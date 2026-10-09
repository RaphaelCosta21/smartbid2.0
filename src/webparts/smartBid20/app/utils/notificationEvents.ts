/**
 * Builds the notification events sent to the Power Automate flow (texts in PT-BR,
 * like the Teams / e-mail templates). Each user action yields its most specific event.
 */
import {
  IActivityLogEntry,
  IBid,
  IPersonRef,
  NotificationEventKey,
} from "../models";
import { NotificationTone } from "../config/notifications.config";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { formatDate } from "./formatters";

export interface INotificationFact {
  title: string;
  value: string;
}

export interface INotificationPresentation {
  title: string;
  emoji: string;
  tone: NotificationTone;
}

export interface INotificationEvent {
  event: NotificationEventKey;
  bidNumber: string;
  /** The flow drops repeated keys, so the same change never notifies twice. */
  eventKey: string;
  headline: string;
  facts: INotificationFact[];
  presentation?: Partial<INotificationPresentation>;
}

const TP_CATEGORY = SHAREPOINT_CONFIG.technicalProposal.attachmentCategory;
const ON_HOLD = "On Hold";
const COMPLETED = "Completed";

const fmtDate = (value: string | null | undefined): string =>
  value ? formatDate(value, "dd/MM/yyyy") : "-";

const orDash = (value: string | null | undefined): string =>
  value && String(value).trim() ? String(value).trim() : "-";

const joinNames = (people: (IPersonRef | null | undefined)[]): string =>
  orDash(
    people
      .map((p) => (p ? p.name : ""))
      .filter((n) => !!n)
      .join(", "),
  );

const isCanceledStatus = (status: string): boolean =>
  /cancel/i.test(status || "");

const uniqueKey = (event: NotificationEventKey, bidNumber: string): string =>
  `${event}|${bidNumber}|${Date.now()}`;

/** Shared with the approval flow, which closes BIDs without the app. */
export function getClosingEventKey(
  event: "BID_COMPLETED" | "BID_CANCELED",
  bid: Pick<IBid, "bidNumber" | "revisions">,
): string {
  return `${event}|${bid.bidNumber}|rev${(bid.revisions || []).length}`;
}

function getNewActivityEntries(
  before: IBid,
  patch: Partial<IBid>,
): IActivityLogEntry[] {
  if (!patch.activityLog) return [];
  const known: Record<string, boolean> = {};
  (before.activityLog || []).forEach((e) => {
    known[e.id] = true;
  });
  return patch.activityLog.filter((e) => e && !known[e.id]);
}

const meta = (
  entry: IActivityLogEntry | undefined,
  key: string,
): string | undefined => {
  const value = entry?.metadata ? entry.metadata[key] : undefined;
  return value === undefined || value === null ? undefined : String(value);
};

export function buildCreatedNotification(
  bidNumber: string,
  createdBy: string,
  commercialRequester: string | null | undefined,
  projectManagers: IPersonRef[],
): INotificationEvent {
  return {
    event: "BID_CREATED",
    bidNumber,
    eventKey: uniqueKey("BID_CREATED", bidNumber),
    headline: `${createdBy} criou uma nova solicitação de SmartBID, aguardando atribuição.`,
    facts: [
      { title: "Criado por", value: orDash(createdBy) },
      { title: "Commercial Requester", value: orDash(commercialRequester) },
      { title: "Project Manager", value: joinNames(projectManagers) },
    ],
  };
}

export function buildAssignedNotification(
  bidNumber: string,
  engineers: IPersonRef[],
  analysts: IPersonRef[],
  assignedBy: string,
): INotificationEvent {
  return {
    event: "BID_ASSIGNED",
    bidNumber,
    eventKey: uniqueKey("BID_ASSIGNED", bidNumber),
    headline: `O SmartBID foi atribuído e seguiu para Bid Kick Off.`,
    facts: [
      { title: "BID Responsible", value: joinNames(engineers) },
      { title: "Analyst", value: joinNames(analysts) },
      { title: "Atribuído por", value: orDash(assignedBy) },
    ],
  };
}

