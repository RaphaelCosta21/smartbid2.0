# Node Description Batch 2 of 43

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "common_pageheader": "PageHeader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PageHeader.tsx:L1 | neighbors=[fe3728a smartbid2.0, PageHeader(), PageHeaderProps, DocLibraryCatalog.tsx, AnalyticsPage.tsx, ApprovalsPage.tsx]
- "pages_templatespage": "TemplatesPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 3a3d0a5 new changes, 401be0c Add EntraTokenTest component fo…, 4b576db AI-Integration, 4c2e63a update smartbid 2.0, c4e04de lots-implementation]
- "bid_approvaltab": "ApprovalTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L1 | neighbors=[ApprovalTab(), ApprovalTabProps, matchesDivision(), SECTOR_CONFIGS, SectorConfig, STATUS_DISPLAY]
- "bid_bidstatusphasepanel": "BidStatusPhasePanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L1 | neighbors=[BidStatusPhasePanel(), BidStatusPhasePanelProps, TerminalStatusSection(), BidTaskChecklist.tsx, BidTaskChecklist(), RevisionsTab.tsx]
- "template_templateeditor": "TemplateEditor.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateEditor.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 1665b01 more features, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0, c4e04de lots-implementation]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3c5c37ba0522eeb4e09fd69ebad830cebb4a5d9f": "3c5c37b more-mods" | kind=Commit | source=git | neighbors=[165493f NEW-MODIFIC, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, CostSearchModal.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8e87d9402fc8756f48036ab14508de0546bd916a": "8e87d94 feat: Add Links and Recommendations page with CRUD functionality" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, BidStatusPhasePanel.tsx, ImportClarificationModal.tsx, QualificationsTab.tsx, main, 7ccad33 Refactor code structure and rem…]
- "common_glasscard": "GlassCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GlassCard.tsx:L1 | neighbors=[AITab.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, NotesTab.tsx, QualificationsTab.tsx]
- "common_pageheader_pageheader": "PageHeader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PageHeader.tsx:L11 | neighbors=[PageHeader.tsx, DocLibraryCatalog.tsx, AnalyticsPage.tsx, ApprovalsPage.tsx, AssetsCatalogPage.tsx, BidBoardPage.tsx]
- "pages_queryconsultingpage": "QueryConsultingPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L1 | neighbors=[e2285cf cont-implementing, AppLayout.tsx, PageHeader.tsx, PageHeader(), PhotoLightbox.tsx, PhotoLightbox()]
- "branch:repo:github.com/RaphaelCosta21/smartbid2.0#main": "main" | kind=Branch | source=git | neighbors=[0546310 Add dashboard components and st…, 0e653cd more mods, 165493f NEW-MODIFIC, 1665b01 more features, 1a40896 feat: add SmartBid 2.0 Executiv…, 1c19dcd Update API diagnostics and AI c…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@b6d954d3fb2bcd28a6d0d42e32c5105e73f92798": "b6d954d feat: Enhance AIAnalysisService to include section data and handle zero…" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, EngineeringHoursSection.tsx, EquipmentImportModal.tsx]
- "function_app_function_app": "function_app.py" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1 | neighbors=[401be0c Add EntraTokenTest component fo…, 961eb93 feat: Update AI integration and…, 9e27edd feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…, c6ce977 Add Azure AI Backend for SmartB…, de36cf5 feat: add SmartBid Docs indexer…]
- "utils_costcalculations": "costCalculations.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L1 | neighbors=[AddQuotationModal.tsx, BidCostSummary.tsx, OverviewTab.tsx, 3c5c37b more-mods, bee3eb5 feat: Enhance bid model with av…, c4e04de lots-implementation]
- "bid_bidhourstable": "BidHoursTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L1 | neighbors=[BidHoursTable(), BidHoursTableProps, blankHoursItem(), ColorPickerInline(), HoursRow(), HoursRowProps]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0546310f05223277e0960f6d542baf27930ac3b7": "0546310 Add dashboard components and styles for activity and engineering hours …" | kind=Commit | source=git | neighbors=[ApprovalBadge.tsx, ApprovalMatrix.tsx, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidApprovalPanel.tsx, BidCard.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@892c1fc3f5724f61043e10959011b9d07c91842f": "892c1fc feat: add PeoplePicker component for AAD user selection" | kind=Commit | source=git | neighbors=[0546310 Add dashboard components and st…, BidCard.tsx, ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx]
- "models_ibidstatus": "IBidStatus.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L1 | neighbors=[ApprovalTab.tsx, 0e653cd more mods, 1665b01 more features, 3a3d0a5 new changes, 8e87d94 feat: Add Links and Recommendat…, c4e04de lots-implementation]
- "common_glasscard_glasscard": "GlassCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GlassCard.tsx:L20 | neighbors=[AITab.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, NotesTab.tsx, QualificationsTab.tsx]
- "hooks_usecurrentuser": "useCurrentUser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useCurrentUser.ts:L1 | neighbors=[AddQuotationModal.tsx, BidCard.tsx, BidStatusPhasePanel.tsx, ErnCreateModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx]
- "models_iaianalysis": "IAIAnalysis.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L1 | neighbors=[4b576db AI-Integration, 961eb93 feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…, c58a13c new-implementations, c6ce977 Add Azure AI Backend for SmartB…, de36cf5 feat: add SmartBid Docs indexer…]
- "common_aidocumentanalyzer": "AIDocumentAnalyzer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L1 | neighbors=[AITab.tsx, ScopeOfSupplyTab.tsx, 4b576db AI-Integration, c58a13c new-implementations, c6ce977 Add Azure AI Backend for SmartB…, de36cf5 feat: add SmartBid Docs indexer…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@165493fb8d1055a2ff598eee19844e74d28e0347": "165493f NEW-MODIFIC" | kind=Commit | source=git | neighbors=[EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, main, 3c5c37b more-mods, PartNumberAutocomplete.tsx, sharepoint.config.ts]
- "layout_sidebar": "Sidebar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L1 | neighbors=[0e653cd more mods, 1665b01 more features, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0, 8e87d94 feat: Add Links and Recommendat…]
- "services_spservice": "SPService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L1 | neighbors=[0e653cd more mods, 4b576db AI-Integration, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, dbdc03a systemconfig online, ActivityLogService.ts]
- "services_aianalysisservice_aianalysisservice": "AIAnalysisService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L56 | neighbors=[AddQuotationModal.tsx, QualificationsTab.tsx, AIDocumentAnalyzer.tsx, DocLibraryCatalog.tsx, AIAnalysisService.ts, .analyzeDocument()]
- "services_spservice_spservice": "SPService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L15 | neighbors=[ActivityLogService.ts, AiAuthService.ts, ApprovalService.ts, AssetCatalogService.ts, AttachmentService.ts, BidService.ts]
- "utils_idgenerator": "idGenerator.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/idGenerator.ts:L1 | neighbors=[AssetsBreakdownTab.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, DocumentsTab.tsx, EngineeringHoursSection.tsx, ImportClarificationModal.tsx]
- "bid_erncreatemodal": "ErnCreateModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L1 | neighbors=[ErnCreateModal(), ErnCreateModalProps, personToPicked(), toInputDate(), PeoplePicker.tsx, IPickedPerson]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@de36cf557398ab15a11ece0b82622bb9f4f93937": "de36cf5 feat: add SmartBid Docs indexer and skillset for AI search integration" | kind=Commit | source=git | neighbors=[961eb93 feat: Update AI integration and…, main, b6d954d feat: Enhance AIAnalysisService…, AIDocumentAnalyzer.tsx, ChatAssistant.tsx, ai.config.ts]
- "utils_ernhelpers": "ernHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L1 | neighbors=[BidCard.tsx, ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx, 892c1fc feat: add PeoplePicker componen…]
- "utils_idgenerator_makeid": "makeId()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/idGenerator.ts:L5 | neighbors=[AssetsBreakdownTab.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, DocumentsTab.tsx, EngineeringHoursSection.tsx, ImportClarificationModal.tsx]
- "utils_reporthelpers": "reportHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L1 | neighbors=[c271ce8 Refactor code structure for imp…, PeriodPerformancePage.tsx, index.ts, BidTableRow, bidTableRows(), byCommercialRequester()]
- "bid_equipmentimportmodal": "EquipmentImportModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L1 | neighbors=[EquipmentImportModal(), EquipmentImportModalProps, IImportPick, IImportSubItem, TabDef, TabId]
- "pages_bidresultspage": "BidResultsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidResultsPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 8e87d94 feat: Add Links and Recommendat…, DataTable.tsx, DataTable()]
- "services_bidservice_bidservice": "BidService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L15 | neighbors=[AppLayout.tsx, BidDetailPage.tsx, BidTrackerPage.tsx, CreateRequestPage.tsx, FollowUpPage.tsx, UnassignedRequestsPage.tsx]
- "utils_accesscontrol": "accessControl.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, 8e87d94 feat: Add Links and Recommendat…, d23a43b feat: enhance ERN management wi…, dbdc03a systemconfig online, fe3728a smartbid2.0]
- "bid_bidcostsummary": "BidCostSummary.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCostSummary.tsx:L1 | neighbors=[BidCostSummary(), BidCostSummaryProps, index.ts, costCalculations.ts, buildCostSummary(), calculateAssetsByResourceType()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4b576dbe191b692b6422f46dbf867026bcb873eb": "4b576db AI-Integration" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AITab.tsx, ClarificationSuggestionsModal.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, main]
- "hooks_usecurrentuser_usecurrentuser": "useCurrentUser()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useCurrentUser.ts:L8 | neighbors=[AddQuotationModal.tsx, BidCard.tsx, BidStatusPhasePanel.tsx, ErnCreateModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-001.json

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
