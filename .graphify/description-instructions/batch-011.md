# Node Description Batch 12 of 43

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

- "utils_exporthelpers_bidstocsv": "bidsToCSV()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L48 | neighbors=[BidDetailPage.tsx, BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx, exportHelpers.ts]
- "utils_exporthelpers_downloadcsv": "downloadCSV()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L66 | neighbors=[BidDetailPage.tsx, BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx, exportHelpers.ts]
- "utils_pdfexport_buildreportpdf": "buildReportPdf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L52 | neighbors=[BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx, ExportService.ts, pdfExport.ts]
- "approval_approvaldecisionpanel": "ApprovalDecisionPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalDecisionPanel.tsx:L1 | neighbors=[ApprovalDecisionPanel(), ApprovalDecisionPanelProps, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "bid_bidstatusdropdown": "BidStatusDropdown.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusDropdown.tsx:L1 | neighbors=[BidStatusDropdown(), BidStatusDropdownProps, 3a3d0a5 new changes, fe3728a smartbid2.0]
- "bid_revisionstab_getcurrentrevisionletter": "getCurrentRevisionLetter()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L45 | neighbors=[OverviewTab.tsx, RevisionsTab.tsx, RevisionsTab(), BidDetailPage.tsx]
- "bid_scopeofsupplytab_scopeofsupplytab": "ScopeOfSupplyTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L129 | neighbors=[ScopeOfSupplyTab.tsx, AIDocumentAnalyzer.tsx, BidDetailPage.tsx, TemplateEditor.tsx]
- "common_aidocumentanalyzer_aidocumentanalyzer": "AIDocumentAnalyzer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L45 | neighbors=[AITab.tsx, ScopeOfSupplyTab.tsx, AIDocumentAnalyzer.tsx, TemplatesPage.tsx]
- "common_progressbar_progressbar": "ProgressBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ProgressBar.tsx:L13 | neighbors=[ProgressBar.tsx, BottleneckAnalysisPage.tsx, TeamAnalyticsPage.tsx, ToolingReportPage.tsx]
- "common_timeline_timeline": "Timeline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L18 | neighbors=[ApprovalTimeline.tsx, BidActivityLog.tsx, Timeline.tsx, BidDetailsReportPage.tsx]
- "config_app_config": "app.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/app.config.ts:L1 | neighbors=[4b576db AI-Integration, c58a13c new-implementations, fe3728a smartbid2.0, APP_CONFIG]
- "data_mockapprovals": "mockApprovals.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockApprovals.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, mockApprovals, IApprovalFlow.ts, IApprovalFlow]
- "function_app_document_structure_has_letters": "_has_letters()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L93 | neighbors=[document_structure.py, _is_boilerplate(), _is_title_case(), _is_upper()]
- "function_app_document_structure_has_word": "_has_word()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L105 | neighbors=[document_structure.py, _letter_count(), _heading(), Guards against all-caps noise such as t…]
- "function_app_document_structure_is_upper": "_is_upper()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L97 | neighbors=[document_structure.py, _heading(), _has_letters(), _numbered_title()]
- "function_app_document_structure_normalize": "_normalize()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L131 | neighbors=[document_structure.py, _is_boilerplate(), Collapse whitespace and mask digits so …, strip_boilerplate()]
- "function_app_document_structure_numbered_title": "_numbered_title()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L119 | neighbors=[document_structure.py, _heading(), _is_upper(), A single-level number is indistinguisha…]
- "function_app_document_structure_split_body": "_split_body()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L300 | neighbors=[document_structure.py, build_chunks(), _atomic_blocks(), _overlap_tail()]
- "function_app_document_structure_split_sections": "split_sections()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L220 | neighbors=[document_structure.py, build_chunks(), Walk the document once, keeping a headi…, _heading()]
- "function_app_document_structure_strip_boilerplate": "strip_boilerplate()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L151 | neighbors=[document_structure.py, build_chunks(), _is_boilerplate(), _normalize()]
- "function_app_function_app_document_block": "_document_block()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L324 | neighbors=[function_app.py, _chat_reference_material(), Render one retrieved document with the …, _reference_material()]
- "function_app_function_app_extract_text_or_images": "extract_text_or_images()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L122 | neighbors=[function_app.py, _document_text(), _page_to_png(), Prefer extracted text (cheap). For scan…]
- "function_app_function_app_now_iso": "_now_iso()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L176 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope()]
- "function_app_function_app_parse_request": "_parse_request()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L280 | neighbors=[function_app.py, extract_quotation(), generate_scope(), Return (body, file_name, file_bytes, sy…]
- "function_app_function_app_reference_material": "_reference_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L360 | neighbors=[function_app.py, generate_scope(), Hybrid (keyword + vector) retrieval. Re…, _document_block()]
- "function_app_function_app_server_error": "_server_error()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L212 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope()]
- "hooks_useaccesslevel_useaccesslevel": "useAccessLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAccessLevel.ts:L7 | neighbors=[useAccessLevel.ts, ApprovalsPage.tsx, BidDetailPage.tsx, TemplateEditor.tsx]
- "hooks_useconfigphases_useconfigphases": "useConfigPhases()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useConfigPhases.ts:L17 | neighbors=[BidPhaseProgress.tsx, OverviewTab.tsx, useConfigPhases.ts, BidDetailPage.tsx]
- "hooks_usekpis_usekpis": "useKPIs()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L22 | neighbors=[useKPIs.ts, AnalyticsPage.tsx, DashboardPage.tsx, ReportsPage.tsx]
- "models_iactivitylog_iactivitylogentry": "IActivityLogEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IActivityLog.ts:L4 | neighbors=[AddQuotationModal.tsx, IActivityLog.ts, index.ts, ActivityLogService.ts]
- "models_iaianalysis_iaianalysiscontext": "IAIAnalysisContext" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L57 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts, aiContext.ts]
- "models_iaianalysis_iaianalysisresult": "IAIAnalysisResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L107 | neighbors=[AIDocumentAnalyzer.tsx, IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaigroupoption": "IAIGroupOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L25 | neighbors=[ai.prompts.ts, IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaisuggestedclarification": "IAISuggestedClarification" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L159 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts, aiClarificationMapper.ts]
- "models_ibid_ibidattachment": "IBidAttachment" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L655 | neighbors=[IBid.ts, IBidTemplate.ts, index.ts, AttachmentService.ts]
- "models_ibid_iscopeitem": "IScopeItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L103 | neighbors=[IAIAnalysis.ts, IBid.ts, IBidTemplate.ts, index.ts]
- "models_ibidapproval_ibidapprovalstate": "IBidApprovalState" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L37 | neighbors=[ApprovalRequestCard.tsx, IBidApproval.ts, index.ts, ApprovalService.ts]
- "models_ibidequipment": "IBidEquipment.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidEquipment.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidEquipmentItem, IEquipmentSummary, index.ts]
- "models_ibidexport_iexportoptions": "IExportOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L17 | neighbors=[useExport.ts, IBidExport.ts, index.ts, ExportService.ts]
- "models_ibidexport_iexportresult": "IExportResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L30 | neighbors=[useExport.ts, IBidExport.ts, index.ts, ExportService.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-011.json

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
