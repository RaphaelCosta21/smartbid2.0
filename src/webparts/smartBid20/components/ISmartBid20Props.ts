import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISmartBid20Props {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  spfxContext: WebPartContext;
}
