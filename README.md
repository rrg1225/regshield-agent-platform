# RegShield Agent Platform

[![CI](https://github.com/rrg1225/regshield-agent-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/rrg1225/regshield-agent-platform/actions/workflows/ci.yml)
![Agent](https://img.shields.io/badge/AI-Agent%20RegTech-174A45)
![Guardrails](https://img.shields.io/badge/Guardrails-Approval%20Gates-B3532B)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)

RegShield Agent Platform is a full-stack AI agent workspace for regulatory change operations. It turns a regulatory update or compliance question into cited evidence, mapped internal controls, residual impact scoring, human approval routing, a dry-run implementation plan, and a persisted audit trace.

The default runner is deterministic and works without external services. The architecture is designed so an LLM provider, vector store, policy engine, ticketing system, or data-room connector can be added without changing the core workflow contract.

## Highlights

- RAG-style retrieval over a seeded regulatory corpus with cited evidence IDs.
- Deterministic observe -> decide -> act -> validate -> handoff loop.
- Narrow tool contracts for evidence retrieval, control mapping, impact scoring, and draft planning.
- Policy guardrails that block approval bypass, audit deletion, and fabricated evidence requests.
- Human-in-the-loop approval routing for critical obligations and material exposure.
- Runtime metrics, operational readiness scorecard, request IDs, and hardened baseline headers.
- React workbench for request intake, risk posture, evidence packs, task plans, and trace inspection.
- API tests plus scenario evals for safe, high-impact, and unsafe regulatory requests.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API defaults to `http://localhost:4740`.

## Scripts

```bash
npm test          # API contracts plus scenario evals
npm run eval      # deterministic agent scenario suite
npm run build     # production React bundle
npm run ci:local  # health checks, tests, evals, and build
npm run start     # serve API and built frontend
```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health and deterministic mode |
| `GET` | `/api/regulations` | Seeded regulatory evidence corpus |
| `GET` | `/api/tools` | Agent tool catalog and permissions |
| `GET` | `/api/metrics/runtime` | Request, run, status, and error counters |
| `GET` | `/api/metrics/scorecard` | Operational readiness score and checks |
| `POST` | `/api/runs` | Execute a regulatory impact run and persist the audit trace |

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4740` | Express API port |
| `AGENT_MODE` | `dry-run` | Execution mode marker |
| `OPENAI_API_KEY` | empty | Optional future provider key; not required for default mode |
| `REGSHIELD_TRACE_DIR` | `./traces` | Directory for persisted run traces |

## Portfolio Positioning

This project demonstrates agent engineering beyond a chat UI: grounded retrieval, deterministic orchestration, control-aware scoring, human approval gates, auditability, operational telemetry, and regression evals. It is suitable for showcasing full-stack product thinking, AI governance, compliance automation, and production-oriented Agent design.
