const blockedPatterns = [
  /bypass\s+(approval|control|audit)/i,
  /ignore\s+(policy|guardrail|approval)/i,
  /fabricate|invent evidence|fake citation/i,
  /delete\s+(audit|trace|log|evidence)/i
];

export function validateAgentRequest(request) {
  const normalized = String(request ?? "").trim();

  if (normalized.length < 12) {
    return { ok: false, code: "REQUEST_TOO_SHORT", message: "Describe the regulatory change or impacted business process." };
  }

  if (normalized.length > 1200) {
    return { ok: false, code: "REQUEST_TOO_LONG", message: "Requests must stay under 1,200 characters for the deterministic runner." };
  }

  const matched = blockedPatterns.find((pattern) => pattern.test(normalized));
  if (matched) {
    return {
      ok: false,
      code: "POLICY_BLOCKED",
      message: "The request attempts to bypass controls, alter audit evidence, or fabricate support."
    };
  }

  return { ok: true, request: normalized };
}

export function approvalDecision(riskScore, obligations, profile = {}) {
  const highValue = Number(profile.annualizedRevenueAtRisk ?? 0) >= 1000000;
  const criticalObligations = obligations.some((obligation) =>
    /72 hour|board|critical|incident|lineage|transfer impact/i.test(obligation)
  );
  const requiresApproval = riskScore >= 76 || highValue || criticalObligations;

  return {
    requiresApproval,
    approvers: requiresApproval ? ["Compliance Lead", "Control Owner", highValue ? "Risk Committee" : "Legal Reviewer"] : [],
    reason: requiresApproval
      ? "Material risk, regulated obligation, or revenue exposure requires human approval before implementation."
      : "Risk is within deterministic draft thresholds; implementation remains dry-run only."
  };
}
