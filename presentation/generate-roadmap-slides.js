/*
 * SmartBid 2.0 — Roadmap + Improved Slides (3–6) Generator
 * Generates: SmartBid-2.0-Roadmap-and-Improved-Slides.pptx
 * Run: npm install && node generate-roadmap-slides.js
 *
 * Produces 5 drop-in slides that match the existing deck style:
 *   1. Roadmap (visual flowchart: done / current / next / milestone)
 *   2. Resumo Executivo (2 columns)   -> replaces Slide 3
 *   3. O que é o SmartBid 2.0          -> replaces Slide 4
 *   4. O Problema Atual (2x2 cards)    -> replaces Slide 5
 *   5. A Solução (2x2 cards)           -> replaces Slide 6
 */
const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in (16:9)
pptx.author = "Raphael Costa";
pptx.company = "Oceaneering International";
pptx.title = "SmartBid 2.0 — Roadmap & Slides";

// ---- Palette (matches existing leadership deck) ----
const C = {
  navy: "0B2E4F",
  navy2: "13324F",
  teal: "1CA9C9",
  tealDark: "0E7C93",
  white: "FFFFFF",
  light: "F3F6F9",
  text: "1F2937",
  muted: "7E8C99",
  // status colors
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

// ---- Base slide (white bg, navy title, muted subtitle, bottom band) ----
function baseSlide(title, subtitle) {
  const s = pptx.addSlide();
  s.background = { color: C.white };

  s.addText(title, {
    x: 0.5,
    y: 0.34,
    w: 12.3,
    h: 0.6,
    fontFace: FONT,
    fontSize: 28,
    color: C.navy,
    bold: true,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.52,
      y: 0.92,
      w: 12.3,
      h: 0.4,
      fontFace: FONT,
      fontSize: 15,
      color: C.muted,
      bold: true,
    });
  }
  // teal accent underline
  s.addShape(pptx.ShapeType.rect, {
    x: 0.52,
    y: 1.32,
    w: 0.9,
    h: 0.05,
    fill: { color: C.teal },
  });
  // bottom band
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: H - 0.5,
    w: W,
    h: 0.5,
    fill: { color: C.navy },
  });
  s.addText("OCEANEERING", {
    x: W - 3.2,
    y: H - 0.47,
    w: 2.9,
    h: 0.44,
    fontFace: FONT,
    fontSize: 12,
    color: C.white,
    bold: true,
    align: "right",
    valign: "middle",
    charSpacing: 1,
  });
  return s;
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

  // body
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: bodyBg },
    line: { color: C.border, width: 1 },
  });
  // header
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.52,
    rectRadius: 0.08,
    fill: { color: headColor },
    line: { color: headColor, width: 1 },
  });
  // square off bottom of header
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
  // body text
  slide.addText(
    lines.map((t) => ({
      text: t,
      options: {
        bullet: { code: "2022", indent: 14 },
        fontFace: FONT,
        fontSize: lineSize,
        color: lineColor,
        paraSpaceAfter: 6,
      },
    })),
    {
      x: x + 0.12,
      y: y + 0.62,
      w: w - 0.28,
      h: h - 0.72,
      valign: "top",
    },
  );
}

