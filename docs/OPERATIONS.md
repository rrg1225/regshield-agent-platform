# Operations

## Local Verification

Run the full local gate before pushing:

```bash
npm run ci:local
```

This executes project health checks, API tests, deterministic evals, and the production build.

## Runtime Checks

- `/api/health` confirms the API is responding.
- `/api/metrics/runtime` reports request counts, run counts, blocked runs, approval-required runs, and errors.
- `/api/metrics/scorecard` reports operational readiness checks.

## Trace Handling

Each `POST /api/runs` call persists a JSON trace under `REGSHIELD_TRACE_DIR` or `./traces`. Trace JSON files are ignored by Git so local audit runs do not leak into commits.

## Release Checklist

- Local `npm run ci:local` passes.
- GitHub Actions CI passes on `main`.
- README and `.env.example` match runtime behavior.
- No generated trace JSON or local `.env` files are staged.
