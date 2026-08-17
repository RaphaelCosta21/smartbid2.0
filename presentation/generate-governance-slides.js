/*
 * SmartBid 2.0 — AI Governance Review Deck Generator
 * Generates: SmartBid-2.0-AI-Governance-Review.pptx
 * Run: npm install && node generate-governance-slides.js
 *
 * Purpose-built for the AI Governance Review meeting (host: Clint Coker,
 * AI Governance & Adoption). Covers the 8 review topics + the EA Intake Form
 * content, and directly addresses the Level-One approval comments
 * (Brazil in-country data + duplication review).
 *
 * Matches the existing leadership-deck visual style (palette, font, helpers).
 */
const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in (16:9)
pptx.author = "Raphael Costa";
pptx.company = "Oceaneering International";
pptx.title = "SmartBid 2.0 — AI Governance Review";

// ---- Palette (matches existing leadership deck) ----
const C = {
  navy: "0B2E4F",
  navy2: "13324F",
  teal: "1CA9C9",
  tealDark: "0E7C93",
  white: "FFFFFF",
  light: "F3F6F9",
  text: "1F2937",
  muted: "6B7280",
  orange: "F97316",
  green: "16A34A",
  greenBg: "E7F7EE",
  amber: "F59E0B",
  amberBg: "FEF6E4",
  blue: "3B82F6",
  blueBg: "E7F0FE",
  purple: "7C3AED",
  purpleBg: "F0EAFE",
  border: "D5DEE6",
};

const FONT = "Segoe UI";
const W = 13.33;
const H = 7.5;

// ---- Helpers ----
function footer(slide, pageNo) {
  slide.addText(
    "SmartBid 2.0  ·  AI Governance Review  ·  Oceaneering Brazil Engineering",
    {
      x: 0.4,
      y: H - 0.4,
      w: 10,
      h: 0.3,
      fontFace: FONT,
      fontSize: 9,
      color: C.muted,
      align: "left",
    },
  );
  slide.addText(String(pageNo), {
    x: W - 0.9,
    y: H - 0.4,
    w: 0.5,
    h: 0.3,
    fontFace: FONT,
    fontSize: 9,
    color: C.muted,
    align: "right",
  });
}

function sectionHeader(slide, title, kicker) {
  slide.background = { color: C.white };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: 1.15,
    fill: { color: C.navy },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1.15,
    w: W,
    h: 0.08,
    fill: { color: C.teal },
  });
  if (kicker) {
    slide.addText(kicker.toUpperCase(), {
      x: 0.5,
      y: 0.18,
      w: 12,
      h: 0.3,
      fontFace: FONT,
      fontSize: 11,
      color: C.teal,
      bold: true,
      charSpacing: 2,
    });
  }
  slide.addText(title, {
    x: 0.5,
    y: 0.44,
    w: 12.3,
    h: 0.6,
    fontFace: FONT,
    fontSize: 24,
    color: C.white,
    bold: true,
  });
}

function bullets(items) {
  return items.map((t) => ({
    text: t.text !== undefined ? t.text : t,
    options: {
      bullet: t.sub ? { indent: 20 } : { code: "2022", indent: 15 },
      indentLevel: t.sub ? 1 : 0,
      fontFace: FONT,
      fontSize: t.sub ? 14 : 16,
      color: t.color || C.text,
      bold: !!t.bold,
      paraSpaceAfter: 8,
    },
  }));
}

// ---- Card (rounded rect with colored header + bullet body) ----
function card(slide, opts) {
  const {
    x,
    y,
    w,
    h,
    headColor,
    headText,
    headTextColor = C.white,
    bodyBg = C.white,
    lines = [],
    lineColor = C.text,
    lineSize = 13,
    headSize = 14,
  } = opts;

  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: bodyBg },
    line: { color: C.border, width: 1 },
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.52,
    rectRadius: 0.08,
    fill: { color: headColor },
    line: { color: headColor, width: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y: y + 0.26,
    w,
    h: 0.26,
    fill: { color: headColor },
    line: { color: headColor, width: 0 },
  });
  slide.addText(headText, {
    x: x + 0.15,
    y: y + 0.02,
    w: w - 0.3,
    h: 0.5,
    fontFace: FONT,
    fontSize: headSize,
    color: headTextColor,
    bold: true,
    valign: "middle",
  });
  slide.addText(
    lines.map((l) => ({
      text: l.text !== undefined ? l.text : l,
      options: {
        bullet: { code: "2022", indent: 14 },
        fontFace: FONT,
        fontSize: lineSize,
        color: (l && l.color) || lineColor,
        bold: !!(l && l.bold),
        paraSpaceAfter: 6,
      },
    })),
    { x: x + 0.2, y: y + 0.68, w: w - 0.4, h: h - 0.85, valign: "top" },
  );
}

