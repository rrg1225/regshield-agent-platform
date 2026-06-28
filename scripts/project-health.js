import fs from "node:fs";

const requiredFiles = [
  "README.md",
  ".env.example",
  ".github/workflows/ci.yml",
  "server/agent/loop.js",
  "server/http.js",
  "src/App.jsx",
  "test/api.test.js",
  "eval/scenarios.test.js",
  "docs/ARCHITECTURE.md",
  "docs/OPERATIONS.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

const readme = fs.readFileSync("README.md", "utf8");
for (const phrase of ["guardrails", "approval", "audit", "evals"]) {
  if (!readme.toLowerCase().includes(phrase)) {
    console.error(`README is missing portfolio signal: ${phrase}`);
    process.exit(1);
  }
}

console.log("Project health checks passed.");
