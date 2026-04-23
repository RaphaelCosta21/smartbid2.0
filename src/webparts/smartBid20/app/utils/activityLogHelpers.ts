import { IActivityLogEntry } from "../models";
import { makeId } from "./idGenerator";

/**
 * Creates a new activity log entry with a unique ID and current timestamp.
 */
export function createActivityLogEntry(
  type: string,
  description: string,
  actor: string,
  actorName: string,
  metadata?: Record<string, unknown>,
): IActivityLogEntry {
  return {
    id: makeId("log"),
    type,
    timestamp: new Date().toISOString(),
    actor,
    actorName,
    description,
    metadata: metadata || {},
  };
}