// Chevron pill used in flow diagrams
function flowBox(slide, x, y, w, h, text, color) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color },
  });
  slide.addText(text, {
    x,
    y,
    w,
    h,
    align: "center",
    valign: "middle",
    fontFace: FONT,
    fontSize: 13,
    bold: true,
    color: C.white,
  });
}

// =========================================================
// SLIDE 1 — Title
// =========================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.navy };
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 4.55,
    w: W,
    h: 0.08,
    fill: { color: C.teal },
  });
  s.addText("SmartBid 2.0", {
    x: 0.7,
    y: 1.9,
    w: 12,
    h: 1.0,
    fontFace: FONT,
    fontSize: 52,
    color: C.white,
    bold: true,
  });
  s.addText("AI Governance Review", {
    x: 0.7,
    y: 3.0,
    w: 12,
    h: 0.7,
    fontFace: FONT,
    fontSize: 26,
    color: C.teal,
    bold: true,
  });
  s.addText(
    [
      { text: "Requestor: ", options: { bold: true } },
      { text: "Raphael Costa — BID Proposals Engineer", options: {} },
    ],
    {
      x: 0.7,
      y: 4.85,
      w: 12,
      h: 0.4,
      fontFace: FONT,
      fontSize: 15,
      color: C.white,
    },
  );
  s.addText("Division: SSR-OPG Engineering, Oceaneering Brazil", {
    x: 0.7,
    y: 5.3,
    w: 12,
    h: 0.4,
    fontFace: FONT,
    fontSize: 15,
    color: "C7D3DE",
  });
  s.addText(
    "AI System Scorecard · Enterprise Architecture · Risks & Controls · Approval Path",
    {
      x: 0.7,
      y: 6.05,
      w: 12,
      h: 0.4,
      fontFace: FONT,
      fontSize: 13,
      color: "9FB2C4",
    },
  );
}

// =========================================================
// SLIDE 2 — Agenda (8 review topics)
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Agenda — Review Topics", "What We Will Cover");
  const left = [
    { text: "1 · AI System information & intended business use", bold: true },
    { text: "2 · Use cases, objectives & expected value", bold: true },
    {
      text: "3 · Enterprise Architecture feedback & recommendations",
      bold: true,
    },
    {
      text: "4 · AI System Scorecard results & governance actions",
      bold: true,
    },
  ];
  const right = [
    { text: "5 · Delivery approach & adoption expectations", bold: true },
    {
      text: "6 · Performance measures, benefits & success criteria",
      bold: true,
    },
    { text: "7 · Risks, controls & compliance requirements", bold: true },
    {
      text: "8 · AI Tools Committee review & approval requirements",
      bold: true,
    },
  ];
  s.addText(bullets(left), { x: 0.6, y: 1.6, w: 6.1, h: 5.2, valign: "top" });
  s.addText(bullets(right), { x: 6.9, y: 1.6, w: 6.0, h: 5.2, valign: "top" });
  footer(s, 2);
}

// =========================================================
// SLIDE 3 — Topic 1: AI System Information & Intended Business Use
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "AI System Information & Intended Use", "Topic 1");
  s.addText(
    bullets([
      { text: "What it is", bold: true, color: C.tealDark },
      {
        text: "SmartBid 2.0 — an existing SPFx web part already in use on SharePoint Online for managing engineering BID requests.",
        sub: true,
      },
      { text: "What we are adding", bold: true, color: C.tealDark },
      {
        text: "An AI-assisted step using Azure OpenAI (GPT-4o-mini) to accelerate document processing inside the existing BID workflow.",
        sub: true,
      },
      { text: "Intended business use", bold: true, color: C.tealDark },
      {
        text: "Extract supplier quotation data, structure Scope of Supply from technical documents, and enable smart search over past bids & datasheets.",
        sub: true,
      },
      { text: "Guardrails", bold: true, color: C.orange },
      {
        text: "Human-in-the-loop always confirms before saving · no personal data · manual entry remains as fallback.",
        sub: true,
      },
    ]),
    { x: 0.6, y: 1.5, w: 12.2, h: 5.4, valign: "top" },
  );
  footer(s, 3);
}

