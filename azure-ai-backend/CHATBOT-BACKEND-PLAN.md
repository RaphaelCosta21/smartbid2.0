# Backend & AI Search improvements — SmartBid Knowledge Chatbot

Status: **not implemented**. This is the spec/backlog for IT.

The SmartBid web part already ships a floating knowledge chatbot. It works **without any
backend deploy** by reusing `POST /scope/generate`. This document explains what that costs us,
what the first live tests proved, and what the backend needs in order to make the feature
actually useful.

Files referenced here:

- [function-app/function_app.py](function-app/function_app.py)
- [ai-search/01-datasource.json](ai-search/01-datasource.json)
- [ai-search/02-index.json](ai-search/02-index.json)
- [ai-search/03-skillset.json](ai-search/03-skillset.json)
- [ai-search/04-indexer.json](ai-search/04-indexer.json)

---

## Part 0 — What the diagnostic proved (2026-09-14)

The chatbot shipped with a retrieval-debug panel (`AI_CONFIG.chat.showRetrievalDebug`) that
makes the model echo every excerpt it received. Real output for the question
**"Me retorne as propostas técnicas que fizemos com o Defender ROV"**:

| #   | Document                                                                 | Retrieved chunk                                                  |
| --- | ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1   | `Technical Proposal - ROV Services in ODNII (1).pdf`                     | "…Page 5 of 19 This document contains proprietary information…"  |
| 2   | `Technical Proposal - Petrorio - ROV and Survey Services…pdf`            | "Forward/reverse: Lateral: Vertical: 2,000 lb…"                  |
| 3   | `Technical Proposal - Petrorio - ROV and Survey Services…pdf`            | "…Page 15 of 21 This document contains proprietary information…" |
| 4   | `Technical Proposal - ROV Services in ODNII (1).pdf`                     | "…Page 4 of 19 This document contains proprietary information…"  |
| 5   | `Technical Proposal - Blue Marine 2026-10016136 - PRM-2 ROV tooling.pdf` | "…the documents requested on the Bid phase. Section 3…"          |

### Conclusions — evidence, not hypotheses

1. **5 chunks returned = only 3 distinct documents.** ODNII appears twice, Petrorio twice.
   There is no dedupe by `parent_id`, so duplicates burn the tiny budget.
2. **The target document was never retrieved.**
   `Technical Proposal - 2026-10016133-001 - Top Riser Inspection with MiniROV for Trident.pdf`
   contains "DEFENDER ROV" in its table of contents, in section 2.2.1, and in a note
   ("2 ROV Defender systems will be considered for the scope").
3. **That document IS indexed.** Asked directly — "e a proposta 2026-10016133-001?" — the
   search found it and the model cited it correctly, noting only that "Defender" was absent
   _from the excerpts provided_. So indexing is fine; **chunk selection is the failure**.
4. **Technical Proposals ARE crawled.** Every retrieved URL sits under
   `/smartBidDocs/Datasheets/Technical%20Proposals/`. Microsoft's documentation confirms the
   datasource `includeFolder` keyword "applies recursively to all subfolders", so the
   assumption recorded in `sharepoint.config.ts` was correct. This question is closed.
5. **Boilerplate is flooding retrieval.** Three of the five chunks are cover pages, headers or
   footers. Every page of every proposal repeats "Technical Proposal – &lt;name&gt;",
   "Revisão A", "Page N of M", "This document contains proprietary information and must not be
   copied…". With `maximumPageLength: 2000`, a large share of each chunk is this boilerplate,
   so on the vector side almost every chunk of every proposal looks alike for a query
   containing the words "proposta técnica".
6. **The retrieval unit is a chunk, not a document.** `top=5` means "the 5 best fragments in
   the whole corpus", never "the 5 best documents". A 14-page PDF is roughly 20 chunks, so the
   single chunk carrying the discriminating term competes against every other chunk in the
   library.
7. **Specific identifiers work; conceptual and list questions do not.** A proposal number
   repeats in the header/footer of many pages and is rare, so it wins. A model name that
   appears in one section loses.

**Net: the chatbot's prompt and grounding behaviour are correct. The retrieval layer is the
bottleneck, and it cannot be fixed from the browser.**

---

## Part 1 — New route: `POST /chat` (highest priority)

### Why a new route instead of changing `/scope/generate`

`/scope/generate` is live and serves Scope of Supply extraction for BIDs and Templates. Its
retrieval is deliberately tuned for that job: the query is built from a long client document,
and it pulls 5 datasheet excerpts to help categorisation. **Retuning it for chat would degrade
scope generation.** The two use cases need opposite settings:

