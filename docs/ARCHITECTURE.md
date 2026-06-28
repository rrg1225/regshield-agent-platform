# Architecture

RegShield is organized around a deterministic agent runtime so the behavior is inspectable, testable, and safe by default.

## Runtime Flow

1. Validate the request against policy guardrails.
2. Retrieve relevant regulatory evidence from a seeded corpus.
3. Map obligations to internal controls and control owners.
4. Score residual impact using severity, deadlines, maturity gaps, and revenue exposure.
5. Decide whether human approval is required.
6. Draft a non-destructive implementation plan.
7. Persist the complete run trace for audit review.

## Boundaries

- `server/agent/corpus.js` stores the seeded regulatory and control data.
- `server/agent/tools.js` implements the deterministic tool contracts.
- `server/agent/policies.js` owns request validation and approval logic.
- `server/agent/loop.js` orchestrates the agent run and memo output.
- `server/http.js` exposes the API, headers, trace persistence, and static build serving.
- `src/App.jsx` renders the workbench for request intake and evidence review.

## Extension Points

- Replace the seeded corpus with a vector store or document ingestion pipeline.
- Add an LLM provider after the deterministic retrieval and policy checks.
- Route approved draft tasks into Jira, ServiceNow, or GRC tooling.
- Persist traces in object storage or a database instead of local JSON files.
- Add policy-as-code rules for jurisdiction-specific approvals and SLA windows.

## Safety Model

All implementation actions are draft-only. The app refuses requests that ask it to bypass approvals, delete audit records, or fabricate evidence. High-risk runs are routed to named human approvers before implementation.