// =========================================================
// SLIDE 4 — Topic 2: Use Cases, Objectives & Expected Value
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Use Cases, Objectives & Value", "Topic 2");
  card(s, {
    x: 0.5,
    y: 1.5,
    w: 4.03,
    h: 4.8,
    headColor: C.navy,
    headText: "1 · Quotation Extraction",
    bodyBg: C.light,
    lines: [
      "Upload supplier PDF → AI fills item, qty, unit cost, currency, lead time, supplier",
      "~15-min task → <3 min (review only)",
      "Eliminates manual transcription",
    ],
  });
  card(s, {
    x: 4.65,
    y: 1.5,
    w: 4.03,
    h: 4.8,
    headColor: C.tealDark,
    headText: "2 · Scope of Supply Analysis",
    bodyBg: C.light,
    lines: [
      "AI reads Engineering Technical (ET) documents (50–200 pages)",
      "Suggests scope structure & maps equipment to categories",
      "Cross-references cataloged datasheets",
    ],
  });
  card(s, {
    x: 8.8,
    y: 1.5,
    w: 4.03,
    h: 4.8,
    headColor: C.teal,
    headText: "3 · Smart Search (RAG)",
    bodyBg: C.light,
    lines: [
      "Semantic search over datasheets & previous bids",
      "Azure AI Search + embeddings",
      "Faster, standardized, auditable proposals",
    ],
  });
  s.addText(
    "Objective: reduce BID preparation time by 40–60% · 100+ BID requests/year · faster, standardized client turnaround.",
    {
      x: 0.6,
      y: 6.45,
      w: 12.2,
      h: 0.5,
      fontFace: FONT,
      fontSize: 13,
      color: C.muted,
      italic: true,
      align: "center",
    },
  );
  footer(s, 4);
}

// =========================================================
// SLIDE 5 — How It Works (Data Flow)
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "How It Works — Data Flow", "Topic 3 · Solution Overview");
  const y = 1.9,
    bh = 1.1;
  flowBox(s, 0.6, y, 2.3, bh, "SmartBid\n(Browser)", C.navy);
  flowBox(s, 3.35, y, 2.3, bh, "pdf.js Text\nExtraction", C.navy2);
  flowBox(s, 6.1, y, 2.5, bh, "Secure Backend\n(Function / APIM)", C.tealDark);
  flowBox(
    s,
    9.05,
    y,
    3.7,
    bh,
    "Azure OpenAI + AI Search\n(GPT-4o-mini · RAG)",
    C.teal,
  );
  [2.9, 5.65, 8.6].forEach((ax) => {
    s.addText("→", {
      x: ax,
      y,
      w: 0.45,
      h: bh,
      align: "center",
      valign: "middle",
      fontFace: FONT,
      fontSize: 26,
      bold: true,
      color: C.teal,
    });
  });
  s.addText(
    bullets([
      "Text is extracted in the browser; only text + a structured prompt are sent to the backend.",
      "The backend validates the request, retrieves the credential from Key Vault, and calls Azure OpenAI / AI Search.",
      "A structured JSON result is returned to SmartBid for human review and confirmation.",
      {
        text: "Only reviewed & approved data is saved to SharePoint. Manual entry remains available as fallback.",
        bold: true,
        color: C.tealDark,
      },
    ]),
    { x: 0.6, y: 3.5, w: 12.2, h: 3.1, valign: "top" },
  );
  footer(s, 5);
}

