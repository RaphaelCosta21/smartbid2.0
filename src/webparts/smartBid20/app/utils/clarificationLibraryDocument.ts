/**
 * clarificationLibraryDocument — Builds the Markdown knowledge documents of the
 * Clarif. & Qualif. library (smartBidDocs/Clarifications Library) that AI Search indexes.
 *
 * One `##` section per library entry: the chunk skill emits one chunk per section
 * for this docType, so every entry is retrieved (and embedded) on its own.
 */
import {
  ClarificationBaseType,
  IClarificationDbItem,
} from "../models/IClarificationDb";
import { IDocLibraryMetadata } from "../models/IDocLibraryItem";
import { IQualificationDbItem } from "../models/IQualificationDb";
import { IConfigOption, ISystemConfig } from "../models/ISystemConfig";
import {
  allCategoryOptions,
  cleanClientDocRef,
  configOptionLabel,
} from "./clarificationHelpers";
import { clean, day, heading, record } from "./pastBidDocument";

export const CLARIFICATION_LIBRARY_DOC_TYPE = "Clarification Library";

export const CLARIFICATION_LIBRARY_FILES: Record<
  ClarificationBaseType,
  string
> = {
  Clarification: "Clarifications.md",
  Qualification: "Qualifications.md",
};

/** Below the chunk skill (400K) and Basic tier extraction (512K) limits, with margin. */
export const CLARIFICATION_LIBRARY_WARN_CHARS = 300000;

const TOPIC_MAX_CHARS = 100;
const TOPIC_FALLBACK_WORDS = 12;

const PLURAL: Record<ClarificationBaseType, string> = {
  Clarification: "Clarifications",
  Qualification: "Qualifications",
};

/** "===" would let library text close the backend's reference-material delimiters. */
function safe(value: unknown): string {
  return clean(value).replace(/={3,}/g, "==");
}

function topicOf(item: IClarificationDbItem): string {
  const topic =
    safe(item.etTopic) ||
    safe(item.clarification)
      .split(" ")
      .slice(0, TOPIC_FALLBACK_WORDS)
      .join(" ");
  return truncateTopic(topic);
}

function truncateTopic(topic: string): string {
  return topic.length > TOPIC_MAX_CHARS
    ? `${topic.substring(0, TOPIC_MAX_CHARS).trim()}...`
    : topic;
}

function entry(
  item: IClarificationDbItem,
  config: ISystemConfig | null,
): string {
  const isClarification = item.baseType === "Clarification";
  const label = (list: IConfigOption[] | undefined, v: string): string =>
    safe(configOptionLabel(list, v));
  const body = [
    record(`Type: ${item.baseType}`, [
      ["Category", label(allCategoryOptions(config), item.category)],
      ["Keyword", safe(item.keyword)],
      ["Client", label(config?.clientList, item.client)],
      ["Division", label(config?.divisions, item.division)],
      ["Service line", label(config?.serviceLines, item.serviceLine)],
      ["Source BID", safe(item.sourceBidNumber) || "manual library entry"],
      ["Client document ref", safe(cleanClientDocRef(item.clientDocRef))],
      ["Date", day(item.date)],
      ["Added to library", day(item.created)],
    ]),
    record("", [
      [
        isClarification ? "Text sent to client" : "Qualification text",
        safe(item.clarification),
      ],
    ]),
    record("", [
      [
        "Client reply",
        safe(item.clientReply) || (isClarification ? "none recorded" : ""),
      ],
    ]),
    item.approved ? "- Accepted by client: Yes" : "",
  ];
  return `${heading(2, `${item.baseType} ${item.id} - ${topicOf(item)}`)}\n\n${body
    .filter(Boolean)
    .join("\n")}`;
}

/** One document per type; entries without a topic and text are skipped. */
export function buildClarificationLibraryDocument(
  baseType: ClarificationBaseType,
  items: IClarificationDbItem[],
  config: ISystemConfig | null,
): { text: string; count: number } {
  const entries = items
    .filter(
      (i) =>
        i.baseType === baseType && (clean(i.clarification) || clean(i.etTopic)),
    )
    .sort((a, b) => a.id - b.id)
    .map((i) => entry(i, config));
  const text = [heading(1, `SmartBid ${PLURAL[baseType]} library`)]
    .concat(entries)
    .join("\n\n")
    .concat("\n");
  return { text, count: entries.length };
}

/** "Q" keeps these ids apart from the legacy Qualification rows of the Clarifications Database. */
function qualificationEntry(
  item: IQualificationDbItem,
  config: ISystemConfig | null,
): string {
  const label = (list: IConfigOption[] | undefined, v: string): string =>
    safe(configOptionLabel(list, v));
  const table = safe(item.tableTitle) || "Qualifications";
  const category = label(config?.qualificationCategories, item.category);
  const body = [
    record("Type: Qualification", [
      ["Table", table],
      ["Category", category],
      ["Client", label(config?.clientList, item.client)],
      ["Division", label(config?.divisions, item.division)],
      ["Service line", label(config?.serviceLines, item.serviceLine)],
      ["Source BID", safe(item.sourceBidNumber) || "manual library entry"],
      ["Added to library", day(item.created)],
    ]),
    record("", [["Qualification text", safe(item.qualification)]]),
  ];
  const topic = truncateTopic([table, category].filter(Boolean).join(" - "));
  return `${heading(2, `Qualification Q${item.id} - ${topic}`)}\n\n${body
    .filter(Boolean)
    .join("\n")}`;
}

/**
 * Qualifications.md: the Qualifications Database tables, then the legacy
 * Qualification rows still kept in the Clarifications Database.
 */
export function buildQualificationLibraryDocument(
  items: IQualificationDbItem[],
  legacy: IClarificationDbItem[],
  config: ISystemConfig | null,
): { text: string; count: number } {
  const entries = items
    .filter((i) => clean(i.qualification))
    .sort((a, b) => a.id - b.id)
    .map((i) => qualificationEntry(i, config))
    .concat(
      legacy
        .filter(
          (i) =>
            i.baseType === "Qualification" &&
            (clean(i.clarification) || clean(i.etTopic)),
        )
        .sort((a, b) => a.id - b.id)
        .map((i) => entry(i, config)),
    );
  const text = [heading(1, "SmartBid Qualifications library")]
    .concat(entries)
    .join("\n\n")
    .concat("\n");
  return { text, count: entries.length };
}

export function buildClarificationLibraryMetadata(
  baseType: ClarificationBaseType,
  count: number,
): IDocLibraryMetadata {
  const plural = PLURAL[baseType];
  return {
    title: `SmartBid ${plural} library`,
    docType: CLARIFICATION_LIBRARY_DOC_TYPE,
    groupId: "",
    subGroupId: "",
    category: "",
    manufacturer: "",
    model: "",
    keywords: baseType.toLowerCase(),
    description: `${count} ${plural.toLowerCase()} Oceaneering raised to clients in past BIDs (SmartBid Clarif. & Qualif. library).`,
    revision: "",
  };
}
