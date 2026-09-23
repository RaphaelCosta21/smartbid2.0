# Node Description Batch 11 of 43

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

- "insights_aiinsightspanel": "AIInsightsPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AIInsightsPanel.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, AIInsightsPanel(), AIInsightsPanelProps, BottleneckAnalysisPage.tsx, PerformanceTrendsPage.tsx]
- "insights_multiselectdropdown": "MultiSelectDropdown.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, AnalyticsFilterBar.tsx, MultiSelectDropdown(), MultiSelectDropdownProps, MultiSelectOption]
- "knowledge_doclibrarycatalog_doclibrarycatalog": "DocLibraryCatalog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L465 | neighbors=[DocLibraryCatalog.tsx, EMPTY_META(), DatasheetsPage.tsx, ManualsCatalogsPage.tsx, TechnicalProposalsPage.tsx]
- "layout_sidebarsubmenu": "SidebarSubmenu.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarSubmenu.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, Sidebar.tsx, SidebarSubmenu(), SidebarSubmenuProps]
- "models_iaichat_ichatmessage": "IChatMessage" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L36 | neighbors=[ChatAssistant.tsx, IAiChat.ts, index.ts, AIAnalysisService.ts, useChatStore.ts]
- "models_iassetcatalog_iassetcatalogitem": "IAssetCatalogItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAssetCatalog.ts:L4 | neighbors=[EquipmentImportModal.tsx, IAssetCatalog.ts, index.ts, AssetsCatalogPage.tsx, AssetCatalogService.ts]
- "models_ibid_ibid": "IBid" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L798 | neighbors=[ApprovalTab.tsx, IBid.ts, index.ts, ApprovalService.ts, aiContext.ts]
- "models_ibidapproval_iapprovalchain": "IApprovalChain" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L26 | neighbors=[ApprovalMatrix.tsx, ApprovalTimeline.tsx, IBidApproval.ts, index.ts, ApprovalService.ts]
- "models_ibidcost": "IBidCost.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidCost.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidCostBreakdown, IBidCostReport, IDivisionCostBreakdown, index.ts]
- "models_ibidhours": "IBidHours.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidHours.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidHoursItem, IBidHoursSection, IBidHoursSummary, index.ts]
- "models_ibidnotes": "IBidNotes.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidNotes.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, BidNoteSection, IBidNote, IBidNotesMap, index.ts]
- "models_ibidresult": "IBidResult.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidResult.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidResultDef, IBidStatus.ts, BidResultOutcome, index.ts]
- "models_iquotationitem": "IQuotationItem.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQuotationItem.ts:L1 | neighbors=[165493f NEW-MODIFIC, b6d954d feat: Enhance AIAnalysisService…, index.ts, IQuotationItem, QuotationType]
- "reports_reportsdashboard": "ReportsDashboard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ReportsDashboard.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PageHeader.tsx, PageHeader(), ReportsDashboard()]
- "services_activitylogservice_activitylogservice": "ActivityLogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L11 | neighbors=[AddQuotationModal.tsx, ActivityLogService.ts, .addEntry(), .getAll(), ._list()]
- "services_aianalysisservice_aianalysisservice_analyzedocument": ".analyzeDocument()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L413 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson(), .validateResponse()]
- "services_aianalysisservice_aianalysisservice_analyzedocumentfortemplate": ".analyzeDocumentForTemplate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L444 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson(), .validateResponse()]
- "services_aianalysisservice_aianalysisservice_extractdocumentmetadata": ".extractDocumentMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L797 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson(), .validateDocumentMetadataResult()]
- "services_aianalysisservice_aianalysisservice_extractquotation": ".extractQuotation()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L709 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson(), .validateQuotationResult()]
- "services_aianalysisservice_aianalysisservice_parsechatanswer": ".parseChatAnswer()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L525 | neighbors=[AIAnalysisService, .chat(), .parseChatCitations(), .parseChatFollowUps(), .parseChatRetrieved()]
- "services_aiauthservice_aiauthservice_getloginhint": ".getLoginHint()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L103 | neighbors=[AiAuthService, .getAccessToken(), .pickAccount(), .probeScope(), .warmUp()]
- "services_aiauthservice_aiauthservice_warmup": ".warmUp()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L308 | neighbors=[AiAuthService, .getApp(), .getLoginHint(), .isConfigured(), .pickAccount()]
- "services_bidservice_bidservice_getbyid": ".getById()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L96 | neighbors=[BidService, .delete(), .patchByBidNumber(), .update(), .updateAfterCreate()]
- "services_bidservice_bidservice_searchcolumns": "._searchColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L69 | neighbors=[BidService, .create(), .patchByBidNumber(), .update(), .updateAfterCreate()]
- "services_editcontrolservice_editcontrolservice_getlocks": ".getLocks()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L19 | neighbors=[EditControlService, .acquireLock(), .saveLocks(), .releaseAllForBid(), .releaseLock()]
- "services_editcontrolservice_editcontrolservice_savelocks": ".saveLocks()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L111 | neighbors=[EditControlService, .acquireLock(), .getLocks(), .releaseAllForBid(), .releaseLock()]
- "services_notificationservice": "NotificationService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, NotificationService, ToastCallback, ToastOptions, ToastType]
- "services_notificationservice_notificationservice_emit": "._emit()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L28 | neighbors=[NotificationService, .error(), .info(), .success(), .warning()]
- "services_pricingservice": "PricingService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L1 | neighbors=[c4e04de lots-implementation, IPriceEntry, PricingService, SPService.ts, SPService]
- "services_querycatalogservice_querycatalogservice_loadcatalog": ".loadCatalog()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L22 | neighbors=[QueryCatalogService, .parseActiveRegistered(), .parseBomSheet(), .parsePeopleSoftFinancials(), .parseRawSheet()]
- "services_querycatalogservice_querycatalogservice_parsebomsheet": ".parseBomSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L171 | neighbors=[QueryCatalogService, .loadCatalog(), .dateDiffDays(), .toISODate(), .toNumber()]
- "services_quotationservice_quotationservice_ensurecolumns": ".ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L32 | neighbors=[QuotationService, .addItems(), ._provisionColumns(), ._migrateLegacyBlob(), .updateItem()]
- "services_userservice_userservice": "UserService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L8 | neighbors=[AppLayout.tsx, UserService.ts, .getCurrentUser(), .getUserPhoto(), .searchUsers()]
- "settings_patchnotes": "PatchNotes.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/PatchNotes.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PatchNotesPage.tsx, PatchNote, PatchNotes()]
- "utils_accesscontrol_issuperadmin": "isSuperAdmin()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L103 | neighbors=[AppLayout.tsx, useAuthStore.ts, accessControl.ts, canAccessKnowledge(), canManageErn()]
- "utils_approvalhelpers_computeapprovalcycletime": "computeApprovalCycleTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L184 | neighbors=[ApprovalTab.tsx, BidDetailsReportPage.tsx, BottleneckAnalysisPage.tsx, approvalHelpers.ts, computeBidSectorDurations()]
- "utils_bomparser_emptyitem": "emptyItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L160 | neighbors=[BomCostsPage.tsx, bomParser.ts, uid(), parseBomCSV(), parseBomExcel()]
- "utils_costcalculations_converttousd": "convertToUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L645 | neighbors=[AddQuotationModal.tsx, BomCostsPage.tsx, QueryConsultingPage.tsx, QuotationsPage.tsx, costCalculations.ts]
- "utils_ernhelpers_erndivision": "ErnDivision" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L23 | neighbors=[ErnCreateModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx, ernHelpers.ts, ernLink.ts]
- "utils_ernhelpers_geterndeadlinestate": "getErnDeadlineState()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L117 | neighbors=[ErnDetailsModal.tsx, OverviewTab.tsx, ErnDashboardSection.tsx, ernHelpers.ts, isErnClosed()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-010.json

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
