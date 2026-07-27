/*
 * SmartBid 2.0 — Leadership Deck Generator
 * Generates: SmartBid-2.0-Leadership-Deck.pptx
 * Run: npm install && node generate-deck.js
 */
const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in (16:9)
pptx.author = "Raphael Costa";
pptx.company = "Oceaneering International";
pptx.title = "SmartBid 2.0 — AI-Assisted BID Management";

// ---- Palette ----
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
  border: "D5DEE6",
};

const FONT = "Segoe UI";
const W = 13.33;
const H = 7.5;

// ---- Helpers ----
function footer(slide, pageNo) {
  slide.addText("SmartBid 2.0  ·  Oceaneering Brasil Engineering", {
    x: 0.4,
    y: H - 0.4,
    w: 8,
    h: 0.3,
    fontFace: FONT,
    fontSize: 9,
    color: C.muted,
    align: "left",
  });
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
    y: 2.0,
    w: 12,
    h: 1.0,
    fontFace: FONT,
    fontSize: 54,
    color: C.white,
    bold: true,
  });
  s.addText(
    "BID Management com Inteligência Artificial — Oceaneering Brasil Engineering",
    {
      x: 0.7,
      y: 3.1,
      w: 12,
      h: 0.6,
      fontFace: FONT,
      fontSize: 22,
      color: C.teal,
    },
  );
  s.addText(
    [
      { text: "Apresentador: ", options: { bold: true } },
      { text: "Raphael Costa — BID Proposals Engineer", options: {} },
    ],
    {
      x: 0.7,
      y: 4.9,
      w: 12,
      h: 0.4,
      fontFace: FONT,
      fontSize: 15,
      color: C.white,
    },
  );
  s.addText("Divisão: SSR-OPG Engineering Brasil", {
    x: 0.7,
    y: 5.35,
    w: 12,
    h: 0.4,
    fontFace: FONT,
    fontSize: 15,
    color: "C7D3DE",
  });
  s.addText(
    "Revisão com a Liderança — Solicitação de Aprovação e Cost Center",
    {
      x: 0.7,
      y: 6.1,
      w: 12,
      h: 0.4,
      fontFace: FONT,
      fontSize: 14,
      color: C.orange,
      bold: true,
    },
  );
}

// =========================================================
// SLIDE 2 — Executive Summary / The Ask
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Resumo Executivo", "O Pedido");
  s.addText(
    bullets([
      {
        text: "O SmartBid 2.0 já está construído e em uso (front-end + back-end) no SharePoint Online.",
        bold: true,
      },
      "Próximo passo: habilitar uma etapa assistida por IA para acelerar o processamento de cotações e documentos técnicos.",
      "O Enterprise Architecture JÁ APROVOU a integração de IA (Azure OpenAI) — condições atendidas.",
      { text: "O que precisamos hoje:", bold: true, color: C.navy },
      { text: "Aprovação da liderança para prosseguir.", sub: true },
      {
        text: "Um cost center para os recursos Azure (baixo custo mensal — ver slides de custo).",
        sub: true,
      },
    ]),
    { x: 0.6, y: 1.5, w: 8.4, h: 5.3, valign: "top" },
  );
  // Callout card
  s.addShape(pptx.ShapeType.roundRect, {
    x: 9.3,
    y: 1.6,
    w: 3.5,
    h: 4.9,
    fill: { color: C.light },
    line: { color: C.border, width: 1 },
    rectRadius: 0.1,
  });
  s.addText("AT A GLANCE", {
    x: 9.5,
    y: 1.8,
    w: 3.1,
    h: 0.3,
    fontFace: FONT,
    fontSize: 11,
    bold: true,
    color: C.tealDark,
    charSpacing: 2,
  });
  s.addText(
    [
      {
        text: "4 usuários\n",
        options: { fontSize: 22, bold: true, color: C.navy },
      },
      {
        text: "time de BID engineering\n\n",
        options: { fontSize: 12, color: C.muted },
      },
      {
        text: "~3 BIDs / semana\n",
        options: { fontSize: 22, bold: true, color: C.navy },
      },
      {
        text: "≈ 12 BIDs / mês\n\n",
        options: { fontSize: 12, color: C.muted },
      },
      {
        text: "~$15–30 / mês\n",
        options: { fontSize: 22, bold: true, color: C.green },
      },
      {
        text: "custo Azure (piloto)",
        options: { fontSize: 12, color: C.muted },
      },
    ],
    {
      x: 9.5,
      y: 2.2,
      w: 3.1,
      h: 4.1,
      fontFace: FONT,
      valign: "top",
      lineSpacingMultiple: 1.0,
    },
  );
  footer(s, 2);
}

