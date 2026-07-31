/*
 * SmartBid 2.0 — Executive Summary Slides (EN) Generator
 * Generates: SmartBid-2.0-Executive-Summary-EN.pptx
 * Run: npm install && node generate-summary-slides.js
 *
 * Produces 6 drop-in English slides that match the existing
 * "presentation two" deck style (navy title, teal underline,
 * card grids with AI badges, navy footer band with OCEANEERING):
 *   1. Overview — What is SmartBID 2.0 (definition + lifecycle strip)
 *   2. Current Business Use — Brazil Engineering BID team
 *   3. Technical Foundation — Architecture & Technology
 *   4. Current Capabilities
 *   5. AI Integration — Status & Next Step (Azure Resources)
 *   6. Rollout Strategy — Brazil first, then scale
 */
const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in (16:9)
pptx.author = "Raphael Costa";
pptx.company = "Oceaneering International";
pptx.title = "SmartBid 2.0 — Executive Summary";

// ---- Palette (matches existing deck) ----
const C = {
  navy: "0B2E4F",
  navy2: "13324F",
  teal: "1CA9C9",
  tealDark: "0E7C93",
  white: "FFFFFF",
  light: "F5F8FA",
  text: "334155",
  muted: "7E8C99",
  amber: "F59E0B",
  amberBg: "FEF6E4",
  blue: "3B82F6",
  blueBg: "E7F0FE",
  purple: "7C3AED",
  purpleBg: "F0EAFE",
  border: "D5DEE6",
  softText: "CFE8F0",
};

const FONT = "Segoe UI";
const W = 13.33;
const H = 7.5;
const CONTENT_X = 0.5;
const CONTENT_W = 12.33;

// ---- Base slide (white bg, navy title, muted subtitle, teal underline, navy footer) ----
function baseSlide(title, subtitle) {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  s.addText(title, {
    x: 0.5,
    y: 0.32,
    w: 12.3,
    h: 0.55,
    fontFace: FONT,
    fontSize: 26,
    color: C.navy,
    bold: true,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.52,
      y: 0.86,
      w: 12.3,
      h: 0.38,
      fontFace: FONT,
      fontSize: 14,
      color: C.muted,
      bold: true,
    });
  }
  s.addShape(pptx.ShapeType.rect, {
    x: 0.52,
    y: 1.26,
    w: 0.9,
    h: 0.05,
    fill: { color: C.teal },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: H - 0.48,
    w: W,
    h: 0.48,
    fill: { color: C.navy },
  });
  s.addText("OCEANEERING", {
    x: W - 3.2,
    y: H - 0.45,
    w: 2.9,
    h: 0.42,
    fontFace: FONT,
    fontSize: 11,
    color: C.white,
    bold: true,
    align: "right",
    valign: "middle",
    charSpacing: 1,
  });
  return s;
}

// ---- Navy definition band with mixed bold/light text ----
function definitionBand(slide, y, h, runs) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y,
    w: CONTENT_W,
    h,
    rectRadius: 0.08,
    fill: { color: C.navy },
    line: { color: C.navy, width: 1 },
  });
  slide.addText(runs, {
    x: 0.78,
    y: y + 0.08,
    w: CONTENT_W - 0.55,
    h: h - 0.16,
    fontFace: FONT,
    fontSize: 15,
    valign: "middle",
  });
}

