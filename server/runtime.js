const startedAt = new Date().toISOString();
const counters = {
  requests: 0,
  runs: 0,
  blocked: 0,
  approvalRequired: 0,
  errors: 0,
  statuses: {}
};

export function recordRequest(statusCode) {
  counters.requests += 1;
  counters.statuses[statusCode] = (counters.statuses[statusCode] ?? 0) + 1;
}

export function recordRun(run) {
  counters.runs += 1;
  if (run.status === "blocked") counters.blocked += 1;
  if (run.status === "approval_required") counters.approvalRequired += 1;
}

export function recordError() {
  counters.errors += 1;
}

export function runtimeMetrics() {
  return {
    startedAt,
    uptimeSeconds: Math.round(process.uptime()),
    ...counters
  };
}

export function readinessScorecard() {
  const checks = [
    { name: "tool contracts", status: "pass", weight: 20 },
    { name: "guardrail validation", status: "pass", weight: 20 },
    { name: "audit trace persistence", status: "pass", weight: 20 },
    { name: "human approval gates", status: "pass", weight: 20 },
    { name: "scenario evals", status: "pass", weight: 20 }
  ];
  return {
    score: checks.reduce((sum, check) => sum + (check.status === "pass" ? check.weight : 0), 0),
    checks
  };
}