// =========================================================
// SLIDE 3 — What is SmartBid
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "O que é o SmartBid 2.0", "Visão Geral");
  s.addText(
    bullets([
      "Uma única plataforma para criar, acompanhar, custear e aprovar BIDs de engenharia.",
      "Substitui planilhas dispersas, e-mails e controles manuais.",
      "Construído sobre Microsoft 365 / SharePoint Online (SPFx + React) — sem nova infraestrutura.",
      "Acesso protegido por SSO + MFA corporativo (herdado do M365).",
    ]),
    { x: 0.6, y: 1.6, w: 12, h: 4.5, valign: "top" },
  );
  footer(s, 3);
}

// =========================================================
// SLIDE 4 — The Problem
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "O Problema (Dor Atual)", "Por que isso importa");
  s.addText(
    bullets([
      "100+ BID requests por ano, cada um exigindo entrada manual de dados de PDFs de fornecedores.",
      "Análise manual de Engineering Technical documents de 50–200 páginas para definir o escopo.",
      "Demorado, propenso a erros e difícil de padronizar.",
      "Dados de custo e bids repetitivos redigitados à mão (~15 min por documento de cotação).",
    ]),
    { x: 0.6, y: 1.6, w: 12, h: 4.5, valign: "top" },
  );
  footer(s, 4);
}

// =========================================================
// SLIDE 5 — The Solution
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "A Solução", "Visão Geral do SmartBid");
  s.addText(
    bullets([
      "Workflow de BID centralizado: Request → Kick-off → Technical Analysis → Cost & Resources → Proposal → Close-out.",
      "Scope of Supply padronizado, cost breakdown, horas, approvals, revisões.",
      "Audit trail completo, dashboards e relatórios.",
      {
        text: "Camada de IA para extrair dados de cotação automaticamente e apoiar a análise de escopo.",
        bold: true,
        color: C.tealDark,
      },
    ]),
    { x: 0.6, y: 1.6, w: 12, h: 4.5, valign: "top" },
  );
  footer(s, 5);
}

// =========================================================
// SLIDE 6 — Pages Part 1
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Navigation & Pages — Daily Workspace", "The Product (1/2)");
  s.addText(
    bullets([
      { text: "BID Tracker", bold: true },
      {
        text: "Landing page; all BIDs in kanban / list / table views.",
        sub: true,
      },
      { text: "Engineering Dashboard", bold: true },
      { text: "KPIs, charts, pending approvals.", sub: true },
      { text: "Unassigned Requests", bold: true },
      { text: "New requests awaiting assignment.", sub: true },
    ]),
    { x: 0.6, y: 1.55, w: 6.1, h: 5.2, valign: "top" },
  );
  s.addText(
    bullets([
      { text: "Timeline View", bold: true },
      { text: "Timeline de phase / status por BID.", sub: true },
      { text: "Create Request", bold: true },
      {
        text: "Formulário de intake estruturado (client, division, service line, PM).",
        sub: true,
      },
      { text: "Notifications & FAQ", bold: true },
      { text: "Alertas e instruções guiadas.", sub: true },
    ]),
    { x: 6.9, y: 1.55, w: 6.0, h: 5.2, valign: "top" },
  );
  footer(s, 6);
}

// =========================================================
// SLIDE 7 — Pages Part 2
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(
    s,
    "Navegação & Páginas — Knowledge, Insights, Tools",
    "O Produto (2/2)",
  );
  s.addText(
    bullets([
      { text: "Knowledge Base", bold: true, color: C.tealDark },
      {
        text: "Assets Catalog · Scope Templates · Datasheets · Manuals & Catalogs · Clarif. & Qualif. · Links.",
        sub: true,
      },
      { text: "Insights / Analytics", bold: true, color: C.tealDark },
      {
        text: "Performance Trends · Bottleneck Analysis · Team Analytics · Follow-up.",
        sub: true,
      },
      { text: "Reports & Export", bold: true, color: C.tealDark },
      {
        text: "Period Performance · BID Details · Operational Summary.",
        sub: true,
      },
      { text: "Tools", bold: true, color: C.tealDark },
      {
        text: "Favorites · BOM Costs · Quotations · Tooling Report · Query Consulting.",
        sub: true,
      },
      { text: "Settings", bold: true, color: C.tealDark },
      {
        text: "System Configuration · Members Management · Patch Notes.",
        sub: true,
      },
    ]),
    { x: 0.6, y: 1.5, w: 12.2, h: 5.4, valign: "top" },
  );
  footer(s, 7);
}

