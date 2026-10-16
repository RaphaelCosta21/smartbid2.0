/**
 * pastBidLedger — Resolves which completed BIDs a chat question is about, from
 * SmartBid's own data. Counts, lists and "the latest X" cannot come from top-k
 * search, so the chat sends this ledger plus the most recent matches (refs) for
 * the backend to read in depth.
 */
import { IBid } from "../models";
import { IPastBidChatContext } from "../models/IAiChat";
import { buildCostSummary } from "./costCalculations";
import { formatDate } from "./formatters";
import { getPastBidYear } from "./pastBidDocument";
import {
  getPastBidKbStatus,
  getPastBidSearchText,
  normalizeText,
} from "./pastBidHelpers";

const MAX_LEDGER_ROWS = 60;
const MAX_LEDGER_CHARS = 19000;
const MAX_REFS = 3;
const MAX_ROW_TAGS = 8;
const MIN_TERM_LENGTH = 3;
// Shorter BID numbers would match unrelated digits in the question.
const MIN_NAMED_BID_LENGTH = 5;

function wordSet(words: string): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  words
    .split(/\s+/)
    .filter(Boolean)
    .forEach((w) => (out[w] = true));
  return out;
}

/** Words that mark a question as being about past BIDs; they never filter BIDs. */
const INTENT_WORDS = wordSet(`
  bid bids proposta propostas proposal proposals cotacao cotacoes cotamos orcamento orcamentos
  preco precos price prices priced quote quotes quoted quotation quotations cliente clientes
  client clients escopo scope fizemos fizeram quantos quantas ultimo ultima ultimos ultimas
  latest last past passado passados anterior anteriores previous clarification clarifications
  qualification qualifications clarificacao clarificacoes qualificacao qualificacoes
  ganhamos perdemos won lost outcome resultado resultados
`);

const STOPWORDS = wordSet(`
  que qual quais quem como quando onde quanto quanta para por com sem dos das nos nas num numa
  uns umas pelo pela pelos pelas aos uma foi foram era eram ser sao esta este esse essa isso
  isto aquele aquela aquilo nosso nossa nossos nossas meu minha meus minhas seu sua seus suas
  ele ela eles elas voce voces tem temos tinha tivemos teve houve havia fazer feito feita feitos
  feitas faz fazemos usei usamos usado usada utilizei utilizamos utilizado considerei
  consideramos considerado considerada incluimos incluido mais menos muito muitos todas todos
  toda todo cada entre sobre ate desde apos antes depois tambem ainda agora ano anos mes meses
  dia dias vez vezes lista liste listar mostre mostra mostrar diga dizer qualquer algum alguma
  alguns algumas tipo tipos coisa coisas sim nao neste nesse deste desse nele nela neles nelas
  equipamento equipamentos item itens servico servicos operacao operacoes valor valores custo
  custos the and for with without from into onto that this these those what which who whom
  whose how many much when where why did does done doing have has had having was were are been
  being our ours your you they them their there here any all some each every list show tell
  give find ever also than then just about over under year years month months time times used
  use using can could would should will may might equipment item items service services
  operation operations value values cost costs datasheet datasheets manual manuals manuais
  catalog catalogs catalogo catalogos document documents documento documentos mention
  mentions menciona mencionam
`);

function tokens(normalized: string): string[] {
  return normalized.split(/[^a-z0-9]+/).filter(Boolean);
}

function isYear(token: string): boolean {
  return /^20\d{2}$/.test(token);
}

function questionTerms(text: string): string[] {
  const out: string[] = [];
  tokens(normalizeText(text)).forEach((raw) => {
    if (raw.length < MIN_TERM_LENGTH || isYear(raw)) return;
    if (STOPWORDS[raw] || INTENT_WORDS[raw]) return;
    // Substring matching then covers singular and plural ("multibeams" -> "multibeam").
    const term = raw.length >= 4 && /s$/.test(raw) ? raw.slice(0, -1) : raw;
    if (STOPWORDS[term] || INTENT_WORDS[term]) return;
    if (out.indexOf(term) < 0) out.push(term);
  });
  return out;
}

function questionYears(normalized: string): number[] {
  const now = new Date().getFullYear();
  const years: number[] = [];
  tokens(normalized).forEach((t) => {
    if (isYear(t)) years.push(Number(t));
  });
  if (
    /\b(este|esse|neste|nesse|deste|desse) ano\b|\bthis year\b/.test(normalized)
  ) {
    years.push(now);
  }
  if (/\bano passado\b|\blast year\b/.test(normalized)) years.push(now - 1);
  return years.filter((y, i) => years.indexOf(y) === i);
}

function hasIntent(normalized: string): boolean {
  return (
    tokens(normalized).some((t) => INTENT_WORDS[t]) ||
    /\bhow many\b/.test(normalized)
  );
}

function day(iso: string | null | undefined): string {
  const d = iso ? formatDate(iso, "yyyy-MM-dd") : "";
  return d === "-" ? "" : d;
}

function clean(value: string | null | undefined): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