|              | `/scope/generate`                   | `/chat`                           |
| ------------ | ----------------------------------- | --------------------------------- |
| Query source | up to 8000 chars of client document | one short question                |
| Goal         | categorise items against datasheets | find which documents mention X    |
| Good `top`   | 5 focused excerpts                  | 20–30, deduped per document       |
| Dedupe       | not needed                          | essential                         |
| Output       | scope-shaped JSON                   | conversational answer + citations |
| Multi-turn   | no                                  | yes                               |

**Rule: do not touch `generate_scope()` or `extract_quotation()`.** Add `chat()` alongside
them with its own retrieval helper. The shared utilities (`_caller_upn`, `_model_json`,
`_bad_request`, `_server_error`, `_now_iso`) can be reused as-is.

### What the frontend does today (the hack this route replaces)

Because there is no `/chat`, the browser abuses `/scope/generate`:

- the question is sent as `fileContent`, the base64 of a fake `smartbid-chat.txt` — any file
  name not ending in `.pdf`/`.docx`/`.doc` falls through to `bytes.decode("utf-8")` in
  `extract_text_or_images()`;
- conversation history is smuggled inside `systemPrompt`, because `_retrieval_query()` ignores
  the system prompt — that is what keeps history out of the search query;
- the answer comes back inside `scopeItems[0]`, because the response shaper passes
  `model_json.get("scopeItems")` through verbatim;
- `division`, `serviceLine`, `resourceTypes` and `contextSummary` are sent empty on purpose so
  `_context_lines()` returns `[]` and the AI Search query is exactly the question.

All of this disappears once the real route exists.

### Route specification

```
POST /chat        methods=["POST"], auth_level=ANONYMOUS (EasyAuth remains the gate)
```

**Request**

```jsonc
{
  "messages": [
    // full conversation, oldest first
    { "role": "user", "content": "Já fizemos propostas com o Defender ROV?" },
    { "role": "assistant", "content": "..." },
  ],
  "systemPrompt": "...", // from ai.prompts.ts, as with the other routes
  "promptVersion": "knowledge-chat-v3",
  "topK": 25, // optional, default 20, cap ~50
  "docTypeFilter": "Technical Proposal", // optional, see 2.4
}
```

- Build the retrieval query from the **last user message only**. Do not concatenate history —
  older turns drag the query off-topic. The current workaround already achieves this by putting
  history in the system prompt, but the route should own the behaviour explicitly.
- Drop the `TEXT_MIN_CHARS = 20` check. It exists for uploaded documents and would reject short
  questions such as "E o Defender?".
- Send history to the model as real `messages` entries instead of embedding it in the system
  prompt. Cap at the last ~6 messages server-side as a token guard.

**Response**

```jsonc
{
  "answer": "...",
  "refused": false,
  "citations": [
    {
      "title": "...",
      "url": "...",
      "docType": "Technical Proposal",
      "client": "Trident Energy do Brasil",
      "reference": "2026-10016133-001",
      "revision": "A",
      "snippet": "...",
    },
  ],
  "retrieved": [{ "title": "...", "url": "...", "snippet": "..." }],
  "warnings": [],
  "answeredAt": "2026-09-14T18:00:00Z",
}
```

`retrieved` should be produced by the **backend**, not asked of the model. Today the frontend
obtains it by instructing the model to echo the REFERENCE MATERIAL, which costs tokens and is
only as honest as the model. Returning it server-side makes it exact and free.

Keep `response_format={"type":"json_object"}`, or move to plain text plus structured
citations — either is fine, but the frontend parser must be updated to match.

---

## Part 2 — Retrieval fixes inside the new route

Implement these in a **new** `_chat_reference_material()`. Leave `_reference_material()`
untouched for scope generation.

### 2.1 Raise `topK` and dedupe per document — the fix for the Defender case

Current code:

```python
vector_query = VectorizableTextQuery(
    text=query_text, k_nearest_neighbors=5, fields="text_vector"
)
results = search_client.search(
    search_text=query_text,
    vector_queries=[vector_query],
    select=["title", "chunk", "sourceUrl", "manufacturer", "docModel"],
    top=5,
)
```

Needed for chat:

- `k_nearest_neighbors` and `top` = `topK` (default 20, allow up to ~50).
- Group results by `parent_id` — already `filterable` in the index and populated by the
  skillset's `parentKeyFieldName`. Keep the best 1–2 chunks per document.
