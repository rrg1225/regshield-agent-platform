import { useEffect, useMemo, useState } from "react";

const defaultRequest =
  "Assess the new AI model inventory accountability rule for our financial-services customer onboarding models and produce an implementation plan.";

export default function App() {
  const [request, setRequest] = useState(defaultRequest);
  const [profile, setProfile] = useState({
    sector: "financial-services",
    jurisdiction: "US",
    annualizedRevenueAtRisk: 1800000
  });
  const [run, setRun] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/tools").then((res) => res.json()), fetch("/api/metrics/scorecard").then((res) => res.json())])
      .then(([toolData, scorecardData]) => {
        setTools(toolData.tools ?? []);
        setScorecard(scorecardData);
      })
      .catch((err) => setError(err.message));
  }, []);

  const impactClass = useMemo(() => {
    const tier = run?.impact?.tier;
    return tier ? `tier ${tier}` : "tier idle";
  }, [run]);

  async function submitRun(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ request, profile })
      });
      const data = await response.json();
      if (!response.ok && !data.run) {
        throw new Error(data.message ?? "Agent run failed");
      }
      setRun(data.run);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">Regulatory change operations</p>
          <h1>RegShield Agent Platform</h1>
          <p className="hero-copy">
            Turn regulatory change into cited impact analysis, mapped controls, approval routing, and a dry-run implementation plan.
          </p>
        </div>
        <div className="score-strip">
          <span>Readiness</span>
          <strong>{scorecard?.score ?? "--"}</strong>
          <span>Controls</span>
          <strong>{tools.length}</strong>
        </div>
      </section>

      <section className="workspace">
        <form className="input-panel" onSubmit={submitRun}>
          <label>
            Regulatory change request
            <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
          </label>
          <div className="grid-two">
            <label>
              Sector
              <select value={profile.sector} onChange={(event) => setProfile({ ...profile, sector: event.target.value })}>
                <option value="financial-services">Financial services</option>
                <option value="healthcare">Healthcare</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="general">General</option>
              </select>
            </label>
            <label>
              Jurisdiction
              <select
                value={profile.jurisdiction}
                onChange={(event) => setProfile({ ...profile, jurisdiction: event.target.value })}
              >
                <option value="US">US</option>
                <option value="EU">EU</option>
                <option value="APAC">APAC</option>
              </select>
            </label>
          </div>
          <label>
            Annualized revenue at risk
            <input
              type="number"
              min="0"
              step="50000"
              value={profile.annualizedRevenueAtRisk}
              onChange={(event) => setProfile({ ...profile, annualizedRevenueAtRisk: Number(event.target.value) })}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Running analysis" : "Run impact agent"}
          </button>
          {error ? <p className="error">{error}</p> : null}
        </form>

        <section className="result-panel">
          <div className="result-header">
            <div>
              <p className="eyebrow">Current run</p>
              <h2>{run ? run.status.replaceAll("_", " ") : "No run yet"}</h2>
            </div>
            <div className={impactClass}>{run?.impact ? `${run.impact.score}/100` : "idle"}</div>
          </div>

          {run ? (
            <>
              <div className="metric-row">
                <Metric label="Evidence" value={run.evidence.length} />
                <Metric label="Controls" value={run.controls.length} />
                <Metric label="Tasks" value={run.plan?.tasks.length ?? 0} />
                <Metric label="Approval" value={run.approval.requiresApproval ? "yes" : "no"} />
              </div>

              <div className="timeline">
                {run.steps.map((step) => (
                  <div key={step.name} className="timeline-item">
                    <span>{step.status}</span>
                    <strong>{step.name.replaceAll("_", " ")}</strong>
                  </div>
                ))}
              </div>

              <div className="split">
                <article>
                  <h3>Evidence pack</h3>
                  {run.evidence.map((item) => (
                    <div className="evidence" key={item.id}>
                      <strong>{item.title}</strong>
                      <span>{item.id} | {item.jurisdiction} | {item.effectiveDate}</span>
                      <p>{item.summary}</p>
                    </div>
                  ))}
                </article>
                <article>
                  <h3>Draft plan</h3>
                  {run.plan.tasks.slice(0, 6).map((task) => (
                    <div className="task" key={task.id}>
                      <strong>{task.title}</strong>
                      <span>{task.owner} | due in {task.dueInDays} days</span>
                    </div>
                  ))}
                </article>
              </div>

              <pre className="memo">{run.memo}</pre>
            </>
          ) : (
            <p className="empty">Run the agent to generate impact scoring, control mapping, approvals, and a persisted audit trace.</p>
          )}
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
