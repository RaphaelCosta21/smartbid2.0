import * as React from "react";
import type { ISmartBid20Props } from "./ISmartBid20Props";
import { AppLayout } from "../app/components/layout/AppLayout";

export default class SmartBid20 extends React.Component<ISmartBid20Props> {
  public render(): React.ReactElement<ISmartBid20Props> {
    return <AppLayout />;
  }
}