- Return the top ~8–10 _documents_ after grouping.
- Cap the assembled block by characters (roughly 30–40k) so the prompt stays bounded.

Against the observed result, this change alone would have dropped the duplicate ODNII and
Petrorio chunks and freed slots for the Trident document.

### 2.2 Put the retrieved metadata into the reference block

The current formatting throws away two fields it already fetched:

```python
f"[{r.get('title','Untitled')}] ({r.get('sourceUrl','')})\n{r.get('chunk','')}"
```

`manufacturer` and `docModel` are in `select` and then discarded. The model therefore never
sees Type, Client, Proposal/BID No., Keywords, Scope Summary or Revision — it can only infer
them from the file name or the excerpt text.

Change:

- `select=["title","chunk","sourceUrl","docType","docCategory","manufacturer","docModel","docKeywords","docDescription","docRevision","parent_id"]`
- Render a header per document, then its chunks:

```
[<title>] (<sourceUrl>)
Type: <docType> | Client: <manufacturer> | Ref: <docModel> | Rev: <docRevision>
Discipline: <docCategory> | Keywords: <docKeywords>
Scope: <docDescription>
--- excerpt ---
<chunk>
```

Impact: exact citations instead of best-effort; the model can answer "which client", "which
proposal number", "which revision" directly; grouped list answers become reliable. This also
removes the "citation detail is best-effort" limitation on the frontend.

### 2.3 Enable the semantic ranker

`smartbid-semantic-config` exists in `02-index.json` and prioritises `title`, `chunk`,
`docKeywords` and `docCategory` — but **no query ever references it**, so it is inert.

Add to the chat search call:

```python
query_type="semantic",
semantic_configuration_name="smartbid-semantic-config",
```

Optionally read `@search.rerankerScore` and drop weak hits. Semantic ranking is billed
separately, so confirm the AI Search tier and quota first. Full benefit depends on
`docCategory` actually being populated — see 3.3.

### 2.4 Optional `docType` filter driven by intent

`docType` is `filterable` and `facetable`. For "have we done X before / list our proposals",
filter to `docType eq 'Technical Proposal'`; for equipment-capability questions, filter to
Datasheet, Manual or Catalog. Either let the client declare intent or add a cheap
classification step. This prevents datasheets from crowding out proposals and vice-versa.

### 2.5 Boilerplate suppression in the query

Low effort, decent payoff: strip the terms that appear in the header or footer of every
document before building the search query — "technical proposal", "revisão", "page N of M",
"this document contains proprietary information", "oceaneering". They carry almost no
discriminating power and pull the vector query toward generic cover pages.

---

## Part 3 — Indexing and skillset changes (require a reindex)

### 3.1 Bigger chunks, and strip repeated headers/footers — high impact

`03-skillset.json` today:

```json
"textSplitMode": "pages", "maximumPageLength": 2000, "pageOverlapLength": 500
```

2000 characters fragments a 14-page proposal into roughly 20 chunks, and a large fraction of
each chunk is repeated boilerplate. Raise `maximumPageLength` to 4000–6000, keep the overlap
near 500, and if feasible pre-process the extracted text to remove the repeating page header
and footer. Fewer, denser chunks carry more real content and less boilerplate, which greatly
improves the odds that the chunk mentioning "Defender" also matches the surrounding context.

### 3.2 Put metadata into the embedding — fixes the vector half

`AzureOpenAIEmbeddingSkill` has `inputs: [{ "name": "text", "source": "/document/pages/*" }]`,
so `text_vector` encodes the chunk text only. Metadata is projected into index fields but is
invisible to the vector. A conceptual query cannot match a document whose evidence lives in the
Scope Summary or Keywords columns — those only work through BM25 exact-ish matching.

Change: add a `MergeSkill`/`ShaperSkill` that prefixes each page with a compact metadata header
(`Title | DocType | Client | Proposal No | Keywords | Scope Summary`) and feed that to the
embedding skill, while keeping the clean `chunk` for display. Cost: a full reindex, and
modestly higher embedding token usage. This is what makes "já fizemos algo parecido?" reliable.

### 3.3 Fix the `docCategory` / `DocGroupId` mismatch

`01-datasource.json` requests
`additionalColumns=DocType,DocCategory,Manufacturer,DocModel,…` and `03-skillset.json` projects
`/document/DocCategory`, but the app never created that column — it writes `DocGroupId` and
`DocSubGroupId`, which hold opaque ids (`makeId("grp")`), not names. So `docCategory` was always
empty and "Discipline / Scope" never reached the index.

