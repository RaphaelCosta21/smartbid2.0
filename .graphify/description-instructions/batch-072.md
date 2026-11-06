# Node Description Batch 73 of 102

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

- "config_accesscontrol_config_iaccessroledef": "IAccessRoleDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L14 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_ispermission": "isPermission()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L202 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_non_eng_pages": "NON_ENG_PAGES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L116 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_page_area": "PAGE_AREA" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L82 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_pickoverrides": "pickOverrides()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L205 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_short_role_labels": "SHORT_ROLE_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L19 | neighbors=[accessControl.config.ts]
- "config_accesscontrol_config_super_admin_pages": "SUPER_ADMIN_PAGES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L90 | neighbors=[accessControl.config.ts]
- "config_ai_config_ai_config": "AI_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L106 | neighbors=[ai.config.ts]
- "config_ai_config_buildaiurl": "buildAiUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L150 | neighbors=[ai.config.ts]
- "config_ai_config_default_assistant_teams": "DEFAULT_ASSISTANT_TEAMS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L137 | neighbors=[ai.config.ts]
- "config_ai_config_iaiauthconfig": "IAiAuthConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L25 | neighbors=[ai.config.ts]
- "config_ai_config_iaichatconfig": "IAiChatConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L53 | neighbors=[ai.config.ts]
- "config_ai_config_iaiconfig": "IAiConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L72 | neighbors=[ai.config.ts]
- "config_ai_config_isaiconfigured": "isAiConfigured()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L140 | neighbors=[ai.config.ts]
- "config_ai_prompts_buildclarificationsuggestionprompt": "buildClarificationSuggestionPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L547 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_builddocumentmetadataextractionprompt": "buildDocumentMetadataExtractionPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L409 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_buildknowledgechatprompt": "buildKnowledgeChatPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L220 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_buildpastbidprofileprompt": "buildPastBidProfilePrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L465 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_buildqualificationsuggestionprompt": "buildQualificationSuggestionPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L590 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_buildquotationextractionprompt": "buildQuotationExtractionPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L322 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_buildscopeofsupplyprompt": "buildScopeOfSupplyPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L64 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_buildsupplierprofileprompt": "buildSupplierProfilePrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L498 | neighbors=[ai.prompts.ts]
- "config_app_config_app_config": "APP_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/config/app.config.ts:L1 | neighbors=[app.config.ts]
- "config_bidroles_config_bid_role_meta": "BID_ROLE_META" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidRoles.config.ts:L10 | neighbors=[bidRoles.config.ts]
- "config_bidroles_config_getbidrolelabel": "getBidRoleLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidRoles.config.ts:L56 | neighbors=[bidRoles.config.ts]
- "config_bidroles_config_getbidrolesforsector": "getBidRolesForSector()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidRoles.config.ts:L50 | neighbors=[bidRoles.config.ts]
- "config_bidroles_config_ibidrolemeta": "IBidRoleMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidRoles.config.ts:L3 | neighbors=[bidRoles.config.ts]
- "config_bidtabs_config_bid_tab_group": "BID_TAB_GROUP" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidTabs.config.ts:L87 | neighbors=[bidTabs.config.ts]
- "config_bidtabs_config_bid_tab_groups": "BID_TAB_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidTabs.config.ts:L36 | neighbors=[bidTabs.config.ts]
- "config_bidtabs_config_bidtab": "BidTab" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidTabs.config.ts:L3 | neighbors=[bidTabs.config.ts]
- "config_bidtabs_config_ibidtabdef": "IBidTabDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidTabs.config.ts:L23 | neighbors=[bidTabs.config.ts]
- "config_bidtabs_config_ibidtabgroupdef": "IBidTabGroupDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidTabs.config.ts:L29 | neighbors=[bidTabs.config.ts]
- "config_colorthemes_config_color_themes": "COLOR_THEMES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L70 | neighbors=[colorThemes.config.ts]
- "config_colorthemes_config_colorthemeid": "ColorThemeId" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L8 | neighbors=[colorThemes.config.ts]
- "config_colorthemes_config_getcolortheme": "getColorTheme()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L161 | neighbors=[colorThemes.config.ts]
- "config_colorthemes_config_icolorthemeaccents": "IColorThemeAccents" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L10 | neighbors=[colorThemes.config.ts]
- "config_colorthemes_config_icolorthemechartcolors": "IColorThemeChartColors" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L22 | neighbors=[colorThemes.config.ts]
- "config_colorthemes_config_icolorthemedef": "IColorThemeDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L40 | neighbors=[colorThemes.config.ts]
- "config_colorthemes_config_iscolorthemeid": "isColorThemeId()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L157 | neighbors=[colorThemes.config.ts]
- "config_colorthemes_config_iupcomingcolortheme": "IUpcomingColorTheme" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L63 | neighbors=[colorThemes.config.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-072.json

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