function ledgerRow(bid: IBid): string {
  const opp = bid.opportunityInfo;
  const p = bid.knowledgeProfile;
  const total = buildCostSummary(bid).totalCostUSD;
  const parts = [
    `BID ${bid.bidNumber}`,
    `Completed ${day(bid.completedDate) || "-"}`,
    opp && opp.client ? `Client ${clean(opp.client)}` : "",
    opp && opp.projectName ? `Project ${clean(opp.projectName)}` : "",
    [bid.division, bid.serviceLine].filter(Boolean).join(" / "),
    p && p.scopeCategories.length
      ? `Scope ${p.scopeCategories.join(", ")}`
      : "",
    p && p.tags.length
      ? `Tags ${p.tags.slice(0, MAX_ROW_TAGS).join(", ")}`
      : "",
    `Outcome ${(bid.bidResult && bid.bidResult.outcome) || "not recorded"}`,
    total
      ? `Total BID cost USD ${total.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
      : "",
    `Knowledge document ${getPastBidKbStatus(bid) === "published" ? "available" : "not available"}`,
  ];
  return `- ${parts.filter(Boolean).join(" | ")}`;
}

function countBy(bids: IBid[], key: (b: IBid) => string): string {
  const counts: Record<string, number> = {};
  const order: string[] = [];
  bids.forEach((b) => {
    const k = key(b) || "unknown";
    if (counts[k] === undefined) {
      counts[k] = 0;
      order.push(k);
    }
    counts[k]++;
  });
  return order.map((k) => `${k}: ${counts[k]}`).join(", ");
}

/**
 * @param question - The question being sent
 * @param previousQuestions - Earlier user questions, oldest first. A follow-up
 *   without its own subject ("and which quotation did we use?") inherits the
 *   subject of the last question that had one.
 * @param bids - All BIDs in the store
 * @returns null when the question is not about past BIDs
 */
export function buildPastBidChatContext(
  question: string,
  previousQuestions: string[],
  bids: IBid[],
): IPastBidChatContext | null {
  const completed = bids.filter((b) => b.currentStatus === "Completed");
  if (!completed.length) return null;

  // A BID number in the question is exact; its digits must not be read as years or terms.
  const normalizedQuestion = normalizeText(question);
  const named = completed.filter((b) => {
    const ref = normalizeText(b.bidNumber || "");
    return (
      ref.length >= MIN_NAMED_BID_LENGTH && normalizedQuestion.indexOf(ref) >= 0
    );
  });
  if (named.length) {
    return {
      ledger: [
        `Today: ${day(new Date().toISOString())}. The question names these completed BIDs:`,
      ]
        .concat(named.map(ledgerRow))
        .join("\n"),
      refs: named
        .filter((b) => getPastBidKbStatus(b) === "published")
        .slice(0, MAX_REFS)
        .map((b) => b.bidNumber),
    };
  }

  let terms = questionTerms(question);
  let subject = question;
  for (let i = previousQuestions.length - 1; i >= 0 && !terms.length; i--) {
    const inherited = questionTerms(previousQuestions[i]);
    if (inherited.length) {
      terms = inherited;
      subject = `${previousQuestions[i]} ${question}`;
    }
  }
  const normalizedSubject = normalizeText(subject);
  let years = questionYears(normalizedQuestion);
  if (!years.length && subject !== question) {
    years = questionYears(normalizedSubject);
  }

  const indexed = completed.map((bid) => {
    const p = bid.knowledgeProfile;
    return {
      bid,
      text: getPastBidSearchText(bid),
      vocabulary: normalizeText(
        [
          bid.opportunityInfo?.client || "",
          p ? p.tags.join(" ") : "",
          p ? p.scopeCategories.join(" ") : "",
          (bid.scopeItems || []).map((s) => s.resourceSubType || "").join(" "),
        ].join(" "),
      ),
    };
  });
  const vocabularyHit = terms.some((t) =>
    indexed.some((i) => i.vocabulary.indexOf(t) >= 0),
  );
  if (!hasIntent(normalizedSubject) && !years.length && !vocabularyHit) {
    return null;
  }

  const inYears = indexed.filter(
    (i) => !years.length || years.indexOf(Number(getPastBidYear(i.bid))) >= 0,
  );
  let matched: IBid[];
  let bestHits = terms.length;
  if (terms.length) {
    const scored = inYears.map((i) => ({
      bid: i.bid,
      hits: terms.filter((t) => i.text.indexOf(t) >= 0).length,
    }));
    bestHits = scored.reduce((m, s) => Math.max(m, s.hits), 0);
    matched = bestHits
      ? scored.filter((s) => s.hits === bestHits).map((s) => s.bid)
      : [];
  } else {
    matched = inYears.map((i) => i.bid);
  }
  matched.sort((a, b) =>
    (b.completedDate || "").localeCompare(a.completedDate || ""),
  );

  const lines: string[] = [
    `Today: ${day(new Date().toISOString())}. Completed BIDs in SmartBid: ${completed.length}.`,
    `Filters understood from the question: ${terms.length ? `terms ${terms.join(", ")}` : "no specific terms"}${years.length ? ` | completion year ${years.join(", ")}` : ""}.`,
    `Matching completed BIDs: ${matched.length}${terms.length > 1 && bestHits && bestHits < terms.length ? ` (none matches every term; these match ${bestHits} of ${terms.length})` : ""}.`,
  ];
  if (matched.length) {
    lines.push(`Per completion year: ${countBy(matched, getPastBidYear)}.`);
    lines.push(
      `Per outcome: ${countBy(matched, (b) => (b.bidResult && b.bidResult.outcome) || "not recorded")}.`,
    );
    lines.push(
      `Rows, most recent first${matched.length > MAX_LEDGER_ROWS ? ` (showing the ${MAX_LEDGER_ROWS} most recent)` : ""}:`,
    );
    matched.slice(0, MAX_LEDGER_ROWS).forEach((b) => lines.push(ledgerRow(b)));
  }

  let ledger = lines.join("\n");
  if (ledger.length > MAX_LEDGER_CHARS) {
    ledger = `${ledger.substring(0, ledger.lastIndexOf("\n", MAX_LEDGER_CHARS))}\n(rows truncated)`;
  }
  const refs = matched
    .filter((b) => getPastBidKbStatus(b) === "published")
    .slice(0, MAX_REFS)
    .map((b) => b.bidNumber);
  return { ledger, refs };
}
