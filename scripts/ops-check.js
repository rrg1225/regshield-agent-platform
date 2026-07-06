import { readFileSync } from "node:fs";

const checks = [
  {
    name: "request correlation",
    ok: readFileSync("server/http.js", "utf8").includes("x-request-id")
  },
  {
    name: "hardened baseline headers",
    ok: readFileSync("server/http.js", "utf8").includes("x-content-type-options")
  },
  {
    name: "guardrail classifier",
    ok: readFileSync("server/agent/policies.js", "utf8").includes("POLICY_BLOCKED")
  },
  {
    name: "draft-only implementation",
    ok: readFileSync("server/agent/tools.js", "utf8").includes("mode: \"draft-only\"")
  },
  {
    name: "audit trace persistence",
    ok: readFileSync("server/http.js", "utf8").includes("persistTrace")
  },
  {
    name: "scenario evals",
    ok: readFileSync("package.json", "utf8").includes("\"eval\"")
  }
];

const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  console.error(failed.map((check) => `[ops] failed: ${check.name}`).join("\n"));
  process.exit(1);
}

console.log(`[ops] ${checks.length} operational checks passed`);
