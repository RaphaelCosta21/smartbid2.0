import * as React from "react";
import {
  MessageSquare,
  X,
  Send,
  RefreshCw,
  Sparkles,
  FileText,
  TriangleAlert,
} from "lucide-react";
import { useChatStore } from "../../stores/useChatStore";
import { useBidStore } from "../../stores/useBidStore";
import { useIsGuest } from "../../hooks/useCurrentUser";
import { useResponsive } from "../../hooks/useResponsive";
import { AI_CONFIG, isAiConfigured } from "../../config/ai.config";
import { IChatMessage } from "../../models/IAiChat";
import styles from "./ChatAssistant.module.scss";

const EXAMPLE_QUESTIONS = [
  "Have we done umbilical commissioning before?",
  "Show me the UWILD proposals we submitted",
  "Which cutting tools do we have, and what can they cut?",
];

interface IBubbleProps {
  message: IChatMessage;
  onFollowUp: (question: string) => void;
}

const ChatBubble: React.FC<IBubbleProps> = ({ message, onFollowUp }) => {
  const isUser = message.role === "user";
  const citations = message.citations || [];
  const followUps = message.followUps || [];
  const retrieved = message.retrieved || [];
  const bids = useBidStore((s) => s.bids);

  // Past Bid documents are resolved through the store, never from model-written fields.
  const pastBidByPath = React.useMemo(() => {
    const map: Record<string, string> = {};
    bids.forEach((b) => {
      const doc = b.knowledgeProfile && b.knowledgeProfile.doc;
      if (doc && doc.serverRelativeUrl) {
        map[doc.serverRelativeUrl.toLowerCase()] = b.bidNumber;
      }
    });
    return map;
  }, [bids]);

  const pastBidFor = (url: string): string | undefined => {
    try {
      return pastBidByPath[
        decodeURIComponent(new URL(url).pathname).toLowerCase()
      ];
    } catch {
      return undefined;
    }
  };

  return (
    <div className={`${styles.row} ${isUser ? styles.rowUser : ""}`}>
      <div
        className={`${styles.bubble} ${
          isUser ? styles.bubbleUser : styles.bubbleBot
        } ${message.refused ? styles.bubbleRefused : ""}`}
      >
        <div className={styles.text}>{message.text}</div>

        {citations.length > 0 && (
          <div className={styles.citations}>
            <div className={styles.citationsLabel}>Sources</div>
            {citations.map((c) => {
              const meta = [c.client, c.reference, c.revision, c.detail]
                .filter(Boolean)
                .join(" · ");
              const pastBid = pastBidFor(c.url);
              return (
                <a
                  key={c.url}
                  className={styles.citation}
                  href={
                    pastBid ? `#/bid/${encodeURIComponent(pastBid)}` : c.url
                  }
                  target={pastBid ? undefined : "_blank"}
                  rel={pastBid ? undefined : "noopener noreferrer"}
                  title={
                    pastBid
                      ? `Open BID ${pastBid}`
                      : `${c.title}${c.docType ? ` — ${c.docType}` : ""}`
                  }
                >
                  <FileText size={13} className={styles.citationIcon} />
                  <span className={styles.citationTitle}>{c.title}</span>
                  {meta && (
                    <span className={styles.citationDetail}>{meta}</span>
                  )}
                </a>
              );
            })}
          </div>
        )}

        {!isUser && followUps.length > 0 && (
          <div className={styles.followUps}>
            {followUps.map((f) => (
              <button
                key={f}
                type="button"
                className={styles.followUp}
                onClick={() => onFollowUp(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {!isUser && AI_CONFIG.chat.showRetrievalDebug && (
          <details className={styles.debug}>
            <summary className={styles.debugSummary}>
              Retrieval: {retrieved.length} excerpt
              {retrieved.length === 1 ? "" : "s"}
            </summary>
            {retrieved.length === 0 ? (
              <div className={styles.debugEmpty}>
                The search returned nothing for this question.
              </div>
            ) : (
              retrieved.map((r, i) => (
                <div key={`${r.url}-${i}`} className={styles.debugItem}>
                  <div className={styles.debugTitle}>
                    {i + 1}. {r.title}
                  </div>
                  <div className={styles.debugUrl}>{r.url}</div>
                  <div className={styles.debugSnippet}>{r.snippet}</div>
                </div>
              ))
            )}
          </details>
        )}
      </div>
    </div>
  );
};

export const ChatAssistant: React.FC = () => {
  const isGuest = useIsGuest();
  const { isMobile } = useResponsive();

  const isOpen = useChatStore((s) => s.isOpen);
  const messages = useChatStore((s) => s.messages);
  const isSending = useChatStore((s) => s.isSending);
  const error = useChatStore((s) => s.error);
  const pendingQuestion = useChatStore((s) => s.pendingQuestion);
  const lastActivityAt = useChatStore((s) => s.lastActivityAt);
  const open = useChatStore((s) => s.open);
  const close = useChatStore((s) => s.close);
  const reset = useChatStore((s) => s.reset);
  const send = useChatStore((s) => s.send);
  const retry = useChatStore((s) => s.retry);

  const [draft, setDraft] = React.useState("");
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Idle reset — rescheduled on every interaction, so it fires 10 min after the last one.
  React.useEffect(() => {
    if (!isOpen) return undefined;
    const timer = setTimeout(() => close(), AI_CONFIG.chat.idleResetMs);
    return () => clearTimeout(timer);
  }, [isOpen, lastActivityAt, close]);

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isSending, error]);

  React.useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  React.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);

  const submit = React.useCallback(
    (text: string): void => {
      const question = text.trim();
      if (!question || isSending) return;
      setDraft("");
      void send(question);
    },
    [isSending, send],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(draft);
    }
  };

  if (isGuest || !isAiConfigured()) return null;

  const canSend = draft.trim().length > 0 && !isSending;

  return (
    <>
      {isOpen && (
        <div
          className={`${styles.panel} ${isMobile ? styles.panelMobile : ""}`}
          role="dialog"
          aria-label="SmartBid assistant"
        >
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <Sparkles size={16} className={styles.headerIcon} />
              <span>SmartBid Assistant</span>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={reset}
                disabled={messages.length === 0}
                title="New chat"
                aria-label="New chat"
              >
                <RefreshCw size={15} />
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={close}
                title="Close (Esc)"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className={styles.messages} ref={listRef}>
            {messages.length === 0 && (
              <div className={styles.empty}>
                <p className={styles.emptyLead}>
                  Ask about past proposals, equipment and BID history.
                </p>
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={styles.example}
                    onClick={() => submit(q)}
                  >
                    {q}
                  </button>
                ))}
                <p className={styles.emptyNote}>
                  Answers are grounded in our technical proposals, datasheets,
                  manuals and catalogs — and show the documents they came from.
                </p>
              </div>
            )}

            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} onFollowUp={submit} />
            ))}

            {isSending && (
              <div className={styles.typing} aria-label="Searching documents">
                <span />
                <span />
                <span />
              </div>
            )}

            {error && (
              <div className={styles.error} role="alert">
                <TriangleAlert size={14} className={styles.errorIcon} />
                <span className={styles.errorText}>{error}</span>
                {pendingQuestion && (
                  <button
                    type="button"
                    className={styles.retryBtn}
                    onClick={() => void retry()}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={styles.composer}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={draft}
              rows={1}
              maxLength={AI_CONFIG.chat.maxQuestionChars}
              placeholder="Ask about a proposal, a job or a tool…"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isSending}
            />
            <button
              type="button"
              className={styles.sendBtn}
              onClick={() => submit(draft)}
              disabled={!canSend}
              title="Send (Enter)"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`${styles.fab} ${isOpen && isMobile ? styles.fabHidden : ""}`}
        onClick={isOpen ? close : open}
        title={isOpen ? "Close assistant" : "Ask the SmartBid assistant"}
        aria-label={isOpen ? "Close assistant" : "Ask the SmartBid assistant"}
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </>
  );
};