// =========================================================
// SLIDE 6 — AI Architecture — Secure by Design
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "AI Architecture — Secure by Design", "Topic 3 · EA");
  card(s, {
    x: 0.5,
    y: 1.5,
    w: 6.0,
    h: 2.35,
    headColor: C.navy,
    headText: "Identity & Secrets",
    bodyBg: C.light,
    lines: [
      "No API key in frontend, SharePoint, or source code",
      "Credential stored in Azure Key Vault, read via Managed Identity",
      "All calls authenticated with Entra ID (same SSO / MFA)",
    ],
  });
  card(s, {
    x: 6.7,
    y: 1.5,
    w: 6.1,
    h: 2.35,
    headColor: C.tealDark,
    headText: "Backend Broker",
    bodyBg: C.light,
    lines: [
      "Azure Function / API Management brokers every AI call",
      "The web part never calls Azure OpenAI directly",
      "Validates the user request and applies controls",
    ],
  });
  card(s, {
    x: 0.5,
    y: 4.05,
    w: 6.0,
    h: 2.35,
    headColor: C.teal,
    headText: "Observability",
    bodyBg: C.light,
    lines: [
      "Application Insights — usage, errors, latency",
      "Log Analytics Workspace — centralized logging & audit",
      "Full traceability of AI requests",
    ],
  });
  card(s, {
    x: 6.7,
    y: 4.05,
    w: 6.1,
    h: 2.35,
    headColor: C.orange,
    headText: "Data & Fallback",
    bodyBg: C.light,
    lines: [
      "Documents & approved data stay in SharePoint / M365",
      "Azure OpenAI does NOT use our data to train models",
      "Human-in-the-loop; manual entry as fallback",
    ],
  });
  footer(s, 6);
}

// =========================================================
// SLIDE 7 — Azure Resources (in scope)
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Azure Resources (In Scope)", "Topic 3 · Provisioned by IT");
  const items = [
    ["Azure OpenAI (GPT-4o-mini)", "Extraction & analysis model"],
    ["Embeddings model", "Vectorize documents for smart search"],
    ["Azure AI Search", "Index & retrieve datasheets and past bids"],
    ["Azure Function / APIM", "Secure backend broker for all AI calls"],
    ["Azure Key Vault", "Secure credential storage (Managed Identity)"],
    ["Application Insights", "Telemetry, errors, performance"],
    ["Log Analytics Workspace", "Centralized logging & audit"],
  ];
  const rows = items.map((it) => [
    {
      text: it[0],
      options: {
        bold: true,
        color: C.navy,
        fontFace: FONT,
        fontSize: 13,
        valign: "middle",
      },
    },
    {
      text: it[1],
      options: {
        color: C.text,
        fontFace: FONT,
        fontSize: 13,
        valign: "middle",
      },
    },
  ]);
  s.addTable(rows, {
    x: 0.6,
    y: 1.55,
    w: 12.1,
    colW: [4.2, 7.9],
    rowH: 0.6,
    border: { type: "solid", color: C.border, pt: 1 },
    fill: { color: C.white },
    valign: "middle",
  });
  s.addText(
    "All resources provisioned and owned by IT in the corporate Azure subscription. Azure OpenAI deployed in Brazil (Brazil South) — same location as the users.",
    {
      x: 0.6,
      y: 6.35,
      w: 12.2,
      h: 0.6,
      fontFace: FONT,
      fontSize: 12.5,
      color: C.muted,
      italic: true,
      align: "center",
    },
  );
  footer(s, 7);
}

