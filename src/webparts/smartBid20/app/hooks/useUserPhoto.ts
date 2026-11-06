/**
 * useUserPhoto — profile photo (data URL) for an email, shared across the app.
 * Team member photos (Members Management) are used first, then Microsoft Graph
 * /users/{email}/photo/$value, like the Overview "Key People" card. Results
 * (including "no photo") are cached for the session and requests are deduped.
 */
import * as React from "react";
import { SpfxContext } from "../config/SpfxContext";
import { MembersService } from "../services/MembersService";

type Listener = (email: string) => void;

/** email (lowercase) -> data URL; "" = known to have no photo */
const cache: Record<string, string> = {};
const pending: Record<string, boolean> = {};
const listeners: Listener[] = [];
let membersSeed: Promise<void> | null = null;
let graphClient: Promise<any> | null = null;

const ALL = "*";

function emailKey(email: string | null | undefined): string {
  return (email || "").trim().toLowerCase();
}

function notify(email: string): void {
  listeners.slice().forEach((l) => l(email));
}

function seedFromMembers(): Promise<void> {
  if (!membersSeed) {
    membersSeed = MembersService.getAll()
      .then((data) => {
        (data.members || []).forEach((m) => {
          const k = emailKey(m.email);
          if (k && m.photoUrl && !cache[k]) cache[k] = m.photoUrl;
        });
        notify(ALL);
      })
      .catch(() => undefined);
  }
  return membersSeed;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = String(reader.result || "").split(",")[1];
      resolve(b64 ? `data:image/jpeg;base64,${b64}` : "");
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(blob);
  });
}

function loadPhoto(ctx: any, email: string): void {
  if (email in cache || pending[email]) return;
  pending[email] = true;
  if (!graphClient) graphClient = ctx.msGraphClientFactory.getClient("3");
  (graphClient as Promise<any>)
    .then((client) => client.api(`/users/${email}/photo/$value`).get())
    .then((blob: Blob) => blobToDataUrl(blob))
    .catch(() => "")
    .then((url: string) => {
      if (!cache[email]) cache[email] = url;
      delete pending[email];
      notify(email);
    });
}

/** Cached photo of a user ("" while loading or when there is none). */
export function useUserPhoto(email: string | null | undefined): string {
  const ctx = React.useContext(SpfxContext);
  const key = emailKey(email);
  const [, rerender] = React.useReducer((x: number) => x + 1, 0);

  React.useEffect(() => {
    if (!key) return undefined;
    const listener: Listener = (changed) => {
      if (changed === key || changed === ALL) rerender();
    };
    listeners.push(listener);
    seedFromMembers().then(() => {
      if (ctx && !(key in cache)) loadPhoto(ctx, key);
    });
    return () => {
      const i = listeners.indexOf(listener);
      if (i >= 0) listeners.splice(i, 1);
    };
  }, [key, ctx]);

  return key ? cache[key] || "" : "";
}
