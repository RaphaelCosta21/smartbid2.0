# SmartBid 2.0 — Leadership Presentation Outline

> **Purpose:** Executive deck to present the SmartBid 2.0 project, its features, the AI capability, and the Azure resource costs — to obtain leadership approval and a cost center.
> **Audience:** Engineering leadership / management (approvals + budget).
> **Suggested length:** 16–18 slides, ~15–20 min.
> **Tip:** Each slide below has **[Bullets]** (put on the slide) and **[Talking points]** (say out loud / speaker notes).

---

## Slide 1 — Title

**SmartBid 2.0**
_AI-Assisted BID Management for Oceaneering Brazil Engineering_

- Presenter: Raphael Costa — BID Proposals Engineer
- Division: SSR-OPG Engineering Brazil
- Date: [add date]

**[Talking points]** One line: "SmartBid is our in-house platform that centralizes and accelerates the entire BID process — and I'm here to show what it does, how AI improves it, and the small cloud cost to run it."

---

## Slide 2 — Executive Summary / The Ask

**[Bullets]**

- SmartBid 2.0 is **already built and in use** (front-end + back-end) on SharePoint Online.
- Next step: enable an **AI-assisted step** to speed up quotation and technical-document processing.
- **Enterprise Architecture already approved** the AI integration (Azure OpenAI) with conditions met.
- **What we need today:** leadership sign-off + a **cost center** for the Azure resources (~low monthly cost).

**[Talking points]** Frame it as: the product exists, the security review is done, we just need budget approval to turn on the cloud resources.

---

## Slide 3 — What is SmartBid 2.0

**[Bullets]**

- A single platform to **create, track, cost, and approve** engineering BIDs.
- Replaces scattered spreadsheets, emails, and manual controls.
- Built on **Microsoft 365 / SharePoint Online** (SPFx + React) — no new infrastructure.
- Access secured by corporate **SSO + MFA** (inherited from M365).

**[Talking points]** Emphasize: it lives inside our existing Microsoft environment, so governance, security, and login are already covered.

---

## Slide 4 — The Problem (Current Pain)

**[Bullets]**

- 100+ BID requests/year, each needing **manual data entry** from supplier PDFs.
- Manual analysis of **50–200 page** Engineering Technical documents to define scope.
- Time-consuming, error-prone, and hard to standardize.
- Cost data and repetitive bids re-typed by hand (~15 min per quotation document).

**[Talking points]** This is the "before" picture — set up why AI matters.

---

## Slide 5 — The Solution (SmartBid Overview)

**[Bullets]**

- Centralized BID workflow: **Request → Kick-off → Technical Analysis → Cost & Resources → Proposal → Close-out**.
- Standardized Scope of Supply, cost breakdown, hours, approvals, revisions.
- Full audit trail, dashboards, and reporting.
- **AI layer** to auto-extract quotation data and assist scope analysis.

**[Talking points]** SmartBid already does the workflow today; AI is the accelerator we're adding.

---

## Slide 6 — Navigation & Pages (Part 1: Daily Workspace)

**[Bullets]**

- **BID Tracker** — landing page; all BIDs in kanban / list / table views.
- **Engineering Dashboard** — KPIs, charts, pending approvals.
- **Unassigned Requests** — new requests awaiting assignment.
- **Timeline View** — phase/status timeline per BID.
- **Create Request** — structured intake form (client, division, service line, PM).
- **Notifications** + **FAQ & Instructions**.

**[Talking points]** This is where the team lives day-to-day.

---

## Slide 7 — Navigation & Pages (Part 2: Knowledge, Insights, Tools)

**[Bullets]**

- **Knowledge Base:** Assets Catalog, Scope Templates, Datasheets, Manuals & Catalogs, Clarifications & Qualifications, Links & Recommendations.
- **Insights / Analytics:** Performance Trends, Bottleneck Analysis, Team Analytics, Follow-up.
- **Reports & Export:** Period Performance, BID Details, Operational Summary.
- **Tools:** Favorites, BOM Costs, Quotations, Tooling Report, Query Consulting.
- **Settings:** System Configuration, Members Management, Patch Notes.

**[Talking points]** Show breadth — this is a complete platform, not a prototype.

---

## Slide 8 — How It's Used (BID Lifecycle)

**[Bullets]**

- 1. Commercial submits a request → 2) Engineering kicks off → 3) Technical analysis & scope → 4) Cost & resources → 5) Technical proposal → 6) Close-out.
- Every step is tracked with dates, owners, tasks, and approvals.
- Revision control for reworked bids.

**[Talking points]** Walk through one BID's journey to make it tangible.

---

## Slide 9 — AI Capability (What the AI Does)

**[Bullets]**

- **Quotation extraction:** upload a supplier PDF → AI auto-fills item, quantity, unit cost, currency, lead time, supplier. Reduces a ~15-min task to <2–3 min (review only).
- **Scope of Supply analysis:** AI reads Engineering Technical documents and suggests scope structure and equipment mapping.
- **Smart search (RAG):** search across datasheets and previous bids using AI Search + embeddings.
- **Human-in-the-loop:** engineer always reviews and confirms before anything is saved.

**[Talking points]** Stress the productivity gain AND that a human always confirms — no blind automation.

---

## Slide 10 — AI Architecture (Secure by Design)

**[Bullets]**

- Flow: **SmartBid (browser) → Secure backend (Azure Function/APIM) → Azure OpenAI**.
- API keys **never** exposed in the frontend, SharePoint, or source code — stored in **Azure Key Vault**, accessed via **Managed Identity**.
- All calls authenticated with **Entra ID** token (same SSO/MFA identity).
- Full logging via **Application Insights / Log Analytics**.