// =========================================================
// SLIDE 1 — ROADMAP (flowchart)
// =========================================================
{
  const s = baseSlide(
    "Roadmap de Implementação",
    "SmartBid 2.0 — do desenvolvimento à adoção full em Q4-2026",
  );

  const cardY = 1.65;
  const cardH = 4.35;
  const cw = 2.83;
  const gap = 0.4;
  const x1 = 0.4;
  const x2 = x1 + cw + gap; // 3.63
  const x3 = x2 + cw + gap; // 6.86
  const x4 = x3 + cw + gap; // 10.09

  card(s, {
    x: x1,
    y: cardY,
    w: cw,
    h: cardH,
    headColor: C.green,
    headText: "✓  CONCLUÍDO",
    bodyBg: C.greenBg,
    lineColor: "14532D",
    lines: [
      "Estruturação do projeto",
      "Backend + Frontend",
      "Diagrama de arquitetura (Mermaid)",
      "Aprovação Enterprise Architecture",
      "EA Intake Form aprovado",
      "Revisão Cybersecurity aprovada",
      "Estimativa de custos + sizing Azure",
    ],
  });

  card(s, {
    x: x2,
    y: cardY,
    w: cw,
    h: cardH,
    headColor: C.amber,
    headText: "●  ETAPA ATUAL",
    bodyBg: C.amberBg,
    lineColor: "7C2D12",
    lines: [
      "Aprovação da gerência",
      "Alocação de centro de custo",
      "Liberação do orçamento Azure",
    ],
  });

  card(s, {
    x: x3,
    y: cardY,
    w: cw,
    h: cardH,
    headColor: C.blue,
    headText: "→  PRÓXIMAS ETAPAS",
    bodyBg: C.blueBg,
    lineColor: "1E3A8A",
    lines: [
      "Provisionar recursos Azure (OpenAI, AI Search, Key Vault, Function/APIM)",
      "Validação técnica + testes de integração e segurança",
      "Piloto com usuários controlados",
      "Rollout em produção + hypercare",
    ],
  });

  card(s, {
    x: x4,
    y: cardY,
    w: cw,
    h: cardH,
    headColor: C.purple,
    headText: "★  META",
    bodyBg: C.purpleBg,
    lineColor: "4C1D95",
    lines: ["Adoção full pela Engenharia"],
  });

  // Big Q4-2026 milestone inside card 4
  s.addText("Q4", {
    x: x4,
    y: cardY + 1.7,
    w: cw,
    h: 1.0,
    fontFace: FONT,
    fontSize: 54,
    color: C.purple,
    bold: true,
    align: "center",
  });
  s.addText("2026", {
    x: x4,
    y: cardY + 2.65,
    w: cw,
    h: 0.7,
    fontFace: FONT,
    fontSize: 30,
    color: C.purple,
    bold: true,
    align: "center",
  });

  // arrows between cards
  const arrowY = cardY + cardH / 2 - 0.2;
  [x1 + cw, x2 + cw, x3 + cw].forEach((ax) => {
    s.addShape(pptx.ShapeType.rightArrow, {
      x: ax + 0.05,
      y: arrowY,
      w: 0.3,
      h: 0.4,
      fill: { color: C.navy },
      line: { color: C.navy, width: 0 },
    });
  });

  // status caption
  s.addText(
    "Governança concluída  ·  Aprovação financeira em andamento  ·  Deployment planejado para Q4-2026",
    {
      x: 0.4,
      y: 6.25,
      w: 12.5,
      h: 0.4,
      fontFace: FONT,
      fontSize: 13,
      color: C.muted,
      italic: true,
      align: "center",
    },
  );
}

// =========================================================
// SLIDE 2 — RESUMO EXECUTIVO (2 columns)  [replaces Slide 3]
// =========================================================
{
  const s = baseSlide("Resumo Executivo", "Overview");

  card(s, {
    x: 0.5,
    y: 1.7,
    w: 6.0,
    h: 4.2,
    headColor: C.navy,
    headText: "ONDE ESTAMOS",
    bodyBg: C.light,
    lineSize: 14,
    lines: [
      "SmartBid 2.0 construído (front-end + back-end), em fase de testes no SharePoint da Engenharia",
      "Arquitetura de IA (Azure OpenAI) aprovada pelo Enterprise Architecture",
      "Projeto revisado e aprovado pelo time de Cybersecurity",
      "Estimativa de custos e recursos Azure concluída",
    ],
  });

  card(s, {
    x: 6.85,
    y: 1.7,
    w: 6.0,
    h: 4.2,
    headColor: C.teal,
    headText: "PRÓXIMOS PASSOS",
    bodyBg: C.light,
    lineSize: 14,
    lines: [
      "Aprovação gerencial e alocação de centro de custo",
      "Provisionar recursos Azure e ativar as etapas assistidas por IA",
      "Testes com BIDs reais (extração de documentos e cotações)",
      "Go-live e adoção full na Engenharia — Q4-2026",
    ],
  });
}

// =========================================================
// SLIDE 3 — O QUE É O SMARTBID 2.0  [replaces Slide 4]
// =========================================================
{
  const s = baseSlide("O que é o SmartBid 2.0", "Resumo");

  // definition band
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.6,
    w: 12.33,
    h: 1.15,
    rectRadius: 0.08,
    fill: { color: C.navy },
    line: { color: C.navy, width: 1 },
  });
  s.addText(
    [
      {
        text: "Plataforma SPFx no SharePoint da Engenharia Brasil ",
        options: { bold: true, color: C.white },
      },
      {
        text: "que centraliza todo o ciclo de vida dos BIDs — da solicitação ao close-out — com uma camada de Inteligência Artificial.",
        options: { color: "CFE8F0" },
      },
    ],
    {
      x: 0.75,
      y: 1.7,
      w: 11.9,
      h: 0.95,
      fontFace: FONT,
      fontSize: 16,
      valign: "middle",
    },
  );

  s.addText("Atualização — 3 recursos de IA (Azure OpenAI):", {
    x: 0.5,
    y: 2.95,
    w: 12,
    h: 0.35,
    fontFace: FONT,
    fontSize: 15,
    bold: true,
    color: C.navy,
  });

  const cy = 3.45;
  const ch = 2.5;
  const cwd = 3.94;
  card(s, {
    x: 0.5,
    y: cy,
    w: cwd,
    h: ch,
    headColor: C.teal,
    headText: "1 · Extração de cotações",
    bodyBg: C.light,
    lines: [
      "Lê PDFs de fornecedores automaticamente",
      "Preenche as cotações no SmartBid",
      "Reduz digitação manual e erros",
    ],
  });
  card(s, {
    x: 0.5 + cwd + 0.25,
    y: cy,
    w: cwd,
    h: ch,
    headColor: C.teal,
    headText: "2 · Análise de escopo",
    bodyBg: C.light,
    lines: [
      "Interpreta ETs de 10–50 páginas",
      "Sugere o Scope of Supply estruturado",
      "Acelera a montagem do BID",
    ],
  });
  card(s, {
    x: 0.5 + 2 * (cwd + 0.25),
    y: cy,
    w: cwd,
    h: ch,
    headColor: C.teal,
    headText: "3 · Busca semântica (RAG)",
    bodyBg: C.light,
    lines: [
      "Embeddings de manuais, datasheets e BIDs",
      "Azure AI Search para recuperação de contexto",
      "Respostas rastreáveis às fontes",
    ],
  });
}

