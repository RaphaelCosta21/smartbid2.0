/**
 * Represents an active edit lock on a BID section.
 * Stored as JSON array in smartbid-config EDIT_CONTROL item.
 */
export interface IEditLock {
  /** The BID number being edited */
  bidNumber: string;
  /** Section identifier (e.g., "overview-general", "scope-ROV", "hours") */
  section: string;
  /** Email of the user holding the lock */
  userEmail: string;
  /** Display name of the user holding the lock */
  userName: string;
  /** ISO timestamp when the lock was acquired */
  lockedAt: string;
}
