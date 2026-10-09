# Node Description Batch 79 of 86

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

- "settings_systemconfiguration_bid_matrix_groups": "BID_MATRIX_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L300 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_clamptarget": "clampTarget()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L271 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_clonedeep": "cloneDeep()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L308 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_inavgroup": "INavGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L113 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_inavitem": "INavItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L106 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_kpi_meta": "KPI_META" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L166 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_master_only_tabs": "MASTER_ONLY_TABS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L256 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_nav_groups": "NAV_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L118 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_notification_labels": "NOTIFICATION_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L215 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_page_matrix_groups": "PAGE_MATRIX_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L293 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_perm_cycle": "PERM_CYCLE" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L213 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_phasecolorrow": "PhaseColorRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L314 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_role_labels": "ROLE_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L193 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_roles": "ROLES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L182 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_scalarkpikey": "ScalarKpiKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L266 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_substatuscolorrow": "SubStatusColorRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L339 | neighbors=[SystemConfiguration.tsx]
- "sheets_assetssheet_dash": "DASH" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/assetsSheet.ts:L21 | neighbors=[assetsSheet.ts]
- "sheets_currencytable_itablegroup": "ITableGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L20 | neighbors=[currencyTable.ts]
- "sheets_prepmobsheet_icurrencyline": "ICurrencyLine" | kind=code-symbol | neighbors=[IPrepLine]
- "sheets_scopesheet_yesno": "yesNo()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/scopeSheet.ts:L13 | neighbors=[scopeSheet.ts]
- "smartbid20_smartbid20webpart_baseclientsidewebpart": "BaseClientSideWebPart" | kind=code-symbol | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_ismartbid20webpartprops": "ISmartBid20WebPartProps" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L19 | neighbors=[SmartBid20WebPart.ts]
- "smartbid20_smartbid20webpart_smartbid20webpart_dataversion": ".dataVersion()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L140 | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_smartbid20webpart_getpropertypaneconfiguration": ".getPropertyPaneConfiguration()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L144 | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_smartbid20webpart_ondispose": ".onDispose()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L136 | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_smartbid20webpart_onthemechanged": ".onThemeChanged()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L115 | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_smartbid20webpart_render": ".render()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L27 | neighbors=[SmartBid20WebPart]
- "src_index": "index.ts" | kind=code-symbol | source=src/index.ts:L1 | neighbors=[fe3728a smartbid2.0]
- "stores_useassetcatalogstore_assetcatalogstate": "AssetCatalogState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAssetCatalogStore.ts:L9 | neighbors=[useAssetCatalogStore.ts]
- "stores_useauthstore_authstate": "AuthState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L17 | neighbors=[useAuthStore.ts]
- "stores_useauthstore_default_user": "DEFAULT_USER" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L5 | neighbors=[useAuthStore.ts]
- "stores_usebidstore_bidfacetkey": "BidFacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L31 | neighbors=[useBidStore.ts]
- "stores_usebidstore_bidfilters": "BidFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L7 | neighbors=[useBidStore.ts]
- "stores_usebidstore_bidstate": "BidState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L77 | neighbors=[useBidStore.ts]
- "stores_usebidstore_default_filters": "DEFAULT_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L19 | neighbors=[useBidStore.ts]
- "stores_usebomcostanalysisstore_bomcostanalysisstate": "BomCostAnalysisState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBomCostAnalysisStore.ts:L9 | neighbors=[useBomCostAnalysisStore.ts]
- "stores_usechatstore_chatstate": "ChatState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useChatStore.ts:L16 | neighbors=[useChatStore.ts]
- "stores_useconfigstore_configstate": "ConfigState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useConfigStore.ts:L8 | neighbors=[useConfigStore.ts]
- "stores_useernstore_ernstate": "ErnState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useErnStore.ts:L8 | neighbors=[useErnStore.ts]
- "stores_usefavoritesstore_favoritesstate": "FavoritesState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L16 | neighbors=[useFavoritesStore.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-078.json

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
