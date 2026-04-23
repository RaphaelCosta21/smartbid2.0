import * as React from "react";
import { IBid, IBidAttachment, IActivityLogEntry } from "../../models";
import { StatusBadge } from "../common/StatusBadge";
import { GlassCard } from "../common/GlassCard";
import { EmptySection } from "./EmptySection";
import { makeId } from "../../utils/idGenerator";
import { createActivityLogEntry } from "../../utils/activityLogHelpers";
import { formatFileSize, formatDateTime } from "../../utils/formatters";
import styles from "../../pages/BidDetailPage.module.scss";

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
  const [showUpload, setShowUpload] = React.useState(false);
  const [docTitle, setDocTitle] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addActivityEntry = (
    description: string,
    attachments: IBidAttachment[],
  ): IActivityLogEntry =>
    createActivityLogEntry(
      "DOCUMENT_CHANGE",
      description,
      currentUser?.email || "",
      currentUser?.displayName || "",
    );

  const handleUpload = async (): Promise<void> => {
    if (!onSave || selectedFiles.length === 0 || !docTitle.trim()) return;
    setUploading(true);
    try {
      const newAttachments: IBidAttachment[] = selectedFiles.map((file) => ({
        id: makeId("att"),
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        fileType: file.name.split(".").pop() || "",
        uploadedBy: currentUser?.displayName || "",
        uploadedDate: new Date().toISOString(),
        category: docTitle.trim(),
      }));

      const logEntry = addActivityEntry(
        `Documents uploaded: "${docTitle.trim()}" (${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""})`,
        newAttachments,
      );

      onSave({
        attachments: [...(bid.attachments || []), ...newAttachments],
        activityLog: [...(bid.activityLog || []), logEntry],
      });

      setShowUpload(false);
      setDocTitle("");
      setSelectedFiles([]);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = (attId: string): void => {
    if (!onSave) return;
    const att = (bid.attachments || []).find((a) => a.id === attId);
    const logEntry = addActivityEntry(
      `Document deleted: "${att?.fileName || "unknown"}" (${att?.category || ""})`,
      [],
    );
    onSave({
      attachments: (bid.attachments || []).filter((a) => a.id !== attId),
      activityLog: [...(bid.activityLog || []), logEntry],
    });
  };

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

      <GlassCard title="Documents & Attachments">
        {canEdit && (
          <div style={{ marginBottom: 16 }}>
            {!showUpload ? (
              <button
                className={styles.backBtn}
                style={{
                  background: "var(--primary-accent)",
                  color: "#fff",
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
                    📎 Choose Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
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
                    onClick={() => {
                      setShowUpload(false);
                      setDocTitle("");
                      setSelectedFiles([]);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.backBtn}
                    style={{
                      background: "var(--primary-accent)",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={handleUpload}
                    disabled={
                      uploading ||
                      !docTitle.trim() ||
                      selectedFiles.length === 0
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
                  </div>
                </div>
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
                    onClick={() => handleDeleteAttachment(att.id)}
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
    </div>
  );
};