// ---- Feature card (top accent strip, optional AI badge / AI note) ----
function featureCard(slide, o) {
  const { x, y, w, h, title, desc, ai = false, aiNote, accentColor } = o;
  const accent = accentColor || (ai ? C.teal : C.navy);

  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    fill: { color: C.white },
    line: { color: C.border, width: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h: 0.09,
    fill: { color: accent },
    line: { width: 0 },
  });
  slide.addText(title, {
    x: x + 0.18,
    y: y + 0.2,
    w: ai ? w - 0.95 : w - 0.34,
    h: 0.4,
    fontFace: FONT,
    fontSize: 14,
    bold: true,
    color: C.navy,
    valign: "middle",
  });
  if (ai) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + w - 0.72,
      y: y + 0.22,
      w: 0.54,
      h: 0.3,
      rectRadius: 0.04,
      fill: { color: C.teal },
      line: { width: 0 },
    });
    slide.addText("AI", {
      x: x + w - 0.72,
      y: y + 0.22,
      w: 0.54,
      h: 0.3,
      fontFace: FONT,
      fontSize: 11,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
    });
  }
  slide.addText(desc, {
    x: x + 0.18,
    y: y + 0.62,
    w: w - 0.34,
    h: h - (aiNote ? 1.35 : 0.72),
    fontFace: FONT,
    fontSize: 12,
    color: C.text,
    valign: "top",
  });
  if (aiNote) {
    slide.addText(
      [
        { text: "AI:  ", options: { bold: true, color: C.tealDark } },
        { text: aiNote, options: { color: C.tealDark, italic: true } },
      ],
      {
        x: x + 0.18,
        y: y + h - 0.72,
        w: w - 0.34,
        h: 0.62,
        fontFace: FONT,
        fontSize: 10.5,
        valign: "top",
      },
    );
  }
}

// ---- Grid layout (centers last partial row) ----
function grid(slide, items, cols, y0, rowH, gapY) {
  const gapX = 0.3;
  const cardW = (CONTENT_W - (cols - 1) * gapX) / cols;
  items.forEach((it, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const itemsInRow = Math.min(cols, items.length - r * cols);
    const rowWidth = itemsInRow * cardW + (itemsInRow - 1) * gapX;
    const rowX0 = CONTENT_X + (CONTENT_W - rowWidth) / 2;
    const x = rowX0 + c * (cardW + gapX);
    const y = y0 + r * (rowH + gapY);
    featureCard(slide, { x, y, w: cardW, h: rowH, ...it });
  });
}

// ---- Horizontal phase strip (numbered cards + arrows) ----
function phaseStrip(slide, phases, y, opts = {}) {
  const {
    h = 1.15,
    x0 = CONTENT_X,
    totalW = CONTENT_W,
    color = C.navy,
    bodyBg = C.light,
  } = opts;
  const n = phases.length;
  const arrowW = 0.34;
  const gap = arrowW + 0.12;
  const cardW = (totalW - (n - 1) * gap) / n;
  phases.forEach((p, i) => {
    const x = x0 + i * (cardW + gap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: cardW,
      h,
      rectRadius: 0.08,
      fill: { color: bodyBg },
      line: { color: C.border, width: 1 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: cardW,
      h: 0.09,
      fill: { color },
      line: { width: 0 },
    });
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + cardW / 2 - 0.2,
      y: y + 0.24,
      w: 0.4,
      h: 0.4,
      fill: { color },
      line: { width: 0 },
    });
    slide.addText(String(i + 1), {
      x: x + cardW / 2 - 0.2,
      y: y + 0.24,
      w: 0.4,
      h: 0.4,
      fontFace: FONT,
      fontSize: 15,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
    });
    slide.addText(p, {
      x: x + 0.1,
      y: y + 0.7,
      w: cardW - 0.2,
      h: h - 0.78,
      fontFace: FONT,
      fontSize: 12.5,
      bold: true,
      color: C.navy,
      align: "center",
      valign: "top",
    });
    if (i < n - 1) {
      slide.addShape(pptx.ShapeType.rightArrow, {
        x: x + cardW + 0.04,
        y: y + h / 2 - 0.16,
        w: arrowW - 0.02,
        h: 0.32,
        fill: { color },
        line: { width: 0 },
      });
    }
  });
}

// ---- Pill (rounded outline chip) ----
function pill(slide, x, y, w, h, text, color) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.12,
    fill: { color: C.light },
    line: { color, width: 1.25 },
  });
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontFace: FONT,
    fontSize: 13,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "middle",
  });
}