// =========================================================
// SLIDE 8 — BID Lifecycle
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Como é Usado — BID Lifecycle", "Workflow");
  const steps = [
    "Request\nSubmitted",
    "Bid\nKick-off",
    "Technical\nAnalysis",
    "Cost &\nResources",
    "Technical\nProposal",
    "Close-out",
  ];
  const bw = 1.9,
    gap = 0.14,
    startX = 0.6,
    y = 2.2;
  steps.forEach((st, i) => {
    const x = startX + i * (bw + gap);
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: bw,
      h: 1.3,
      fill: { color: i % 2 ? C.tealDark : C.navy },
      rectRadius: 0.08,
    });
    s.addText(`${i + 1}`, {
      x,
      y: y + 0.12,
      w: bw,
      h: 0.3,
      align: "center",
      fontFace: FONT,
      fontSize: 12,
      bold: true,
      color: C.teal,
    });
    s.addText(st, {
      x,
      y: y + 0.42,
      w: bw,
      h: 0.8,
      align: "center",
      valign: "middle",
      fontFace: FONT,
      fontSize: 12,
      bold: true,
      color: C.white,
    });
  });
  s.addText(
    bullets([
      "Cada etapa é rastreada com datas, responsáveis, tarefas e approvals.",
      "Revision control para bids retrabalhados.",
      "Activity log e audit trail completos por BID.",
    ]),
    { x: 0.6, y: 4.1, w: 12, h: 2.4, valign: "top" },
  );
  footer(s, 8);
}

// =========================================================
// SLIDE 9 — AI Capability
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Capacidade de IA — O que a IA Faz", "O Acelerador");
  s.addText(
    bullets([
      { text: "Quotation extraction", bold: true, color: C.tealDark },
      {
        text: "Upload de um PDF de fornecedor → a IA preenche item, quantidade, unit cost, currency, lead time, supplier. Tarefa de ~15 min → <3 min (apenas revisão).",
        sub: true,
      },
      { text: "Scope of Supply analysis", bold: true, color: C.tealDark },
      {
        text: "A IA lê Engineering Technical documents e sugere a estrutura de escopo e o mapeamento de equipamentos.",
        sub: true,
      },
      { text: "Smart search (RAG)", bold: true, color: C.tealDark },
      {
        text: "Busca em datasheets e bids anteriores usando AI Search + embeddings.",
        sub: true,
      },
      { text: "Human-in-the-loop", bold: true, color: C.orange },
      {
        text: "O engenheiro sempre revisa e confirma antes de qualquer dado ser salvo.",
        sub: true,
      },
    ]),
    { x: 0.6, y: 1.5, w: 12.2, h: 5.4, valign: "top" },
  );
  footer(s, 9);
}

// =========================================================
// SLIDE 10 — AI Architecture
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "AI Architecture — Segura por Design", "Como Funciona");
  const boxes = [
    { t: "SmartBid\n(Browser)", c: C.navy },
    { t: "Secure Backend\n(Azure Function / APIM)", c: C.tealDark },
    { t: "Azure\nOpenAI", c: C.navy },
  ];
  const bw = 3.0,
    gap = 1.0,
    y = 2.1,
    startX = 0.9;
  boxes.forEach((b, i) => {
    const x = startX + i * (bw + gap);
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: bw,
      h: 1.2,
      fill: { color: b.c },
      rectRadius: 0.08,
    });
    s.addText(b.t, {
      x,
      y,
      w: bw,
      h: 1.2,
      align: "center",
      valign: "middle",
      fontFace: FONT,
      fontSize: 14,
      bold: true,
      color: C.white,
    });
    if (i < boxes.length - 1) {
      s.addText("→", {
        x: x + bw,
        y,
        w: gap,
        h: 1.2,
        align: "center",
        valign: "middle",
        fontFace: FONT,
        fontSize: 28,
        bold: true,
        color: C.teal,
      });
    }
  });
  s.addText(
    bullets([
      "API keys nunca expostas no frontend, SharePoint ou código-fonte.",
      {
        text: "Armazenadas no Azure Key Vault, acessadas via Managed Identity.",
        sub: true,
      },
      "Todas as chamadas autenticadas com token do Entra ID (mesma identidade SSO / MFA).",
      "Logging completo via Application Insights / Log Analytics.",
    ]),
    { x: 0.6, y: 3.7, w: 12.2, h: 2.9, valign: "top" },
  );
  footer(s, 10);
}

