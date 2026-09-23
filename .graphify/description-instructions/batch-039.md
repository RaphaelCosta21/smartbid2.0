# Node Description Batch 40 of 43

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

- "settings_membersmanagement_isectormeta": "ISectorMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L23 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_membersmanagement": "MembersManagement()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L179 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_sector_meta": "SECTOR_META" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L31 | neighbors=[MembersManagement.tsx]
- "settings_patchnotes_patchnote": "PatchNote" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/PatchNotes.tsx:L4 | neighbors=[PatchNotes.tsx]
- "settings_systemconfiguration_access_areas": "ACCESS_AREAS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L204 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_all_nav_items": "ALL_NAV_ITEMS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L158 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_inavgroup": "INavGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L42 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_inavitem": "INavItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L35 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_kpi_meta": "KPI_META" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L166 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_nav_groups": "NAV_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L47 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_notification_labels": "NOTIFICATION_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L215 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_perm_cycle": "PERM_CYCLE" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L213 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_phasecolorrow": "PhaseColorRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L230 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_role_labels": "ROLE_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L193 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_roles": "ROLES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L182 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_substatuscolorrow": "SubStatusColorRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L255 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_systemconfiguration": "SystemConfiguration()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L348 | neighbors=[SystemConfiguration.tsx]
- "smartbid20_smartbid20webpart_baseclientsidewebpart": "BaseClientSideWebPart" | kind=code-symbol | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_ismartbid20webpartprops": "ISmartBid20WebPartProps" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L16 | neighbors=[SmartBid20WebPart.ts]
- "smartbid20_smartbid20webpart_smartbid20webpart_dataversion": ".dataVersion()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L123 | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_smartbid20webpart_getpropertypaneconfiguration": ".getPropertyPaneConfiguration()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L127 | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_smartbid20webpart_ondispose": ".onDispose()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L119 | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_smartbid20webpart_onthemechanged": ".onThemeChanged()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L98 | neighbors=[SmartBid20WebPart]
- "smartbid20_smartbid20webpart_smartbid20webpart_render": ".render()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L24 | neighbors=[SmartBid20WebPart]
- "src_index": "index.ts" | kind=code-symbol | source=src/index.ts:L1 | neighbors=[fe3728a smartbid2.0]
- "stores_useauthstore_authstate": "AuthState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L23 | neighbors=[useAuthStore.ts]
- "stores_useauthstore_default_user": "DEFAULT_USER" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L8 | neighbors=[useAuthStore.ts]
- "stores_usebidstore_bidfilters": "BidFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L7 | neighbors=[useBidStore.ts]
- "stores_usebidstore_bidstate": "BidState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L27 | neighbors=[useBidStore.ts]
- "stores_usebidstore_default_filters": "DEFAULT_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L17 | neighbors=[useBidStore.ts]
- "stores_usechatstore_chatstate": "ChatState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useChatStore.ts:L13 | neighbors=[useChatStore.ts]
- "stores_useconfigstore_configstate": "ConfigState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useConfigStore.ts:L8 | neighbors=[useConfigStore.ts]
- "stores_useernstore_ernstate": "ErnState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useErnStore.ts:L8 | neighbors=[useErnStore.ts]
- "stores_usefavoritesstore_favoritesstate": "FavoritesState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L16 | neighbors=[useFavoritesStore.ts]
- "stores_usefavoritesstore_generateid": "generateId()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L63 | neighbors=[useFavoritesStore.ts]
- "stores_usenotificationstore_notificationstate": "NotificationState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useNotificationStore.ts:L4 | neighbors=[useNotificationStore.ts]
- "stores_usequerycatalogstore_arpnindex": "_arPnIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L59 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_buildprefixindex": "buildPrefixIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L64 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_bumblpnindex": "_bumblPnIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L61 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_bumbrpnindex": "_bumbrPnIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L62 | neighbors=[useQueryCatalogStore.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-039.json

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
