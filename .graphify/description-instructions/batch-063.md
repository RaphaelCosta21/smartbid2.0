# Node Description Batch 64 of 102

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

- "utils_surveydatajourney_issourcerole": "isSourceRole()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L474 | neighbors=[surveyDataJourney.ts, listJourneys()]
- "utils_surveydatajourney_overrideof": "overrideOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L155 | neighbors=[surveyDataJourney.ts, buildDataJourney()]
- "utils_surveydatajourney_same": "same()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L117 | neighbors=[surveyDataJourney.ts, buildDataJourney()]
- "utils_surveyfailure_pushunique": "pushUnique()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFailure.ts:L44 | neighbors=[surveyFailure.ts, computeFailureImpact()]
- "utils_surveyfreescene_buildfocus": "buildFocus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFreeScene.ts:L91 | neighbors=[surveyFreeScene.ts, buildFreeScene()]
- "utils_surveyfreescene_locationbyequipment": "locationByEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFreeScene.ts:L32 | neighbors=[surveyFreeScene.ts, buildFreeScene()]
- "utils_surveyglossary_classify": "classify()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L185 | neighbors=[surveyGlossary.ts, protocolsForLink()]
- "utils_surveyglossary_getmatcher": "getMatcher()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L80 | neighbors=[surveyGlossary.ts, scanGlossary()]
- "utils_surveyglossary_iswordchar": "isWordChar()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L62 | neighbors=[surveyGlossary.ts, scanGlossary()]
- "utils_surveyglossary_loadglossarylang": "loadGlossaryLang()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L33 | neighbors=[SurveySystemPage.tsx, surveyGlossary.ts]
- "utils_surveyglossary_protocolsforlinkrefs": "protocolsForLinkRefs()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L236 | neighbors=[SurveySystemPage.tsx, surveyGlossary.ts]
- "utils_surveyglossary_saveglossarylang": "saveGlossaryLang()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L44 | neighbors=[SurveySystemPage.tsx, surveyGlossary.ts]
- "utils_surveyglossary_textof": "textOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L196 | neighbors=[surveyGlossary.ts, protocolsForLink()]
- "utils_surveypackages_composepackages": "composePackages()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackages.ts:L41 | neighbors=[surveyPackages.ts, resolveActiveSpread()]
- "utils_surveyspreadgraph_directlinks": "directLinks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L291 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_ilineageitem": "ILineageItem" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L356 | neighbors=[SurveyEquipmentDetail.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_ilineagestage": "ILineageStage" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L369 | neighbors=[SurveyEquipmentDetail.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_lineagestagekey": "LineageStageKey" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L346 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_resolvespreadlinks": "resolveSpreadLinks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L195 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_technicalproposalhelpers_technical_proposal_state_labels": "TECHNICAL_PROPOSAL_STATE_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L11 | neighbors=[TechnicalProposalChip.tsx, technicalProposalHelpers.ts]
- "utils_technicalproposalhelpers_technicalproposalstate": "TechnicalProposalState" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L4 | neighbors=[TechnicalProposalChip.tsx, technicalProposalHelpers.ts]
- "utils_textsimilarity_boundedlevenshtein": "boundedLevenshtein()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/textSimilarity.ts:L21 | neighbors=[textSimilarity.ts, similarityAtLeast()]
- "utils_textsimilarity_tokensortkey": "tokenSortKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/textSimilarity.ts:L7 | neighbors=[bidComparator.ts, textSimilarity.ts]
- "utils_validators_sanitizetext": "sanitizeText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L89 | neighbors=[CreateRequestPage.tsx, validators.ts]
- "utils_validators_validatebidrequest": "validateBidRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L62 | neighbors=[validators.ts, validateRequired()]
- "utils_validators_validaterequired": "validateRequired()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L11 | neighbors=[validators.ts, validateBidRequest()]
- "utils_winprobability_clientkey": "clientKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L52 | neighbors=[winProbability.ts, getHistoricalWinProbability()]
- "utils_winprobability_fromtally": "fromTally()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L83 | neighbors=[winProbability.ts, getHistoricalWinProbability()]
- "utils_winprobability_iwinrateindex": "IWinRateIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L28 | neighbors=[EngHoursOutlook.tsx, winProbability.ts]
- "utils_winprobability_win_probability_levels": "WIN_PROBABILITY_LEVELS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L50 | neighbors=[FollowUpPage.tsx, winProbability.ts]
- "utils_winprobability_win_probability_source_label": "WIN_PROBABILITY_SOURCE_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L38 | neighbors=[FollowUpPage.tsx, winProbability.ts]
- "approval_approvalbadge_approvalbadge": "ApprovalBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalBadge.tsx:L10 | neighbors=[ApprovalBadge.tsx]
- "approval_approvalbadge_approvalbadgeprops": "ApprovalBadgeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalBadge.tsx:L5 | neighbors=[ApprovalBadge.tsx]
- "approval_approvaldecisionpanel_approvaldecisionpanel": "ApprovalDecisionPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalDecisionPanel.tsx:L13 | neighbors=[ApprovalDecisionPanel.tsx]
- "approval_approvaldecisionpanel_approvaldecisionpanelprops": "ApprovalDecisionPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalDecisionPanel.tsx:L4 | neighbors=[ApprovalDecisionPanel.tsx]
- "approval_approvalmatrix_approvalmatrix": "ApprovalMatrix()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalMatrix.tsx:L11 | neighbors=[ApprovalMatrix.tsx]
- "approval_approvalmatrix_approvalmatrixprops": "ApprovalMatrixProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalMatrix.tsx:L6 | neighbors=[ApprovalMatrix.tsx]
- "approval_approvaloverridebanner_approvaloverridebannerprops": "ApprovalOverrideBannerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalOverrideBanner.tsx:L7 | neighbors=[ApprovalOverrideBanner.tsx]
- "approval_approvaloverridebanner_non_pending_label": "NON_PENDING_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalOverrideBanner.tsx:L12 | neighbors=[ApprovalOverrideBanner.tsx]
- "approval_approvalrequestcard_approvalrequestcard": "ApprovalRequestCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalRequestCard.tsx:L11 | neighbors=[ApprovalRequestCard.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-063.json

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
