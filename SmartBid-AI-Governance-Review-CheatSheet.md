# SmartBid 2.0 — AI Governance Review · Cheat Sheet

**Meeting:** Wed 2026-08-05, 13:30–14:20 · **Host:** Clint Coker (Sr. Manager, AI Governance & Adoption, IT Data & Analytics)
**Objective:** AI Governance Review — confirm purpose, value, risks, governance requirements, next steps, approval path.
**You bring:** EA Intake Form · Architecture Diagram · Success Criteria.

---

## 60-second opener (say this first)

> "SmartBid is already in production for the bid workflow. Today we're reviewing an added AI-assisted step using **Azure OpenAI (GPT-4o-mini)**: **quotation extraction** from supplier PDFs, **Scope of Supply analysis** from Engineering Technical documents, and **Smart Search (RAG)** over our datasheets and past bids. Everything runs in **Brazil South**, it's **human-in-the-loop**, **no secrets in the frontend**, **no personal data**, and **manual entry stays as fallback**. I've brought the EA Intake Form, the architecture diagram, and the success criteria, and I'm here to align on governance actions and the approval path."

---

## Scope of this review

Three AI use cases — **all in scope for this phase**:

- **Quotation extraction** — supplier PDF → structured quotation data.
- **Scope of Supply analysis** — Engineering Technical (ET) documents → structured scope.
- **Smart Search (RAG)** — semantic search over datasheets & past bids using **Azure AI Search + embeddings**.

> Note on data: the **RAG knowledge base** uses Oceaneering's **own** datasheets, manuals & past bids (internal content). The **uploaded BID documents** (client technical requisitions) are **customer data, typically under NDA** — handle via the **AUP §7.6** section below.

---

## ⚠️ The hard one — customer data in AI (AUP §7.6)

**Expect this to be the main objection.** AUP §7.6 says customer documents / specifications / requirements and third-party information under NDA **must not be entered into any AI product** _unless the specific use is explicitly approved in writing through governance and by the information owner_. Your BID requisitions carry a **confidentiality clause + NDA reference** in the footer — so **do not argue "it's not confidential."** Argue the **approval path** and the **contained architecture** instead.

**Say this:**

> "I understand the BID requisition is customer data under §7.6 — that's exactly why I'm here. I'm requesting **explicit written approval** for this specific use. The key point is **containment**: this is **Azure OpenAI inside our own Oceaneering Azure tenant (Brazil South)**, under our Microsoft enterprise agreement. It is **not** an external model or public tool — prompts are **not used to train any model**, **not shared with OpenAI**, and the data **does not leave the Oceaneering environment**. Same trust boundary as SharePoint / M365 — not 'sending data outside the company.'"

**Then offer, to make approval easy:**

- **Written approval + information owner** — "Tell me the artifact you need and who the information owner is, and I'll get the sign-off."
- **Strip client identifiers** — remove client name, project & document numbers before processing; keep only the generic technical scope text.
- **No external egress** — no web / browsing / plug-ins / extensions; the model cannot send data out.
- **ITAR / EAR / CUI attestation** at upload — those documents are excluded from the pipeline.
- **Human-in-the-loop + audit logging** — the raw document is not retained beyond processing.

> If they still say no: fall back to **manual entry** for client documents, and keep AI for **supplier quotations** and **Oceaneering's own datasheets (RAG)** while the written approval is pursued.

---

## The 8 topics — ready answers

**1. AI System Information & intended business use**

> "Existing SPFx web part on SharePoint Online. Adds an AI step via Azure OpenAI GPT-4o-mini for quotation extraction, ET document scope analysis, and smart search over past bids & datasheets."

**2. Use cases, objectives & expected value**

> "Three use cases: auto-extract supplier quotation data, structure Scope of Supply from technical docs, and Smart Search (RAG) over datasheets & past bids. Goal: cut BID prep time 40–60%, 15 min → <3 min per quotation."

**3. Enterprise Architecture feedback & recommendations**

> "EA reviewed it — Approved with Conditions (ref SR/WorkOrder #907579). Conditions addressed: no key in frontend (Key Vault + Managed Identity), backend broker (Function/APIM), Entra ID auth, full logging."
> ⚑ **Prep:** know the exact EA conditions + evidence each was met. Also be ready for the two Level-One notes: (1) **duplication review** vs. existing requirements applications — SmartBid is BID-proposal-specific, no overlap (confirm with IT); (2) **in-country Brazil data** — deployed in Brazil South over non-confidential data — confirmed.

**4. AI System Scorecard results & governance actions**

> "Happy to provide inputs. Data: no personal data; supplier specs/prices + client technical docs (customer data under §7.6 — written approval requested). Oversight: human-in-the-loop, nothing saved without engineer confirmation. Model: Azure OpenAI GPT-4o-mini, approved platform, no new vendor. Security: no key in frontend, Key Vault + Managed Identity, Entra ID. Monitoring: App Insights + Log Analytics. Residency: Brazil South (in-country). Fallback: manual entry."
> ⚑ **Ask:** "What does the scorecard evaluate, so I give the right inputs?"