// =========================================================
// SLIDE 1 — OVERVIEW / WHAT IS SMARTBID 2.0
// =========================================================
{
  const s = baseSlide("SmartBID 2.0", "Centralized BID Lifecycle Management");

  definitionBand(s, 1.55, 1.25, [
    {
      text: "A centralized solution that manages the entire BID lifecycle ",
      options: { bold: true, color: C.white },
    },
    {
      text: "— replacing fragmented spreadsheets and email-based controls with a single, traceable workflow — to improve consistency, visibility and execution speed across BID activities.",
      options: { color: C.softText },
    },
  ]);

  s.addText("End-to-end BID cycle", {
    x: 0.52,
    y: 3.02,
    w: 8,
    h: 0.35,
    fontFace: FONT,
    fontSize: 14,
    bold: true,
    color: C.navy,
  });

  phaseStrip(
    s,
    [
      "Request",
      "Technical Analysis",
      "Cost & Resources",
      "Proposal",
      "Close-out",
    ],
    3.42,
  );

  s.addText("Designed to improve", {
    x: 0.52,
    y: 4.9,
    w: 8,
    h: 0.35,
    fontFace: FONT,
    fontSize: 14,
    bold: true,
    color: C.navy,
  });

  const chips = ["Consistency", "Visibility", "Execution speed"];
  const pw = 2.7;
  const pgap = 0.4;
  const totalPW = chips.length * pw + (chips.length - 1) * pgap;
  let px = CONTENT_X + (CONTENT_W - totalPW) / 2;
  chips.forEach((chip) => {
    pill(s, px, 5.32, pw, 0.6, chip, C.teal);
    px += pw + pgap;
  });
}

// =========================================================
// SLIDE 2 — CURRENT BUSINESS USE
// =========================================================
{
  const s = baseSlide("Current Business Use", "Brazil Engineering BID team");
  grid(
    s,
    [
      {
        title: "End-to-End Bid Cycle",
        desc: "Manage Request → Technical Analysis → Cost & Resources → Proposal → Close-out in one connected workflow.",
      },
      {
        title: "Productivity & Quality",
        desc: "Increase productivity and quality in technical and cost preparation.",
      },
      {
        title: "Management Visibility",
        desc: "Dashboards, analytics, reports and audit trails for full management visibility.",
      },
      {
        title: "Less Rework & Errors",
        desc: "Reduce rework and transcription errors through history tracking and revision control.",
      },
    ],
    2,
    1.7,
    2.15,
    0.28,
  );

  s.addText(
    "Structures key stages — intake, technical analysis, costing, revisions, approvals and close-out — with governance through status/phase tracking, activity history and reporting.",
    {
      x: 0.52,
      y: 6.35,
      w: 12.3,
      h: 0.45,
      fontFace: FONT,
      fontSize: 12,
      italic: true,
      color: C.muted,
      align: "center",
    },
  );
}

// =========================================================
// SLIDE 3 — TECHNICAL FOUNDATION
// =========================================================
{
  const s = baseSlide("Technical Foundation", "Architecture & Technology");
  grid(
    s,
    [
      {
        title: "Frontend",
        desc: "SPFx (SharePoint Framework) with a React + TypeScript frontend.",
      },
      {
        title: "State & Integration",
        desc: "Zustand for state management and PnPjs for SharePoint integration.",
      },
      {
        title: "Data & Authentication",
        desc: "Data persisted in SharePoint lists (JSON model), with M365 enterprise authentication.",
      },
      {
        title: "Approval Orchestration",
        desc: "Power Automate + Microsoft Teams orchestrate approvals via Teams and email.",
      },
      {
        title: "Modular by Design",
        desc: "Modular page and component structure for continuous solution evolution.",
      },
    ],
    3,
    1.72,
    2.45,
    0.28,
  );
}

// =========================================================
// SLIDE 4 — CURRENT CAPABILITIES
// =========================================================
{
  const s = baseSlide(
    "Current Capabilities",
    "What SmartBID 2.0 delivers today",
  );
  grid(
    s,
    [
      {
        title: "BID Tracking & Timeline",
        desc: "BID tracking and timeline control across every phase.",
      },
      {
        title: "Dashboards & Analytics",
        desc: "Dashboards and analytics views for real-time insight.",
      },
      {
        title: "Reports & Export",
        desc: "Reports and multiple export options.",
      },
      {
        title: "Document & Knowledge Support",
        desc: "Document and knowledge support pages.",
      },
      {
        title: "Approval & Auditability",
        desc: "Approval workflow structure with full auditability.",
      },
    ],
    3,
    1.72,
    2.45,
    0.28,
  );
}

