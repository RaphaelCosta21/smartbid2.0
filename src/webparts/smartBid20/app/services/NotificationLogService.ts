import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";

const LIST_NAME = SHAREPOINT_CONFIG.lists.notificationLog;
const F = SHAREPOINT_CONFIG.notificationLogFields;
const DELIVERY_STATUSES = ["Received", "Sent", "Skipped", "Failed"];

let provisionPromise: Promise<void> | undefined;

/** Provisions only the schema. Delivery and log records belong to Power Automate. */
export class NotificationLogService {
  /** Concurrent clicks share a run; subsequent clicks recheck the schema. */
  public static ensureList(): Promise<void> {
    if (provisionPromise) return provisionPromise;
    const pending = NotificationLogService._provision().then(
      () => {
        provisionPromise = undefined;
      },
      (err) => {
        provisionPromise = undefined;
        throw err;
      },
    );
    provisionPromise = pending;
    return pending;
  }

  private static async _provision(): Promise<void> {
    // The project's SPFI declarations omit the PnP provisioning extensions.
    const lists = SPService.sp.web.lists as any;
    const list = lists.getByTitle(LIST_NAME) as any;
    try {
      await list.select("Id")();
    } catch (err) {
      if ((err as { status?: number })?.status !== 404) throw err;
      await lists.add(
        LIST_NAME,
        "SmartBid notification delivery log and event deduplication",
        100,
        false,
      );
    }

    const fields = (await list.fields.select(
      "InternalName",
      "TypeAsString",
    )()) as { InternalName: string; TypeAsString: string }[];
    const ensureField = async (
      name: string,
      type: "Text" | "Note" | "Choice",
    ): Promise<void> => {
      try {
        const existing = fields.find((f) => f.InternalName === name);
        if (existing && existing.TypeAsString !== type) {
          throw new Error(`Expected ${type}, found ${existing.TypeAsString}`);
        }
        if (!existing) {
          if (type === "Note") {
            await list.fields.addMultilineText(name, {
              RichText: false,
              AppendOnly: false,
            });
          } else if (type === "Choice") {
            await list.fields.addChoice(name, {
              Choices: DELIVERY_STATUSES,
              FillInChoice: false,
            });
          } else {
            await list.fields.addText(name);
          }
        }
        const field = list.fields.getByInternalNameOrTitle(name);
        if (type === "Note") {
          await field.update(
            { RichText: false, AppendOnly: false },
            "SP.FieldMultiLineText",
          );
        } else if (type === "Choice") {
          await field.update(
            {
              Choices: DELIVERY_STATUSES,
              DefaultValue: "Received",
              FillInChoice: false,
            },
            "SP.FieldChoice",
          );
        }
      } catch (err) {
        throw new Error(
          `${LIST_NAME}.${name}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    };

    // Uniqueness requires an index. Never silently fall back to a non-unique key.
    try {
      const title = list.fields.getByInternalNameOrTitle("Title");
      await title.update({ Indexed: true }, "SP.FieldText");
      await title.update(
        { EnforceUniqueValues: true, Required: true },
        "SP.FieldText",
      );
    } catch (err) {
      throw new Error(
        `${LIST_NAME}.Title: could not enforce unique event keys. Check Manage Lists permission and existing duplicate titles. ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    for (const name of [F.event, F.bidNumber, F.source, F.actor]) {
      await ensureField(name, "Text");
    }
    await ensureField(F.deliveryStatus, "Choice");
    for (const name of [F.recipients, F.payload, F.notes]) {
      await ensureField(name, "Note");
    }
  }
}