// =========================================================
// SLIDE 8 — Architecture Recap (End to End)
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(
    s,
    "Architecture Recap — End to End",
    "Topic 3 · Request Lifecycle",
  );
  const steps = [
    [
      "1",
      "Upload",
      "The engineer uploads the client technical document inside SmartBid.",
      C.navy,
    ],
    [
      "2",
      "Extract in the browser (pdf.js)",
      "Text is extracted client-side — the file never leaves the browser.",
      C.navy2,
    ],
    [
      "3",
      "Secure backend (Function / APIM)",
      "Entra ID-authenticated call; Key Vault provides the credential via Managed Identity.",
      C.tealDark,
    ],
    [
      "4",
      "Retrieve + Generate",
      "AI Search retrieves relevant datasheets & past bids (RAG); Azure OpenAI (GPT-4o-mini) returns a structured Scope of Supply.",
      C.tealDark,
    ],
    [
      "5",
      "Review & Save",
      "The engineer reviews and confirms; only approved data is saved to SharePoint. Manual entry remains as fallback.",
      C.teal,
    ],
  ];
  const sx = 0.6,
    sw = 12.2,
    rh = 0.9,
    gap = 0.12,
    sy = 1.5;
  steps.forEach((st, i) => {
    const y = sy + i * (rh + gap);
    s.addShape(pptx.ShapeType.roundRect, {
      x: sx,
      y,
      w: 0.9,
      h: rh,
      rectRadius: 0.08,
      fill: { color: st[3] },
    });
    s.addText(st[0], {
      x: sx,
      y,
      w: 0.9,
      h: rh,
      align: "center",
      valign: "middle",
      fontFace: FONT,
      fontSize: 26,
      bold: true,
      color: C.white,
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: sx + 1.05,
      y,
      w: sw - 1.05,
      h: rh,
      rectRadius: 0.08,
      fill: { color: C.light },
      line: { color: C.border, width: 1 },
    });
    s.addText(
      [
        {
          text: st[1] + "  ",
          options: { bold: true, color: C.navy, fontFace: FONT, fontSize: 14 },
        },
        {
          text: st[2],
          options: { color: C.text, fontFace: FONT, fontSize: 12.5 },
        },
      ],
      {
        x: sx + 1.25,
        y,
        w: sw - 1.5,
        h: rh,
        valign: "middle",
        align: "left",
      },
    );
  });
  s.addText(
    "pdf.js runs client-side (no OCR for scanned PDFs) — human review + manual entry cover the edge cases. No new Azure resource required.",
    {
      x: 0.6,
      y: 6.55,
      w: 12.2,
      h: 0.4,
      fontFace: FONT,
      fontSize: 12,
      color: C.muted,
      italic: true,
      align: "center",
    },
  );
  footer(s, 8);
}

// =========================================================
// SLIDE 9 — Knowledge Base (RAG "Brain")
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(
    s,
    "Knowledge Base — How the AI Learns",
    "Topic 3 · Retrieval (RAG)",
  );
  const ky = 1.9,
    kbh = 1.1;
  const boxes = [
    ["SharePoint\nFolder", C.navy],
    ["Extract\nText", C.navy2],
    ["Chunk", C.tealDark],
    ["Embeddings\n(Azure OpenAI)", C.tealDark],
    ["Azure AI\nSearch Index", C.teal],
  ];
  const bw = 2.0,
    slot = 0.36;
  let bx = 0.95;
  boxes.forEach((b, i) => {
    flowBox(s, bx, ky, bw, kbh, b[0], b[1]);
    if (i < boxes.length - 1) {
      s.addText("→", {
        x: bx + bw,
        y: ky,
        w: slot,
        h: kbh,
        align: "center",
        valign: "middle",
        fontFace: FONT,
        fontSize: 22,
        bold: true,
        color: C.teal,
      });
    }
    bx += bw + slot;
  });
  s.addText(
    bullets([
      "Datasheets & manuals already live in a SharePoint folder — no new data store.",
      "An ingestion process (inside the same backend Function — no new resource) turns them into searchable vectors.",
      "Runs automatically on upload / update, or as a scheduled batch.",
      "Start with a single AI Search index; split later only if governance or volume requires.",
      {
        text: "Scope generation queries this index (RAG) so suggestions are grounded in Oceaneering's own catalog & past bids.",
        bold: true,
        color: C.tealDark,
      },
    ]),
    { x: 0.6, y: 3.5, w: 12.2, h: 3.0, valign: "top" },
  );
  footer(s, 9);
}

// =========================================================
// SLIDE 10 — Data Governance & Brazil Residency
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(
    s,
    "Data Governance & Brazil Residency",
    "Topic 4 & 7 · In-Country",
  );
  card(s, {
    x: 0.5,
    y: 1.5,
    w: 6.0,
    h: 4.9,
    headColor: C.navy,
    headText: "Data Classification",
    bodyBg: C.light,
    lineSize: 13.5,
    lines: [
      {
        text: "No personal data processed",
        bold: true,
        color: C.green,
      },
      "Client BID requisitions are customer data, often under NDA (AUP §7.6)",
      "Handled via explicit written approval + information-owner sign-off",
      "Supplier quotation data: item descriptions, prices, lead times, specs",
      "ITAR / Export-Controlled / CUI content excluded, with user attestation at upload",
    ],
  });
  card(s, {
    x: 6.7,
    y: 1.5,
    w: 6.1,
    h: 4.9,
    headColor: C.tealDark,
    headText: "Residency & Handling",
    bodyBg: C.light,
    lineSize: 13.5,
    lines: [
      {
        text: "Azure OpenAI deployed in Brazil (Brazil South)",
        bold: true,
        color: C.tealDark,
      },
      "Runs inside Oceaneering's own Azure tenant — data does not leave the Oceaneering environment",
      "No external model / web / plug-ins; not used to train models or shared with OpenAI",
      "Documents & approved records remain in SharePoint / M365",
      "Addresses the approval note: “In-Country requirements for Brazil data” — confirmed",
    ],
  });
  footer(s, 10);
}

