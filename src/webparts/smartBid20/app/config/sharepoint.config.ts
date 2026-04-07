/**
 * SharePoint configuration — List names, site URLs, library names.
 */
export const SHAREPOINT_CONFIG = {
  siteUrl: "https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering",

  lists: {
    bidTracker: "smartbid-tracker",
    config: "smartbid-config",
    statusTracker: "smartbid-status-tracker",
    approvals: "smartbid-approvals",
  },

  libraries: {
    attachments: "SmartBidAttachments",
  },

  folders: {
    clientDocuments: "Client-Documents",
    technicalAnalysis: "Technical-Analysis",
    costSheets: "Cost-Sheets",
    proposals: "Proposals",
    approvalsFolder: "Approvals",
    exports: "Exports",
    templates: "Templates",
  },

  configKeys: {
    systemConfig: "SYSTEM_CONFIG",
    teamMembers: "TEAM_MEMBERS",
    activityLog: "ACTIVITY_LOG",
    bidTemplates: "BID_TEMPLATES",
    approvalRules: "APPROVAL_RULES",
    quotationDatabase: "QUOTATION_DATABASE",
    patchNotes: "PATCH_NOTES",
  },

  fields: {
    title: "Title",
    jsondata: "jsondata",
    status: "Status",
    dueDate: "DueDate",
    configValue: "ConfigValue",
    changeType: "ChangeType",
  },
} as const;
