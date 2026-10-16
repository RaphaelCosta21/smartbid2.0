/**
 * useChatStore — State for the floating knowledge chat assistant.
 *
 * Conversations live in memory only: closing the panel or 10 minutes of
 * inactivity resets them, and nothing is ever written to storage.
 */
import { create } from "zustand";
import { AIAnalysisService } from "../services/AIAnalysisService";
import { AI_CONFIG } from "../config/ai.config";
import { IChatMessage } from "../models/IAiChat";
import { makeId } from "../utils/idGenerator";
import { asksAboutClarifications } from "../utils/clarificationChatIntent";
import { buildPastBidChatContext } from "../utils/pastBidLedger";
import { useBidStore } from "./useBidStore";

interface ChatState {
  isOpen: boolean;
  messages: IChatMessage[];
  isSending: boolean;
  error: string;
  /** Question awaiting an answer — kept so Retry does not duplicate the bubble. */
  pendingQuestion: string;
  /** Timestamp of the last user interaction, used by the idle reset. */
  lastActivityAt: number;

  open: () => void;
  close: () => void;
  reset: () => void;
  touch: () => void;
  send: (question: string) => Promise<void>;
  retry: () => Promise<void>;
}

let controller: AbortController | undefined;
/** Set by reset() so a request it aborted cannot write back into the fresh state. */
let discardInFlight = false;

export const useChatStore = create<ChatState>((set, get) => {
  const ask = async (): Promise<void> => {
    const cfg = AI_CONFIG.chat;
    const { pendingQuestion, messages } = get();
    if (!pendingQuestion) return;

    // The pending question is always the last bubble; everything before it is history.
    const history = messages.slice(0, -1).slice(-cfg.maxHistoryTurns * 2);

    discardInFlight = false;
    controller = new AbortController();
    const activeController = controller;
    const timer = setTimeout(
      () => activeController.abort(),
      cfg.requestTimeoutMs,
    );
    set({ isSending: true, error: "", lastActivityAt: Date.now() });

    try {
      const previousQuestions = history
        .filter((m) => m.role === "user")
        .map((m) => m.text);
      const pastBids = buildPastBidChatContext(
        pendingQuestion,
        previousQuestions,
        useBidStore.getState().bids,
      );
      const answer = await AIAnalysisService.chat(
        pendingQuestion,
        history,
        activeController.signal,
        pastBids,
        asksAboutClarifications(pendingQuestion, previousQuestions),
      );
      if (discardInFlight) return;
      set({
        messages: [
          ...get().messages,
          {
            id: makeId("chat"),
            role: "assistant",
            text: answer.answer,
            citations: answer.citations,
            retrieved: answer.retrieved,
            refused: answer.refused,
            followUps: answer.followUps,
            createdAt: new Date().toISOString(),
          },
        ],
        isSending: false,
        pendingQuestion: "",
        lastActivityAt: Date.now(),
      });
    } catch (e) {
      if (discardInFlight) return;
      set({
        isSending: false,
        error:
          e instanceof Error
            ? e.message
            : "The assistant could not answer. Please try again.",
        lastActivityAt: Date.now(),
      });
    } finally {
      clearTimeout(timer);
      if (controller === activeController) controller = undefined;
    }
  };

  return {
    isOpen: false,
    messages: [],
    isSending: false,
    error: "",
    pendingQuestion: "",
    lastActivityAt: Date.now(),

    open: () => set({ isOpen: true, lastActivityAt: Date.now() }),

    close: () => {
      get().reset();
      set({ isOpen: false });
    },

    reset: () => {
      discardInFlight = true;
      if (controller) controller.abort();
      controller = undefined;
      set({
        messages: [],
        isSending: false,
        error: "",
        pendingQuestion: "",
        lastActivityAt: Date.now(),
      });
    },

    touch: () => set({ lastActivityAt: Date.now() }),

    send: async (question) => {
      const cfg = AI_CONFIG.chat;
      const { isSending, messages } = get();
      if (isSending) return;

      const text = String(question || "")
        .replace(/\s+/g, " ")
        .trim();
      if (text.length < cfg.minQuestionChars) {
        set({
          error: `Please write at least ${cfg.minQuestionChars} characters.`,
        });
        return;
      }
      const asked = messages.filter((m) => m.role === "user").length;
      if (asked >= cfg.maxMessagesPerSession) {
        set({
          error:
            "This conversation reached its limit. Start a new chat to keep going.",
        });
        return;
      }

      const trimmed = text.substring(0, cfg.maxQuestionChars);
      set({
        messages: [
          ...messages,
          {
            id: makeId("chat"),
            role: "user",
            text: trimmed,
            createdAt: new Date().toISOString(),
          },
        ],
        pendingQuestion: trimmed,
        error: "",
        lastActivityAt: Date.now(),
      });
      await ask();
    },

    retry: async () => {
      if (get().isSending || !get().pendingQuestion) return;
      await ask();
    },
  };
});
