import { controlCatalog, regulatoryCorpus } from "./corpus.js";

export const toolCatalog = [
  {
    name: "retrieve_regulatory_evidence",
    permission: "read",
    description: "Finds relevant regulatory changes from the seeded corpus and returns cited evidence."
  },
  {
    name: "map_impacted_controls",
    permission: "read",
    description: "Maps obligations to internal control owners and maturity gaps."
  },
  {
    name: "score_change_impact",
    permission: "compute",
    description: "Scores residual impact using severity, deadlines, control maturity, and business exposure."
  },
  {
    name: "draft_implementation_plan",
    permission: "draft",
    description: "Creates non-destructive task recommendations and approval routing."
  }
];

export function retrieveRegulatoryEvidence(request, profile = {}) {
  const text = `${request} ${profile.sector ?? ""} ${profile.jurisdiction ?? ""}`.toLowerCase();
  const scored = regulatoryCorpus.map((item) => {
    const keywordHits = item.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length;
    const sectorHit = profile.sector && item.sector === profile.sector ? 2 : 0;
    const jurisdictionHit = profile.jurisdiction && item.jurisdiction === profile.jurisdiction ? 2 : 0;
    const severityBoost = item.severity === "critical" ? 1.5 : item.severity === "high" ? 1 : 0.5;
    return { item, score: keywordHits + sectorHit + jurisdictionHit + severityBoost };
  });

  return scored
    .filter(({ score }) => score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item, score }) => ({ ...item, matchScore: Number(score.toFixed(2)) }));
}

export function mapImpactedControls(evidence) {
  const ids = new Set(evidence.flatMap((item) => item.controls));
  return [...ids].map((id) => {
    const control = controlCatalog.find((candidate) => candidate.id === id);
    const obligations = evidence
      .filter((item) => item.controls.includes(id))
      .flatMap((item) => item.obligations);
    const maturityGap = Math.max(0, 4 - Number(control?.maturity ?? 1));

    return {
      ...control,
      obligations: [...new Set(obligations)],
      maturityGap,
      status: maturityGap >= 2 ? "needs-upgrade" : "monitor"
    };
  });
}

export function scoreChangeImpact(evidence, controls, profile = {}) {
  const severityWeight = { low: 10, medium: 18, high: 28, critical: 38 };
  const evidenceScore = evidence.reduce((sum, item) => sum + (severityWeight[item.severity] ?? 12), 0);
  const maturityPenalty = controls.reduce((sum, control) => sum + control.maturityGap * 6, 0);
  const deadlinePenalty = evidence.some((item) => Date.parse(item.effectiveDate) < Date.now() + 1000 * 60 * 60 * 24 * 120) ? 14 : 4;
  const exposure = Number(profile.annualizedRevenueAtRisk ?? 0);
  const exposurePenalty = exposure >= 5000000 ? 18 : exposure >= 1000000 ? 12 : exposure >= 250000 ? 6 : 0;
  const score = Math.min(100, Math.round(evidenceScore + maturityPenalty + deadlinePenalty + exposurePenalty));

  return {
    score,
    tier: score >= 80 ? "critical" : score >= 60 ? "high" : score >= 35 ? "medium" : "low",
    drivers: [
      `${evidence.length} cited regulatory evidence item(s)`,
      `${controls.filter((control) => control.status === "needs-upgrade").length} control maturity gap(s)`,
      deadlinePenalty >= 14 ? "near-term effective date" : "standard implementation window",
      exposurePenalty > 0 ? "material revenue exposure" : "limited quantified exposure"
    ]
  };
}

export function draftImplementationPlan(evidence, controls, approval) {
  const obligations = [...new Set(evidence.flatMap((item) => item.obligations))];
  const upgradedControls = controls.filter((control) => control.status === "needs-upgrade");
  const tasks = [
    ...obligations.slice(0, 5).map((obligation, index) => ({
      id: `TASK-${index + 1}`,
      title: `Document ${obligation}`,
      owner: controls[index % Math.max(controls.length, 1)]?.owner ?? "Compliance",
      dueInDays: 14 + index * 7,
      type: "obligation"
    })),
    ...upgradedControls.map((control, index) => ({
      id: `CTRL-${index + 1}`,
      title: `Raise maturity for ${control.id}: ${control.name}`,
      owner: control.owner,
      dueInDays: 21 + index * 10,
      type: "control-gap"
    }))
  ];

  return {
    mode: "draft-only",
    tasks,
    operatingModel: {
      raci: controls.slice(0, 4).map((control) => ({
        controlId: control.id,
        responsible: control.owner,
        accountable: approval.requiresApproval ? approval.approvers[0] : control.owner,
        consulted: ["Legal", "Risk", "Product"].filter((owner) => owner !== control.owner),
        informed: ["Audit"]
      })),
      changeCalendar: tasks.slice(0, 5).map((task) => ({
        taskId: task.id,
        dueInDays: task.dueInDays,
        gate: task.type === "control-gap" ? "control validation" : "obligation evidence"
      })),
      successMetrics: ["all obligations mapped", "control owners assigned", "approval route captured", "no external write performed"]
    },
    nextReview: approval.requiresApproval ? "Schedule approval review before implementation." : "Review draft with control owners.",
    implementationBlocked: approval.requiresApproval
  };
}
