/**
 * EditLockBanner — Shows lock status and provides Edit/Finish Editing controls.
 * Used by BidDetailPage tabs that require concurrent edit control.
 */
import * as React from "react";
import { Pencil, Check, Lock, Eye } from "lucide-react";
import { EditControlState } from "../../hooks/useEditControl";
import styles from "./EditLockBanner.module.scss";

/* ─── Lock Banner (error / lock message) ─── */

export const EditLockBanner: React.FC<{
  message: string;
  onDismiss?: () => void;
}> = ({ message, onDismiss }) => (
  <div className={styles.editLockBanner}>
    <span className={styles.editLockIcon}>
      <Lock size={16} />
    </span>
    <span className={styles.editLockText}>{message}</span>
    {onDismiss && (
      <button
        className={styles.editLockDismiss}
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        ✕
      </button>
    )}
  </div>
);

/* ─── Edit / Finish Editing button ─── */

const EditActionButton: React.FC<{ editControl: EditControlState }> = ({
  editControl,
}) =>
  !editControl.isEditing ? (
    <button
      type="button"
      className={styles.editBtn}
      disabled={editControl.loading}
      onClick={() => editControl.startEditing()}
    >
      {editControl.loading ? (
        "Checking..."
      ) : (
        <>
          <Pencil size={14} /> Edit
        </>
      )}
    </button>
  ) : (
    <button
      type="button"
      className={styles.finishEditBtn}
      onClick={() => editControl.stopEditing()}
    >
      <Check size={14} /> Finish Editing
    </button>
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
        <EditActionButton editControl={editControl} />
      </div>
    </>
  );
};

/* ─── Compact edit status + button (rendered inside a tab header) ─── */

export interface ITabEditContext {
  editControl: EditControlState;
  canEdit: boolean;
}

/** Lets a tab header render the edit controls of the surrounding EditableTabContent. */
export const TabEditContext = React.createContext<ITabEditContext | null>(null);

export const EditControls: React.FC<ITabEditContext> = ({
  editControl,
  canEdit,
}) => {
  if (!canEdit) {
    return (
      <span className={`${styles.statusPill} ${styles.statusMuted}`}>
        <Eye size={12} /> View only
      </span>
    );
  }
  return (
    <div className={styles.editControls}>
      {editControl.isEditing ? (
        <span className={`${styles.statusPill} ${styles.statusEditing}`}>
          <span className={styles.editPulseDot} /> Editing
        </span>
      ) : (
        <span className={`${styles.statusPill} ${styles.statusMuted}`}>
          <Lock size={12} /> Read-only
        </span>
      )}
      <EditActionButton editControl={editControl} />
    </div>
  );
};

/* ─── Editable Tab Content Wrapper ─── */

export const EditableTabContent: React.FC<{
  editControl: EditControlState;
  canEdit: boolean;
  label?: string;
  onEditChange?: (editing: boolean) => void;
  /** The tab renders the controls itself (via TabEditContext) instead of the toolbar */
  controlsInHeader?: boolean;
  children: (isEditing: boolean) => React.ReactNode;
}> = ({
  editControl,
  canEdit,
  label,
  onEditChange,
  controlsInHeader,
  children,
}) => {
  const isEditing = canEdit && editControl.isEditing;

  React.useEffect(() => {
    if (onEditChange) onEditChange(isEditing);
  }, [isEditing]);

  if (controlsInHeader) {
    return (
      <TabEditContext.Provider value={{ editControl, canEdit }}>
        <div>
          {canEdit && editControl.errorMessage && (
            <EditLockBanner
              message={editControl.errorMessage}
              onDismiss={editControl.dismissError}
            />
          )}
          {children(isEditing)}
        </div>
      </TabEditContext.Provider>
    );
  }

  return (
    <div>
      <EditToolbar editControl={editControl} canEdit={canEdit} label={label} />
      {children(isEditing)}
    </div>
  );
};

export default EditLockBanner;
