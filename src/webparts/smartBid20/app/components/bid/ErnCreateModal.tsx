/**
 * ErnCreateModal — two-page wizard to create an ERN for a BID and link it back.
 * Creates the ERN directly in SharePoint (no drafts). On success, patches the
 * BID with ernNumber/ernId/ernStatus/ernDueDate and logs the activity.
 */
import * as React from "react";
import { IBid, IErnCreateData, IPersonRef } from "../../models";
import { ErnService } from "../../services/ErnService";
import { useConfigStore } from "../../stores/useConfigStore";
import { useUIStore } from "../../stores/useUIStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { PeoplePicker, IPickedPerson } from "../common/PeoplePicker";
import {
  ERN_REVISION_REASONS,
  resolveErnProjectNumber,
  ErnDivision,
} from "../../utils/ernHelpers";
import { linkErnToBid } from "../../utils/ernLink";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import styles from "./ErnCreateModal.module.scss";

interface ErnCreateModalProps {
  bid: IBid;
  isOpen: boolean;
  /** Division slot for Integrated BIDs (null = single ERN). */
  division?: ErnDivision;
  onDismiss: () => void;
  onCreated: (ernNumber: string, ernStatus: string, ernId: number) => void;
}

const toInputDate = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const personToPicked = (p: IPersonRef | undefined): IPickedPerson | null =>
  p ? { name: p.name, email: p.email, photoUrl: p.photoUrl || "" } : null;

