/**
 * ErnSearchModal — pick an existing (open) ERN created in the external ERN app
 * and link it to a BID slot. No drafts — reads live from SharePoint.
 */
import * as React from "react";
import { IBid, IErn, IPersonRef } from "../../models";
import { ErnService } from "../../services/ErnService";
import { useUIStore } from "../../stores/useUIStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { formatDate } from "../../utils/formatters";
import { ErnDivision, isErnClosed } from "../../utils/ernHelpers";
import { linkErnToBid } from "../../utils/ernLink";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import styles from "./ErnSearchModal.module.scss";

interface ErnSearchModalProps {
  bid: IBid;
  isOpen: boolean;
  /** Division slot for Integrated BIDs (null = single ERN). */
  division?: ErnDivision;
  /** ERN titles already linked to this BID — excluded from the results. */
  excludeTitles?: string[];
  onDismiss: () => void;
  onSelected: (ern: IErn) => void;
}

const ernNum = (title: string): number => {
  const m = /ERN-(\d+)/.exec(title || "");
  return m ? parseInt(m[1], 10) : 0;
};

export const ErnSearchModal: React.FC<ErnSearchModalProps> = ({
  bid,
  isOpen,
  division = null,
  excludeTitles = [],
  onDismiss,
  onSelected,
}) => {
  const addToast = useUIStore((s) => s.addToast);
  const currentUser = useCurrentUser();
  const [erns, setErns] = React.useState<IErn[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [linkingId, setLinkingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setLoading(true);
    setLoadError(false);
    ErnService.getAll()
      .then((all) => {
        setErns(all);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ErnSearchModal load failed", err);
        setLoadError(true);
        setLoading(false);
      });
  }, [isOpen]);

  const filtered = React.useMemo(() => {
    const exclude = new Set(excludeTitles);
    const q = query.toLowerCase().trim();
    return erns
      .filter((e) => !isErnClosed(e.status))
      .filter((e) => !exclude.has(e.title))
      .filter((e) => {
        if (!q) return true;
        return (
          e.title.toLowerCase().indexOf(q) >= 0 ||
          e.projectTitle.toLowerCase().indexOf(q) >= 0 ||
          e.projectNumber.toLowerCase().indexOf(q) >= 0 ||
          e.description.toLowerCase().indexOf(q) >= 0
        );
      })
      .sort((a, b) => ernNum(b.title) - ernNum(a.title));
  }, [erns, excludeTitles, query]);

  if (!isOpen) return null;

  const handleSelect = async (ern: IErn): Promise<void> => {
    setLinkingId(ern.id);
    try {
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
          ernNumber: ern.title,
          ernId: ern.id,
          ernStatus: ern.status,
          ernDueDate: ern.dueDate,
          ernFinishDate: ern.finishDate,
        },
        linkedBy,
      );
      addToast({
        type: "success",
        title: "ERN linked",
        message: `${ern.title} linked to ${bid.bidNumber}.`,
      });
      onSelected(ern);
      onDismiss();
    } catch (err) {
      console.error("ErnSearchModal.handleSelect failed", err);
      addToast({
        type: "error",
        title: "Failed to link ERN",
        message: "Please try again.",
      });
    } finally {
      setLinkingId(null);
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
        <div className={styles.header}>
          <div>
            <div className={styles.title}>
              Select existing ERN
              {division
                ? ` — ${division === "SURVEY" ? "Survey" : division}`
                : ""}
            </div>
            <div className={styles.subtitle}>
              Open ERNs from the Engineering Request app · {bid.bidNumber}
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

        <div className={styles.searchRow}>
          <input
            className={styles.search}
            placeholder="Search by ERN #, project, description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <a
            className={styles.appLink}
            href={SHAREPOINT_CONFIG.ern.appUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open ERN app ↗
          </a>
        </div>

        <div className={styles.body}>
          {loading && <div className={styles.msg}>Loading ERNs…</div>}
          {!loading && loadError && (
            <div className={styles.msg}>
              Could not load ERNs from the list. Check the list name/permissions
              (see console for ErnService warnings).
            </div>
          )}
          {!loading && !loadError && filtered.length === 0 && (
            <div className={styles.msg}>No open ERNs found.</div>
          )}
          {!loading &&
            filtered.map((ern) => (
              <div key={ern.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.ernNumber}>{ern.title}</span>
                  <span className={styles.rowStatus}>{ern.status || "—"}</span>
                </div>
                <div className={styles.rowMeta}>
                  {ern.projectTitle && <span>{ern.projectTitle}</span>}
                  {ern.deliverableType && <span>· {ern.deliverableType}</span>}
                  {ern.dueDate && <span>· Due {formatDate(ern.dueDate)}</span>}
                </div>
                <button
                  type="button"
                  className={styles.selectBtn}
                  disabled={linkingId !== null}
                  onClick={() => handleSelect(ern)}
                >
                  {linkingId === ern.id ? "Linking…" : "Select"}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
