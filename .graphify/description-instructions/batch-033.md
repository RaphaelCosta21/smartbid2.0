# Node Description Batch 34 of 102

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

- "effects_effecttypes_effectcontext": "EffectContext" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectTypes.ts:L9 | neighbors=[effectTypes.ts, vesselEffects.ts, phenomenonController.ts]
- "effects_effectutils_arrowgeometry": "arrowGeometry()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L94 | neighbors=[effectUtils.ts, rovEffects.ts, vesselEffects.ts]
- "effects_effectutils_flatring": "flatRing()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L123 | neighbors=[effectUtils.ts, glowMat(), rovEffects.ts]
- "effects_effectutils_hitseabed": "hitSeabed()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L106 | neighbors=[effectUtils.ts, rovEffects.ts, seabedEffects.ts]
- "effects_effectutils_signed": "signed()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L17 | neighbors=[effectUtils.ts, rovEffects.ts, vesselEffects.ts]
- "function_app_document_structure_is_title_case": "_is_title_case()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L117 | neighbors=[document_structure.py, _heading(), _has_letters()]
- "function_app_document_structure_letter_count": "_letter_count()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L107 | neighbors=[document_structure.py, _has_word(), _heading()]
- "function_app_function_app_bad_request": "_bad_request()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L261 | neighbors=[function_app.py, extract_quotation(), generate_scope()]
- "function_app_function_app_clarification_library_block": "_clarification_library_block()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L617 | neighbors=[function_app.py, generate_scope(), suggest_clarifications()]
- "function_app_function_app_odata_literal": "_odata_literal()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L443 | neighbors=[function_app.py, _chat_past_bid_material(), _not_this_bid()]
- "function_app_function_app_parent_key": "_parent_key()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L439 | neighbors=[function_app.py, _chat_past_bid_material(), _group_by_document()]
- "function_app_function_app_past_bid_refs": "_past_bid_refs()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L937 | neighbors=[function_app.py, chat(), _bid_ref()]
- "function_app_function_app_unreadable": "_unreadable()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L249 | neighbors=[function_app.py, extract_quotation(), generate_scope()]
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
- "hooks_useteammembers_useteammembers": "useTeamMembers()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTeamMembers.ts:L8 | neighbors=[ErnCreateModal.tsx, useTeamMembers.ts, TeamAnalyticsPage.tsx]
- "hooks_usetechnicalproposalpublisher_usetechnicalproposalpublisher": "useTechnicalProposalPublisher()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTechnicalProposalPublisher.ts:L13 | neighbors=[DocumentsTab.tsx, useTechnicalProposalPublisher.ts, BidDetailPage.tsx]
- "insights_aiinsightspanel_aiinsightspanel": "AIInsightsPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AIInsightsPanel.tsx:L18 | neighbors=[AIInsightsPanel.tsx, BottleneckAnalysisPage.tsx, PerformanceTrendsPage.tsx]
- "knowledge_clarificationentrymodal_clarificationentrymodal": "ClarificationEntryModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryModal.tsx:L26 | neighbors=[ClarificationEntryModal.tsx, toDateInput(), ClarificationsDbPage.tsx]
- "knowledge_doclibrarycatalog_findgroupbyname": "findGroupByName()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L132 | neighbors=[DocLibraryCatalog.tsx, createFavoriteGroupAndSave(), mergeExtractedMetadata()]
- "knowledge_doclibrarycatalog_mergeextractedmetadata": "mergeExtractedMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L148 | neighbors=[DocLibraryCatalog.tsx, findGroupByName(), findSubGroupByName()]
- "layout_guestmodebanner": "GuestModeBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/GuestModeBanner.tsx:L1 | neighbors=[fe3728a smartbid2.0, AppLayout.tsx, GuestModeBanner()]
- "layout_livepulse_describedeadline": "describeDeadline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L208 | neighbors=[LivePulse.tsx, describeDateChange(), fmtDay()]
- "layout_livepulse_describeern": "describeErn()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L138 | neighbors=[LivePulse.tsx, describeDateChange(), fmtDay()]
- "layout_livepulsepanel_livepulsepanel": "LivePulsePanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L183 | neighbors=[LivePulse.tsx, LivePulsePanel.tsx, itemStyle()]
- "loc_mystrings_d": "mystrings.d.ts" | kind=code-symbol | source=src/webparts/smartBid20/loc/mystrings.d.ts:L1 | neighbors=[fe3728a smartbid2.0, ISmartBid20WebPartStrings, SmartBid20WebPartStrings]
- "models_iaianalysis_aiusecase": "AIUseCase" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L9 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaianalysisrequest": "IAIAnalysisRequest" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L104 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaiassetcatalogoption": "IAIAssetCatalogOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L52 | neighbors=[AIDocumentAnalyzer.tsx, ai.prompts.ts, IAIAnalysis.ts]
- "models_iaianalysis_iaiimportmeta": "IAIImportMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L164 | neighbors=[AIDocumentAnalyzer.tsx, IAIAnalysis.ts, index.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-033.json

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
