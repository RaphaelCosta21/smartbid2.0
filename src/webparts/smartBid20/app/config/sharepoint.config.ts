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
    assetsCatalog: "Assets Catalog_",
    templates: "smartbid-templates",
  },

  libraries: {
    attachments: "SmartBidAttachments",
  },

  /** Base URL for equipment photos (format: {partNumber}.jpg) — relative to siteUrl */
  photosBaseUrl: "/smartBidDocs/photos",

  folders: {
    clientDocuments: "Client-Documents",
    technicalAnalysis: "Technical-Analysis",
    costSheets: "Cost-Sheets",
    proposals: "Proposals",
    approvalsFolder: "Approvals",
    exports: "Exports",
    templates: "Templates",
    aiAnalysis: "AI-Analysis",
  },

  configKeys: {
    systemConfig: "SYSTEM_CONFIG",
    teamMembers: "TEAM_MEMBERS",
    activityLog: "ACTIVITY_LOG",
    bidTemplates: "BID_TEMPLATES",
    approvalRules: "APPROVAL_RULES",
    quotationDatabase: "QUOTATION_DATABASE",
    patchNotes: "PATCH_NOTES",
    editControl: "EDIT_CONTROL",
    favorites: "FAVORITES",
    bomCosts: "BOM_COSTS",
  },

  /** Path to the Queries.xlsx Excel catalog in SharePoint */
  queriesExcelPath:
    "/sites/G-OPGSSRBrazilEngineering/smartBidDocs/Queries/Queries.xlsx",

  fields: {
    title: "Title",
    jsondata: "jsondata",
    status: "Status",
    dueDate: "DueDate",
    configValue: "ConfigValue",
    changeType: "ChangeType",
    aiResponse: "AIResponse",
  },
} as const;
