export const regulatoryCorpus = [
  {
    id: "reg-ai-001",
    title: "AI model inventory and accountability",
    jurisdiction: "US",
    sector: "financial-services",
    effectiveDate: "2026-09-30",
    severity: "high",
    summary:
      "Covered firms must maintain an inventory of customer-facing AI systems, named owners, model purpose, data lineage, and quarterly review evidence.",
    obligations: ["model inventory", "owner attestation", "data lineage", "quarterly review"],
    controls: ["GOV-001", "GOV-004", "AUD-002"],
    keywords: ["ai", "model", "inventory", "lineage", "attestation", "financial"]
  },
  {
    id: "reg-privacy-014",
    title: "Cross-border personal data transfer assessment",
    jurisdiction: "EU",
    sector: "general",
    effectiveDate: "2026-11-01",
    severity: "medium",
    summary:
      "Organizations transferring personal data outside approved regions must document transfer purpose, processor safeguards, retention limits, and customer notice updates.",
    obligations: ["transfer impact assessment", "processor safeguards", "retention limits", "customer notice"],
    controls: ["PRV-002", "PRV-006", "AUD-002"],
    keywords: ["privacy", "personal data", "transfer", "processor", "retention", "customer notice"]
  },
  {
    id: "reg-cyber-022",
    title: "Operational resilience incident reporting",
    jurisdiction: "US",
    sector: "healthcare",
    effectiveDate: "2026-08-15",
    severity: "critical",
    summary:
      "Critical service providers must classify cyber incidents within 24 hours, notify regulators within 72 hours, and preserve incident evidence for audit.",
    obligations: ["incident classification", "72 hour notice", "evidence preservation", "resilience testing"],
    controls: ["SEC-003", "OPS-007", "AUD-004"],
    keywords: ["cyber", "incident", "reporting", "resilience", "72 hour", "healthcare"]
  },
  {
    id: "reg-thirdparty-009",
    title: "Third-party concentration and exit planning",
    jurisdiction: "APAC",
    sector: "financial-services",
    effectiveDate: "2027-01-01",
    severity: "high",
    summary:
      "Regulated entities must identify critical vendors, concentration exposure, exit plans, and board-level acceptance for high-dependency services.",
    obligations: ["critical vendor register", "concentration exposure", "exit plan", "board acceptance"],
    controls: ["TPR-001", "TPR-004", "GOV-004"],
    keywords: ["vendor", "third-party", "concentration", "exit plan", "board", "financial"]
  },
  {
    id: "reg-esg-006",
    title: "Climate disclosure evidence controls",
    jurisdiction: "US",
    sector: "manufacturing",
    effectiveDate: "2026-12-15",
    severity: "medium",
    summary:
      "Public manufacturers must tie climate disclosures to source evidence, reviewer signoff, and change history for material environmental metrics.",
    obligations: ["source evidence", "reviewer signoff", "change history", "materiality assessment"],
    controls: ["AUD-002", "GOV-003", "OPS-005"],
    keywords: ["climate", "disclosure", "evidence", "manufacturing", "materiality"]
  }
];

export const controlCatalog = [
  {
    id: "GOV-001",
    name: "System inventory owner attestation",
    owner: "AI Governance",
    maturity: 3,
    description: "Maintains named owners, review cadence, and purpose statements for regulated systems."
  },
  {
    id: "GOV-003",
    name: "Executive disclosure review",
    owner: "Legal",
    maturity: 2,
    description: "Routes regulated disclosures to accountable reviewers before publication."
  },
  {
    id: "GOV-004",
    name: "Board risk acceptance workflow",
    owner: "Risk Committee",
    maturity: 2,
    description: "Captures high-risk acceptance, conditions, renewal dates, and rationale."
  },
  {
    id: "PRV-002",
    name: "Transfer impact assessment",
    owner: "Privacy",
    maturity: 2,
    description: "Documents cross-border data transfer purpose, safeguards, and risk treatment."
  },
  {
    id: "PRV-006",
    name: "Data retention policy enforcement",
    owner: "Data Office",
    maturity: 3,
    description: "Applies retention limits and deletion evidence for regulated personal data."
  },
  {
    id: "SEC-003",
    name: "Incident classification clock",
    owner: "Security Operations",
    maturity: 4,
    description: "Starts regulatory notification timers once severity criteria are met."
  },
  {
    id: "OPS-005",
    name: "Evidence change log",
    owner: "Operations",
    maturity: 3,
    description: "Records source evidence changes, reviewers, and release timestamps."
  },
  {
    id: "OPS-007",
    name: "Resilience exercise program",
    owner: "Business Continuity",
    maturity: 2,
    description: "Tests critical service recovery, communication paths, and regulator reporting."
  },
  {
    id: "TPR-001",
    name: "Critical vendor register",
    owner: "Third-Party Risk",
    maturity: 3,
    description: "Classifies vendors by criticality, service dependency, and concentration risk."
  },
  {
    id: "TPR-004",
    name: "Vendor exit plan validation",
    owner: "Third-Party Risk",
    maturity: 1,
    description: "Validates exit scenarios, replacement options, data portability, and test evidence."
  },
  {
    id: "AUD-002",
    name: "Audit evidence pack",
    owner: "Internal Audit",
    maturity: 3,
    description: "Bundles source documents, decisions, timestamps, and reviewer attestations."
  },
  {
    id: "AUD-004",
    name: "Incident evidence preservation",
    owner: "Internal Audit",
    maturity: 2,
    description: "Preserves incident artifacts, communication records, and post-incident actions."
  }
];
