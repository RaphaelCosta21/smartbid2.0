export { type IUser, type IPersonRef, type UserRole } from "./IUser";
export {
  type BidPhase,
  type BidStatusId,
  type IBidStatusDef,
  type IPhaseDef,
  type BidPriority,
  type BidType,
  type BidSize,
  type Division,
  type ApprovalStatus,
  type BidResultOutcome,
} from "./IBidStatus";
export {
  type IBid,
  type IOpportunityInfo,
  type IBidStep,
  type IBidTask,
  type IEquipmentItem,
  type IHoursItem,
  type IHoursSection,
  type IHoursSummary,
  type IAssetsCostSummary,
  type ICostSummary,
  type IBidApproval,
  type IBidAttachment,
  type IBidComment,
  type IBidResult,
  type IActivityLogEntry,
  type IBidKPIs,
  type IBidMetadata,
} from "./IBid";
export { type IBidRequest } from "./IBidRequest";
export { type IBidTaskDef, type TaskStatusType } from "./IBidTask";
export {
  type IBidApprovalState,
  type IApprovalChain,
  type IApprovalChainStep,
} from "./IBidApproval";
export {
  type IBidEquipmentItem,
  type IEquipmentSummary,
} from "./IBidEquipment";
export {
  type IBidHoursItem,
  type IBidHoursSection,
  type IBidHoursSummary,
} from "./IBidHours";
export {
  type IBidCostBreakdown,
  type IDivisionCostBreakdown,
  type IBidCostReport,
} from "./IBidCost";
export { type IBidOpportunityInfo } from "./IBidOpportunityInfo";
export { type IBidCommentDef } from "./IBidComment";
export { type IBidResultDef } from "./IBidResult";
export { type IBidTemplate } from "./IBidTemplate";
export {
  type IExportTab,
  type IExportColumn,
  type IExportOptions,
  type IExportResult,
} from "./IBidExport";
export {
  type IBidNote,
  type BidNoteSection,
  type IBidNotesMap,
} from "./IBidNotes";
export { type INotification } from "./INotification";
export {
  type ISystemConfig,
  type IConfigOption,
  type IKPITargets,
  type ICurrencySettings,
  type IApprovalRules,
  type IAccessLevelDef,
  type AccessPermission,
} from "./ISystemConfig";
export { type ITeamMember, type IMembersData } from "./ITeamMember";
export {
  type IActivityLogEntry as IActivityLogEntryDef,
  type IActivityLog,
} from "./IActivityLog";
export {
  type IDashboardKPI,
  type IMonthlyVolume,
  type IDivisionWorkload,
  type IDashboardData,
} from "./IDashboard";
export {
  type IApprovalFlow,
  type IApprovalFlowChain,
  type IApprovalFlowStep,
} from "./IApprovalFlow";
export { type IKnowledgeBaseItem, type KBCategory } from "./IKnowledgeBase";