// =========================================================
// SLIDE 11 — Enterprise Architecture Feedback & Governance Actions
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(
    s,
    "EA Feedback & Governance Actions",
    "Topic 3 & 4 · Approval Notes",
  );
  s.addText(
    [
      {
        text: "Status: ",
        options: { bold: true, color: C.navy, fontFace: FONT, fontSize: 15 },
      },
      {
        text: "Enterprise Architecture — Approved with Conditions (Level One approved by Todd Moran, 02/07/2026).",
        options: { color: C.text, fontFace: FONT, fontSize: 15 },
      },
    ],
    { x: 0.6, y: 1.4, w: 12.2, h: 0.5 },
  );
  card(s, {
    x: 0.5,
    y: 2.1,
    w: 6.0,
    h: 4.3,
    headColor: C.amber,
    headText: "Action 1 · Duplication Review",
    headTextColor: C.navy,
    bodyBg: C.amberBg,
    lineColor: "7C4A03",
    lineSize: 13.5,
    lines: [
      {
        text: "Note: review for duplication with ET and other requirements-hashing applications.",
        bold: true,
      },
      "SmartBid is BID-proposal specific to Brazil Engineering",
      "AI scope = quotation extraction + scope structuring — not a general requirements-management tool",
      "Action: confirm no functional overlap with IT before go-live",
    ],
  });
  card(s, {
    x: 6.7,
    y: 2.1,
    w: 6.1,
    h: 4.3,
    headColor: C.green,
    headText: "Action 2 · In-Country Data",
    bodyBg: C.greenBg,
    lineColor: "0B5A2B",
    lineSize: 13.5,
    lines: [
      {
        text: "Note: confirm In-Country requirements for Brazil data (not expected).",
        bold: true,
      },
      "Azure OpenAI deployed in Brazil South",
      "Data stays in-country, co-located with the users",
      "Status: confirmed — no additional in-country constraint identified",
    ],
  });
  footer(s, 11);
}

// =========================================================
// SLIDE 12 — AI System Scorecard Inputs
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "AI System Scorecard — Inputs", "Topic 4");
  const rows = [
    [
      "Data sensitivity",
      "No personal data; customer docs (NDA) under §7.6 — written approval",
    ],
    [
      "Human oversight",
      "Human-in-the-loop; nothing saved without engineer confirmation",
    ],
    [
      "Model & vendor",
      "Azure OpenAI GPT-4o-mini — approved platform, no new vendor",
    ],
    [
      "Security",
      "No key in frontend; Key Vault + Managed Identity; Entra ID auth",
    ],
    [
      "Monitoring",
      "Application Insights + Log Analytics (usage, errors, audit)",
    ],
    [
      "Reliability / accuracy",
      ">85% extraction accuracy target; manual fallback available",
    ],
    [
      "Residency",
      "Brazil South; data stays in-country; not used for model training",
    ],
  ];
  const header = [
    {
      text: "Dimension",
      options: {
        bold: true,
        color: C.white,
        fill: { color: C.navy },
        fontFace: FONT,
        fontSize: 13,
      },
    },
    {
      text: "Our position",
      options: {
        bold: true,
        color: C.white,
        fill: { color: C.navy },
        fontFace: FONT,
        fontSize: 13,
      },
    },
  ];
  const body = rows.map((r) => [
    {
      text: r[0],
      options: {
        bold: true,
        color: C.navy,
        fontFace: FONT,
        fontSize: 12.5,
        valign: "middle",
      },
    },
    {
      text: r[1],
      options: {
        color: C.text,
        fontFace: FONT,
        fontSize: 12.5,
        valign: "middle",
      },
    },
  ]);
  s.addTable([header, ...body], {
    x: 0.6,
    y: 1.55,
    w: 12.1,
    colW: [3.3, 8.8],
    rowH: 0.62,
    border: { type: "solid", color: C.border, pt: 1 },
    valign: "middle",
  });
  s.addText(
    "Open question for IT: what does the AI System Scorecard evaluate, so we provide the exact inputs?",
    {
      x: 0.6,
      y: 6.5,
      w: 12.2,
      h: 0.4,
      fontFace: FONT,
      fontSize: 12.5,
      color: C.muted,
      italic: true,
      align: "center",
    },
  );
  footer(s, 12);
}

