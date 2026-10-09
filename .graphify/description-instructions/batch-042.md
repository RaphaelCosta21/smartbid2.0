# Node Description Batch 43 of 86

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "models_ibidresult_ibidresultdef": "IBidResultDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidResult.ts:L6 | neighbors=[IBidResult.ts, index.ts]
- "models_ibidstatus_bidstatusid": "BidStatusId" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L10 | neighbors=[IBidStatus.ts, index.ts]
- "models_ibidstatus_substatusid": "SubStatusId" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L53 | neighbors=[IBidStatus.ts, index.ts]
- "models_ibidtask_ibidtaskdef": "IBidTaskDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTask.ts:L6 | neighbors=[IBidTask.ts, index.ts]
- "models_ibidtask_taskstatustype": "TaskStatusType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTask.ts:L23 | neighbors=[IBidTask.ts, index.ts]
- "models_ibomcostanalysis_bomcostsource": "BomCostSource" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L8 | neighbors=[IBomCostAnalysis.ts, index.ts]
- "models_ibomcostanalysis_ibomcostanalysis": "IBomCostAnalysis" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L63 | neighbors=[IBomCostAnalysis.ts, index.ts]
- "models_ibomcostanalysis_ibomcostitem": "IBomCostItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L17 | neighbors=[IBomCostAnalysis.ts, index.ts]
- "models_ieditlock_ieditlock": "IEditLock" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IEditLock.ts:L5 | neighbors=[IEditLock.ts, index.ts]
- "models_iern_erndeadlinestate": "ErnDeadlineState" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L94 | neighbors=[IErn.ts, index.ts]
- "models_iern_iern": "IErn" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L8 | neighbors=[IErn.ts, index.ts]
- "models_iern_ierncreatedata": "IErnCreateData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L43 | neighbors=[IErn.ts, index.ts]
- "models_iern_ierncreateresult": "IErnCreateResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L86 | neighbors=[IErn.ts, index.ts]
- "models_ifavoriteitem_favoritedatasource": "FavoriteDataSource" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L21 | neighbors=[IFavoriteItem.ts, index.ts]
- "models_ifavoriteitem_ifavoritebid": "IFavoriteBid" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L57 | neighbors=[IFavoriteItem.ts, index.ts]
- "models_ifavoriteitem_ifavoriteequipment": "IFavoriteEquipment" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L24 | neighbors=[IFavoriteItem.ts, index.ts]
- "models_ifavoriteitem_ifavoritesdata": "IFavoritesData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L64 | neighbors=[IFavoriteItem.ts, index.ts]
- "models_ifavoriteitem_ifavoritesubgroup": "IFavoriteSubGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L14 | neighbors=[IFavoriteItem.ts, index.ts]
- "models_inotification_inotification": "INotification" | kind=code-symbol | source=src/webparts/smartBid20/app/models/INotification.ts:L1 | neighbors=[index.ts, INotification.ts]
- "models_iqualificationdb_iqualificationtablesaveresult": "IQualificationTableSaveResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQualificationDb.ts:L43 | neighbors=[IQualificationDb.ts, QualificationDbService.ts]
- "models_iquerycatalog_catalogsearchbucket": "CatalogSearchBucket" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L94 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_financialsactiveregisteredcolumn": "FinancialsActiveRegisteredColumn" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L110 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_financialsactiveregisteredrow": "FinancialsActiveRegisteredRow" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L119 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_iactiveregistereditem": "IActiveRegisteredItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L8 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_ibomcostresult": "IBomCostResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L158 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_ibomsheetitem": "IBomSheetItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L42 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_imultisourceresults": "IMultiSourceResults" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L73 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_ipeoplesoftfinancialsitem": "IPeopleSoftFinancialsItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L22 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_ipnalias": "IPnAlias" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L84 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_iquerycatalogdata": "IQueryCatalogData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L131 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_isearchresultitem": "ISearchResultItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L58 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquotationitem_iquotationitem": "IQuotationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQuotationItem.ts:L11 | neighbors=[index.ts, IQuotationItem.ts]
- "models_iquotationitem_quotationtype": "QuotationType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQuotationItem.ts:L8 | neighbors=[index.ts, IQuotationItem.ts]
- "models_isurveycatalog_isurveybidintel": "ISurveyBidIntel" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L177 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveycatalog": "ISurveyCatalog" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L102 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveyequipment": "ISurveyEquipment" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L61 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveyfamily": "ISurveyFamily" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L47 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveyfitnode": "ISurveyFitNode" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L55 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveypackageline": "ISurveyPackageLine" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L168 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveyspread": "ISurveySpread" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L156 | neighbors=[index.ts, ISurveyCatalog.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-042.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