export const ErnCreateModal: React.FC<ErnCreateModalProps> = ({
  bid,
  isOpen,
  division = null,
  onDismiss,
  onCreated,
}) => {
  const config = useConfigStore((s) => s.config);
  const currentUser = useCurrentUser();
  const addToast = useUIStore((s) => s.addToast);

  // Service line value that drives this slot's Project Number / ServiceLine
  const slotServiceLine =
    division === "ROV" ? "ROV" : division === "SURVEY" ? "Survey" : "";

  const [page, setPage] = React.useState(1);
  const [saving, setSaving] = React.useState(false);
  const [serviceLineChoices, setServiceLineChoices] = React.useState<string[]>(
    [],
  );
  const [deliverableChoices, setDeliverableChoices] = React.useState<string[]>(
    [],
  );
  const [choicesLoading, setChoicesLoading] = React.useState(true);

  // Page 1
  const [serviceLine, setServiceLine] = React.useState("");
  const [contentAction, setContentAction] = React.useState<"Create" | "Revise">(
    "Create",
  );
  const [revisionReason, setRevisionReason] = React.useState("");
  const [projectNumber, setProjectNumber] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [projectTitle, setProjectTitle] = React.useState("");
  const [deliverableType, setDeliverableType] = React.useState("");

  // Page 2
  const [engDueDate, setEngDueDate] = React.useState("");
  const [checkerDueDate, setCheckerDueDate] = React.useState("");
  const [leadDate, setLeadDate] = React.useState("");
  const [resource1, setResource1] = React.useState<IPickedPerson | null>(null);
  const [checker, setChecker] = React.useState<IPickedPerson | null>(null);
  const [lead, setLead] = React.useState<IPickedPerson | null>(null);
  const [description, setDescription] = React.useState("");

  // Pre-fill on open
  React.useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    setContentAction("Create");
    setRevisionReason("");
    setProjectNumber(
      resolveErnProjectNumber(bid, config, slotServiceLine || undefined),
    );
    setProjectName(bid.opportunityInfo?.projectName || "");
    setProjectTitle(bid.opportunityInfo?.projectName || "");
    setDescription(bid.opportunityInfo?.projectDescription || "");
    setEngDueDate(toInputDate(bid.desiredDueDate || bid.dueDate));
    setCheckerDueDate("");
    setLeadDate("");
    setResource1(personToPicked((bid.engineerResponsible || [])[0]));
    setChecker(null);
    setLead(null);
    setDeliverableType("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Load choices on open
  React.useEffect(() => {
    if (!isOpen) return;
    const F = SHAREPOINT_CONFIG.ern.fields;
    setChoicesLoading(true);
    const slPromise = ErnService.getFieldChoices(F.serviceLine)
      .then((c) => {
        setServiceLineChoices(c);
        // Pre-select the choice matching this slot's division (Integrated),
        // otherwise the first available choice.
        const match = slotServiceLine
          ? c.find((x) => x.toLowerCase() === slotServiceLine.toLowerCase())
          : undefined;
        if (match) setServiceLine(match);
        else if (c.length > 0) setServiceLine(c[0]);
      })
      .catch(console.error);
    const dtPromise = ErnService.getFieldChoices(F.deliverableType)
      .then(setDeliverableChoices)
      .catch(console.error);
    Promise.all([slPromise, dtPromise])
      .then(() => setChoicesLoading(false))
      .catch(() => setChoicesLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const choicesFailed =
    !choicesLoading &&
    serviceLineChoices.length === 0 &&
    deliverableChoices.length === 0;

  const canGoNext =
    !!serviceLine &&
    !!projectNumber.trim() &&
    !!projectName.trim() &&
    !!projectTitle.trim() &&
    !!deliverableType &&
    (contentAction !== "Revise" || !!revisionReason);

  const canSubmit =
    !!engDueDate && !!resource1 && !!checker && !!lead && !saving;

  const handleSubmit = async (): Promise<void> => {
    if (!resource1 || !checker || !lead) return;
    setSaving(true);
    try {
      const payload: IErnCreateData = {
        field_12: "Bid",
        ServiceLine: serviceLine,
        field_28: contentAction,
        RevisionReason: contentAction === "Revise" ? revisionReason : undefined,
        field_14: projectNumber,
        field_15: projectName,
        ProjectTitle: projectTitle,
        field_20: deliverableType,
        field_4: engDueDate ? new Date(engDueDate).toISOString() : "",
        CheckerDueDate: checkerDueDate
          ? new Date(checkerDueDate).toISOString()
          : "",
        LeadDate: leadDate ? new Date(leadDate).toISOString() : "",
        Resource1: resource1.name,
        EmailResource1: resource1.email,
        Resource3: checker.name,
        EmailChecker: checker.email,
        Lead: lead.name,
        LeadEmail: lead.email,
        field_2: description,
      };

      const result = await ErnService.create(payload);

      const linkedBy: IPersonRef | null = currentUser
        ? {
            name: currentUser.displayName,
            email: currentUser.email,
            role: "contributor",
            photoUrl: currentUser.photoUrl || "",
          }
        : null;

      await linkErnToBid(
        bid,
        division,
        {
          ernNumber: result.title,
          ernId: result.id,
          ernStatus: result.status,
          ernDueDate: result.dueDate,
        },
        linkedBy,
        "created",
      );

      addToast({
        type: "success",
        title: "ERN created",
        message: `${result.title} linked to ${bid.bidNumber}.`,
      });
      onCreated(result.title, result.status, result.id);
      onDismiss();
    } catch (err) {
      console.error("ErnCreateModal.handleSubmit failed", err);
      addToast({
        type: "error",
        title: "Failed to create ERN",
        message: "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={onDismiss}>
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.title}>
              Create Engineering Request (ERN)
              {division
                ? ` — ${division === "SURVEY" ? "Survey" : division}`
                : ""}
            </div>
            <div className={styles.subtitle}>
              {bid.bidNumber} · {bid.opportunityInfo?.client || "—"}
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close"
            onClick={onDismiss}
          >
            ×
          </button>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          <span className={page === 1 ? styles.stepActive : styles.step}>
            1 · Request Info
          </span>
          <span className={styles.stepDivider} />
          <span className={page === 2 ? styles.stepActive : styles.step}>
            2 · Schedule &amp; Resources
          </span>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {choicesFailed && (
            <div className={styles.warnBanner}>
              Could not load Service Line / Deliverable Type options from the
              ERN list. Check the list name/field configuration (see console for
              the ErnService warnings).
            </div>
          )}
          {page === 1 ? (
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>Type of Request</span>
                <input className={styles.input} value="Bid" disabled readOnly />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Service Line *</span>
                <select
                  className={styles.input}
                  value={serviceLine}
                  onChange={(e) => setServiceLine(e.target.value)}
                >
                  <option value="">
                    {choicesLoading ? "Loading…" : "Select…"}
                  </option>
                  {serviceLineChoices.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Content Action *</span>
                <select
                  className={styles.input}
                  value={contentAction}
                  onChange={(e) =>
                    setContentAction(e.target.value as "Create" | "Revise")
                  }
                >
                  <option value="Create">Create</option>
                  <option value="Revise">Revise</option>
                </select>
              </label>
              {contentAction === "Revise" && (
                <label className={styles.field}>
                  <span className={styles.label}>Revision Reason *</span>
                  <select
                    className={styles.input}
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                  >
                    <option value="">Select…</option>
                    {ERN_REVISION_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className={styles.field}>
                <span className={styles.label}>Project Number *</span>
                <input
                  className={styles.input}
                  value={projectNumber}
                  onChange={(e) => setProjectNumber(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Project Name *</span>
                <input
                  className={styles.input}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Project Title *</span>
                <input
                  className={styles.input}
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Deliverable Type *</span>
                <select
                  className={styles.input}
                  value={deliverableType}
                  onChange={(e) => setDeliverableType(e.target.value)}
                >
                  <option value="">
                    {choicesLoading ? "Loading…" : "Select…"}
                  </option>
                  {deliverableChoices.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>Eng Due Date *</span>
                <input
                  type="date"
                  className={styles.input}
                  value={engDueDate}
                  onChange={(e) => setEngDueDate(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Checker Due Date</span>
                <input
                  type="date"
                  className={styles.input}
                  value={checkerDueDate}
                  onChange={(e) => setCheckerDueDate(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Lead Date</span>
                <input
                  type="date"
                  className={styles.input}
                  value={leadDate}
                  onChange={(e) => setLeadDate(e.target.value)}
                />
              </label>
              <div className={styles.field}>
                <PeoplePicker
                  label="Resource 1 (Engineer) *"
                  value={resource1}
                  onChange={setResource1}
                />
              </div>
              <div className={styles.field}>
                <PeoplePicker
                  label="Checker *"
                  value={checker}
                  onChange={setChecker}
                />
              </div>
              <div className={styles.field}>
                <PeoplePicker label="Lead *" value={lead} onChange={setLead} />
              </div>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Deliverable Description</span>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={onDismiss}
            disabled={saving}
          >
            Cancel
          </button>
          <div className={styles.footerRight}>
            {page === 2 && (
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => setPage(1)}
                disabled={saving}
              >
                Back
              </button>
            )}
            {page === 1 ? (
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={!canGoNext}
                onClick={() => setPage(2)}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {saving ? "Creating…" : "Create ERN"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