// =========================================================
// SLIDE 13 — Delivery Approach & Adoption
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Delivery Approach & Adoption", "Topic 5");
  card(s, {
    x: 0.5,
    y: 1.6,
    w: 3.9,
    h: 4.6,
    headColor: C.blue,
    headText: "Delivery",
    bodyBg: C.blueBg,
    lineColor: "1E3A8A",
    lines: [
      "IT provisions Azure resources (1–2 weeks)",
      "Integrate AI into SmartBid (2–3 weeks after credentials)",
      "Target go-live: Q3 2026",
    ],
  });
  card(s, {
    x: 4.55,
    y: 1.6,
    w: 3.9,
    h: 4.6,
    headColor: C.tealDark,
    headText: "Adoption",
    bodyBg: C.light,
    lines: [
      "Pilot first with the Brazil BID team",
      "Minimal training — review/confirm inside an existing workflow",
      "Owner: Raphael Costa (functional); SmartBid team supports",
    ],
  });
  card(s, {
    x: 8.6,
    y: 1.6,
    w: 4.2,
    h: 4.6,
    headColor: C.navy,
    headText: "Scale Criteria",
    bodyBg: C.light,
    lines: [
      "Measure accuracy & time saved during pilot",
      "Expand only if targets are met",
      "Reusable AI foundation for future SmartBid modules",
    ],
  });
  footer(s, 13);
}

// =========================================================
// SLIDE 14 — Performance Measures & Success Criteria
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Performance & Success Criteria", "Topic 6");
  const kpis = [
    [">85%", "Extraction accuracy target"],
    ["15 → <3 min", "Quotation entry per document"],
    ["40–60%", "BID prep time reduction"],
    ["−80%", "Transcription errors"],
    ["90%+", "Quotations processed via AI"],
    ["100%", "AI calls via secure backend"],
  ];
  const cw = 3.9,
    chh = 1.55,
    gx = 0.5,
    gy = 1.6,
    hgap = 0.28,
    vgap = 0.3;
  kpis.forEach((k, i) => {
    const col = i % 3,
      row = Math.floor(i / 3);
    const x = gx + col * (cw + hgap);
    const y = gy + row * (chh + vgap);
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: cw,
      h: chh,
      rectRadius: 0.08,
      fill: { color: C.light },
      line: { color: C.border, width: 1 },
    });
    s.addText(k[0], {
      x,
      y: y + 0.18,
      w: cw,
      h: 0.7,
      align: "center",
      fontFace: FONT,
      fontSize: 30,
      bold: true,
      color: C.tealDark,
    });
    s.addText(k[1], {
      x: x + 0.15,
      y: y + 0.95,
      w: cw - 0.3,
      h: 0.5,
      align: "center",
      fontFace: FONT,
      fontSize: 12.5,
      color: C.text,
    });
  });
  s.addText(
    "Logs available for troubleshooting & audit · no API key exposed in browser, SharePoint, or source.",
    {
      x: 0.6,
      y: 6.45,
      w: 12.2,
      h: 0.45,
      fontFace: FONT,
      fontSize: 12.5,
      color: C.muted,
      italic: true,
      align: "center",
    },
  );
  footer(s, 14);
}

