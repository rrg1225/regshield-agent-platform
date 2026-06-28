import { randomUUID } from "node:crypto";
import { approvalDecision, validateAgentRequest } from "./policies.js";
import {
  draftImplementationPlan,
  mapImpactedControls,
  retrieveRegulatoryEvidence,
  scoreChangeImpact
} from "./tools.js";

export function runRegShieldAgent(input = {}) {
  const startedAt = new Date().toISOString();
  const requestId = randomUUID();
  const validation = validateAgentRequest(input.request);
  const steps = [{ name: "validate_request", status: validation.ok ? "passed" : "blocked", detail: validation.message ?? "Request accepted." }];

  if (!validation.ok) {
    return {
      id: requestId,
      startedAt,
      completedAt: new Date().toISOString(),
      status: "blocked",
      request: String(input.request ?? ""),
      steps,
      guardrail: validation,
      memo: "Request blocked by policy before tool execution."
    };
  }

  const profile = normalizeProfile(input.profile);
  const evidence = retrieveRegulatoryEvidence(validation.request, profile);
  steps.push({ name: "retrieve_regulatory_evidence", status: evidence.length ? "passed" : "needs-review", count: evidence.length });

  const controls = mapImpactedControls(evidence);
  steps.push({ name: "map_impacted_controls", status: controls.length ? "passed" : "needs-review", count: controls.length });

  const impact = scoreChangeImpact(evidence, controls, profile);
  steps.push({ name: "score_change_impact", status: "passed", tier: impact.tier, score: impact.score });

  const obligations = [...new Set(evidence.flatMap((item) => item.obligations))];
  const approval = approvalDecision(impact.score, obligations, profile);
  steps.push({ name: "approval_gate", status: approval.requiresApproval ? "approval-required" : "passed", approvers: approval.approvers });

  const plan = draftImplementationPlan(evidence, controls, approval);
  steps.push({ name: "draft_implementation_plan", status: "drafted", taskCount: plan.tasks.length });

  const status = approval.requiresApproval ? "approval_required" : "ready_for_review";
  return {
    id: requestId,
    startedAt,
    completedAt: new Date().toISOString(),
    status,
    request: validation.request,
    profile,
    evidence,
    controls,
    impact,
    approval,
    plan,
    steps,
    memo: buildMemo(validation.request, evidence, impact, approval, plan)
  };
}

function normalizeProfile(profile = {}) {
  return {
    sector: profile.sector || "financial-services",
    jurisdiction: profile.jurisdiction || "US",
    annualizedRevenueAtRisk: Number(profile.annualizedRevenueAtRisk ?? 750000)
  };
}

function buildMemo(request, evidence, impact, approval, plan) {
  const citations = evidence.map((item) => item.id).join(", ") || "none";
  return [
    `Request: ${request}`,
    `Impact: ${impact.tier.toUpperCase()} (${impact.score}/100). Drivers: ${impact.drivers.join("; ")}.`,
    `Evidence: ${citations}.`,
    `Approval: ${approval.requiresApproval ? `required from ${approval.approvers.join(", ")}` : "not required for draft review"}.`,
    `Plan: ${plan.tasks.length} draft tasks generated; no external systems were modified.`
  ].join("\n");
}
