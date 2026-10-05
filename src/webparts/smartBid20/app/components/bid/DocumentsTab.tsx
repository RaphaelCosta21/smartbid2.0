import * as React from "react";
import { Paperclip } from "lucide-react";
import { IBid, IBidAttachment, IActivityLogEntry } from "../../models";
import { StatusBadge } from "../common/StatusBadge";
import { GlassCard } from "../common/GlassCard";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { EmptySection } from "./EmptySection";
import { TechnicalProposalChip } from "./TechnicalProposalChip";
import { makeId } from "../../utils/idGenerator";
import { createActivityLogEntry } from "../../utils/activityLogHelpers";
import { formatFileSize, formatDateTime } from "../../utils/formatters";
import {
  getTechnicalProposalAttachment,
  getTechnicalProposalState,
} from "../../utils/technicalProposalHelpers";
import { AttachmentService } from "../../services/AttachmentService";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { useBidStore } from "../../stores/useBidStore";
import { useUIStore } from "../../stores/useUIStore";
import { useTechnicalProposalPublisher } from "../../hooks/useTechnicalProposalPublisher";
import styles from "../../pages/BidDetailPage.module.scss";

const TP_CATEGORY = SHAREPOINT_CONFIG.technicalProposal.attachmentCategory;

const isLocalUrl = (url: string): boolean => !url || url.indexOf("blob:") === 0;

