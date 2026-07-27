/*
 * SmartBid 2.0 — Pages & AI Slides (7–15) Generator
 * Generates: SmartBid-2.0-Pages-and-AI-Slides.pptx
 * Run: npm install && node generate-pages-slides.js
 *
 * Rebuilds the dense "Páginas e Navegação" catalog slides (7–13),
 * the BID Lifecycle slide (14) and the AI implementation slide (15)
 * as balanced card grids with AI badges. Matches the existing deck style.
 */
const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in (16:9)
pptx.author = "Raphael Costa";
pptx.company = "Oceaneering International";
pptx.title = "SmartBid 2.0 — Pages & AI";

// ---- Palette ----
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
  border: "D5DEE6",
};

const FONT = "Segoe UI";
const W = 13.33;
const H = 7.5;
const CONTENT_X = 0.5;
const CONTENT_W = 12.33;

// ---- Base slide ----
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

// ---- Feature card ----
function featureCard(slide, o) {
  const {
    x,
    y,
    w,
    h,
    title,
    desc,
    ai = false,
    aiNote,
    highlight,
    accentColor,
  } = o;
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
  // top accent strip
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h: 0.09,
    fill: { color: accent },
    line: { width: 0 },
  });
  // title
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
  // AI badge
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
  // description
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
  // highlight pill
  if (highlight) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.18,
      y: y + h - 0.98,
      w: w - 0.36,
      h: 0.42,
      rectRadius: 0.05,
      fill: { color: C.amberBg },
      line: { color: C.amber, width: 1 },
    });
    slide.addText(highlight, {
      x: x + 0.18,
      y: y + h - 0.98,
      w: w - 0.36,
      h: 0.42,
      fontFace: FONT,
      fontSize: 12,
      bold: true,
      color: "92400E",
      align: "center",
      valign: "middle",
    });
  }
  // AI note
  if (aiNote) {
    slide.addText(
      [
        { text: "IA:  ", options: { bold: true, color: C.tealDark } },
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

// =========================================================
// SLIDE 7 — WORKSPACE (6 cards, 3x2)
// =========================================================
{
  const s = baseSlide("Páginas e Navegação", "Workspace");
  grid(
    s,
    [
      {
        title: "BID Tracker",
        desc: "Landing page. Visualização em Kanban, lista ou tabela.",
      },
      {
        title: "Engineering Dashboard",
        desc: "KPIs, gráficos e aprovações pendentes.",
      },
      {
        title: "Unassigned Requests",
        desc: "Novas solicitações aguardando designação.",
      },
      {
        title: "Timeline View",
        desc: "Linha do tempo de fase e status por BID.",
      },
      {
        title: "Create Request",
        desc: "Formulário de intake estruturado (client, division, service line, PM).",
      },
      {
        title: "Notifications & FAQ",
        desc: "Alertas e instruções guiadas ao longo do workflow.",
        ai: true,
        aiNote: "assistente/chatbot guiando o usuário no processo de BID.",
      },
    ],
    3,
    1.72,
    2.42,
    0.28,
  );
}

// =========================================================
// SLIDE 8 — KNOWLEDGE BASE (6 cards, 3x2)
// =========================================================
{
  const s = baseSlide("Páginas e Navegação", "Knowledge Base");
  grid(
    s,
    [
      {
        title: "Assets Catalog",
        desc: "Catálogo de ferramentas atualizado automaticamente. Cards ou lista.",
      },
      {
        title: "Scope Templates",
        desc: "Templates pré-montados de Scope of Supply.",
        ai: true,
        aiNote:
          "gera/sugere o escopo a partir da solicitação e de BIDs anteriores.",
      },
      {
        title: "Datasheets",
        desc: "Datasheets de diversas ferramentas. Cards ou lista.",
        ai: true,
        aiNote: "extrai especificações e habilita busca semântica.",
      },
      {
        title: "Manuals & Catalogs",
        desc: "Manuais e catálogos de ferramentas. Cards ou lista.",
        ai: true,
        aiNote: "consulta em linguagem natural (chat) sobre os documentos.",
      },
      {
        title: "Clarif. & Qualif.",
        desc: "Histórico de clarifications e qualifications, com importação.",
        ai: true,
        aiNote: "sugere respostas com base em casos já respondidos.",
      },
      {
        title: "Links & Recommendations",
        desc: "Links úteis e notas gerais para apoiar o processo de BID.",
      },
    ],
    3,
    1.72,
    2.42,
    0.28,
  );
}

// =========================================================
// SLIDE 9 — INSIGHTS & ANALYTICS (4 cards, 2x2)
// =========================================================
{
  const s = baseSlide("Páginas e Navegação", "Insights & Analytics");
  grid(
    s,
    [
      {
        title: "Performance Trends",
        desc: "Tendências ao longo do tempo: volume de BIDs, tempo médio de conclusão, win rate e entregas no prazo (OTD).",
        ai: true,
        aiNote:
          "prevê tendências e antecipa desvios (forecast de volume, prazo e win rate).",
      },
      {
        title: "Bottleneck Analysis",
        desc: "Identificação de gargalos: tempo por fase/status, BIDs mais demorados e carga por divisão.",
        ai: true,
        aiNote: "identifica a causa-raiz dos gargalos e sugere ações.",
      },
      {
        title: "Team Analytics",
        desc: "Desempenho e carga da equipe: BIDs por owner, tempo médio de entrega e balanceamento de trabalho.",
      },
      {
        title: "Follow Up",
        desc: "Resultados de BIDs concluídos (Won / Loss / Pending), win/loss e motivos de perda.",
      },
    ],
    2,
    1.8,
    2.45,
    0.3,
  );
}

// =========================================================
// SLIDE 10 — REPORTS & EXPORT (3 cards, 3x1)
// =========================================================
{
  const s = baseSlide("Páginas e Navegação", "Reports & Export");
  grid(
    s,
    [
      {
        title: "Period Performance",
        desc: "Relatório consolidado de desempenho por período. Exportação em Excel, CSV ou impressão.",
      },
      {
        title: "BID Details",
        desc: "Relatório detalhado por BID: custos, horas, equipamentos e histórico, pronto para exportar.",
      },
      {
        title: "Operational Summary",
        desc: "Resumo operacional e throughput de BIDs para acompanhamento gerencial.",
      },
    ],
    3,
    2.7,
    2.75,
    0.3,
  );
}

// =========================================================
// SLIDE 11 — TOOLS (5 cards, 3 + 2)
// =========================================================
{
  const s = baseSlide("Páginas e Navegação", "Tools");
  grid(
    s,
    [
      {
        title: "Favorites",
        desc: "BIDs e equipamentos favoritados em grupos/subgrupos, com fotos e busca no catálogo.",
        ai: true,
        aiNote: "indica ferramentas repetidas para salvar como favorito.",
      },
      {
        title: "BOM Costs",
        desc: "Análise de custo de BOM: importação de árvore hierárquica com lookup de preços.",
      },
      {
        title: "Quotations",
        desc: "Cotações de aquisição/locação por fornecedor, com lead time, moeda e conversão para USD.",
        ai: true,
        aiNote: "acelera a importação de cotações no SmartBid.",
      },
      {
        title: "Tooling Report",
        desc: "Estatísticas de uso de ferramentas nos BIDs (qtd, custo, nº de BIDs) por divisão.",
        ai: true,
        aiNote:
          "recomenda conjuntos de ferramentas e sinaliza quantidades/custos fora do padrão.",
      },
      {
        title: "Query Consulting",
        desc: "Consulta de preços Peoplesoft (Financials / Brazil) com filtros por Business Unit e busca por coluna.",
      },
    ],
    3,
    1.72,
    2.42,
    0.28,
  );
}

// =========================================================
// SLIDE 12 — SETTINGS (3 cards, 3x1)
// =========================================================
{
  const s = baseSlide("Páginas e Navegação", "Settings");
  grid(
    s,
    [
      {
        title: "System Configuration",
        desc: "Configuração central: metas de KPI, divisões, tipos de BID, fases/status, clientes, custos e níveis de acesso.",
      },
      {
        title: "Members Management",
        desc: "Gestão de membros e equipes (Commercial, Engineering, Project…) com papéis e atribuições.",
      },
      {
        title: "Patch Notes",
        desc: "Histórico de versões e changelog do sistema.",
      },
    ],
    3,
    2.7,
    2.75,
    0.3,
  );
}

// =========================================================
// SLIDE 13 — BID DETAIL (5 cards, 3 + 2)
// =========================================================
{
  const s = baseSlide("Páginas e Navegação", "BID Detail");
  grid(
    s,
    [
      {
        title: "General",
        desc: "Overview e Timeline do BID.",
      },
      {
        title: "Scope & Costing",
        desc: "Scope of Supply, Hours & Personnel, Assets, Prep & Mobilization, Logistics, Certifications, Cost Summary.",
        ai: true,
        aiNote:
          "cria draft de Scope of Supply e sugere recurso de pessoal com base em BIDs passados.",
      },
      {
        title: "Management",
        desc: "Status & Phases, Revisions, Approval e Documents.",
      },
      {
        title: "Collaboration",
        desc: "Notes & Comments e Clarif. & Qualif.",
        ai: true,
        aiNote: "sugere clarifications/qualifications de casos já respondidos.",
      },
      {
        title: "Tools",
        desc: "AI Analysis, Activity Log e Export.",
      },
    ],
    3,
    1.72,
    2.42,
    0.28,
  );
}

// =========================================================
// SLIDE 14 — BID LIFECYCLE (value cards + screenshot placeholder)
// =========================================================
{
  const s = baseSlide("BID Lifecycle", "Fases e Status");

  // left value cards
  const items = [
    {
      title: "Rastreabilidade total",
      desc: "Cada etapa é rastreada com datas, responsáveis, tarefas e aprovações.",
    },
    {
      title: "Revision Control",
      desc: "Controle de revisões para BIDs retrabalhados, sem perder histórico.",
    },
    {
      title: "Audit Trail",
      desc: "Activity log e trilha de auditoria completos por BID.",
    },
  ];
  const lx = 0.5;
  const lw = 4.7;
  let ly = 1.75;
  const lh = 1.45;
  items.forEach((it) => {
    featureCard(s, { x: lx, y: ly, w: lw, h: lh, ...it });
    ly += lh + 0.22;
  });

  // right screenshot placeholder
  s.addShape(pptx.ShapeType.roundRect, {
    x: 5.5,
    y: 1.75,
    w: 7.33,
    h: 4.55,
    rectRadius: 0.06,
    fill: { color: C.light },
    line: { color: C.teal, width: 1.5, dashType: "dash" },
  });
  s.addText("[ Cole aqui o screenshot: Phase Progress & Detailed Flow ]", {
    x: 5.5,
    y: 3.7,
    w: 7.33,
    h: 0.6,
    fontFace: FONT,
    fontSize: 14,
    color: C.muted,
    italic: true,
    align: "center",
    valign: "middle",
  });
}

// =========================================================
// SLIDE 15 — UTILIZAÇÃO DE IA (4 cards, 2x2)
// =========================================================
{
  const s = baseSlide("Utilização de IA", "Implementação de IA no SmartBid");
  grid(
    s,
    [
      {
        title: "Extração de cotações",
        desc: "Upload de um PDF de fornecedor → a IA preenche item, quantidade, unit cost, currency, lead time e supplier.",
        ai: true,
        highlight: "⏱  ~15 min  →  <3 min (apenas revisão)",
      },
      {
        title: "Scope of Supply Elaboration",
        desc: "A IA lê a documentação técnica e sugere a estrutura de escopo e o mapeamento de equipamentos.",
        ai: true,
      },
      {
        title: "Smart Search (RAG)",
        desc: "Busca em datasheets e BIDs anteriores usando Azure AI Search + embeddings, com respostas rastreáveis.",
        ai: true,
      },
      {
        title: "Human-in-the-loop",
        desc: "O engenheiro sempre revisa e confirma antes de qualquer dado ser salvo. A IA assiste, não decide.",
        accentColor: C.amber,
      },
    ],
    2,
    1.8,
    2.45,
    0.3,
  );
}

// ---- Save ----
pptx
  .writeFile({ fileName: "SmartBid-2.0-Pages-and-AI-Slides.pptx" })
  .then((fn) => console.log("Generated:", fn))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
