# Node Description Batch 19 of 43

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

- "bid_ernsearchmodal_ernsearchmodal": "ErnSearchModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnSearchModal.tsx:L32 | neighbors=[ErnSearchModal.tsx, OverviewTab.tsx]
- "bid_exportclarificationmodal_exportclarificationmodal": "ExportClarificationModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L15 | neighbors=[ExportClarificationModal.tsx, QualificationsTab.tsx]
- "bid_importclarificationmodal_importclarificationmodal": "ImportClarificationModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportClarificationModal.tsx:L29 | neighbors=[ImportClarificationModal.tsx, QualificationsTab.tsx]
- "bid_logisticsbreakdowntab_logisticsbreakdowntab": "LogisticsBreakdownTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L25 | neighbors=[LogisticsBreakdownTab.tsx, BidDetailPage.tsx]
- "bid_notestab_notestab": "NotesTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/NotesTab.tsx:L18 | neighbors=[NotesTab.tsx, BidDetailPage.tsx]
- "bid_overviewtab_overviewtab": "OverviewTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L361 | neighbors=[OverviewTab.tsx, BidDetailPage.tsx]
- "bid_preparationmobilizationtab_preparationmobilizationtab": "PreparationMobilizationTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L91 | neighbors=[PreparationMobilizationTab.tsx, BidDetailPage.tsx]
- "bid_qualificationstab_qualificationstab": "QualificationsTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationsTab.tsx:L30 | neighbors=[QualificationsTab.tsx, BidDetailPage.tsx]
- "bid_revisionstab_canstartrevision": "canStartRevision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L23 | neighbors=[RevisionsTab.tsx, RevisionsTab()]
- "bid_revisionstab_getactiverevision": "getActiveRevision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L40 | neighbors=[RevisionsTab.tsx, RevisionsTab()]
- "charts_heatmapgrid_heatcolor": "heatColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L36 | neighbors=[HeatmapGrid.tsx, hexToRgb()]
- "charts_heatmapgrid_heatmapgrid": "HeatmapGrid()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L49 | neighbors=[HeatmapGrid.tsx, BottleneckAnalysisPage.tsx]
- "charts_heatmapgrid_hextorgb": "hexToRgb()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L23 | neighbors=[HeatmapGrid.tsx, heatColor()]
- "common_advancedcatalogsearch_advancedcatalogsearch": "AdvancedCatalogSearch()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AdvancedCatalogSearch.tsx:L29 | neighbors=[AdvancedCatalogSearch.tsx, FavoritesPage.tsx]
- "common_chatassistant_chatassistant": "ChatAssistant()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L114 | neighbors=[ChatAssistant.tsx, AppLayout.tsx]
- "common_confirmdialog_confirmdialog": "ConfirmDialog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ConfirmDialog.tsx:L15 | neighbors=[ConfirmDialog.tsx, CreateRequestPage.tsx]
- "common_countdowntimer_countdowntimer": "CountdownTimer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CountdownTimer.tsx:L9 | neighbors=[CountdownTimer.tsx, TimelinePage.tsx]
- "common_editlockbanner_editabletabcontent": "EditableTabContent()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L86 | neighbors=[EditLockBanner.tsx, BidDetailPage.tsx]
- "common_editlockbanner_editlockbanner": "EditLockBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L12 | neighbors=[OverviewTab.tsx, EditLockBanner.tsx]
- "common_fileupload_fileupload": "FileUpload()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FileUpload.tsx:L12 | neighbors=[FileUpload.tsx, CreateRequestPage.tsx]
- "common_filterpanel_filterpanel": "FilterPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FilterPanel.tsx:L11 | neighbors=[FilterPanel.tsx, BidTrackerPage.tsx]
- "common_hoursimportpreview_hoursimportpreview": "HoursImportPreview()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L21 | neighbors=[HoursImportPreview.tsx, ImportSourceModal.tsx]
- "common_importsourcelist_iimportsource": "IImportSource" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceList.tsx:L5 | neighbors=[ImportSourceList.tsx, ImportSourceModal.tsx]
- "common_importsourcelist_importsourcelist": "ImportSourceList()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceList.tsx:L26 | neighbors=[ImportSourceList.tsx, ImportSourceModal.tsx]
- "common_peoplepicker_igraphresult": "IGraphResult" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L17 | neighbors=[PeoplePicker.tsx, IPickedPerson]
- "common_peoplepicker_peoplepicker": "PeoplePicker()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L29 | neighbors=[ErnCreateModal.tsx, PeoplePicker.tsx]
- "common_querycatalogloadingbanner_querycatalogloadingbanner": "QueryCatalogLoadingBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/QueryCatalogLoadingBanner.tsx:L11 | neighbors=[QueryCatalogLoadingBanner.tsx, AppLayout.tsx]
- "common_richtexteditor_richtexteditor": "RichTextEditor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RichTextEditor.tsx:L12 | neighbors=[RichTextEditor.tsx, CreateRequestPage.tsx]
- "common_scopeimportpreview_iscopeimportresult": "IScopeImportResult" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ScopeImportPreview.tsx:L13 | neighbors=[ImportSourceModal.tsx, ScopeImportPreview.tsx]
- "common_scopeimportpreview_scopeimportpreview": "ScopeImportPreview()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ScopeImportPreview.tsx:L36 | neighbors=[ImportSourceModal.tsx, ScopeImportPreview.tsx]
- "common_toastcontainer_toastcontainer": "ToastContainer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L16 | neighbors=[ToastContainer.tsx, AppLayout.tsx]
- "config_defaultfavoritegroups_nextid": "nextId()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L8 | neighbors=[defaultFavoriteGroups.ts, makeGroup()]
- "config_phases_config_getphaselabel": "getPhaseLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L281 | neighbors=[phases.config.ts, getPhaseConfig()]
- "config_phases_config_getphasetasks": "getPhaseTasks()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L285 | neighbors=[phases.config.ts, getPhaseConfig()]
- "config_spfxcontext_spfxcontext": "SpfxContext" | kind=code-symbol | source=src/webparts/smartBid20/app/config/SpfxContext.ts:L7 | neighbors=[SmartBid20.tsx, SpfxContext.ts]
- "config_status_config_getphasecolor": "getPhaseColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L280 | neighbors=[status.config.ts, getPhaseDef()]
- "config_status_config_getphasedef": "getPhaseDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L259 | neighbors=[status.config.ts, getPhaseColor()]
- "config_status_config_getstatuscolor": "getStatusColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L276 | neighbors=[status.config.ts, getStatusDef()]
- "config_status_config_getstatusdef": "getStatusDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L226 | neighbors=[status.config.ts, getStatusColor()]
- "config_status_config_getsubstatuscolor": "getSubStatusColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L398 | neighbors=[status.config.ts, getSubStatusDef()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-018.json

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
