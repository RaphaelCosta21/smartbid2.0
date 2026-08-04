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
    quotations: "smartbid-quotations",
    clarificationsDatabase: "Clarifications Database",
    /** Engineering Request Number list (same-site) — note the double "t" */
    erns: "Engineering Requestt",
  },
  libraries: {
    attachments: "SmartBidAttachments",
  },

  /** Base URL for equipment photos (format: {partNumber}.jpg) — relative to siteUrl */
  photosBaseUrl: "/smartBidDocs/photos",

  /**
   * Document library that holds catalogued reference documents
   * (Datasheets, Manuals & Catalogs). Catalog metadata is stored as
   * columns on the library itself.
   */
  docLibrary: {
    name: "smartBidDocs",
    serverRelativeUrl: "/sites/G-OPGSSRBrazilEngineering/smartBidDocs",
    folders: {
      datasheets: "Datasheets",
      manualsCatalogs: "Manuals and Catalogs",
    },
  },

  /** Internal field names for the smartBidDocs catalog columns (auto-created if missing) */
  docCatalogFields: {
    docType: "DocType",
    category: "DocCategory",
    manufacturer: "Manufacturer",
    model: "DocModel",
    keywords: "DocKeywords",
    description: "DocDescription",
    revision: "DocRevision",
  },

  /**
   * Internal field names for the smartbid-approvals list (auto-provisioned by
   * ApprovalService.ensureApprovalColumns). Drives the Teams approval flow:
   * one "Round" row per approval + one "Approver" row per person.
   */
  approvalFields: {
    recordType: "RecordType",
    bidNumber: "BidNumber",
    roundNumber: "RoundNumber",
    approverEmail: "ApproverEmail",
    approverName: "ApproverName",
    sector: "Sector",
    sectorLabel: "SectorLabel",
    approvalStatus: "ApprovalStatus",
    respondedDate: "RespondedDate",
    chatId: "ChatId",
    statusCardMessageId: "StatusCardMessageId",
    expectedApproverCount: "ExpectedApproverCount",
  },

  /** Internal field names for the "Clarifications Database" list */
  clarificationDbFields: {
    baseType: "BaseType",
    clientDocRef: "Title",
    etTopic: "TextodaET",
    clarification: "ClarificationEnviado",
    clientReply: "RespostaaoClarification",
    approved: "Aprovado_x002f_Aceito_x003f_",
    date: "Data",
    keyword: "Keyword",
    client: "Client",
  },

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
    linksRecommendations: "LINKS_RECOMMENDATIONS",
  },

  /** Path to the Queries.xlsx Excel catalog in SharePoint */
  queriesExcelPath:
    "/sites/G-OPGSSRBrazilEngineering/smartBidDocs/Queries/Queries.xlsx",

  /**
   * ERN (Engineering Request Number) integration — the list lives on the same
   * site. The list Title differs from its URL segment, so access it by its
   * server-relative URL via web.getList (getByTitle('Engineering Requestt')
   * returns 404). Internal field names below.
   */
  ern: {
    /** Server-relative URL of the ERN list (used with web.getList) */
    listUrl: "/sites/G-OPGSSRBrazilEngineering/Lists/Engineering Requestt",
    /** Deep link to the external ERN Power App (used in deadline reminders) */
    appUrl:
      "https://apps.powerapps.com/play/e/default-97525e9a-595d-472c-8248-0dc58f852d61/a/1b08a7bc-4e21-42a3-b729-676c303eb16a?tenantId=97525e9a-595d-472c-8248-0dc58f852d61&source=sharebutton",
    /** Days-before-due threshold that triggers the "due soon" warning */
    dueSoonDays: 5,
    fields: {
      status: "field_1",
      dueDate: "field_4",
      finishDate: "FinishDate",
      projectTitle: "ProjectTitle",
      projectNumber: "field_14",
      description: "field_2",
      deliverableType: "field_20",
      typeOfRequest: "field_12",
      serviceLine: "ServiceLine",
      contentAction: "field_28",
      revisionReason: "RevisionReason",
      projectName: "field_15",
      checkerDueDate: "CheckerDueDate",
      leadDate: "LeadDate",
      resource1: "Resource1",
      emailResource1: "EmailResource1",
      resource3: "Resource3",
      emailChecker: "EmailChecker",
      lead: "Lead",
      leadEmail: "LeadEmail",
    },
  },

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
