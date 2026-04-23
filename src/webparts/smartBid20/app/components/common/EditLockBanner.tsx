/**
 * EditLockBanner — Shows lock status and provides Edit/Finish Editing controls.
 * Used by BidDetailPage tabs that require concurrent edit control.
 */
import * as React from "react";
import { EditControlState } from "../../hooks/useEditControl";
import styles from "./EditLockBanner.module.scss";

/* ─── Lock Banner (error / lock message) ─── */

export const EditLockBanner: React.FC<{
  message: string;
  onDismiss?: () => void;
}> = ({ message, onDismiss }) => (
  <div className={styles.editLockBanner}>
    <span className={styles.editLockIcon}>🔒</span>
    <span className={styles.editLockText}>{message}</span>
    {onDismiss && (
      <button className={styles.editLockDismiss} onClick={onDismiss}>
        ✕
      </button>
    )}
  </div>
);

/* ─── Edit Toolbar (Edit / Finish Editing buttons + lock banner) ─── */

export const EditToolbar: React.FC<{
  editControl: EditControlState;
  canEdit: boolean;
  label?: string;
}> = ({ editControl, canEdit, label }) => {
  if (!canEdit) return null;

  return (
    <>
      {editControl.errorMessage && (
        <EditLockBanner
          message={editControl.errorMessage}
          onDismiss={editControl.dismissError}
        />
      )}
      <div className={styles.editToolbar}>
        <span
          className={`${styles.editToolbarLabel} ${editControl.isEditing ? styles.editToolbarLabelActive : ""}`}
        >
          {editControl.isEditing ? (
            <span className={styles.editingIndicator}>
              <span className={styles.editPulseDot} />
              Editing {label || "this section"}
            </span>
          ) : (
            label || "Read-only"
          )}
        </span>
        {!editControl.isEditing ? (
          <button
            className={styles.editBtn}
            disabled={editControl.loading}
            onClick={() => editControl.startEditing()}
          >
            {editControl.loading ? "Checking..." : "✏️ Edit"}
          </button>
        ) : (
          <button
            className={styles.finishEditBtn}
            onClick={() => editControl.stopEditing()}
          >
            ✅ Finish Editing
          </button>
        )}
      </div>
    </>
  );
};

/* ─── Editable Tab Content Wrapper ─── */

export const EditableTabContent: React.FC<{
  editControl: EditControlState;
  canEdit: boolean;
  label?: string;
  children: (isEditing: boolean) => React.ReactNode;
}> = ({ editControl, canEdit, label, children }) => {
  const isEditing = canEdit && editControl.isEditing;
  return (
    <div>
      <EditToolbar editControl={editControl} canEdit={canEdit} label={label} />
      {children(isEditing)}
    </div>
  );
};

export default EditLockBanner;
