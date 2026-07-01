import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { LinksRecommendationsService } from "../services/LinksRecommendationsService";
import { IBidLink, IBidRecommendation } from "../models/ILinksRecommendations";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { canAccessKnowledge } from "../utils/accessControl";
import { makeId } from "../utils/idGenerator";
import { formatDate } from "../utils/formatters";
import styles from "./LinksRecommendationsPage.module.scss";

type LinkModal = { open: boolean; item: IBidLink | null };
type RecModal = { open: boolean; item: IBidRecommendation | null };

export const LinksRecommendationsPage: React.FC = () => {
  const currentUser = useCurrentUser();
  const canManage = canAccessKnowledge(currentUser);

  const [links, setLinks] = React.useState<IBidLink[]>([]);
  const [recommendations, setRecommendations] = React.useState<
    IBidRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const [linkModal, setLinkModal] = React.useState<LinkModal>({
    open: false,
    item: null,
  });
  const [recModal, setRecModal] = React.useState<RecModal>({
    open: false,
    item: null,
  });
  const [deleteLink, setDeleteLink] = React.useState<IBidLink | null>(null);
  const [deleteRec, setDeleteRec] = React.useState<IBidRecommendation | null>(
    null,
  );

  const load = React.useCallback(() => {
    setIsLoading(true);
    setError("");
    LinksRecommendationsService.getAll()
      .then((data) => {
        setLinks(data.links);
        setRecommendations(data.recommendations);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load links & recommendations:", err);
        setError("Could not load links & recommendations.");
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  // ─── Link handlers ───
  const openNewLink = (): void =>
    setLinkModal({
      open: true,
      item: {
        id: makeId("link"),
        title: "",
        url: "",
        description: "",
        category: "",
        createdBy: currentUser.displayName,
        createdDate: new Date().toISOString(),
      },
    });

  const patchLink = (patch: Partial<IBidLink>): void =>
    setLinkModal((m) => (m.item ? { ...m, item: { ...m.item, ...patch } } : m));

  const submitLink = (): void => {
    if (!linkModal.item) return;
    const item = linkModal.item;
    const exists = links.some((l) => l.id === item.id);
    setSaving(true);
    const op = exists
      ? LinksRecommendationsService.updateLink(item)
      : LinksRecommendationsService.addLink(item);
    op.then(() => {
      setSaving(false);
      setLinkModal({ open: false, item: null });
      load();
    }).catch((err) => {
      console.error("Save link failed:", err);
      setSaving(false);
      setError("Could not save the link.");
    });
  };

  const confirmDeleteLink = (): void => {
    if (!deleteLink) return;
    setSaving(true);
    LinksRecommendationsService.removeLink(deleteLink.id)
      .then(() => {
        setSaving(false);
        setDeleteLink(null);
        load();
      })
      .catch((err) => {
        console.error("Delete link failed:", err);
        setSaving(false);
        setError("Could not delete the link.");
      });
  };

  // ─── Recommendation handlers ───
  const openNewRec = (): void =>
    setRecModal({
      open: true,
      item: {
        id: makeId("rec"),
        title: "",
        content: "",
        createdBy: currentUser.displayName,
        createdDate: new Date().toISOString(),
      },
    });

  const patchRec = (patch: Partial<IBidRecommendation>): void =>
    setRecModal((m) => (m.item ? { ...m, item: { ...m.item, ...patch } } : m));

  const submitRec = (): void => {
    if (!recModal.item) return;
    const item = recModal.item;
    const exists = recommendations.some((r) => r.id === item.id);
    setSaving(true);
    const payload: IBidRecommendation = {
      ...item,
      lastModified: new Date().toISOString(),
    };
    const op = exists
      ? LinksRecommendationsService.updateRecommendation(payload)
      : LinksRecommendationsService.addRecommendation(payload);
    op.then(() => {
      setSaving(false);
      setRecModal({ open: false, item: null });
      load();
    }).catch((err) => {
      console.error("Save recommendation failed:", err);
      setSaving(false);
      setError("Could not save the recommendation.");
    });
  };

  const confirmDeleteRec = (): void => {
    if (!deleteRec) return;
    setSaving(true);
    LinksRecommendationsService.removeRecommendation(deleteRec.id)
      .then(() => {
        setSaving(false);
        setDeleteRec(null);
        load();
      })
      .catch((err) => {
        console.error("Delete recommendation failed:", err);
        setSaving(false);
        setError("Could not delete the recommendation.");
      });
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Links & Recommendations"
        subtitle="Important links and recommendations for the BID sector"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
        }
      />

      {error && (
        <p style={{ color: "var(--danger, #ef4444)", fontSize: 13 }}>{error}</p>
      )}

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading…</span>
        </div>
      ) : (
        <div className={styles.sectionsWrap}>
          {/* ─── Links ─── */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🔗 Important Links</h2>
              {canManage && (
                <button className={styles.addBtn} onClick={openNewLink}>
                  + Add Link
                </button>
              )}
            </div>
            {links.length === 0 ? (
              <div className={styles.emptyWrap}>No links added yet.</div>
            ) : (
              <div className={styles.grid}>
                {links.map((link) => (
                  <div key={link.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{link.title}</h3>
                      {canManage && (
                        <div className={styles.cardActions}>
                          <button
                            className={styles.actionBtn}
                            onClick={() =>
                              setLinkModal({ open: true, item: { ...link } })
                            }
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => setDeleteLink(link)}
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      )}
                    </div>
                    <a
                      className={styles.linkUrl}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.url}
                    </a>
                    {link.description && (
                      <p className={styles.cardDesc}>{link.description}</p>
                    )}
                    <div className={styles.cardMeta}>
                      {link.category && (
                        <span className={styles.catChip}>{link.category}</span>
                      )}
                      <span>
                        {link.createdBy} · {formatDate(link.createdDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Recommendations ─── */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                💡 Recommendations & Notes
              </h2>
              {canManage && (
                <button className={styles.addBtn} onClick={openNewRec}>
                  + Add Recommendation
                </button>
              )}
            </div>
            {recommendations.length === 0 ? (
              <div className={styles.emptyWrap}>
                No recommendations added yet.
              </div>
            ) : (
              <div className={styles.grid}>
                {recommendations.map((rec) => (
                  <div key={rec.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{rec.title}</h3>
                      {canManage && (
                        <div className={styles.cardActions}>
                          <button
                            className={styles.actionBtn}
                            onClick={() =>
                              setRecModal({ open: true, item: { ...rec } })
                            }
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => setDeleteRec(rec)}
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      )}
                    </div>
                    <p className={styles.recContent}>{rec.content}</p>
                    <div className={styles.cardMeta}>
                      <span>
                        {rec.createdBy} · {formatDate(rec.createdDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Link Modal */}
      {linkModal.open && linkModal.item && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {links.some((l) => l.id === linkModal.item!.id)
                  ? "Edit Link"
                  : "Add Link"}
              </h3>
              <button
                className={styles.modalClose}
                onClick={() => setLinkModal({ open: false, item: null })}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Title</label>
                <input
                  className={styles.formInput}
                  value={linkModal.item.title}
                  onChange={(e) => patchLink({ title: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>URL</label>
                <input
                  className={styles.formInput}
                  placeholder="https://..."
                  value={linkModal.item.url}
                  onChange={(e) => patchLink({ url: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Category (optional)</label>
                <input
                  className={styles.formInput}
                  value={linkModal.item.category || ""}
                  onChange={(e) => patchLink({ category: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  value={linkModal.item.description}
                  onChange={(e) => patchLink({ description: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setLinkModal({ open: false, item: null })}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={submitLink}
                disabled={
                  saving || !linkModal.item.title || !linkModal.item.url
                }
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Modal */}
      {recModal.open && recModal.item && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {recommendations.some((r) => r.id === recModal.item!.id)
                  ? "Edit Recommendation"
                  : "Add Recommendation"}
              </h3>
              <button
                className={styles.modalClose}
                onClick={() => setRecModal({ open: false, item: null })}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Title</label>
                <input
                  className={styles.formInput}
                  value={recModal.item.title}
                  onChange={(e) => patchRec({ title: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Content</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 140 }}
                  value={recModal.item.content}
                  onChange={(e) => patchRec({ content: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setRecModal({ open: false, item: null })}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={submitRec}
                disabled={saving || !recModal.item.title}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Link Confirm */}
      {deleteLink && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: 420 }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Delete Link</h3>
              <button
                className={styles.modalClose}
                onClick={() => setDeleteLink(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.confirmText}>
                Delete <strong>{deleteLink.title}</strong>?
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setDeleteLink(null)}
              >
                Cancel
              </button>
              <button
                className={styles.btnDanger}
                onClick={confirmDeleteLink}
                disabled={saving}
              >
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Recommendation Confirm */}
      {deleteRec && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: 420 }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Delete Recommendation</h3>
              <button
                className={styles.modalClose}
                onClick={() => setDeleteRec(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.confirmText}>
                Delete <strong>{deleteRec.title}</strong>?
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setDeleteRec(null)}
              >
                Cancel
              </button>
              <button
                className={styles.btnDanger}
                onClick={confirmDeleteRec}
                disabled={saving}
              >
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