**[Talking points]** Insert the architecture diagram here (the one from the EA submission).

---

## Slide 11 — Security & Compliance

**[Bullets]**

- **SSO + MFA (two-factor):** inherited from M365 — no separate login.
- **No secret in frontend:** key in Key Vault via Managed Identity.
- **ITAR / Export-Controlled / CUI:** content excluded from the AI pipeline; user attestation at upload.
- **Enterprise Architecture: Approved with Conditions** — conditions addressed.
- **Approved AI platform:** Azure OpenAI (GPT-4o-mini) — no new vendor introduced.

**[Talking points]** This slide de-risks the whole ask — leadership sees security is already handled.

---

## Slide 12 — Azure Resources (Overview)

**[Bullets]**

- **Azure OpenAI Service** — the AI model (GPT-4o-mini) for extraction/analysis.
- **Embeddings model** — converts documents to vectors for smart search.
- **Azure AI Search** — indexes datasheets & previous bids for retrieval.
- **Azure Function App** — secure backend that brokers all AI calls.
- **Azure Key Vault** — secure storage of credentials.
- **Application Insights** — app telemetry, errors, performance.
- **Log Analytics Workspace** — centralized logging & audit.

**[Talking points]** Seven small, standard Azure building blocks — all provisioned by the Cloud team.

---

## Slide 13 — Azure Resources: Usage & Monthly Cost

> **Note:** Estimates in USD, based on projected low volume (~100–200 AI calls/month). Final pricing depends on region and actual usage — to be confirmed by the Cloud team via the Azure Pricing Calculator.

| #   | Resource                       | What it's used for                             | Est. Monthly (POC) | Est. Monthly (Production) |
| --- | ------------------------------ | ---------------------------------------------- | ------------------ | ------------------------- |
| 1   | **Azure OpenAI (GPT-4o-mini)** | Extract quotation data; analyze technical docs | $5 – $10           | $10 – $25                 |
| 2   | **Embeddings model**           | Vectorize datasheets/bids for smart search     | $2 – $5            | $5 – $10                  |
| 3   | **Azure AI Search**            | Index & retrieve datasheets and past bids      | $0 (Free tier)     | ~$75 (Basic tier)         |
| 4   | **Azure Function App**         | Secure backend / API proxy (Consumption plan)  | $0 – $5            | $5 – $15                  |
| 5   | **Azure Key Vault**            | Secure credential storage                      | ~$1                | $1 – $2                   |
| 6   | **Application Insights**       | Telemetry, errors, performance                 | $0 – $5            | $5 – $15                  |
| 7   | **Log Analytics Workspace**    | Centralized logging & audit                    | $0 – $5            | $5 – $15                  |

**[Talking points]** Point out most services are near-free at our volume; AI Search Basic is the main line item if/when we scale.

---

## Slide 14 — Total Cost Summary

**[Bullets]**

- **POC / Pilot phase:** ~**$15 – $30 / month** (AI Search on Free tier).
- **Production (scaled):** ~**$105 – $155 / month** (~**$1,300 – $1,900 / year**).
- Cost scales with usage; can start on the Pilot tier and grow only if adopted.
- **No hardware, no licenses, no additional dev cost** — implementation by the existing SmartBid team.

**[Talking points]** Anchor on the pilot number ($15–30/mo) to make approval easy, then show production is still modest.

---

## Slide 15 — Benefits / ROI

**[Bullets]**

- Quotation data entry: **~15 min → <3 min** per document.
- Target **40–60% reduction** in BID preparation time for scope analysis.
- **80% fewer** manual transcription errors in cost data.
- Faster client turnaround; standardized, auditable proposals.
- Reusable AI foundation for future SmartBid modules.

**[Talking points]** Translate time savings into engineer-hours/month if you have the numbers.

---

## Slide 16 — Roadmap / Next Steps

**[Bullets]**

- 1. Leadership approval + cost center assigned.
- 2. Cloud team provisions Azure resources (scoped).
- 3. Integrate AI extraction into SmartBid (POC).
- 4. Pilot with BID team → measure accuracy & time savings.
- 5. Scale to production if targets met. **Target go-live: Q3 2026.**

**[Talking points]** Show a clear, low-risk, staged path.

---

## Slide 17 — The Ask (Decision Slide)

**[Bullets]**

- ✅ Approve enabling the AI capability in SmartBid.
- ✅ Assign a **cost center** for the Azure resources (~$15–30/mo pilot).
- ✅ Authorize coordination with the Cloud team for provisioning.
- Owner: Raphael Costa · Sponsor: [leadership name].

**[Talking points]** End with a single, explicit yes/no ask. Make the decision easy.

---

## Slide 18 — Q&A / Appendix

**[Bullets]**

- Architecture diagram (full)
- EA approval reference (SR/WorkOrder #907579)
- Detailed page list & screenshots
- Azure Pricing Calculator link (per resource)

**[Talking points]** Keep detailed cost math and security details here for tough questions.

---

## Appendix — Notes for Building the Deck

- **Design:** Use Oceaneering brand colors; 1 idea per slide; prefer icons + short bullets over text walls.
- **Screenshots:** Add real SmartBid screenshots on slides 6–9 (Tracker, Dashboard, BID Detail, AI tab).
- **Cost validation:** Confirm exact numbers with the Cloud team before the meeting; replace ranges with firm figures if available.
- **Diagram:** Reuse the approved architecture diagram from the EA Intake submission on slide 10.
