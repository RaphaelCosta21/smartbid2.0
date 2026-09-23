# Node Description Batch 20 of 43

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

- "config_status_config_getsubstatusdef": "getSubStatusDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L377 | neighbors=[status.config.ts, getSubStatusColor()]
- "dashboard_approvalspending_approvalspending": "ApprovalsPending()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L11 | neighbors=[ApprovalsPending.tsx, DashboardPage.tsx]
- "dashboard_bidsbydivisionchart_bidsbydivisionchart": "BidsByDivisionChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByDivisionChart.tsx:L20 | neighbors=[BidsByDivisionChart.tsx, DashboardPage.tsx]
- "dashboard_bidsbystatuschart_bidsbystatuschart": "BidsByStatusChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByStatusChart.tsx:L22 | neighbors=[BidsByStatusChart.tsx, DashboardPage.tsx]
- "dashboard_dashboardactivity_dashboardactivity": "DashboardActivity()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L33 | neighbors=[DashboardActivity.tsx, DashboardPage.tsx]
- "dashboard_dashboardkpirow_dashboardkpirow": "DashboardKPIRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardKPIRow.tsx:L18 | neighbors=[DashboardKPIRow.tsx, DashboardPage.tsx]
- "dashboard_enghoursranking_enghoursranking": "EngHoursRanking()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L25 | neighbors=[EngHoursRanking.tsx, DashboardPage.tsx]
- "dashboard_erndashboardsection_erndashboardsection": "ErnDashboardSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnDashboardSection.tsx:L33 | neighbors=[ErnDashboardSection.tsx, DashboardPage.tsx]
- "dashboard_upcomingdeadlines_upcomingdeadlines": "UpcomingDeadlines()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/UpcomingDeadlines.tsx:L13 | neighbors=[UpcomingDeadlines.tsx, DashboardPage.tsx]
- "function_app_document_structure_outline": "outline()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L334 | neighbors=[document_structure.py, build_chunks()]
- "function_app_document_structure_overlap_tail": "_overlap_tail()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L292 | neighbors=[document_structure.py, _split_body()]
- "function_app_function_app_chat_bad_request": "_chat_bad_request()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L202 | neighbors=[function_app.py, chat()]
- "function_app_function_app_page_to_png": "_page_to_png()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L115 | neighbors=[function_app.py, extract_text_or_images()]
- "hooks_useanalyticsfilters_analyticsfilters": "AnalyticsFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L16 | neighbors=[useAnalyticsFilters.ts, AnalyticsFilterBar.tsx]
- "hooks_useanalyticsfilters_datepreset": "DatePreset" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L7 | neighbors=[useAnalyticsFilters.ts, AnalyticsFilterBar.tsx]
- "hooks_useanalyticsfilters_isodaysago": "isoDaysAgo()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L36 | neighbors=[useAnalyticsFilters.ts, presetRange()]
- "hooks_useanalyticsfilters_todaystr": "todayStr()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L42 | neighbors=[useAnalyticsFilters.ts, presetRange()]
- "hooks_useapprovals_useapprovals": "useApprovals()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovals.ts:L15 | neighbors=[useApprovals.ts, ApprovalsPage.tsx]
- "hooks_usecurrentuser_useisguest": "useIsGuest()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useCurrentUser.ts:L12 | neighbors=[ChatAssistant.tsx, useCurrentUser.ts]
- "hooks_useeditcontrol_editcontrolstate": "EditControlState" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useEditControl.ts:L12 | neighbors=[EditLockBanner.tsx, useEditControl.ts]
- "hooks_usequerysearch_usequerysearch": "useQuerySearch()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L41 | neighbors=[PartNumberAutocomplete.tsx, useQuerySearch.ts]
- "hooks_useteammembers_useteammembers": "useTeamMembers()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTeamMembers.ts:L8 | neighbors=[useTeamMembers.ts, TeamAnalyticsPage.tsx]
- "hooks_usetemplates_usetemplates": "useTemplates()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTemplates.ts:L8 | neighbors=[useTemplates.ts, TemplatesPage.tsx]
- "insights_multiselectdropdown_multiselectdropdown": "MultiSelectDropdown()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L21 | neighbors=[AnalyticsFilterBar.tsx, MultiSelectDropdown.tsx]
- "insights_multiselectdropdown_multiselectoption": "MultiSelectOption" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L4 | neighbors=[AnalyticsFilterBar.tsx, MultiSelectDropdown.tsx]
- "knowledge_doclibrarycatalog_createfavoritegroupandsave": "createFavoriteGroupAndSave()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L212 | neighbors=[DocLibraryCatalog.tsx, findGroupByName()]
- "knowledge_doclibrarycatalog_empty_meta": "EMPTY_META()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L71 | neighbors=[DocLibraryCatalog.tsx, DocLibraryCatalog()]
- "knowledge_doclibrarycatalog_findsubgroupbyname": "findSubGroupByName()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L138 | neighbors=[DocLibraryCatalog.tsx, mergeExtractedMetadata()]
- "layout_applayout_applayout": "AppLayout()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L80 | neighbors=[SmartBid20.tsx, AppLayout.tsx]
- "layout_commandpalette_commandpalette": "CommandPalette()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/CommandPalette.tsx:L24 | neighbors=[AppLayout.tsx, CommandPalette.tsx]
- "layout_footer_footer": "Footer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L12 | neighbors=[AppLayout.tsx, Footer.tsx]
- "layout_guestmodebanner_guestmodebanner": "GuestModeBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/GuestModeBanner.tsx:L4 | neighbors=[AppLayout.tsx, GuestModeBanner.tsx]
- "layout_header_header": "Header()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Header.tsx:L11 | neighbors=[AppLayout.tsx, Header.tsx]
- "layout_sidebar_sidebar": "Sidebar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L543 | neighbors=[AppLayout.tsx, Sidebar.tsx]
- "layout_sidebaritem_sidebaritem": "SidebarItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarItem.tsx:L15 | neighbors=[Sidebar.tsx, SidebarItem.tsx]
- "layout_sidebarsubmenu_sidebarsubmenu": "SidebarSubmenu()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarSubmenu.tsx:L11 | neighbors=[Sidebar.tsx, SidebarSubmenu.tsx]
- "models_iactivitylog_iactivitylog": "IActivityLog" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IActivityLog.ts:L15 | neighbors=[IActivityLog.ts, index.ts]
- "models_iaianalysis_iaianalysiserror": "IAIAnalysisError" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L127 | neighbors=[IAIAnalysis.ts, index.ts]
- "models_iaianalysis_iaiassetsubitemoption": "IAIAssetSubItemOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L51 | neighbors=[AIDocumentAnalyzer.tsx, IAIAnalysis.ts]
- "models_iaianalysis_iairesourcetypeoption": "IAIResourceTypeOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L17 | neighbors=[ai.prompts.ts, IAIAnalysis.ts]

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