// =========================================================
// SLIDE 15 — Risks, Controls & Compliance
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Risks, Controls & Compliance", "Topic 7");
  const header = [
    {
      text: "Risk",
      options: {
        bold: true,
        color: C.white,
        fill: { color: C.navy },
        fontFace: FONT,
        fontSize: 13,
      },
    },
    {
      text: "Control / Mitigation",
      options: {
        bold: true,
        color: C.white,
        fill: { color: C.navy },
        fontFace: FONT,
        fontSize: 13,
      },
    },
  ];
  const rows = [
    [
      "Incorrect AI output / hallucination",
      "Human-in-the-loop review before save; manual entry fallback",
    ],
    [
      "Supplier PDF layout variability / poor scans",
      "Review step catches errors; manual entry available",
    ],
    [
      "Credential exposure",
      "No key in frontend; Key Vault + Managed Identity; Entra ID",
    ],
    [
      "Quota / rate limits / cost",
      "Low volume; monitored via App Insights; budget-capped",
    ],
    [
      "Sensitive content",
      "No personal data; ITAR/CUI excluded + user attestation",
    ],
    ["Data residency", "Brazil South; in-country; not used for model training"],
  ];
  const body = rows.map((r) => [
    {
      text: r[0],
      options: {
        bold: true,
        color: C.navy,
        fontFace: FONT,
        fontSize: 12,
        valign: "middle",
      },
    },
    {
      text: r[1],
      options: {
        color: C.text,
        fontFace: FONT,
        fontSize: 12,
        valign: "middle",
      },
    },
  ]);
  s.addTable([header, ...body], {
    x: 0.6,
    y: 1.55,
    w: 12.1,
    colW: [4.4, 7.7],
    rowH: 0.7,
    border: { type: "solid", color: C.border, pt: 1 },
    valign: "middle",
  });
  footer(s, 15);
}

// =========================================================
// SLIDE 16 — AI Tools Committee & Approval Path
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "AI Tools Committee & Approval Path", "Topic 8");
  card(s, {
    x: 0.5,
    y: 1.6,
    w: 6.0,
    h: 4.7,
    headColor: C.navy,
    headText: "Where We Are",
    bodyBg: C.light,
    lineSize: 13.5,
    lines: [
      "EA — Approved with Conditions (Level One approved)",
      "Two approval notes being addressed (duplication + in-country)",
      "System documented in EA Intake Form + architecture diagram",
      "Cybersecurity review completed",
    ],
  });
  card(s, {
    x: 6.7,
    y: 1.6,
    w: 6.1,
    h: 4.7,
    headColor: C.tealDark,
    headText: "Questions for the Committee",
    bodyBg: C.light,
    lineSize: 13.5,
    lines: [
      "Is SmartBid subject to AI Tools Committee approval?",
      "What artifacts, criteria & timeline are required?",
      "What does the AI System Scorecard evaluate?",
      "Confirm next steps and responsible parties for sign-off",
    ],
  });
  footer(s, 16);
}

// =========================================================
// SLIDE 17 — Governance Actions Summary & Next Steps
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Governance Actions & Next Steps", "Closing");
  s.addText(
    bullets([
      {
        text: "Confirm no functional duplication with ET / requirements-hashing apps (with IT)",
        bold: true,
      },
      {
        text: "In-country Brazil data requirement — confirmed as not applicable",
        bold: true,
        color: C.green,
      },
      {
        text: "Clarify AI System Scorecard inputs and AI Tools Committee requirements",
        bold: true,
      },
      { text: "IT provisions Azure resources in Brazil South", bold: true },
      {
        text: "Integrate AI into SmartBid → pilot with BID team → measure → scale (go-live Q3 2026)",
        bold: true,
      },
    ]),
    { x: 0.6, y: 1.6, w: 12.2, h: 4.0, valign: "top" },
  );
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 5.65,
    w: 12.1,
    h: 0.95,
    rectRadius: 0.08,
    fill: { color: C.navy },
  });
  s.addText(
    "The ask: confirm governance actions, scorecard result, and the approval path to go-live.",
    {
      x: 0.8,
      y: 5.65,
      w: 11.7,
      h: 0.95,
      valign: "middle",
      align: "center",
      fontFace: FONT,
      fontSize: 15,
      bold: true,
      color: C.white,
    },
  );
  footer(s, 17);
}

// =========================================================
// Save
// =========================================================
pptx
  .writeFile({ fileName: "SmartBid-2.0-AI-Governance-Review.pptx" })
  .then((fn) => console.log("Generated:", fn))
  .catch((e) => console.error(e));
