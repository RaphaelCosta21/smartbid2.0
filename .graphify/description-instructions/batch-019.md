# Node Description Batch 20 of 86

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

- "function_app_function_app_context_lines": "_context_lines()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L374 | neighbors=[function_app.py, generate_scope(), BID metadata SmartBid sends with every …, suggest_clarifications(), BID metadata SmartBid sends with every …]
- "function_app_function_app_hybrid_search": "_hybrid_search()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L460 | neighbors=[function_app.py, _chat_past_bid_material(), _clarification_library_material(), _clarification_material(), _past_bid_scope_material()]
- "function_app_function_app_now_iso": "_now_iso()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L245 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), suggest_clarifications()]
- "function_app_function_app_parse_request": "_parse_request()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L359 | neighbors=[function_app.py, extract_quotation(), generate_scope(), Return (body, file_name, file_bytes, sy…, Return (body, file_name, file_bytes, sy…]
- "function_app_function_app_reference_material": "_reference_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L512 | neighbors=[function_app.py, generate_scope(), Hybrid (keyword + vector) retrieval. Re…, _document_block(), Hybrid (keyword + vector) retrieval. Re…]
- "function_app_function_app_retrieval_query": "_retrieval_query()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L394 | neighbors=[function_app.py, generate_scope(), Bias retrieval towards the BID's divisi…, suggest_clarifications(), Bias retrieval towards the BID's divisi…]
- "function_app_function_app_server_error": "_server_error()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L291 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), suggest_clarifications()]
- "gulpfile": "gulpfile.js" | kind=code-symbol | source=gulpfile.js:L1 | neighbors=[8e88523 build: skip lint on gulp serve …, dbdc03a systemconfig online, ddf6c96 Merge branch 'feat/survey-knowl…, fe3728a smartbid2.0, build]
- "hooks_usecharttheme_categoricalcolor": "categoricalColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L111 | neighbors=[DashboardFilterBar.tsx, ErnDashboardSection.tsx, useChartTheme.ts, buildCategorical(), PeriodPerformancePage.tsx]
- "hooks_useeditcontrol_useeditcontrol": "useEditControl()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useEditControl.ts:L29 | neighbors=[OverviewTab.tsx, QualificationsTab.tsx, useEditControl.ts, BidDetailPage.tsx, TemplateEditor.tsx]
- "hooks_usepastbidpublisher_usepastbidpublisher": "usePastBidPublisher()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePastBidPublisher.ts:L36 | neighbors=[usePastBidPublisher.ts, usePastBidScopeCategories(), BidDetailPage.tsx, FollowUpPage.tsx, PastBidsPage.tsx]
- "hooks_useresponsive": "useResponsive.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResponsive.ts:L1 | neighbors=[fe3728a smartbid2.0, ChatAssistant.tsx, Breakpoints, useResponsive(), Header.tsx]
- "knowledge_clarificationbadges_clarificationtypebadge": "ClarificationTypeBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationBadges.tsx:L11 | neighbors=[ExportClarificationModal.tsx, ImportClarificationModal.tsx, ClarificationBadges.tsx, ClarificationEntryDrawer.tsx, ClarificationsDbPage.tsx]
- "knowledge_doclibrarycatalog_doclibrarycatalog": "DocLibraryCatalog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L454 | neighbors=[DocLibraryCatalog.tsx, EMPTY_META(), DatasheetsPage.tsx, ManualsCatalogsPage.tsx, TechnicalProposalsPage.tsx]
- "knowledge_qualificationcategoryinput_qualificationcategoryinput": "QualificationCategoryInput()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationCategoryInput.tsx:L20 | neighbors=[QualificationsTab.tsx, ScopeOfSupplyTab.tsx, QualificationCategoryInput.tsx, QualificationEntryModal.tsx, QualificationTableModal.tsx]
- "knowledge_qualificationtablemodal_qualificationtablemodal": "QualificationTableModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L144 | neighbors=[QualificationLibraryView.tsx, QualificationTableModal.tsx, metaOf(), plural(), sameMeta()]
- "models_iaianalysis_iaisuggestedclarification": "IAISuggestedClarification" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L188 | neighbors=[AIDocumentAnalyzer.tsx, IAIAnalysis.ts, index.ts, AIAnalysisService.ts, aiClarificationMapper.ts]
- "models_iaichat_ichatmessage": "IChatMessage" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L36 | neighbors=[ChatAssistant.tsx, IAiChat.ts, index.ts, AIAnalysisService.ts, useChatStore.ts]
- "models_ibid_iapprovaloverride": "IApprovalOverride" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L699 | neighbors=[ApprovalOverrideBanner.tsx, ApprovalTab.tsx, IBid.ts, index.ts, ApprovalService.ts]
- "models_ibid_iscopeitem": "IScopeItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L108 | neighbors=[IAIAnalysis.ts, IBid.ts, IBidRequest.ts, IBidTemplate.ts, index.ts]
- "models_ibidapproval_iapprovalchain": "IApprovalChain" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L26 | neighbors=[ApprovalMatrix.tsx, ApprovalTimeline.tsx, IBidApproval.ts, index.ts, ApprovalService.ts]
- "models_ibidcost": "IBidCost.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidCost.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidCostBreakdown, IBidCostReport, IDivisionCostBreakdown, index.ts]
- "models_ibidhours": "IBidHours.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidHours.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidHoursItem, IBidHoursSection, IBidHoursSummary, index.ts]
- "models_ibidnotes": "IBidNotes.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidNotes.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, BidNoteSection, IBidNote, IBidNotesMap, index.ts]
- "models_ibidresult": "IBidResult.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidResult.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidResultDef, IBidStatus.ts, BidResultOutcome, index.ts]
- "models_iqualificationdb_iqualificationtablechanges": "IQualificationTableChanges" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQualificationDb.ts:L37 | neighbors=[QualificationLibraryView.tsx, QualificationTableModal.tsx, IQualificationDb.ts, QualificationDbService.ts, qualificationHelpers.ts]
- "models_iquotationitem": "IQuotationItem.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQuotationItem.ts:L1 | neighbors=[165493f NEW-MODIFIC, b6d954d feat: Enhance AIAnalysisService…, index.ts, IQuotationItem, QuotationType]
- "models_iuser_bidrole": "BidRole" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L12 | neighbors=[bidRoles.config.ts, index.ts, ISystemConfig.ts, ITeamMember.ts, IUser.ts]
- "reports_reportsdashboard": "ReportsDashboard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ReportsDashboard.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PageHeader.tsx, PageHeader(), ReportsDashboard()]
- "services_activitylogservice_activitylogservice": "ActivityLogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L11 | neighbors=[AddQuotationModal.tsx, ActivityLogService.ts, .addEntry(), .getAll(), ._list()]
- "services_aianalysisservice_aianalysisservice_analyzedocument": ".analyzeDocument()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L449 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson(), .validateResponse()]
- "services_aianalysisservice_aianalysisservice_analyzedocumentfortemplate": ".analyzeDocumentForTemplate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L482 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson(), .validateResponse()]
- "services_aianalysisservice_aianalysisservice_extractdocumentmetadata": ".extractDocumentMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L884 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson(), .validateDocumentMetadataResult()]
- "services_aianalysisservice_aianalysisservice_parsechatanswer": ".parseChatAnswer()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L564 | neighbors=[AIAnalysisService, .chat(), .parseChatCitations(), .parseChatFollowUps(), .parseChatRetrieved()]
- "services_aianalysisservice_aianalysisservice_suggestclarifications": ".suggestClarifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L1080 | neighbors=[AIAnalysisService, .ensureConfigured(), .parseClarifications(), .parseWarnings(), .postJson()]
- "services_aianalysisservice_aianalysisservice_suggestqualifications": ".suggestQualifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L1124 | neighbors=[AIAnalysisService, .ensureConfigured(), .parseQualifications(), .parseWarnings(), .postJson()]
- "services_aiauthservice_aiauthservice_getloginhint": ".getLoginHint()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L103 | neighbors=[AiAuthService, .getAccessToken(), .pickAccount(), .probeScope(), .warmUp()]
- "services_aiauthservice_aiauthservice_warmup": ".warmUp()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L308 | neighbors=[AiAuthService, .getApp(), .getLoginHint(), .isConfigured(), .pickAccount()]
- "services_bidservice_bidservice_searchcolumns": "._searchColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L78 | neighbors=[BidService, .create(), .patchByBidNumber(), .update(), .updateAfterCreate()]
- "services_clarificationdbservice_clarificationdbservice_columns": "._columns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L87 | neighbors=[ClarificationDbService, .ensureColumns(), .create(), .getAll(), .update()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-019.json

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
