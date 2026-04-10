import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import styles from "./FaqPage.module.scss";

interface IFaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: IFaqItem[] = [
  {
    category: "General",
    question: "What is SMART BID 2.0?",
    answer:
      "SMART BID 2.0 is the bid management platform for Oceaneering Brazil Engineering. It manages the full BID lifecycle from request to delivery, including cost estimation, approvals, and follow-up.",
  },
  {
    category: "General",
    question: "Who can access the system?",
    answer:
      "All members of the Engineering and Commercial teams with an Oceaneering account. Access levels depend on your role (Manager, Engineer, Bidder, Project Team, Viewer).",
  },
  {
    category: "BID Process",
    question: "How do I create a new BID request?",
    answer:
      "Navigate to 'New Request' from the sidebar and fill in the multi-step form with client, project, division, and deadline information. The request will be triaged by the bid coordination team.",
  },
  {
    category: "BID Process",
    question: "What are the BID phases?",
    answer:
      "Phase 0: Request → Phase 1: Kick Off → Phase 2: Technical Analysis → Phase 3: Cost Compilation → Phase 4: Review & Approval → Phase 5: Delivery. Each phase has specific RACI tasks.",
  },
  {
    category: "BID Process",
    question: "How does the approval system work?",
    answer:
      "After completing cost compilation, the BID enters the approval phase. Multiple stakeholders can be added to the approval chain. Each must approve or request revision before the BID can be delivered.",
  },
  {
    category: "Templates",
    question: "How do I use equipment templates?",
    answer:
      "Go to Templates from the sidebar, browse available templates by division, and import them into your BID from the equipment tab. Templates include pre-configured equipment lists and costs.",
  },
  {
    category: "Reports",
    question: "Can I export BID data?",
    answer:
      "Yes! From the Reports page you can export to CSV. Each BID detail page also has an export tab for individual BID data including equipment, hours, and cost summaries.",
  },
  {
    category: "Troubleshooting",
    question: "What if the system is slow?",
    answer:
      "Try refreshing the page. If the issue persists, check your internet connection. The system caches data locally for performance. Contact IT if problems continue.",
  },
];

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<string>("all");
  const categories = [
    "all",
    ...Array.from(new Set(FAQ_ITEMS.map((f) => f.category))),
  ];

  const filtered =
    filter === "all"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((f) => f.category === filter);

  return (
    <div className={styles.page}>
      <PageHeader
        title="FAQ"
        subtitle="Frequently asked questions and support"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        }
      />

      <div className={styles.tabBar}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`${styles.tabBtn} ${filter === c ? styles.tabBtnActive : ""}`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <div className={styles.faqList}>
        {filtered.map((faq, i) => {
          const globalIdx = FAQ_ITEMS.indexOf(faq);
          const isOpen = openIndex === globalIdx;
          return (
            <div key={globalIdx} className={styles.faqItem}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                className={styles.faqQuestion}
              >
                <div className={styles.faqQuestionContent}>
                  <span className={styles.faqCategory}>{faq.category}</span>
                  {faq.question}
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isOpen && <div className={styles.faqAnswer}>{faq.answer}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
