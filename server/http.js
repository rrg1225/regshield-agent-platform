import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import { regulatoryCorpus } from "./agent/corpus.js";
import { runRegShieldAgent } from "./agent/loop.js";
import { toolCatalog } from "./agent/tools.js";
import { readinessScorecard, recordError, recordRequest, recordRun, runtimeMetrics } from "./runtime.js";

export function createApp(options = {}) {
  const app = express();
  const traceDir = options.traceDir ?? process.env.REGSHIELD_TRACE_DIR ?? path.join(process.cwd(), "traces");

  app.disable("x-powered-by");
  app.use(cors());
  app.use(express.json({ limit: "64kb" }));
  app.use((req, res, next) => {
    const requestId = req.headers["x-request-id"] || cryptoRandomId();
    res.setHeader("x-request-id", requestId);
    res.setHeader("x-content-type-options", "nosniff");
    res.setHeader("referrer-policy", "no-referrer");
    res.on("finish", () => recordRequest(res.statusCode));
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "regshield-agent-platform", mode: process.env.AGENT_MODE ?? "dry-run" });
  });

  app.get("/api/regulations", (_req, res) => {
    res.json({ regulations: regulatoryCorpus });
  });

  app.get("/api/tools", (_req, res) => {
    res.json({ tools: toolCatalog });
  });

  app.get("/api/metrics/runtime", (_req, res) => {
    res.json(runtimeMetrics());
  });

  app.get("/api/metrics/scorecard", (_req, res) => {
    res.json(readinessScorecard());
  });

  app.post("/api/runs", (req, res, next) => {
    try {
      const run = runRegShieldAgent(req.body);
      persistTrace(traceDir, run);
      recordRun(run);
      res.status(run.status === "blocked" ? 422 : 201).json({ run });
    } catch (error) {
      next(error);
    }
  });

  const distPath = path.join(process.cwd(), "dist");
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.use((error, _req, res, _next) => {
    recordError();
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  });

  return app;
}

function persistTrace(traceDir, run) {
  fs.mkdirSync(traceDir, { recursive: true });
  const safeName = `run_${Date.now()}_${run.id.slice(0, 8)}.json`;
  fs.writeFileSync(path.join(traceDir, safeName), JSON.stringify(run, null, 2));
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}
