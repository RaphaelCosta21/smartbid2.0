# Node Description Batch 31 of 43

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

- "common_filterpanel_filterpanelprops": "FilterPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FilterPanel.tsx:L4 | neighbors=[FilterPanel.tsx]
- "common_glasscard_glasscardprops": "GlassCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GlassCard.tsx:L4 | neighbors=[GlassCard.tsx]
- "common_hoursimportpreview_hourscategory": "HoursCategory" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L13 | neighbors=[HoursImportPreview.tsx]
- "common_hoursimportpreview_hoursimportpreviewprops": "HoursImportPreviewProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L7 | neighbors=[HoursImportPreview.tsx]
- "common_hoursimportpreview_selectionstate": "SelectionState" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L15 | neighbors=[HoursImportPreview.tsx]
- "common_importsourcelist_importsourcelistprops": "ImportSourceListProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceList.tsx:L19 | neighbors=[ImportSourceList.tsx]
- "common_importsourcemodal_importmode": "ImportMode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceModal.tsx:L18 | neighbors=[ImportSourceModal.tsx]
- "common_importsourcemodal_importsourcemodalprops": "ImportSourceModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceModal.tsx:L20 | neighbors=[ImportSourceModal.tsx]
- "common_integrateddivisiontabs_integrateddivision": "IntegratedDivision" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L15 | neighbors=[IntegratedDivisionTabs.tsx]
- "common_integrateddivisiontabs_integrateddivisiontabsprops": "IntegratedDivisionTabsProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L27 | neighbors=[IntegratedDivisionTabs.tsx]
- "common_integrateddivisiontabs_opg_service_lines": "OPG_SERVICE_LINES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L18 | neighbors=[IntegratedDivisionTabs.tsx]
- "common_integrateddivisiontabs_tabbarstyle": "tabBarStyle" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L32 | neighbors=[IntegratedDivisionTabs.tsx]
- "common_integrateddivisiontabs_tabstyle": "tabStyle()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L39 | neighbors=[IntegratedDivisionTabs.tsx]
- "common_kpicard_kpicardprops": "KPICardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/KPICard.tsx:L4 | neighbors=[KPICard.tsx]
- "common_pageheader_pageheaderprops": "PageHeaderProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PageHeader.tsx:L4 | neighbors=[PageHeader.tsx]
- "common_partnumberautocomplete_partnumberautocompleteprops": "PartNumberAutocompleteProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L12 | neighbors=[PartNumberAutocomplete.tsx]
- "common_partnumberautocomplete_sectiondef": "SectionDef" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L45 | neighbors=[PartNumberAutocomplete.tsx]
- "common_partnumberautocomplete_sections": "SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L51 | neighbors=[PartNumberAutocomplete.tsx]
- "common_partnumberautocomplete_source_labels": "SOURCE_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L36 | neighbors=[PartNumberAutocomplete.tsx]
- "common_peoplepicker_peoplepickerprops": "PeoplePickerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L21 | neighbors=[PeoplePicker.tsx]
- "common_personacard_personacardprops": "PersonaCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PersonaCard.tsx:L4 | neighbors=[PersonaCard.tsx]
- "common_phasebadge_phasebadgeprops": "PhaseBadgeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhaseBadge.tsx:L5 | neighbors=[PhaseBadge.tsx]
- "common_photolightbox_photolightboxprops": "PhotoLightboxProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhotoLightbox.tsx:L8 | neighbors=[PhotoLightbox.tsx]
- "common_prioritybadge_prioritybadge": "PriorityBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PriorityBadge.tsx:L10 | neighbors=[PriorityBadge.tsx]
- "common_prioritybadge_prioritybadgeprops": "PriorityBadgeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PriorityBadge.tsx:L5 | neighbors=[PriorityBadge.tsx]
- "common_progressbar_progressbarprops": "ProgressBarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ProgressBar.tsx:L4 | neighbors=[ProgressBar.tsx]
- "common_richtexteditor_richtexteditorprops": "RichTextEditorProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RichTextEditor.tsx:L4 | neighbors=[RichTextEditor.tsx]
- "common_scopeimportpreview_scopeimportpreviewprops": "ScopeImportPreviewProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ScopeImportPreview.tsx:L21 | neighbors=[ScopeImportPreview.tsx]
- "common_scopeimportpreview_sectiongroup": "SectionGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ScopeImportPreview.tsx:L31 | neighbors=[ScopeImportPreview.tsx]
- "common_skeletonloader_skeletonloaderprops": "SkeletonLoaderProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SkeletonLoader.tsx:L4 | neighbors=[SkeletonLoader.tsx]
- "common_statusbadge_statusbadgeprops": "StatusBadgeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/StatusBadge.tsx:L6 | neighbors=[StatusBadge.tsx]
- "common_timeline_timelineitem": "TimelineItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L4 | neighbors=[Timeline.tsx]
- "common_timeline_timelineprops": "TimelineProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L13 | neighbors=[Timeline.tsx]
- "common_toastcontainer_toast": "Toast" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L4 | neighbors=[ToastContainer.tsx]
- "common_toastcontainer_toastcontainerprops": "ToastContainerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L11 | neighbors=[ToastContainer.tsx]
- "components_smartbid20_smartbid20_componentdidmount": ".componentDidMount()" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L9 | neighbors=[SmartBid20]
- "components_smartbid20_smartbid20_render": ".render()" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L16 | neighbors=[SmartBid20]
- "config_ai_config_ai_config": "AI_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L109 | neighbors=[ai.config.ts]
- "config_ai_config_buildaiurl": "buildAiUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L152 | neighbors=[ai.config.ts]
- "config_ai_config_iaiauthconfig": "IAiAuthConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L25 | neighbors=[ai.config.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-030.json

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
