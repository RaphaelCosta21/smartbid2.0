/**
 * MockDataService — Mock data para dev e Guest Mode.
 * Static singleton pattern.
 */
import { IBid } from "../models";
import { ISystemConfig, IMembersData } from "../models";
import { INotification } from "../models";
import { IBidTemplate } from "../models/IBidTemplate";
import { IBidRequest } from "../models/IBidRequest";
import { IKnowledgeBaseItem } from "../models/IKnowledgeBase";
import { MOCK_BIDS } from "../data/mockBids";
import { MOCK_NOTIFICATIONS } from "../data/mockNotifications";
import { DEFAULT_SYSTEM_CONFIG } from "../data/defaultSystemConfig";
import { MOCK_TEMPLATES } from "../data/mockTemplates";
import { mockRequests } from "../data/mockRequests";
import { mockKnowledgeBase } from "../data/mockKnowledgeBase";

export class MockDataService {
  public static getBids(): IBid[] {
    return MOCK_BIDS;
  }

  public static getMembers(): IMembersData {
    return { members: [] };
  }

  public static getNotifications(): INotification[] {
    return MOCK_NOTIFICATIONS;
  }

  public static getSystemConfig(): ISystemConfig {
    return DEFAULT_SYSTEM_CONFIG;
  }

  public static getTemplates(): IBidTemplate[] {
    return MOCK_TEMPLATES as any;
  }

  public static getRequests(): IBidRequest[] {
    return mockRequests;
  }

  public static getKnowledgeBase(): IKnowledgeBaseItem[] {
    return mockKnowledgeBase;
  }
}
