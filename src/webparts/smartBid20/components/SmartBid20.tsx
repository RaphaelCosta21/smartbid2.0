import * as React from "react";
import type { ISmartBid20Props } from "./ISmartBid20Props";
import { AppLayout } from "../app/components/layout/AppLayout";
import { SpfxContext } from "../app/config/SpfxContext";

export default class SmartBid20 extends React.Component<ISmartBid20Props> {
  public render(): React.ReactElement<ISmartBid20Props> {
    return (
      <SpfxContext.Provider value={this.props.spfxContext}>
        <AppLayout />
      </SpfxContext.Provider>
    );
  }
}
