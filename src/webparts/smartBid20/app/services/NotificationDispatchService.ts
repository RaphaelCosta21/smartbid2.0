/**
 * NotificationDispatchService — Sends SmartBid events to the Power Automate
 * notification flow (HTTP trigger). The flow resolves the recipients from the
 * saved rules; failures never block the user action.
 */
import { INotificationSettings, NotificationEventKey } from "../models";
import {
  getNotificationEventDef,
  isValidFlowUrl,
  NotificationChannel,
} from "../config/notifications.config";
import {
  INotificationEvent,
  INotificationFact,
  INotificationPresentation,
} from "../utils/notificationEvents";
import { SystemConfigService } from "./SystemConfigService";

export interface INotificationActor {
  name: string;
  email: string;
}

interface INotificationPayload {
  schemaVersion: 1;
  eventKey: string;
  event: NotificationEventKey | "TEST";
  source: "app";
  occurredAt: string;
  bidNumber: string;
  deepLink: string;
  actor: INotificationActor;
  channels: NotificationChannel[];
  presentation: INotificationPresentation;
  headline: string;
  facts: INotificationFact[];
}

const appUrl = (): string =>
  `${window.location.origin}${window.location.pathname}`;

async function post(url: string, payload: INotificationPayload): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Notification flow returned HTTP ${response.status}`);
  }
}

export class NotificationDispatchService {
  /** Fire-and-forget: disabled events and a missing flow URL are skipped silently. */
  public static async emit(
    events: INotificationEvent[],
    actor: INotificationActor,
  ): Promise<void> {
    if (events.length === 0) return;
    let settings: INotificationSettings | undefined;
    try {
      settings = (await SystemConfigService.get()).notifications;
    } catch (err) {
      console.warn("Notifications skipped: system configuration unavailable", err);
      return;
    }
    if (!settings || !isValidFlowUrl(settings.flowUrl)) return;

    const occurredAt = new Date().toISOString();
    for (const e of events) {
      const rule = settings.rules[e.event];
      const def = getNotificationEventDef(e.event);
      if (!rule || !rule.enabled || !def) continue;
      try {
        await post(settings.flowUrl, {
          schemaVersion: 1,
          eventKey: e.eventKey,
          event: e.event,
          source: "app",
          occurredAt,
          bidNumber: e.bidNumber,
          deepLink: `${appUrl()}#/bid/${e.bidNumber}`,
          actor,
          channels: def.channels,
          presentation: {
            title: def.title,
            emoji: def.emoji,
            tone: def.tone,
            ...(e.presentation || {}),
          },
          headline: e.headline,
          facts: e.facts,
        });
      } catch (err) {
        console.warn(`Notification ${e.event} for ${e.bidNumber} not sent`, err);
      }
    }
  }

  /** Sends a TEST event that the flow delivers only to `actor`, on both channels. */
  public static async sendTest(
    flowUrl: string,
    actor: INotificationActor,
  ): Promise<void> {
    if (!isValidFlowUrl(flowUrl)) {
      throw new Error("Invalid flow URL");
    }
    await post(flowUrl.trim(), {
      schemaVersion: 1,
      eventKey: `TEST|${actor.email}|${Date.now()}`,
      event: "TEST",
      source: "app",
      occurredAt: new Date().toISOString(),
      bidNumber: "",
      deepLink: `${appUrl()}#/`,
      actor,
      channels: ["email", "teams"],
      presentation: { title: "Teste de notificação", emoji: "🧪", tone: "brand" },
      headline:
        "Se você recebeu esta mensagem, o fluxo de notificações do SmartBID está funcionando.",
      facts: [
        { title: "Enviado por", value: actor.name || actor.email },
        { title: "Origem", value: "System Configuration > Notifications" },
      ],
    });
  }
}
