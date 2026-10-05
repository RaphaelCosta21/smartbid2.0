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
    /** Supplier registry (native CRUD form) — one row per supplier. */
    suppliers: "smartbid-suppliers",
    /** Survey Knowledge & BID Portal catalog (families, equipment, systems). */
    surveyCatalog: "smartbid-survey-catalog",
  },
  libraries: {
    attachments: "SmartBidAttachments",
  },

  /** Base URL for equipment photos (format: {partNumber}.jpg) — relative to siteUrl */
  photosBaseUrl: "/smartBidDocs/photos",

  /** Internal field names for smartbid-survey-catalog (auto-provisioned). */
  surveyCatalogFields: {
    itemType: "SurveyItemType",
    itemKey: "SurveyItemKey",
    familyKey: "SurveyFamilyKey",
    partNumber: "PartNumber",
    sortOrder: "SortOrder",
    isActive: "IsActive",
    jsondata: "jsondata",
  },

  /** Optional vessel GLB for the Survey System 3D scene; a procedural vessel is used when missing. */
  surveyVesselModelUrl:
    "/sites/G-OPGSSRBrazilEngineering/smartBidDocs/SurveyModels/vessel.glb",

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
      // Subfolder of Datasheets so the existing AI Search datasource (whose
      // includeFolder filter is recursive) picks it up without redeployment.
      technicalProposals: "Datasheets/Technical Proposals",
      // Generated from completed BIDs; needs its own includeFolder in the AI Search datasource.
      pastBids: "Past Bids",
      // Generated from the Clarifications Database list; needs its own includeFolder too.
      clarificationLibrary: "Clarifications Library",
    },
  },

  technicalProposal: {
    /** Attachment category (and SmartBidAttachments sub-folder) of a BID's Technical Proposal */
    attachmentCategory: "Technical Proposal",
    /** Every technical proposal is classified under this group; AI only picks the sub-group. */
    knowledgeGroupName: "Operation KIT",
  },

  /** Internal field names for the smartBidDocs catalog columns (auto-created if missing) */
  docCatalogFields: {
    docType: "DocType",
    groupId: "DocGroupId",
    subGroupId: "DocSubGroupId",
    // Human-readable "Group / SubGroup"; the ids above are opaque and useless to search.
    category: "DocCategory",
    manufacturer: "Manufacturer",
    model: "DocModel",
    keywords: "DocKeywords",
    description: "DocDescription",
    revision: "DocRevision",
  },

  /**
   * Plain columns mirrored from the bid JSON blob on smartbid-tracker, so AI
   * Search can index a bid without parsing `jsondata`.
   */
  bidTrackerFields: {
    client: "BidClient",
    projectName: "BidProjectName",
    division: "BidDivision",
    scopeSummary: "BidScopeSummary",
  },

  /** Internal field names for the smartbid-quotations columns (one row per quotation) */
  quotationFields: {
    quotationId: "QuotationId",
    groupId: "GroupId",
    subGroupId: "SubGroupId",
    partNumber: "PartNumber",
    reference: "QuotationRef",
    supplier: "Supplier",
    quantity: "Quantity",
    leadTimeDays: "LeadTimeDays",
    quotationDate: "QuotationDate",
    quotationType: "QuotationType",
    cost: "Cost",
    currency: "Currency",
    costUSD: "CostUSD",
    exchangeRateUsed: "ExchangeRateUsed",
    notes: "Notes",
    isFavorite: "IsFavorite",
    fileUrl: "FileUrl",
    fileName: "FileName",
    createdByName: "CreatedByName",
    createdDate: "CreatedDate",
    lastModifiedDate: "LastModifiedDate",
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
    overriddenBy: "OverriddenBy",
    overriddenDate: "OverriddenDate",
    overrideReason: "OverrideReason",
    nativeApprovalId: "NativeApprovalId",
    approverComments: "ApproverComments",
    lastReminderDate: "LastReminderDate",
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
    category: "Category",
    division: "Division",
    serviceLine: "ServiceLine",
    sourceBidNumber: "SourceBidNumber",
    sourceItemId: "SourceItemId",
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
    editControl: "EDIT_CONTROL",
    favorites: "FAVORITES",
    bomCosts: "BOM_COSTS",
    linksRecommendations: "LINKS_RECOMMENDATIONS",
  },

  /** Path to the Queries.xlsx Excel catalog in SharePoint */
  queriesExcelPath:
    "/sites/G-OPGSSRBrazilEngineering/smartBidDocs/Queries/Queries.xlsx",

  /**
   * Peoplesoft Financials "Active Registered with Manuf." CSV export.
   * `columns` maps UI column name → CSV header; only these columns are loaded.
   */
  financialsActiveRegisteredCsv: {
    path: "/sites/G-OPGSSRBrazilEngineering/smartBidDocs/Queries/export_BUIEH_data-Export Worksheet.csv",
    columns: {
      "BUSINESS UNIT": "BUSINESS_UNIT",
      "PART NUMBER": "INV_ITEM_ID",
      DESCRIPTION: "DESCR254",
      "MFG NAME": "MFG_ID",
      "MFG REF": "MFG_ITM_ID",
      "LAST ORDER DATE": "TO_CHAR(A.LAST_ORDER_DATE,'YYYY-MM-DD')",
    },
  },

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
  },
} as const;
