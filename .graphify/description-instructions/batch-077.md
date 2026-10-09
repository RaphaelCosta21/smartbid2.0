# Node Description Batch 78 of 86

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

- "settings_accesslog_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L17 | neighbors=[AccessLog.tsx]
- "settings_accessmatrix_accessmatrixprops": "AccessMatrixProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L30 | neighbors=[AccessMatrix.tsx]
- "settings_accessmatrix_cycle": "CYCLE" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L67 | neighbors=[AccessMatrix.tsx]
- "settings_accessmatrix_iaccessmatrixitem": "IAccessMatrixItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L17 | neighbors=[AccessMatrix.tsx]
- "settings_accessmatrix_legendpill": "LegendPill()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L97 | neighbors=[AccessMatrix.tsx]
- "settings_accessmatrix_level_label": "LEVEL_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L78 | neighbors=[AccessMatrix.tsx]
- "settings_accessmatrix_levelicon": "LevelIcon()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L85 | neighbors=[AccessMatrix.tsx]
- "settings_accessmatrix_nextlevel": "nextLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L68 | neighbors=[AccessMatrix.tsx]
- "settings_accessmatrix_rolecolor": "roleColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L94 | neighbors=[AccessMatrix.tsx]
- "settings_approvalrulesconfig_approvalrulesconfig": "ApprovalRulesConfig()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/ApprovalRulesConfig.tsx:L4 | neighbors=[ApprovalRulesConfig.tsx]
- "settings_membersmanagement_bid_role_meta": "BID_ROLE_META" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L98 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_bl_colors": "BL_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L85 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_business_lines": "BUSINESS_LINES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L105 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_getavatarcolor": "getAvatarColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L126 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L117 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_ibidrolemeta": "IBidRoleMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L91 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_ipeopleresult": "IPeopleResult" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L146 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_isectormeta": "ISectorMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L50 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_member_facet_values": "MEMBER_FACET_VALUES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L109 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_memberfacetkey": "MemberFacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L107 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_membersmanagement": "MembersManagement()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L159 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_sector_meta": "SECTOR_META" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L57 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_sectorstyle": "sectorStyle()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L102 | neighbors=[MembersManagement.tsx]
- "settings_notificationmatrix_channelchips": "ChannelChips()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L198 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_deliverypatch": "DeliveryPatch" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L252 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_event_icons": "EVENT_ICONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L68 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_group_icons": "GROUP_ICONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L86 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_mode_label": "MODE_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L103 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_modeicon": "ModeIcon()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L109 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_modes": "MODES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L101 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_notificationdeliverycardprops": "NotificationDeliveryCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L259 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_notificationmatrixprops": "NotificationMatrixProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L562 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_notificationrules": "NotificationRules" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L66 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_sameteamrule": "sameTeamRule()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L159 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_switch": "Switch()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L177 | neighbors=[NotificationMatrix.tsx]
- "settings_notificationmatrix_tone_color": "TONE_COLOR" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L93 | neighbors=[NotificationMatrix.tsx]
- "settings_patchnotes_patchnote": "PatchNote" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/PatchNotes.tsx:L4 | neighbors=[PatchNotes.tsx]
- "settings_systemconfiguration_access_areas": "ACCESS_AREAS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L204 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_all_nav_items": "ALL_NAV_ITEMS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L258 | neighbors=[SystemConfiguration.tsx]
- "settings_systemconfiguration_area_icons": "AREA_ICONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L284 | neighbors=[SystemConfiguration.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-077.json

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
