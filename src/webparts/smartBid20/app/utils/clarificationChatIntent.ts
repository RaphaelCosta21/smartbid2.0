/**
 * clarificationChatIntent — Detects chat questions about clarifications and
 * qualifications, so the backend also reads the Clarif. & Qualif. library.
 */
import { normalizeText } from "./pastBidHelpers";

/** PT/EN word stems, matched on accent-free lower-case text. */
const CLARIFICATION_INTENT =
  /(^|[^a-z])(clarif|esclarec|qualif|premissa|excec|exception|assumption|desvio|deviation|c ?& ?q)/;

/** A follow-up ("and about cranes?") keeps the intent of the previous question. */
export function asksAboutClarifications(
  question: string,
  previousQuestions: string[],
): boolean {
  const last = previousQuestions[previousQuestions.length - 1] || "";
  return [question, last].some((q) =>
    CLARIFICATION_INTENT.test(normalizeText(q)),
  );
}
