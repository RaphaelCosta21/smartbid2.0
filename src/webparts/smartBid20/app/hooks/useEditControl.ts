/**
 * useEditControl — Hook for managing concurrent edit locks on BID sections.
 * Acquires/releases locks via EditControlService.
 * Automatically releases lock on unmount or when section key changes.
 */
import * as React from "react";
import { EditControlService } from "../services/EditControlService";
import { useCurrentUser } from "./useCurrentUser";
import { IEditLock } from "../models";
import { formatDateTime } from "../utils/formatters";

export interface EditControlState {
  /** Whether the current user is actively editing this section */
  isEditing: boolean;
  /** If another user holds the lock, their lock info */
  lockedBy: IEditLock | null;
  /** Whether a lock operation is in progress */
  loading: boolean;
  /** Error message from lock attempt */
  errorMessage: string | null;
  /** Try to acquire the lock and enter edit mode. Returns true if successful. */
  startEditing: () => Promise<boolean>;
  /** Release the lock and exit edit mode. */
  stopEditing: () => Promise<void>;
  /** Dismiss the error/lock message. */
  dismissError: () => void;
}

export function useEditControl(
  bidNumber: string,
  section: string,
): EditControlState {
  const currentUser = useCurrentUser();
  const [isEditing, setIsEditing] = React.useState(false);
  const [lockedBy, setLockedBy] = React.useState<IEditLock | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Refs for cleanup — always track latest values
  const isEditingRef = React.useRef(false);
  const sectionRef = React.useRef(section);
  const bidNumberRef = React.useRef(bidNumber);
  const userEmailRef = React.useRef(currentUser.email);

  isEditingRef.current = isEditing;
  sectionRef.current = section;
  bidNumberRef.current = bidNumber;
  userEmailRef.current = currentUser.email;

  // When section changes (e.g., switching division tabs), release previous lock
  const prevSectionRef = React.useRef(section);
  React.useEffect(() => {
    if (prevSectionRef.current !== section && isEditingRef.current) {
      EditControlService.releaseLock(
        bidNumberRef.current,
        prevSectionRef.current,
        userEmailRef.current,
      ).catch(() => {});
      setIsEditing(false);
      setLockedBy(null);
      setErrorMessage(null);
    }
    prevSectionRef.current = section;
  }, [section]);

  // Cleanup on unmount — release any active lock
  React.useEffect(() => {
    return () => {
      if (isEditingRef.current) {
        EditControlService.releaseLock(
          bidNumberRef.current,
          sectionRef.current,
          userEmailRef.current,
        ).catch(() => {});
      }
    };
  }, []);

  const startEditing = React.useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    setLockedBy(null);
    try {
      const lock: IEditLock = {
        bidNumber,
        section,
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        lockedAt: new Date().toISOString(),
      };
      const result = await EditControlService.acquireLock(lock);
      if (result.success) {
        setIsEditing(true);
        setLoading(false);
        return true;
      } else {
        const existing = result.existingLock;
        setLockedBy(existing || null);
        const lockedTime = existing
          ? formatDateTime(existing.lockedAt)
          : "unknown time";
        setErrorMessage(
          `This section is currently being edited by ${existing?.userName || "another user"} (${existing?.userEmail || ""}) since ${lockedTime}. Please try again later.`,
        );
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error("EditControl: Failed to acquire lock", err);
      setErrorMessage("Failed to check edit lock. Please try again.");
      setLoading(false);
      return false;
    }
  }, [bidNumber, section, currentUser.email, currentUser.displayName]);

  const stopEditing = React.useCallback(async (): Promise<void> => {
    try {
      await EditControlService.releaseLock(
        bidNumber,
        section,
        currentUser.email,
      );
    } catch (err) {
      console.error("EditControl: Failed to release lock", err);
    }
    setIsEditing(false);
    setLockedBy(null);
    setErrorMessage(null);
  }, [bidNumber, section, currentUser.email]);

  const dismissError = React.useCallback(() => {
    setErrorMessage(null);
    setLockedBy(null);
  }, []);

  return {
    isEditing,
    lockedBy,
    loading,
    errorMessage,
    startEditing,
    stopEditing,
    dismissError,
  };
}
