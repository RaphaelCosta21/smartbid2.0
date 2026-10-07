import * as React from "react";
import { Lock, UserLock } from "lucide-react";
import {
  IBid,
  IBidConfidentiality,
  IPersonRef,
  ITeamMember,
} from "../../models";
import { useBidStore } from "../../stores/useBidStore";
import { useUIStore } from "../../stores/useUIStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { createActivityLogEntry } from "../../utils/activityLogHelpers";
import {
  canManageBidConfidentiality,
  diffPeople,
  isBidConfidential,
} from "../../utils/bidConfidentiality";
import { ConfidentialAccessModal } from "./ConfidentialAccessModal";

interface BidConfidentialButtonProps {
  bid: IBid;
  teamMembers: ITeamMember[];
  onSave: (patch: Partial<IBid>) => Promise<void>;
  className?: string;
}

const names = (people: IPersonRef[]): string =>
  people.map((p) => p.name || p.email).join(", ");

/** Only the BID Responsible and Analyst of the BID see this button. */
export const BidConfidentialButton: React.FC<BidConfidentialButtonProps> = ({
  bid,
  teamMembers,
  onSave,
  className,
}) => {
  const currentUser = useCurrentUser();
  const addToast = useUIStore((s) => s.addToast);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  if (!canManageBidConfidentiality(bid, currentUser.email)) return null;

  const isEnabled = isBidConfidential(bid);
  const actor: IPersonRef = {
    name: currentUser.displayName || currentUser.email,
    email: currentUser.email,
  };

  const latestBid = (): IBid =>
    useBidStore.getState().bids.find((b) => b.bidNumber === bid.bidNumber) ||
    bid;

  const persist = async (
    confidentiality: IBidConfidentiality,
    type: string,
    description: string,
    metadata: Record<string, unknown>,
    toastTitle: string,
  ): Promise<void> => {
    const latest = latestBid();
    const logEntry = createActivityLogEntry(
      type,
      description,
      actor.email,
      actor.name,
      metadata,
    );
    setSaving(true);
    try {
      await onSave({
        confidentiality,
        activityLog: [...(latest.activityLog || []), logEntry],
      });
      // savePatch toasts its own errors and rolls the store back.
      if (latestBid().confidentiality !== confidentiality) return;
      addToast({ type: "success", title: toastTitle, message: bid.bidNumber });
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = (people: IPersonRef[]): void => {
    const now = new Date().toISOString();
    const latest = latestBid();
    const emails = people.map((p) => p.email);
    if (!isBidConfidential(latest)) {
      persist(
        {
          enabled: true,
          allowedPeople: people,
          enabledBy: actor,
          enabledDate: now,
          updatedBy: null,
          updatedDate: null,
        },
        "CONFIDENTIALITY_ENABLED",
        `BID marked as confidential. Access limited to ${people.length} ${people.length === 1 ? "person" : "people"}: ${names(people)}`,
        { allowed: emails },
        "BID is now confidential",
      ).catch(() => undefined);
      return;
    }
    const previous = latest.confidentiality!;
    const { added, removed } = diffPeople(previous.allowedPeople || [], people);
    if (added.length === 0 && removed.length === 0) {
      setOpen(false);
      return;
    }
    const parts: string[] = [];
    if (added.length > 0) parts.push(`added ${names(added)}`);
    if (removed.length > 0) parts.push(`removed ${names(removed)}`);
    persist(
      {
        ...previous,
        allowedPeople: people,
        updatedBy: actor,
        updatedDate: now,
      },
      "CONFIDENTIALITY_UPDATED",
      `Confidential access updated: ${parts.join("; ")}`,
      {
        allowed: emails,
        added: added.map((p) => p.email),
        removed: removed.map((p) => p.email),
      },
      "Confidential access updated",
    ).catch(() => undefined);
  };

  const handleDisable = (): void => {
    const previous = latestBid().confidentiality;
    if (!previous) return;
    persist(
      {
        ...previous,
        enabled: false,
        updatedBy: actor,
        updatedDate: new Date().toISOString(),
      },
      "CONFIDENTIALITY_DISABLED",
      "Confidentiality turned off. The BID follows the regular access levels again.",
      { previousAllowed: (previous.allowedPeople || []).map((p) => p.email) },
      "Confidentiality turned off",
    ).catch(() => undefined);
  };

  const label = isEnabled ? "Manage access" : "Make confidential";

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        title={
          isEnabled
            ? "Choose who can open this confidential BID"
            : "Limit who can open this BID"
        }
      >
        {isEnabled ? <UserLock size={14} /> : <Lock size={14} />}
        {label}
      </button>
      {open && (
        <ConfidentialAccessModal
          bid={bid}
          teamMembers={teamMembers}
          currentUserEmail={currentUser.email}
          saving={saving}
          onSave={handleSave}
          onDisable={handleDisable}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