// =========================================================
// SLIDE 11 — Security & Compliance
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Security & Compliance", "Risco Mitigado");
  s.addText(
    bullets([
      { text: "SSO + MFA (two-factor): ", bold: true },
      { text: "herdado do M365 — sem login separado.", sub: true },
      { text: "Sem segredo no frontend: ", bold: true },
      { text: "key no Key Vault via Managed Identity.", sub: true },
      { text: "ITAR / Export-Controlled / CUI: ", bold: true },
      {
        text: "conteúdo excluído do AI pipeline; atestação do usuário no upload.",
        sub: true,
      },
      {
        text: "Enterprise Architecture: Approved with Conditions ",
        bold: true,
        color: C.green,
      },
      { text: "— condições atendidas.", sub: true },
      { text: "Plataforma de IA aprovada: ", bold: true },
      {
        text: "Azure OpenAI (GPT-4o-mini) — nenhum novo fornecedor introduzido.",
        sub: true,
      },
    ]),
    { x: 0.6, y: 1.5, w: 12.2, h: 5.4, valign: "top" },
  );
  footer(s, 11);
}

// =========================================================
// SLIDE 12 — Azure Resources Overview
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Azure Resources — Visão Geral", "Blocos da Nuvem");
  const items = [
    [
      "Azure OpenAI Service",
      "O modelo de IA (GPT-4o-mini) para extração & análise",
    ],
    ["Embeddings model", "Converte documentos em vetores para smart search"],
    ["Azure AI Search", "Indexa datasheets & bids anteriores para retrieval"],
    [
      "Azure Function App",
      "Backend seguro que intermedia todas as chamadas de IA",
    ],
    ["Azure Key Vault", "Armazenamento seguro de credenciais"],
    ["Application Insights", "Telemetria, erros e performance da aplicação"],
    ["Log Analytics Workspace", "Logging centralizado & audit"],
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
    y: 1.6,
    w: 12.1,
    colW: [3.6, 8.5],
    rowH: 0.66,
    border: { type: "solid", color: C.border, pt: 1 },
    fill: { color: C.white },
    valign: "middle",
  });
  footer(s, 12);
}

