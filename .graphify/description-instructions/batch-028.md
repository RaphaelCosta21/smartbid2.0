# Node Description Batch 29 of 86

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

- "hooks_useapproothost_useapproothost": "useAppRootHost()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAppRootHost.ts:L8 | neighbors=[GuidedTour.tsx, useAppRootHost.ts, HowItWorksDrawer.tsx]
- "hooks_useclarificationlibraryfilter_useclarificationlibraryfilter": "useClarificationLibraryFilter()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L99 | neighbors=[ImportClarificationModal.tsx, useClarificationLibraryFilter.ts, ClarificationsDbPage.tsx]
- "hooks_usedashboardsync_usedashboardsync": "useDashboardSync()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardSync.ts:L46 | neighbors=[useDashboardSync.ts, LivePulse.tsx, DashboardPage.tsx]
- "hooks_useliveoverview_iliveupdate": "ILiveUpdate" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useLiveOverview.ts:L44 | neighbors=[useLiveOverview.ts, LivePulse.tsx, LivePulsePanel.tsx]
- "hooks_useliveoverview_liveoverview": "LiveOverview" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useLiveOverview.ts:L33 | neighbors=[ErnDashboardSection.tsx, useLiveOverview.ts, LivePulsePanel.tsx]
- "hooks_useliveoverview_liveupdates": "LiveUpdates" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useLiveOverview.ts:L57 | neighbors=[useLiveOverview.ts, LivePulse.tsx, LivePulsePanel.tsx]
- "hooks_useliveoverview_useliveoverview": "useLiveOverview()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useLiveOverview.ts:L66 | neighbors=[useLiveOverview.ts, LivePulse.tsx, DashboardPage.tsx]
- "hooks_usepastbidpublisher_usepastbidscopecategories": "usePastBidScopeCategories()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePastBidPublisher.ts:L24 | neighbors=[usePastBidPublisher.ts, usePastBidPublisher(), PastBidsPage.tsx]
- "hooks_usequalificationlibraryfilter_usequalificationlibraryfilter": "useQualificationLibraryFilter()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L80 | neighbors=[ImportQualificationModal.tsx, useQualificationLibraryFilter.ts, QualificationLibraryView.tsx]
- "hooks_usequerysearch_searchbucket": "searchBucket()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L109 | neighbors=[useQuerySearch.ts, searchByField(), searchList()]
- "hooks_useregisterquotationsuppliers_useregisterquotationsuppliers": "useRegisterQuotationSuppliers()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useRegisterQuotationSuppliers.ts:L10 | neighbors=[AddQuotationModal.tsx, useRegisterQuotationSuppliers.ts, QuotationsPage.tsx]
- "hooks_useresponsive_useresponsive": "useResponsive()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResponsive.ts:L14 | neighbors=[ChatAssistant.tsx, useResponsive.ts, Header.tsx]
- "hooks_usesurveyportal_usesurveybidcomparison": "useSurveyBidComparison()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSurveyPortal.ts:L15 | neighbors=[useSurveyPortal.ts, SurveyEquipmentPage.tsx, SurveySystemPage.tsx]
- "hooks_usesurveyportal_usesurveybidintel": "useSurveyBidIntel()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSurveyPortal.ts:L56 | neighbors=[useSurveyPortal.ts, SurveyEquipmentPage.tsx, SurveySystemPage.tsx]
- "hooks_useteammembers_useteammembers": "useTeamMembers()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTeamMembers.ts:L8 | neighbors=[ErnCreateModal.tsx, useTeamMembers.ts, TeamAnalyticsPage.tsx]
- "hooks_usetechnicalproposalpublisher_usetechnicalproposalpublisher": "useTechnicalProposalPublisher()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTechnicalProposalPublisher.ts:L13 | neighbors=[DocumentsTab.tsx, useTechnicalProposalPublisher.ts, BidDetailPage.tsx]
- "insights_aiinsightspanel_aiinsightspanel": "AIInsightsPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AIInsightsPanel.tsx:L18 | neighbors=[AIInsightsPanel.tsx, BottleneckAnalysisPage.tsx, PerformanceTrendsPage.tsx]
- "knowledge_clarificationentrymodal_clarificationentrymodal": "ClarificationEntryModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryModal.tsx:L26 | neighbors=[ClarificationEntryModal.tsx, toDateInput(), ClarificationsDbPage.tsx]
- "knowledge_doclibrarycatalog_findgroupbyname": "findGroupByName()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L132 | neighbors=[DocLibraryCatalog.tsx, createFavoriteGroupAndSave(), mergeExtractedMetadata()]
- "knowledge_doclibrarycatalog_mergeextractedmetadata": "mergeExtractedMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L137 | neighbors=[DocLibraryCatalog.tsx, findGroupByName(), findSubGroupByName()]
- "layout_guestmodebanner": "GuestModeBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/GuestModeBanner.tsx:L1 | neighbors=[fe3728a smartbid2.0, AppLayout.tsx, GuestModeBanner()]
- "layout_livepulse_describedeadline": "describeDeadline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L208 | neighbors=[LivePulse.tsx, describeDateChange(), fmtDay()]
- "layout_livepulse_describeern": "describeErn()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L138 | neighbors=[LivePulse.tsx, describeDateChange(), fmtDay()]
- "layout_livepulsepanel_livepulsepanel": "LivePulsePanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L183 | neighbors=[LivePulse.tsx, LivePulsePanel.tsx, itemStyle()]
- "loc_mystrings_d": "mystrings.d.ts" | kind=code-symbol | source=src/webparts/smartBid20/loc/mystrings.d.ts:L1 | neighbors=[fe3728a smartbid2.0, ISmartBid20WebPartStrings, SmartBid20WebPartStrings]
- "models_iaianalysis_aiusecase": "AIUseCase" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L9 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaianalysisrequest": "IAIAnalysisRequest" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L104 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaiassetcatalogoption": "IAIAssetCatalogOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L52 | neighbors=[AIDocumentAnalyzer.tsx, ai.prompts.ts, IAIAnalysis.ts]
- "models_iaianalysis_iaiimportmeta": "IAIImportMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L164 | neighbors=[AIDocumentAnalyzer.tsx, IAIAnalysis.ts, index.ts]
- "models_iaianalysis_iaiservicetypeoption": "IAIServiceTypeOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L42 | neighbors=[ai.prompts.ts, IAIAnalysis.ts, index.ts]
- "models_iaianalysis_iaisuggestedqualification": "IAISuggestedQualification" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L210 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaisuggestionsresult": "IAISuggestionsResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L204 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaisupplieroption": "IAISupplierOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L36 | neighbors=[ai.prompts.ts, IAIAnalysis.ts, index.ts]
- "models_iaianalysis_iextractedquotationline": "IExtractedQuotationLine" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L218 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iquotationextractionresult": "IQuotationExtractionResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L256 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_isupplierprofilesuggestion": "ISupplierProfileSuggestion" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L314 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_supplierprofilebasis": "SupplierProfileBasis" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L306 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaichat_ichatanswer": "IChatAnswer" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L51 | neighbors=[IAiChat.ts, index.ts, AIAnalysisService.ts]
- "models_iaichat_ichatcitation": "IChatCitation" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L9 | neighbors=[IAiChat.ts, index.ts, AIAnalysisService.ts]
- "models_iaichat_ichatretrieveddoc": "IChatRetrievedDoc" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L27 | neighbors=[IAiChat.ts, index.ts, AIAnalysisService.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-028.json

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
