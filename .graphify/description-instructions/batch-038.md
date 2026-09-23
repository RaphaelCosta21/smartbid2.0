# Node Description Batch 39 of 43

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

- "services_notificationservice_toasttype": "ToastType" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L5 | neighbors=[NotificationService.ts]
- "services_pricingservice_ipriceentry": "IPriceEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L8 | neighbors=[PricingService.ts]
- "services_pricingservice_pricingservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L27 | neighbors=[PricingService]
- "services_pricingservice_pricingservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L23 | neighbors=[PricingService]
- "services_pricingservice_pricingservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L42 | neighbors=[PricingService]
- "services_quotationservice_quotationservice_fromrow": "._fromRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L97 | neighbors=[QuotationService]
- "services_quotationservice_quotationservice_getfileopenurl": ".getFileOpenUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L288 | neighbors=[QuotationService]
- "services_quotationservice_quotationservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L23 | neighbors=[QuotationService]
- "services_quotationservice_quotationservice_uploadfile": ".uploadFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L272 | neighbors=[QuotationService]
- "services_requestservice_requestservice_assignrequest": ".assignRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L307 | neighbors=[RequestService]
- "services_requestservice_requestservice_bidtorequest": ".bidToRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L32 | neighbors=[RequestService]
- "services_requestservice_requestservice_createrequest": ".createRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L93 | neighbors=[RequestService]
- "services_requestservice_requestservice_getunassignedfromsp": ".getUnassignedFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L16 | neighbors=[RequestService]
- "services_requestservice_requestservice_rejectrequest": ".rejectRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L320 | neighbors=[RequestService]
- "services_spservice_spservice_context": ".context()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L39 | neighbors=[SPService]
- "services_spservice_spservice_init": ".init()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L20 | neighbors=[SPService]
- "services_spservice_spservice_isinitialized": ".isInitialized()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L48 | neighbors=[SPService]
- "services_spservice_spservice_sp": ".sp()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L26 | neighbors=[SPService]
- "services_statustrackerservice_changetype": "ChangeType" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L9 | neighbors=[StatusTrackerService.ts]
- "services_statustrackerservice_istatustrackerentry": "IStatusTrackerEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L24 | neighbors=[StatusTrackerService.ts]
- "services_statustrackerservice_statustrackerservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L37 | neighbors=[StatusTrackerService]
- "services_systemconfigservice_systemconfigservice_clearcache": ".clearCache()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L68 | neighbors=[SystemConfigService]
- "services_systemconfigservice_systemconfigservice_get": ".get()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L18 | neighbors=[SystemConfigService]
- "services_systemconfigservice_systemconfigservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L14 | neighbors=[SystemConfigService]
- "services_systemconfigservice_systemconfigservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L49 | neighbors=[SystemConfigService]
- "services_templateservice_templateservice_configlist": "._configList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L18 | neighbors=[TemplateService]
- "services_templateservice_templateservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L25 | neighbors=[TemplateService]
- "services_templateservice_templateservice_getspitemid": ".getSpItemId()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L147 | neighbors=[TemplateService]
- "services_templateservice_templateservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L14 | neighbors=[TemplateService]
- "services_userservice_userservice_getcurrentuser": ".getCurrentUser()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L9 | neighbors=[UserService]
- "services_userservice_userservice_getuserphoto": ".getUserPhoto()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L23 | neighbors=[UserService]
- "services_userservice_userservice_searchusers": ".searchUsers()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L33 | neighbors=[UserService]
- "settings_approvalrulesconfig_approvalrulesconfig": "ApprovalRulesConfig()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/ApprovalRulesConfig.tsx:L4 | neighbors=[ApprovalRulesConfig.tsx]
- "settings_membersmanagement_bid_role_meta": "BID_ROLE_META" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L98 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_bl_colors": "BL_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L85 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_business_lines": "BUSINESS_LINES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L83 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_getavatarcolor": "getAvatarColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L146 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L137 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_ibidrolemeta": "IBidRoleMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L91 | neighbors=[MembersManagement.tsx]
- "settings_membersmanagement_ipeopleresult": "IPeopleResult" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L166 | neighbors=[MembersManagement.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-038.json

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