// =========================================================
// SLIDE 13 — Usage Basis + Cost Table
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Azure Resources — Uso & Custo Mensal", "Os Números");
  s.addText(
    [
      { text: "Base de uso: ", options: { bold: true, color: C.navy } },
      {
        text: "4 usuários · ~3 BIDs/semana (≈ 12 BIDs/mês) · ~150–220 chamadas de IA/mês. Estimativas em USD; valores finais confirmados pelo Cloud team.",
        options: { color: C.muted },
      },
    ],
    { x: 0.6, y: 1.35, w: 12.2, h: 0.5, fontFace: FONT, fontSize: 12 },
  );
  const head = [
    {
      text: "Resource",
      options: {
        bold: true,
        color: C.white,
        fill: { color: C.navy },
        fontFace: FONT,
        fontSize: 12,
      },
    },
    {
      text: "Used for",
      options: {
        bold: true,
        color: C.white,
        fill: { color: C.navy },
        fontFace: FONT,
        fontSize: 12,
      },
    },
    {
      text: "Piloto / mês",
      options: {
        bold: true,
        color: C.white,
        fill: { color: C.navy },
        fontFace: FONT,
        fontSize: 12,
        align: "center",
      },
    },
    {
      text: "Produção / mês",
      options: {
        bold: true,
        color: C.white,
        fill: { color: C.navy },
        fontFace: FONT,
        fontSize: 12,
        align: "center",
      },
    },
  ];
  const data = [
    [
      "Azure OpenAI (GPT-4o-mini)",
      "Extrair cotações; analisar documentos técnicos",
      "$5 – $10",
      "$10 – $25",
    ],
    [
      "Embeddings model",
      "Vetorizar datasheets/bids para busca",
      "$2 – $5",
      "$5 – $10",
    ],
    [
      "Azure AI Search",
      "Indexar & recuperar datasheets e bids anteriores",
      "$0 (Free)",
      "~$75 (Basic)",
    ],
    [
      "Azure Function App",
      "Backend seguro / API proxy (Consumption)",
      "$0 – $5",
      "$5 – $15",
    ],
    [
      "Azure Key Vault",
      "Armazenamento seguro de credenciais",
      "~$1",
      "$1 – $2",
    ],
    [
      "Application Insights",
      "Telemetria, erros, performance",
      "$0 – $5",
      "$5 – $15",
    ],
    [
      "Log Analytics Workspace",
      "Logging centralizado & audit",
      "$0 – $5",
      "$5 – $15",
    ],
  ];
  const rows = [head];
  data.forEach((d, i) => {
    const bg = i % 2 ? C.light : C.white;
    rows.push([
      {
        text: d[0],
        options: {
          bold: true,
          color: C.navy,
          fill: { color: bg },
          fontFace: FONT,
          fontSize: 11,
        },
      },
      {
        text: d[1],
        options: {
          color: C.text,
          fill: { color: bg },
          fontFace: FONT,
          fontSize: 11,
        },
      },
      {
        text: d[2],
        options: {
          color: C.green,
          bold: true,
          align: "center",
          fill: { color: bg },
          fontFace: FONT,
          fontSize: 11,
        },
      },
      {
        text: d[3],
        options: {
          color: C.text,
          align: "center",
          fill: { color: bg },
          fontFace: FONT,
          fontSize: 11,
        },
      },
    ]);
  });
  s.addTable(rows, {
    x: 0.6,
    y: 1.95,
    w: 12.1,
    colW: [3.3, 5.0, 1.9, 1.9],
    rowH: 0.5,
    border: { type: "solid", color: C.border, pt: 1 },
    valign: "middle",
  });
  footer(s, 13);
}

// =========================================================
// SLIDE 14 — Total Cost Summary
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Resumo de Custo Total", "Conclusão");
  // Two big cards
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 1.8,
    w: 5.7,
    h: 2.6,
    fill: { color: C.light },
    line: { color: C.green, width: 2 },
    rectRadius: 0.1,
  });
  s.addText("PILOTO / POC", {
    x: 0.7,
    y: 2.0,
    w: 5.7,
    h: 0.4,
    align: "center",
    fontFace: FONT,
    fontSize: 14,
    bold: true,
    color: C.tealDark,
    charSpacing: 2,
  });
  s.addText("~$15 – $30", {
    x: 0.7,
    y: 2.5,
    w: 5.7,
    h: 0.9,
    align: "center",
    fontFace: FONT,
    fontSize: 44,
    bold: true,
    color: C.green,
  });
  s.addText("por mês  ·  AI Search Free tier", {
    x: 0.7,
    y: 3.5,
    w: 5.7,
    h: 0.4,
    align: "center",
    fontFace: FONT,
    fontSize: 13,
    color: C.muted,
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.9,
    y: 1.8,
    w: 5.7,
    h: 2.6,
    fill: { color: C.light },
    line: { color: C.navy, width: 2 },
    rectRadius: 0.1,
  });
  s.addText("PRODUÇÃO (ESCALADO)", {
    x: 6.9,
    y: 2.0,
    w: 5.7,
    h: 0.4,
    align: "center",
    fontFace: FONT,
    fontSize: 14,
    bold: true,
    color: C.navy,
    charSpacing: 2,
  });
  s.addText("~$105 – $155", {
    x: 6.9,
    y: 2.5,
    w: 5.7,
    h: 0.9,
    align: "center",
    fontFace: FONT,
    fontSize: 44,
    bold: true,
    color: C.navy,
  });
  s.addText("por mês  ·  ≈ $1,300 – $1,900 / ano", {
    x: 6.9,
    y: 3.5,
    w: 5.7,
    h: 0.4,
    align: "center",
    fontFace: FONT,
    fontSize: 13,
    color: C.muted,
  });

  s.addText(
    bullets([
      "Perfil de uso: 4 usuários · ~3 BIDs/semana — mantém tudo firmemente na faixa de baixo volume.",
      "Pode começar no tier Piloto e crescer somente se houver adoção.",
      "Sem hardware, sem licenças, sem custo adicional de dev — implementado pelo time atual do SmartBid.",
    ]),
    { x: 0.7, y: 4.7, w: 12, h: 2.0, valign: "top" },
  );
  footer(s, 14);
}

