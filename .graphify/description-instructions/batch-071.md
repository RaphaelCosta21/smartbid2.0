# Node Description Batch 72 of 102

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

- "common_segmentedtabs_segmentedtabitem": "SegmentedTabItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SegmentedTabs.tsx:L8 | neighbors=[SegmentedTabs.tsx]
- "common_segmentedtabs_segmentedtabsprops": "SegmentedTabsProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SegmentedTabs.tsx:L15 | neighbors=[SegmentedTabs.tsx]
- "common_skeletonloader_skeletonloaderprops": "SkeletonLoaderProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SkeletonLoader.tsx:L4 | neighbors=[SkeletonLoader.tsx]
- "common_statusbadge_statusbadgeprops": "StatusBadgeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/StatusBadge.tsx:L6 | neighbors=[StatusBadge.tsx]
- "common_suggestioninput_suggestioninputprops": "SuggestionInputProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SuggestionInput.tsx:L6 | neighbors=[SuggestionInput.tsx]
- "common_suppliercombobox_suppliercomboboxprops": "SupplierComboboxProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SupplierCombobox.tsx:L18 | neighbors=[SupplierCombobox.tsx]
- "common_timeline_timelineitem": "TimelineItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L4 | neighbors=[Timeline.tsx]
- "common_timeline_timelineprops": "TimelineProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L13 | neighbors=[Timeline.tsx]
- "common_toastcontainer_icons": "ICONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L10 | neighbors=[ToastContainer.tsx]
- "common_toastcontainer_toast": "Toast" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L4 | neighbors=[ToastContainer.tsx]
- "common_toastcontainer_toastcontainerprops": "ToastContainerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L17 | neighbors=[ToastContainer.tsx]
- "common_toastcontainer_toastitem": "ToastItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L22 | neighbors=[ToastContainer.tsx]
- "comparator_comparatorsetup_comparatorsetupprops": "ComparatorSetupProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparatorSetup.tsx:L11 | neighbors=[ComparatorSetup.tsx]
- "comparator_comparisonexecutive_comparisonexecutiveprops": "ComparisonExecutiveProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonExecutive.tsx:L21 | neighbors=[ComparisonExecutive.tsx]
- "comparator_comparisonexecutive_row": "Row()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonExecutive.tsx:L29 | neighbors=[ComparisonExecutive.tsx]
- "comparator_comparisonexecutive_section": "Section()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonExecutive.tsx:L38 | neighbors=[ComparisonExecutive.tsx]
- "comparator_comparisonsummary_comparisonsummaryprops": "ComparisonSummaryProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonSummary.tsx:L17 | neighbors=[ComparisonSummary.tsx]
- "comparator_comparisontables_changefilter": "ChangeFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonTables.tsx:L59 | neighbors=[ComparisonTables.tsx]
- "comparator_comparisontables_comparisontableprops": "ComparisonTableProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonTables.tsx:L25 | neighbors=[ComparisonTables.tsx]
- "comparator_comparisontables_deltaclass": "deltaClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonTables.tsx:L31 | neighbors=[ComparisonTables.tsx]
- "comparator_comparisontables_displaycurrency": "DisplayCurrency" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonTables.tsx:L23 | neighbors=[ComparisonTables.tsx]
- "comparator_comparisontables_ifullrow": "IFullRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonTables.tsx:L285 | neighbors=[ComparisonTables.tsx]
- "comparator_comparisontables_itemcell": "ItemCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonTables.tsx:L37 | neighbors=[ComparisonTables.tsx]
- "comparator_comparisontables_matchnote": "matchNote()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonTables.tsx:L52 | neighbors=[ComparisonTables.tsx]
- "comparator_comparisontables_status_class": "STATUS_CLASS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonTables.tsx:L298 | neighbors=[ComparisonTables.tsx]
- "components_smartbid20_smartbid20_componentdidmount": ".componentDidMount()" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L9 | neighbors=[SmartBid20]
- "components_smartbid20_smartbid20_render": ".render()" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L16 | neighbors=[SmartBid20]
- "config_accesscontrol_config_access_area_keys": "ACCESS_AREA_KEYS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L45 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_access_areas": "ACCESS_AREAS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L76 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_access_permissions": "ACCESS_PERMISSIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L32 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_access_roles": "ACCESS_ROLES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L24 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_area_labels": "AREA_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L54 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_areas": "areas()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L98 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_bid_tab_group_keys": "BID_TAB_GROUP_KEYS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L92 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_bidgroups": "bidGroups()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L168 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_collectpages": "collectPages()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L63 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_default_access_levels": "DEFAULT_ACCESS_LEVELS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L121 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_default_bid_access_levels": "DEFAULT_BID_ACCESS_LEVELS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L189 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_iaccessareadef": "IAccessAreaDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L39 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_iaccesspagedef": "IAccessPageDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L34 | neighbors=[accessControl.config.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-071.json

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