// =========================================================
// SLIDE 4 — O PROBLEMA ATUAL (2x2 cards)  [replaces Slide 5]
// =========================================================
{
  const s = baseSlide("O Problema Atual", "Smart BID 1.0");

  const gx = 0.5;
  const gy = 1.7;
  const cwd = 6.0;
  const chd = 2.05;
  const gapx = 0.33;
  const gapy = 0.22;

  card(s, {
    x: gx,
    y: gy,
    w: cwd,
    h: chd,
    headColor: C.navy,
    headText: "Volume & esforço manual",
    bodyBg: C.light,
    lines: [
      "100+ BIDs por ano",
      "Entrada manual de PDFs e cotações",
      "Leitura de ETs de 10 a 50 páginas",
    ],
  });
  card(s, {
    x: gx + cwd + gapx,
    y: gy,
    w: cwd,
    h: chd,
    headColor: C.navy,
    headText: "Erros & padronização",
    bodyBg: C.light,
    lines: [
      "Processo lento e propenso a erros",
      "Custos e itens repetitivos digitados à mão",
      "Difícil padronizar o Scope of Supply",
    ],
  });
  card(s, {
    x: gx,
    y: gy + chd + gapy,
    w: cwd,
    h: chd,
    headColor: C.navy,
    headText: "Cotações & histórico",
    bodyBg: C.light,
    lines: [
      "Cotações inseridas manualmente",
      "Sem catálogo de itens salvo",
      "Histórico de BIDs se perde",
    ],
  });
  card(s, {
    x: gx + cwd + gapx,
    y: gy + chd + gapy,
    w: cwd,
    h: chd,
    headColor: C.navy,
    headText: "Processo & aprovações",
    bodyBg: C.light,
    lines: [
      "Filtros e visões não customizáveis",
      "Fluxo de trabalho nem sempre respeitado",
      "Aprovações lentas em chats dispersos",
    ],
  });
}

// =========================================================
// SLIDE 5 — A SOLUÇÃO (2x2 cards)  [replaces Slide 6]
// =========================================================
{
  const s = baseSlide("A Solução", "Smart BID 2.0 — Engineering BID System");

  const gx = 0.5;
  const gy = 1.7;
  const cwd = 6.0;
  const chd = 2.05;
  const gapx = 0.33;
  const gapy = 0.22;

  card(s, {
    x: gx,
    y: gy,
    w: cwd,
    h: chd,
    headColor: C.tealDark,
    headText: "Processo centralizado",
    bodyBg: C.light,
    lines: [
      "Workflow único: Request → Close-out",
      "Scope of Supply padronizado",
      "Audit trail, dashboards e relatórios",
    ],
  });
  card(s, {
    x: gx + cwd + gapx,
    y: gy,
    w: cwd,
    h: chd,
    headColor: C.tealDark,
    headText: "Camada de IA",
    bodyBg: C.light,
    lines: [
      "Extração automática de cotações",
      "Análise assistida de escopo (ETs)",
      "Embeddings + busca semântica (RAG)",
    ],
  });
  card(s, {
    x: gx,
    y: gy + chd + gapy,
    w: cwd,
    h: chd,
    headColor: C.tealDark,
    headText: "Base de conhecimento",
    bodyBg: C.light,
    lines: [
      "Salvamento de PDFs e manuais",
      "Catálogo de itens atualizado automaticamente",
      "Import de BIDs históricos e templates",
    ],
  });
  card(s, {
    x: gx + cwd + gapx,
    y: gy + chd + gapy,
    w: cwd,
    h: chd,
    headColor: C.tealDark,
    headText: "Colaboração",
    bodyBg: C.light,
    lines: [
      "Registro de esclarecimentos e qualificações",
      "Chat único com todos os aprovadores",
      "Notificações e FAQ guiado",
    ],
  });
}

// ---- Save ----
pptx
  .writeFile({ fileName: "SmartBid-2.0-Roadmap-and-Improved-Slides.pptx" })
  .then((fn) => console.log("Generated:", fn))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