**5. Delivery approach & adoption expectations**

> "Provisioning 1–2 weeks, implementation 2–3 weeks, go-live target Q3 2026. Pilot first with the Brazil BID team, measure accuracy and time saved, then scale. Minimal training — it's review/confirm inside an existing workflow. I own it functionally; SmartBid team supports."

**6. Performance measures, benefits & success criteria**

> ">85% extraction accuracy · 15 min → <3 min per doc · 90%+ of quotations via AI · 50% less time on scope analysis · 80% fewer transcription errors."

**7. Risks, controls & compliance**

> "Risks: PDF layout variability, poor scans, quota/rate limits, token cost. Controls: mandatory human review, manual fallback, key in Key Vault, logging via App Insights/Log Analytics."
> **Add for governance:**
>
> - "Azure OpenAI does **not** use our data to train models and doesn't share it with OpenAI."
> - "Azure OpenAI + AI Search are deployed in **Brazil South** — data stays in-country, co-located with the users."
> - "Client BID requisitions are **customer data (often under NDA)** under **AUP §7.6** — we're requesting **explicit written approval** for a **contained** use: Azure OpenAI in Oceaneering's own tenant (Brazil South), **no external model, no training on our data, nothing leaves the Oceaneering environment**. ITAR/EAR/CUI content **excluded, with user attestation at upload**."
> - "Hallucination risk mitigated by human-in-the-loop — nothing is saved without review."

**8. AI Tools Committee review & approval**

> ⚑ **Ask:** "Is SmartBid subject to AI Tools Committee approval? What artifacts, criteria, and timeline do you need from me?"

---

## Key numbers (memorize)

| Metric                     | Value                                |
| -------------------------- | ------------------------------------ |
| BID requests/year          | 100+                                 |
| Quotation entry time       | 15 min → <3 min                      |
| BID prep time reduction    | 40–60%                               |
| Extraction accuracy target | >85%                                 |
| Transcription errors       | −80%                                 |
| Cost                       | < $10/month short-term · < $120/year |
| Model                      | Azure OpenAI GPT-4o-mini             |

---

## Likely tough questions → short answers

- **"Does the AI train on our data?"** → "No. Azure OpenAI doesn't use our data to train models or share it with OpenAI."
- **"Any personal/sensitive data?"** → "No personal data. But the uploaded BID requisitions are **customer data, often under NDA** (AUP §7.6) — that's why I'm asking for written approval for a contained use (see the §7.6 section). Supplier data is specs/prices/lead times. ITAR/EAR/CUI excluded with user attestation."
- **"Isn't uploading customer/NDA documents against AUP §7.6?"** → "§7.6 allows it with explicit written approval through governance + the information owner. This is Azure OpenAI in our own tenant (Brazil South) — no external model, no training, data stays inside Oceaneering. I'm here to get that written approval and to identify the information owner."
- **"What if the AI is wrong?"** → "Human-in-the-loop — the engineer reviews and confirms before anything is saved. Manual entry stays as fallback."
- **"New vendor / new platform?"** → "No. Azure OpenAI is an already-approved platform; no new vendor."
- **"Where's the API key?"** → "In Azure Key Vault, accessed by the backend via Managed Identity. Never in the frontend, SharePoint, or source."
- **"Is RAG / AI Search in scope?"** → "Yes — Smart Search over datasheets and past bids using Azure AI Search + embeddings, deployed in Brazil South, over non-confidential engineering content."
- **"Where does it run / data residency?"** → "Azure OpenAI and Azure AI Search are deployed in **Brazil South** — data stays in-country, co-located with the users."

---

## Questions to ask Clint (shows maturity)

1. What does the AI System Scorecard evaluate?
2. Is AI Tools Committee approval required — artifacts and timeline?
3. Does **Brazil South** satisfy all in-country / data-residency requirements for this workload?
4. Are the original EA conditions (#907579) considered closed, or part of this review?
5. What are the exact next steps and responsible parties to get approval?
6. For customer data under §7.6, what **written-approval artifact** do you need, and **who is the information owner** that must sign off?

---

## Prep checklist before the meeting

- [ ] Confirm scope: quotation extraction + ET scope analysis + Smart Search (RAG) — all in Brazil South
- [ ] Retrieve the exact EA conditions (#907579) + evidence each was met
- [ ] Confirm Brazil South deployment (Azure OpenAI + Azure AI Search)
- [ ] Have the architecture diagram open (no secret in browser → backend → OpenAI)
- [ ] Prepare scorecard inputs (data / oversight / model / security / monitoring / residency / fallback)
- [ ] **AUP §7.6:** don't argue 'not confidential' — request **written approval** + name the **information owner**
- [ ] Confirm **no external egress** (no web/plug-ins) and **no training on our data**