**The frontend side is done.** `sharepoint.config.ts` now declares `category: "DocCategory"`,
`DocLibraryCatalogService.ensureColumns()` provisions it, and `DocLibraryCatalog.tsx` writes
`"<Group> / <SubGroup>"` on every save.

**Still required from IT / ops:**

- Backfill. Existing documents only gain the column on their next save. Updating a column bumps
  `Modified`, so the daily indexer re-crawls them; a bulk re-save of the library is the fastest
  backfill.
- Re-run the indexer afterwards.
- Verify the indexer was not erroring on `additionalColumns` during the period when
  `DocCategory` did not exist.

### 3.4 Make `docRevision` searchable

`02-index.json` has `"docRevision": { "searchable": false }`, so "Revision / Date" is
filter-only. Azure AI Search cannot flip `searchable` on an existing field — it needs a new
index and a full reindex. Bundle this with 3.1 and 3.2 so the library is reindexed only once.

### 3.5 Indexer cadence

`04-indexer.json` runs `PT24H` at 03:00 UTC, so a proposal uploaded today is unanswerable until
tomorrow. Consider a shorter interval, or trigger an on-demand indexer run after upload from
`DocLibraryCatalogService.uploadFile()`.

---

## Part 4 — Frontend migration once `/chat` exists

Small and well-contained. The Zustand store and the UI do not change.

| File                                  | Change                                                                                                                                                                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config/ai.config.ts`                 | uncomment `endpoints.chat`; add `topK`; keep the `chat` tunables block                                                                                                                                                                                                                            |
| `services/AIAnalysisService.ts`       | point `chat()` at `endpoints.chat`; send `messages[]` instead of the fake `.txt`; drop `utf8ToBase64` on this path; read `answer` / `citations` / `retrieved` from the top level instead of `scopeItems[0]`; delete the `scopeItems` and `suggestedClarifications` fallbacks in `parseChatAnswer` |
| `config/ai.prompts.ts`                | bump to `knowledge-chat-v3`; drop the `=== CONVERSATION SO FAR ===` block, since history now travels as real messages; drop the `retrieved` echo instruction, since the backend returns it; add the citation fields that become available                                                         |
| `models/IAiChat.ts`                   | extend `IChatCitation` with `docType`, `client`, `reference`, `revision`                                                                                                                                                                                                                          |
| `components/common/ChatAssistant.tsx` | richer citation chips; set `showRetrievalDebug: false` for normal users                                                                                                                                                                                                                           |

Keep the current path behind a config flag for one release so a backend rollback does not break
the chat.

---

## Part 5 — Also worth doing, lower priority

- **Index `smartbid-tracker` for exact BID counts.** "Quantas propostas fizemos com o ROV
  Defender?" is a structured-data question that RAG over documents can never answer exactly.
  Cheapest first: (a) filter client-side via `BidService` / `useBidStore` and pass a compact
  summary to the model, which needs no Azure work; (b) a second AI Search index over the list;
  (c) tool / function calling. Option (a) is the recommended chatbot v2.
- **Streaming responses** on `/chat` — better UX, but validate against EasyAuth and the
  SharePoint-origin CORS configuration.
- **Per-user rate limiting or token budget** in the Function App. Today the only guards are
  client-side (`maxMessagesPerSession`, length caps), which a crafted request bypasses.
- **Retrieval telemetry.** Log the query, hit titles and reranker scores to Application
  Insights so retrieval quality can be tuned with real data. Mind the PII policy — the backend
  currently logs only `bidNumber` and `promptVersion`, never user text.
- **`_retrieval_query()` for scope generation.** The query is 8000 characters of raw document
  text, which is a weak query; consider summarising to keywords first. Separate from chat.

---

## Suggested sequencing

| Wave | Items                                                                               | Needs reindex?                | Unblocks                                         |
| ---- | ----------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------ |
| 1    | Part 1 (`/chat` route) + 2.1 dedupe/topK + 2.2 metadata in block                    | no                            | the Defender case; removes the `scopeItems` hack |
| 2    | 2.3 semantic ranker + 2.4 docType filter + 2.5 boilerplate stripping + 3.3 backfill | reindex only for the backfill | ranking quality                                  |
| 3    | 3.1 chunking + 3.2 metadata in embedding + 3.4 `docRevision`                        | yes, once                     | conceptual and "similar job" recall              |
| 4    | Part 5                                                                              | —                             | exact counts, streaming, telemetry               |

Wave 1 alone should fix the reported failure. Waves 2 and 3 are quality. Group every item in
Wave 3 into a single reindex cycle, since 3.4 forces a new index regardless.