export interface DocumentsTabProps {
  bid: IBid;
  canEdit?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
  currentUser?: { displayName: string; email: string };
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  bid,
  canEdit,
  onSave,
  currentUser,
}) => {
  const addToast = useUIStore((s) => s.addToast);
  const publishTechnicalProposal = useTechnicalProposalPublisher();
  const [showUpload, setShowUpload] = React.useState(false);
  const [docTitle, setDocTitle] = React.useState("");
  const [isTechnicalProposal, setIsTechnicalProposal] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [pendingDelete, setPendingDelete] =
    React.useState<IBidAttachment | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const tp = bid.technicalProposal;
  const tpAttachment = getTechnicalProposalAttachment(bid);
  const tpState = getTechnicalProposalState(bid);
  const category = isTechnicalProposal ? TP_CATEGORY : docTitle.trim();

  const addActivityEntry = (description: string): IActivityLogEntry =>
    createActivityLogEntry(
      "DOCUMENT_CHANGE",
      description,
      currentUser?.email || "",
      currentUser?.displayName || "",
    );

  /** Uploads can take a while; patch on top of the latest BID, not the render-time one. */
  const latestBid = (): IBid =>
    useBidStore.getState().bids.find((b) => b.bidNumber === bid.bidNumber) ||
    bid;

  const resetUploadForm = (): void => {
    setShowUpload(false);
    setDocTitle("");
    setIsTechnicalProposal(false);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (): Promise<void> => {
    if (!onSave || selectedFiles.length === 0 || !category) return;
    if (
      isTechnicalProposal &&
      (selectedFiles.length !== 1 || !/\.pdf$/i.test(selectedFiles[0].name))
    ) {
      addToast({
        type: "warning",
        title: "PDF required",
        message: "The Technical Proposal must be a single PDF file.",
      });
      return;
    }
    setUploading(true);
    const folder = AttachmentService.safeFolderName(category);
    const uploaded: IBidAttachment[] = [];
    const failed: string[] = [];
    try {
      for (const file of selectedFiles) {
        try {
          const result = await AttachmentService.uploadFile(
            bid.bidNumber,
            folder,
            file,
          );
          uploaded.push({
            ...result,
            id: makeId("att"),
            fileType: file.name.split(".").pop() || "",
            uploadedBy: currentUser?.displayName || "",
            category,
          });
        } catch (err) {
          console.error(`Failed to upload "${file.name}":`, err);
          failed.push(file.name);
        }
      }

      if (uploaded.length > 0) {
        const current = latestBid();
        // Same name in the same folder overwrites the file, so replace its entry.
        const replacedUrls = uploaded.map((a) => a.fileUrl);
        const kept = (current.attachments || []).filter(
          (a) => replacedUrls.indexOf(a.fileUrl) < 0,
        );
        const logEntry = addActivityEntry(
          isTechnicalProposal
            ? `Technical Proposal uploaded: "${uploaded[0].fileName}"`
            : `Documents uploaded: "${category}" (${uploaded.length} file${uploaded.length > 1 ? "s" : ""})`,
        );
        onSave({
          attachments: [...kept, ...uploaded],
          activityLog: [...(current.activityLog || []), logEntry],
        });
      }

      if (failed.length > 0) {
        addToast({
          type: "error",
          title: "Upload failed",
          message: `Could not upload to SharePoint: ${failed.join(", ")}`,
        });
        setSelectedFiles(
          selectedFiles.filter((f) => failed.indexOf(f.name) >= 0),
        );
      } else {
        resetUploadForm();
      }
    } finally {
      setUploading(false);
    }
  };

  const confirmDeleteAttachment = (): void => {
    const att = pendingDelete;
    setPendingDelete(null);
    if (!onSave || !att) return;
    const current = latestBid();
    const remaining = (current.attachments || []).filter(
      (a) => a.id !== att.id,
    );
    const logEntry = addActivityEntry(
      `Document deleted: "${att.fileName}" (${att.category || ""})`,
    );
    onSave({
      attachments: remaining,
      activityLog: [...(current.activityLog || []), logEntry],
    });
    const stillReferenced = remaining.some((a) => a.fileUrl === att.fileUrl);
    if (!isLocalUrl(att.fileUrl) && !stillReferenced) {
      AttachmentService.deleteFile(att.fileUrl).catch((err) =>
        console.warn(`Could not delete "${att.fileUrl}" from SharePoint:`, err),
      );
    }
  };

  const handleToggleRequested = (requested: boolean): void => {
    if (!onSave) return;
    const current = latestBid();
    const logEntry = addActivityEntry(
      requested
        ? "Technical Proposal marked as requested"
        : "Technical Proposal marked as not requested",
    );
    onSave({
      technicalProposal: {
        ...(current.technicalProposal || {}),
        requested,
        requestedBy: requested
          ? {
              name: currentUser?.displayName || "",
              email: currentUser?.email || "",
            }
          : null,
        requestedDate: requested ? new Date().toISOString() : null,
      },
      activityLog: [...(current.activityLog || []), logEntry],
    });
  };

  const handlePublish = async (): Promise<void> => {
    setPublishing(true);
    try {
      await publishTechnicalProposal(latestBid());
    } finally {
      setPublishing(false);
    }
  };

  const canPublish =
    !!canEdit && bid.currentStatus === "Completed" && !!tpAttachment;

  return (
    <div className={styles.flexColumn}>
      {/* Commercial Folder Link */}
      {bid.commercialFolderUrl && (
        <GlassCard title="Commercial Folder">
          <div className={styles.docItem}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--secondary-accent)"
              strokeWidth="2"
            >
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            <div className={styles.docItemInfo}>
              <a
                href={bid.commercialFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--primary-accent)",
                  textDecoration: "underline",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Open Commercial Folder in SharePoint
              </a>
              <div className={styles.docItemMeta}>
                Link provided by commercial team at request creation
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard
        title="Technical Proposal"
        actions={<TechnicalProposalChip state={tpState} showRequested />}
      >
        <div className={styles.tpPanel}>
          <div className={styles.tpRow}>
            <span className={styles.tpRowLabel}>Request</span>
            <span>
              {tp?.requested
                ? `Requested${tp.requestedBy?.name ? ` by ${tp.requestedBy.name}` : ""}${tp.requestedDate ? ` · ${formatDateTime(tp.requestedDate)}` : ""}`
                : "Not requested for this BID"}
            </span>
          </div>
          <div className={styles.tpRow}>
            <span className={styles.tpRowLabel}>Proposal PDF</span>
            {tpAttachment ? (
              <span>
                <a
                  href={tpAttachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.tpLink}
                >
                  {tpAttachment.fileName}
                </a>
                {` · ${tpAttachment.uploadedBy ? `${tpAttachment.uploadedBy} · ` : ""}${formatDateTime(tpAttachment.uploadedDate)}`}
              </span>
            ) : (
              <span>
                {tp?.requested
                  ? 'Not attached yet - attach it with "This is the Technical Proposal".'
                  : "Not attached"}
              </span>
            )}
          </div>
          <div className={styles.tpRow}>
            <span className={styles.tpRowLabel}>Knowledge Base</span>
            {tp?.doc?.status === "published" ? (
              <span>
                <a
                  href={tp.doc.serverRelativeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.tpLink}
                >
                  {tp.doc.fileName}
                </a>
                {tp.doc.publishedDate
                  ? ` · ${formatDateTime(tp.doc.publishedDate)}`
                  : ""}
                {tp.aiStatus === "failed" ? " · AI metadata unavailable" : ""}
              </span>
            ) : tp?.doc?.status === "failed" ? (
              <span className={styles.tpError}>
                Copy failed{tp.doc.error ? `: ${tp.doc.error}` : ""}
              </span>
            ) : (
              <span>
                Copied to Technical Proposals when the BID is completed
              </span>
            )}
          </div>
          {canEdit && (
            <div className={styles.tpActions}>
              <label className={styles.tpToggle}>
                <input
                  type="checkbox"
                  checked={!!tp?.requested}
                  onChange={(e) => handleToggleRequested(e.target.checked)}
                />
                Technical Proposal requested
              </label>
              {canPublish && (
                <button
                  className={styles.backBtn}
                  onClick={() => void handlePublish()}
                  disabled={publishing}
                >
                  {publishing
                    ? "Publishing..."
                    : tp?.doc?.status === "published"
                      ? "Republish to Knowledge Base"
                      : tp?.doc?.status === "failed"
                        ? "Retry Knowledge Base copy"
                        : "Publish to Knowledge Base"}
                </button>
              )}
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard title="Documents & Attachments">
        {canEdit && (
          <div style={{ marginBottom: 16 }}>
            {!showUpload ? (
              <button
                className={styles.backBtn}
                style={{
                  background: "var(--primary-accent)",
                  color: "var(--primary-accent-contrast)",
                  border: "none",
                }}
                onClick={() => setShowUpload(true)}
              >
                + Attach Document
              </button>
            ) : (
              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--card-bg-elevated)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <label className={styles.tpAttachToggle}>
                  <input
                    type="checkbox"
                    checked={isTechnicalProposal}
                    onChange={(e) => {
                      setIsTechnicalProposal(e.target.checked);
                      setSelectedFiles([]);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  />
                  This is the Technical Proposal
                </label>
                {isTechnicalProposal ? (
                  <div className={styles.tpLockedCategory}>
                    <span>
                      Category: <strong>{TP_CATEGORY}</strong> · single PDF
                      {tpAttachment
                        ? ` · becomes the current proposal (replaces "${tpAttachment.fileName}")`
                        : ""}
                    </span>
                  </div>
                ) : (
                  <input
                    placeholder="Document title / category..."
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                  />
                )}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    className={styles.backBtn}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "1px dashed var(--border)",
                      background: "transparent",
                      fontSize: 12,
                    }}
                  >
                    <Paperclip size={14} style={{ verticalAlign: "-2px" }} />{" "}
                    {isTechnicalProposal ? "Choose PDF" : "Choose Files"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple={!isTechnicalProposal}
                    accept={
                      isTechnicalProposal ? ".pdf,application/pdf" : undefined
                    }
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const arr: File[] = [];
                        for (let i = 0; i < files.length; i++)
                          arr.push(files[i]);
                        setSelectedFiles(arr);
                      }
                    }}
                  />
                  {selectedFiles.length > 0 && (
                    <span
                      style={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      {selectedFiles.length} file(s) selected
                    </span>
                  )}
                </div>
                {selectedFiles.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {selectedFiles.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "rgba(59,130,246,0.1)",
                          color: "var(--primary-accent)",
                        }}
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    className={styles.backBtn}
                    onClick={resetUploadForm}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.backBtn}
                    style={{
                      background: "var(--primary-accent)",
                      color: "var(--primary-accent-contrast)",
                      border: "none",
                    }}
                    onClick={() => void handleUpload()}
                    disabled={
                      uploading || !category || selectedFiles.length === 0
                    }
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(bid.attachments || []).length === 0 ? (
          <EmptySection message="No documents uploaded yet." />
        ) : (
          <div className={styles.docList}>
            {bid.attachments.map((att) => (
              <div key={att.id} className={styles.docItem}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--secondary-accent)"
                  strokeWidth="2"
                >
                  <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                  <path d="M14 2v6h6" />
                </svg>
                <div className={styles.docItemInfo} style={{ flex: 1 }}>
                  <a
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.docItemName}
                    style={{
                      color: "var(--primary-accent)",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {att.fileName}
                  </a>
                  <div className={styles.docItemMeta}>
                    {att.category} · {formatFileSize(att.fileSize)} ·{" "}
                    {att.uploadedBy} · {formatDateTime(att.uploadedDate)}
                    {isLocalUrl(att.fileUrl)
                      ? " · not stored in SharePoint, please re-upload"
                      : ""}
                  </div>
                </div>
                {tpAttachment?.id === att.id && (
                  <StatusBadge status={TP_CATEGORY} />
                )}
                <StatusBadge
                  status={att.fileType.toUpperCase()}
                  color="var(--primary-accent)"
                />
                {canEdit && (
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--error-color, #EF4444)",
                      cursor: "pointer",
                      fontSize: 14,
                      marginLeft: 8,
                    }}
                    onClick={() => setPendingDelete(att)}
                    title="Remove document"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <ConfirmDialog
        isOpen={!!pendingDelete}
        title="Remove document"
        message={
          pendingDelete && !isLocalUrl(pendingDelete.fileUrl)
            ? `Remove "${pendingDelete.fileName}" from this BID? The file is also deleted from SharePoint.`
            : `Remove "${pendingDelete?.fileName || ""}" from this BID?`
        }
        confirmLabel="Remove"
        variant="danger"
        onConfirm={confirmDeleteAttachment}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};
