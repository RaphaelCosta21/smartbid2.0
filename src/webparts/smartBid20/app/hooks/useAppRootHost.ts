import * as React from "react";
import globalStyles from "../styles/globals.module.scss";

/**
 * Closest `.smartBidRoot` of a probe element, used as portal target so overlays
 * keep the theme tokens. Attach the returned ref to an element that is always rendered.
 */
export function useAppRootHost(
  active: boolean,
): [React.RefObject<HTMLSpanElement>, HTMLElement | null] {
  const probeRef = React.useRef<HTMLSpanElement>(null);
  const [host, setHost] = React.useState<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (!active || host) return;
    const probe = probeRef.current;
    const root = probe
      ? (probe.closest(`.${globalStyles.smartBidRoot}`) as HTMLElement | null)
      : null;
    setHost(root || document.body);
  }, [active, host]);

  return [probeRef, host];
}