// =========================================================
// SLIDE 5 — AI INTEGRATION (STATUS & NEXT STEP)
// =========================================================
{
  const s = baseSlide("AI Integration", "Status & next step — Azure Resources");

  definitionBand(s, 1.5, 1.0, [
    {
      text: "Human-in-the-loop:  ",
      options: { bold: true, color: C.white },
    },
    {
      text: "still in development, the platform will be ready for AI integration focused on productivity — engineers always review and confirm before anything is saved.",
      options: { color: C.softText },
    },
  ]);

  grid(
    s,
    [
      {
        title: "Quote Extraction",
        desc: "Read supplier PDFs to capture item, quantity, cost, currency and lead time.",
        ai: true,
      },
      {
        title: "Scope of Supply Drafting",
        desc: "Support drafting the Scope of Supply by reading technical documentation.",
        ai: true,
      },
      {
        title: "Intelligent Search (RAG)",
        desc: "RAG search across the document database and BID history, with traceable answers.",
        ai: true,
      },
      {
        title: "Contextual Suggestions",
        desc: "Suggestions for clarifications/qualifications and analytical support.",
        ai: true,
      },
    ],
    2,
    2.75,
    1.75,
    0.25,
  );
}

// =========================================================
// SLIDE 6 — ROLLOUT STRATEGY
// =========================================================
{
  const s = baseSlide("Rollout Strategy", "Brazil first, then scale");

  const steps = [
    {
      title: "Consolidate in Brazil",
      desc: "Establish and adopt SmartBID within the Brazil Engineering BID team.",
      color: C.teal,
    },
    {
      title: "Stabilize & Mature",
      desc: "Harden the platform, refine workflows and reach a stable, mature solution.",
      color: C.blue,
    },
    {
      title: "Scale to Other Regions",
      desc: "Once fully matured, extend to other regions where suitable.",
      color: C.purple,
    },
  ];

  const cardY = 2.1;
  const cardH = 2.8;
  const arrowW = 0.4;
  const gap = arrowW + 0.2;
  const cardW = (CONTENT_W - (steps.length - 1) * gap) / steps.length;

  steps.forEach((st, i) => {
    const x = CONTENT_X + i * (cardW + gap);
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: cardY,
      w: cardW,
      h: cardH,
      rectRadius: 0.08,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x,
      y: cardY,
      w: cardW,
      h: 0.09,
      fill: { color: st.color },
      line: { width: 0 },
    });
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + cardW / 2 - 0.32,
      y: cardY + 0.4,
      w: 0.64,
      h: 0.64,
      fill: { color: st.color },
      line: { width: 0 },
    });
    s.addText(String(i + 1), {
      x: x + cardW / 2 - 0.32,
      y: cardY + 0.4,
      w: 0.64,
      h: 0.64,
      fontFace: FONT,
      fontSize: 24,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
    });
    s.addText(st.title, {
      x: x + 0.2,
      y: cardY + 1.2,
      w: cardW - 0.4,
      h: 0.5,
      fontFace: FONT,
      fontSize: 15,
      bold: true,
      color: C.navy,
      align: "center",
      valign: "middle",
    });
    s.addText(st.desc, {
      x: x + 0.25,
      y: cardY + 1.75,
      w: cardW - 0.5,
      h: 0.9,
      fontFace: FONT,
      fontSize: 12,
      color: C.text,
      align: "center",
      valign: "top",
    });
    if (i < steps.length - 1) {
      s.addShape(pptx.ShapeType.rightArrow, {
        x: x + cardW + 0.05,
        y: cardY + cardH / 2 - 0.2,
        w: arrowW - 0.05,
        h: 0.4,
        fill: { color: C.navy },
        line: { width: 0 },
      });
    }
  });

  s.addText(
    "Consolidate SmartBID locally in Brazil first; once stable and fully matured, scale to other regions where suitable.",
    {
      x: 0.52,
      y: 5.5,
      w: 12.3,
      h: 0.5,
      fontFace: FONT,
      fontSize: 13,
      italic: true,
      color: C.muted,
      align: "center",
    },
  );
}

// ---- Save ----
pptx
  .writeFile({ fileName: "SmartBid-2.0-Executive-Summary-EN.pptx" })
  .then((fn) => console.log("Generated:", fn))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
