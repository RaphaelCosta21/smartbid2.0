import * as React from "react";
import type { ISmartBid20Props } from "./ISmartBid20Props";
import { AppLayout } from "../app/components/layout/AppLayout";
import { SpfxContext } from "../app/config/SpfxContext";
import { AiAuthService } from "../app/services/AiAuthService";
import { isAiConfigured } from "../app/config/ai.config";

export default class SmartBid20 extends React.Component<ISmartBid20Props> {
  public componentDidMount(): void {
    // Silent warm-up so the first AI call already has a cached token (no pop-up).
    if (isAiConfigured()) {
      AiAuthService.warmUp().catch(() => undefined);
    }
  }

  public render(): React.ReactElement<ISmartBid20Props> {
    return (
      <SpfxContext.Provider value={this.props.spfxContext}>
        <AppLayout />
      </SpfxContext.Provider>
    );
  }
}