/** Events for a BID Details save, from the BID before the save and the saved patch. */
export function deriveBidNotifications(
  before: IBid,
  patch: Partial<IBid>,
  actorName: string,
): INotificationEvent[] {
  const after = { ...before, ...patch } as IBid;
  const bidNumber = before.bidNumber;
  const by = orDash(actorName);
  const logs = getNewActivityEntries(before, patch);
  const findLog = (type: string): IActivityLogEntry | undefined =>
    logs.filter((e) => e.type === type)[0];
  const events: INotificationEvent[] = [];

  const fromStatus = before.currentStatus;
  const toStatus = after.currentStatus;
  const fromPhase = before.currentPhase;
  const toPhase = after.currentPhase;
  const statusChanged = !!patch.currentStatus && toStatus !== fromStatus;
  const phaseChanged = !!patch.currentPhase && toPhase !== fromPhase;

  const roundsBefore = before.approvalRounds || [];
  const roundsAfter = after.approvalRounds || [];
  const newRound =
    roundsAfter.length > roundsBefore.length
      ? roundsAfter[roundsAfter.length - 1]
      : null;
  const roundStarted = !!newRound && newRound.status === "pending";

  const revisionsBefore = before.revisions || [];
  const revisionsAfter = after.revisions || [];
  const newRevision =
    revisionsAfter.length > revisionsBefore.length
      ? revisionsAfter[revisionsAfter.length - 1]
      : null;
  const revisionStarted = !!newRevision && newRevision.status === "open";

  const overrideLog = findLog("APPROVAL_OVERRIDE");
  if (overrideLog) {
    const round = meta(overrideLog, "round") || "-";
    const bypassed = (overrideLog.metadata?.bypassed || []) as {
      name: string;
      sector: string;
    }[];
    events.push({
      event: "APPROVAL_OVERRIDE",
      bidNumber,
      eventKey: uniqueKey("APPROVAL_OVERRIDE", bidNumber),
      headline: `A aprovação da rodada ${round} foi concluída por override, sem aguardar todos os aprovadores.`,
      facts: [
        { title: "Rodada", value: round },
        {
          title: "Aprovados",
          value: `${meta(overrideLog, "approvedCount") || "0"} de ${meta(overrideLog, "totalApprovers") || "0"}`,
        },
        {
          title: "Ignorados",
          value: orDash(
            bypassed.map((b) => `${b.name} (${b.sector})`).join(", "),
          ),
        },
        { title: "Motivo", value: orDash(meta(overrideLog, "reason")) },
        { title: "Override por", value: by },
      ],
    });
  }

  if (statusChanged && toStatus === COMPLETED) {
    const closedRevision = revisionsAfter.filter(
      (r) =>
        r.status === "closed" &&
        revisionsBefore.some(
          (b) => b.revisionLetter === r.revisionLetter && b.status === "open",
        ),
    )[0];
    const facts: INotificationFact[] = [
      { title: "Concluído em", value: fmtDate(after.completedDate) },
      { title: "Concluído por", value: by },
    ];
    if (closedRevision) {
      facts.push({ title: "Revisão", value: closedRevision.revisionLetter });
    }
    events.push({
      event: "BID_COMPLETED",
      bidNumber,
      eventKey: getClosingEventKey("BID_COMPLETED", after),
      headline: overrideLog
        ? "O SmartBID foi concluído após override da aprovação."
        : closedRevision
          ? `O SmartBID foi concluído e a revisão ${closedRevision.revisionLetter} foi fechada.`
          : "O SmartBID foi concluído.",
      facts,
    });
  } else if (statusChanged && isCanceledStatus(toStatus)) {
    events.push({
      event: "BID_CANCELED",
      bidNumber,
      eventKey: getClosingEventKey("BID_CANCELED", after),
      headline: `O SmartBID foi cancelado (${toStatus}).`,
      facts: [
        { title: "Status anterior", value: orDash(fromStatus) },
        { title: "Cancelado por", value: by },
      ],
    });
  } else if (statusChanged && (toStatus === ON_HOLD || fromStatus === ON_HOLD)) {
    const paused = toStatus === ON_HOLD;
    events.push({
      event: "BID_ON_HOLD",
      bidNumber,
      eventKey: uniqueKey("BID_ON_HOLD", bidNumber),
      headline: paused
        ? `O SmartBID foi colocado em espera (estava em "${fromStatus}").`
        : `O SmartBID saiu de espera e voltou para "${toStatus}".`,
      facts: paused
        ? [
            { title: "Status anterior", value: orDash(fromStatus) },
            { title: "Alterado por", value: by },
          ]
        : [
            { title: "Novo status", value: orDash(toStatus) },
            { title: "Fase", value: orDash(toPhase) },
            { title: "Alterado por", value: by },
          ],
      presentation: paused
        ? undefined
        : { title: "SmartBID retomado", emoji: "▶️", tone: "success" },
    });
  } else if (revisionStarted && newRevision) {
    events.push({
      event: "REVISION_STARTED",
      bidNumber,
      eventKey: uniqueKey("REVISION_STARTED", bidNumber),
      headline: `A revisão ${newRevision.revisionLetter} foi iniciada e o SmartBID voltou para Rework.`,
      facts: [
        { title: "Revisão", value: newRevision.revisionLetter },
        { title: "Motivo", value: orDash(newRevision.reason) },
        { title: "Iniciada por", value: by },
      ],
    });
  } else if (roundStarted && newRound) {
    const approvers = (newRound.approvals || []).map(
      (a) => `${a.stakeholder.name} (${a.stakeholderRole})`,
    );
    const waived = (newRound.waivedSectors || []).map((w) => w.sectorLabel);
    const facts: INotificationFact[] = [
      { title: "Rodada", value: String(newRound.round) },
      { title: "Aprovadores", value: orDash(approvers.join(", ")) },
    ];
    if (waived.length > 0) {
      facts.push({ title: "Setores dispensados", value: waived.join(", ") });
    }
    facts.push({ title: "Iniciada por", value: by });
    events.push({
      event: "APPROVAL_STARTED",
      bidNumber,
      eventKey: uniqueKey("APPROVAL_STARTED", bidNumber),
      headline: `A rodada ${newRound.round} de aprovação foi iniciada com ${approvers.length} aprovador(es).`,
      facts,
    });
  } else if (phaseChanged) {
    events.push({
      event: "PHASE_CHANGED",
      bidNumber,
      eventKey: uniqueKey("PHASE_CHANGED", bidNumber),
      headline: `A fase mudou de "${fromPhase}" para "${toPhase}".`,
      facts: [
        { title: "De", value: orDash(fromPhase) },
        { title: "Para", value: orDash(toPhase) },
        { title: "Status", value: orDash(toStatus) },
        { title: "Alterado por", value: by },
      ],
    });
  } else if (statusChanged) {
    events.push({
      event: "STATUS_CHANGED",
      bidNumber,
      eventKey: uniqueKey("STATUS_CHANGED", bidNumber),
      headline: `O status mudou de "${fromStatus}" para "${toStatus}".`,
      facts: [
        { title: "De", value: orDash(fromStatus) },
        { title: "Para", value: orDash(toStatus) },
        { title: "Fase", value: orDash(toPhase) },
        { title: "Alterado por", value: by },
      ],
    });
  }

  const dueBefore = before.dueDate || before.desiredDueDate || "";
  const dueAfter = after.dueDate || after.desiredDueDate || "";
  if (
    (patch.dueDate !== undefined || patch.desiredDueDate !== undefined) &&
    dueAfter !== dueBefore
  ) {
    const dueLog = findLog("DUE_DATE_CHANGED");
    events.push({
      event: "DUE_DATE_CHANGED",
      bidNumber,
      eventKey: uniqueKey("DUE_DATE_CHANGED", bidNumber),
      headline: `O prazo foi alterado de ${fmtDate(dueBefore)} para ${fmtDate(dueAfter)}.`,
      facts: [
        { title: "Prazo anterior", value: fmtDate(dueBefore) },
        { title: "Novo prazo", value: fmtDate(dueAfter) },
        { title: "Motivo", value: orDash(meta(dueLog, "reason")) },
        { title: "Alterado por", value: by },
      ],
    });
  }

  if (patch.attachments) {
    const knownIds: Record<string, boolean> = {};
    (before.attachments || []).forEach((a) => {
      knownIds[a.id] = true;
    });
    const tp = patch.attachments.filter(
      (a) => a && a.category === TP_CATEGORY && !knownIds[a.id],
    )[0];
    if (tp) {
      events.push({
        event: "TECHNICAL_PROPOSAL_UPLOADED",
        bidNumber,
        eventKey: uniqueKey("TECHNICAL_PROPOSAL_UPLOADED", bidNumber),
        headline: `A Technical Proposal foi anexada ao SmartBID: "${tp.fileName}".`,
        facts: [
          { title: "Arquivo", value: orDash(tp.fileName) },
          { title: "Enviado por", value: by },
        ],
      });
    }
  }

  return events;
}
