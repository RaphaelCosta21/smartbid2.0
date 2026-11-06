# Node Description Batch 24 of 102

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

- "models_ibid_iscopeitem": "IScopeItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L110 | neighbors=[IAIAnalysis.ts, IBid.ts, IBidRequest.ts, IBidTemplate.ts, index.ts]
- "models_ibidapproval_iapprovalchain": "IApprovalChain" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L26 | neighbors=[ApprovalMatrix.tsx, ApprovalTimeline.tsx, IBidApproval.ts, index.ts, ApprovalService.ts]
- "models_ibidcost": "IBidCost.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidCost.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidCostBreakdown, IBidCostReport, IDivisionCostBreakdown, index.ts]
- "models_ibidhours": "IBidHours.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidHours.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidHoursItem, IBidHoursSection, IBidHoursSummary, index.ts]
- "models_ibidnotes": "IBidNotes.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidNotes.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, BidNoteSection, IBidNote, IBidNotesMap, index.ts]
- "models_ibidresult": "IBidResult.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidResult.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidResultDef, IBidStatus.ts, BidResultOutcome, index.ts]
- "models_ibidstatus_basedivision": "BaseDivision" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L94 | neighbors=[IBid.ts, IBidRequest.ts, IBidStatus.ts, index.ts, CreateRequestPage.tsx]
- "models_iqualificationdb_iqualificationtablechanges": "IQualificationTableChanges" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQualificationDb.ts:L37 | neighbors=[QualificationLibraryView.tsx, QualificationTableModal.tsx, IQualificationDb.ts, QualificationDbService.ts, qualificationHelpers.ts]
- "models_iquotationitem": "IQuotationItem.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQuotationItem.ts:L1 | neighbors=[165493f NEW-MODIFIC, b6d954d feat: Enhance AIAnalysisService…, index.ts, IQuotationItem, QuotationType]
- "models_iuser_bidrole": "BidRole" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L12 | neighbors=[bidRoles.config.ts, index.ts, ISystemConfig.ts, ITeamMember.ts, IUser.ts]
- "reports_exportbar_exportbar": "ExportBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportBar.tsx:L49 | neighbors=[BidComparatorPage.tsx, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, ExportBar.tsx, OperationalSummaryPage.tsx]
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
- "services_bidservice_bidservice_searchcolumns": "._searchColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L85 | neighbors=[BidService, .create(), .patchByBidNumber(), .update(), .updateAfterCreate()]
- "services_clarificationdbservice_clarificationdbservice_columns": "._columns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L87 | neighbors=[ClarificationDbService, .ensureColumns(), .create(), .getAll(), .update()]
- "services_clarificationdbservice_clarificationdbservice_maptosp": "._mapToSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L127 | neighbors=[ClarificationDbService, .create(), .syncFromBid(), .update(), .addMany()]
- "services_easimodulesadapter_easimodulesadapter_getbenchmarkdataset": ".getBenchmarkDataset()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L137 | neighbors=[EasiModulesAdapter, ._bids(), ._costRows(), ._laborRows(), ._opportunityRows()]
- "services_editcontrolservice_editcontrolservice_getlocks": ".getLocks()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L19 | neighbors=[EditControlService, .acquireLock(), .saveLocks(), .releaseAllForBid(), .releaseLock()]
- "services_editcontrolservice_editcontrolservice_savelocks": ".saveLocks()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L111 | neighbors=[EditControlService, .acquireLock(), .getLocks(), .releaseAllForBid(), .releaseLock()]
- "services_membersservice_membersservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L16 | neighbors=[MembersService, .addMember(), .removeMember(), .savePreferences(), .updateMember()]
- "services_membersservice_membersservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L49 | neighbors=[MembersService, .addMember(), .removeMember(), .savePreferences(), .updateMember()]
- "services_notificationservice": "NotificationService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, NotificationService, ToastCallback, ToastOptions, ToastType]
- "services_notificationservice_notificationservice_emit": "._emit()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L28 | neighbors=[NotificationService, .error(), .info(), .success(), .warning()]
- "services_pricingservice": "PricingService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L1 | neighbors=[c4e04de lots-implementation, IPriceEntry, PricingService, SPService.ts, SPService]
- "services_qualificationdbservice_qualificationdbservice_ensurelist": ".ensureList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L30 | neighbors=[QualificationDbService, .create(), ._provision(), .saveTable(), .syncFromBid()]
- "services_qualificationdbservice_qualificationdbservice_maptosp": "._mapToSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L123 | neighbors=[QualificationDbService, .create(), .saveTable(), .syncFromBid(), .update()]
- "services_qualificationdbservice_qualificationdbservice_savetable": ".saveTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L179 | neighbors=[QualificationDbService, .delete(), .ensureList(), ._mapToSP(), .update()]
- "services_qualificationdbservice_qualificationdbservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L165 | neighbors=[QualificationDbService, ._provision(), .saveTable(), .syncFromBid(), ._mapToSP()]
- "services_querycatalogservice_querycatalogservice_parsebomsheet": ".parseBomSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L230 | neighbors=[QueryCatalogService, .loadCatalog(), .dateDiffDays(), .toISODate(), .toNumber()]
- "services_quotationservice_quotationservice_ensurecolumns": ".ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L34 | neighbors=[QuotationService, .addItems(), ._provisionColumns(), ._migrateLegacyBlob(), .updateItem()]
- "services_supplierservice_supplierservice_setlogo": "._setLogo()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L293 | neighbors=[SupplierService, .create(), ._clearLogo(), validateLogo(), .update()]
- "services_supplierservice_supplierservice_updateprofile": ".updateProfile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L266 | neighbors=[SupplierService, joinKeywords(), joinLines(), .columns(), .update()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-023.json

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