// =========================================================
// SLIDE 15 — Benefits / ROI
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Benefits / ROI", "Valor");
  s.addText(
    bullets([
      {
        text: "Entrada de dados de cotação: ~15 min → <3 min por documento.",
        bold: true,
      },
      {
        text: "Meta de redução de 40–60% no tempo de preparação do BID na análise de escopo.",
        bold: true,
      },
      "80% menos erros de transcrição manual nos dados de custo.",
      "Resposta mais rápida ao cliente; propostas padronizadas e auditáveis.",
      "Base de IA reutilizável para futuros módulos do SmartBid.",
    ]),
    { x: 0.6, y: 1.6, w: 12, h: 4.8, valign: "top" },
  );
  footer(s, 15);
}

// =========================================================
// SLIDE 16 — Roadmap / Next Steps
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Roadmap / Next Steps", "O Caminho");
  s.addText(
    bullets([
      {
        text: "1. Aprovação da liderança + cost center atribuído.",
        bold: true,
      },
      "2. Cloud team provisiona os recursos Azure (escopo definido).",
      "3. Integrar a extração por IA no SmartBid (POC).",
      "4. Piloto com o time de BID → medir acurácia & ganho de tempo.",
      {
        text: "5. Escalar para produção se as metas forem atingidas. Go-live alvo: Q3 2026.",
        bold: true,
        color: C.tealDark,
      },
    ]),
    { x: 0.6, y: 1.6, w: 12, h: 4.8, valign: "top" },
  );
  footer(s, 16);
}

// =========================================================
// SLIDE 17 — The Ask (Decision)
// =========================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.navy };
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1.15,
    w: W,
    h: 0.08,
    fill: { color: C.teal },
  });
  s.addText("DECISÃO", {
    x: 0.5,
    y: 0.2,
    w: 12,
    h: 0.3,
    fontFace: FONT,
    fontSize: 11,
    color: C.teal,
    bold: true,
    charSpacing: 2,
  });
  s.addText("A Solicitação", {
    x: 0.5,
    y: 0.46,
    w: 12,
    h: 0.6,
    fontFace: FONT,
    fontSize: 24,
    color: C.white,
    bold: true,
  });
  s.addText(
    [
      {
        text: "✓  Aprovar a habilitação da capacidade de IA no SmartBid.\n\n",
        options: { fontSize: 20, color: C.white, bold: true },
      },
      {
        text: "✓  Atribuir um cost center para os recursos Azure (~$15–30/mês no piloto).\n\n",
        options: { fontSize: 20, color: C.white, bold: true },
      },
      {
        text: "✓  Autorizar a coordenação com o Cloud team para provisionamento.",
        options: { fontSize: 20, color: C.white, bold: true },
      },
    ],
    {
      x: 0.9,
      y: 1.9,
      w: 11.5,
      h: 3.2,
      fontFace: FONT,
      valign: "top",
      lineSpacingMultiple: 1.1,
    },
  );
  s.addText(
    [
      { text: "Owner: ", options: { bold: true, color: C.teal } },
      { text: "Raphael Costa      ", options: { color: C.white } },
      { text: "Sponsor: ", options: { bold: true, color: C.teal } },
      { text: "[leadership name]", options: { color: C.white } },
    ],
    { x: 0.9, y: 5.6, w: 11.5, h: 0.5, fontFace: FONT, fontSize: 16 },
  );
}

// =========================================================
// SLIDE 18 — Q&A / Appendix
// =========================================================
{
  const s = pptx.addSlide();
  sectionHeader(s, "Q&A / Appendix", "Backup");
  s.addText(
    bullets([
      "Diagrama de arquitetura (completo) — da submissão do EA Intake.",
      "Referência da aprovação do EA (SR / WorkOrder #907579).",
      "Lista detalhada de páginas & screenshots.",
      "Link do Azure Pricing Calculator (por recurso) para valores firmes.",
    ]),
    { x: 0.6, y: 1.6, w: 12, h: 4.8, valign: "top" },
  );
  footer(s, 18);
}

pptx.writeFile({ fileName: "SmartBid-2.0-Leadership-Deck.pptx" }).then((fn) => {
  console.log("Deck generated:", fn);
});
