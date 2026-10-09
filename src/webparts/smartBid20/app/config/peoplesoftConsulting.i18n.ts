/**
 * Peoplesoft Consulting page texts (English / Portuguese).
 * Covers the page chrome, table headers, How it Works and the guided tour.
 * Table cell data is never translated.
 */

export type PeoplesoftLang = "en" | "pt";
export type PeoplesoftSourceKey = "financials" | "brazil";
export type PeoplesoftViewKey = "priceConsulting" | "activeRegistered";
export type PeoplesoftTourStepId =
  | "header"
  | "language"
  | "search"
  | "sources"
  | "views"
  | "legend"
  | "filters"
  | "businessUnits"
  | "columns"
  | "table"
  | "hscroll"
  | "pagination"
  | "rates"
  | "external"
  | "help";

export const PEOPLESOFT_LANG_STORAGE_KEY =
  "smartbid.peoplesoftConsulting.language";

/** Tour order; steps whose target is not on screen are skipped by the tour. */
export const PEOPLESOFT_TOUR_ORDER: PeoplesoftTourStepId[] = [
  "header",
  "language",
  "search",
  "sources",
  "views",
  "legend",
  "filters",
  "businessUnits",
  "columns",
  "table",
  "hscroll",
  "pagination",
  "rates",
  "external",
  "help",
];

export interface IPeoplesoftColumnHeaders {
  photo: string;
  businessUnit: string;
  partNumber: string;
  description: string;
  lastOrderDate: string;
  cost: string;
  leadTime: string;
  vendor: string;
  mfgName: string;
  mfgRef: string;
  qtyAvail: string;
  qtyOnHand: string;
}

export interface IPeoplesoftHelpSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface IPeoplesoftConsultingText {
  title: string;
  loadingSubtitle: string;
  loadingMessage: string;
  errorSubtitle: string;
  itemsOf: (filtered: string, total: string) => string;
  ratesUpdated: (date: string) => string;
  howItWorks: string;
  howItWorksTitle: string;
  externalView: string;
  externalViewTitle: string;
  languageAria: string;
  searchPlaceholder: string;
  searchAria: string;
  searching: string;
  clearSearch: string;
  allViews: string;
  allViewsTitle: string;
  countTitle: string;
  dataSourceAria: string;
  sourceViews: (source: string) => string;
  sourceHints: Record<PeoplesoftSourceKey, string>;
  views: Record<PeoplesoftViewKey, string>;
  aboutThisView: string;
  viewLegends: Record<PeoplesoftSourceKey, Record<PeoplesoftViewKey, string>>;
  filterThisView: string;
  filterColumnAria: string;
  filterValueAria: string;
  filterBy: (column: string) => string;
  filterValuePlaceholder: string;
  removeFilter: string;
  addFilter: string;
  businessUnits: string;
  columns: string;
  filterByBusinessUnit: string;
  selectedOf: (selected: number, total: number) => string;
  selectAll: string;
  clearAll: string;
  noBusinessUnits: string;
  headers: IPeoplesoftColumnHeaders;
  emptyTable: string;
  showing: (from: string, to: string, total: string) => string;
  pageOf: (page: number, total: number) => string;
  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
  scrollLeft: string;
  scrollRight: string;
  scrollBarAria: string;
  footerUpdate: string;
  footerCreatedBy: string;
  photoAlt: string;
  help: {
    title: string;
    close: string;
    tourTitle: string;
    tourBody: string;
    startTour: string;
    contents: string;
    pagesTitle: string;
    pagesIntro: string;
    overview: IPeoplesoftHelpSection;
    navigation: IPeoplesoftHelpSection;
    search: IPeoplesoftHelpSection;
    filters: IPeoplesoftHelpSection;
    table: IPeoplesoftHelpSection;
    costs: IPeoplesoftHelpSection;
    external: IPeoplesoftHelpSection;
    refreshNote: string;
  };
  tour: {
    next: string;
    back: string;
    skip: string;
    finish: string;
    close: string;
    stepOf: (step: number, total: number) => string;
    steps: Record<PeoplesoftTourStepId, { title: string; body: string }>;
  };
}

const EN: IPeoplesoftConsultingText = {
  title: "Peoplesoft Consulting",
  loadingSubtitle: "Loading catalog data...",
  loadingMessage: "Loading Peoplesoft data from SharePoint...",
  errorSubtitle: "Error loading data",
  itemsOf: (filtered, total) => `${filtered} of ${total} items`,
  ratesUpdated: (date) => `Updated ${date}`,
  howItWorks: "How it Works",
  howItWorksTitle: "Learn how to use this page and start the guided tour",
  externalView: "External View",
  externalViewTitle: "Open in fullscreen external view",
  languageAria: "Page language",
  searchPlaceholder:
    "Search Peoplesoft Financials and Peoplesoft Brazil by part number or description...",
  searchAria:
    "Search every Peoplesoft Consulting view by part number or description",
  searching: "Searching...",
  clearSearch: "Clear search (Esc)",
  allViews: "All views",
  allViewsTitle: "Applies to every source and view below",
  countTitle: "Matches for the general search and the filters of each view",
  dataSourceAria: "Data source",
  sourceViews: (source) => `${source} views`,
  sourceHints: {
    financials:
      "Purchase history and manufacturer registrations from Peoplesoft Financials.",
    brazil:
      "Purchase history, stock and manufacturer registrations from the Peoplesoft Brazil business units.",
  },
  views: {
    priceConsulting: "Price Consulting",
    activeRegistered: "Active Registered with Manuf.",
  },
  aboutThisView: "About this view",
  viewLegends: {
    financials: {
      priceConsulting:
        "Last price paid for each part number, converted to USD, with the last order date and lead time.",
      activeRegistered:
        "Active items registered with their manufacturer name and manufacturer reference (MFG REF), plus the last order date. Use it to find OEM references.",
    },
    brazil: {
      priceConsulting:
        "Last price paid in Brazil (BRL converted to USD), vendor, last order date and lead time calculated from the purchase order dates.",
      activeRegistered:
        "Active items in Brazil with quantity available and on hand, manufacturer, manufacturer reference and vendor.",
    },
  },
  filterThisView: "Filter this view",
  filterColumnAria: "Filter column",
  filterValueAria: "Filter value",
  filterBy: (column) => `Filter by ${column.toLowerCase()}...`,
  filterValuePlaceholder: "Filter value...",
  removeFilter: "Remove filter",
  addFilter: "+ Add Filter",
  businessUnits: "Business Units",
  columns: "Columns",
  filterByBusinessUnit: "Filter by Business Unit",
  selectedOf: (selected, total) => `${selected} of ${total} selected`,
  selectAll: "Select All",
  clearAll: "Clear All",
  noBusinessUnits: "No Business Units available",
  headers: {
    photo: "Photo",
    businessUnit: "BUSINESS UNIT",
    partNumber: "PART NUMBER",
    description: "DESCRIPTION",
    lastOrderDate: "LAST ORDER DATE",
    cost: "COST (USD)",
    leadTime: "LEAD TIME",
    vendor: "VENDOR",
    mfgName: "MFG NAME",
    mfgRef: "MFG REF",
    qtyAvail: "QTY AVAIL",
    qtyOnHand: "QTY ON HAND",
  },
  emptyTable:
    "No results found. Try different search criteria or adjust filters.",
  showing: (from, to, total) => `Showing ${from}-${to} of ${total} items`,
  pageOf: (page, total) => `Page ${page} of ${total}`,
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  scrollLeft: "Scroll table left",
  scrollRight: "Scroll table right",
  scrollBarAria: "Horizontal table scroll",
  footerUpdate: "Update Date: Automatic update every morning.",
  footerCreatedBy: "Created By: Raphael Costa",
  photoAlt: "Equipment photo",
  help: {
    title: "How it Works",
    close: "Close (Esc)",
    tourTitle: "Take the guided tour",
    tourBody:
      "A step by step walkthrough that points at each part of the page. It takes about one minute.",
    startTour: "Start guided tour",
    contents: "On this page",
    pagesTitle: "What each page brings",
    pagesIntro:
      "Pick a source first, then one of its views. These are the four pages available:",
    overview: {
      title: "What is Peoplesoft Consulting?",
      paragraphs: [
        "Peoplesoft Consulting lets you look up purchase and registration data exported from Peoplesoft without opening the ERP.",
        "Use it to find the last price paid for a part, its lead time, its manufacturer and manufacturer reference and, for Brazil, the stock on hand.",
      ],
    },
    navigation: {
      title: "Navigating between pages",
      paragraphs: [
        "The page has two levels of tabs. First choose a data source in the folder tabs (Peoplesoft Financials or Peoplesoft Brazil), then choose one of its views in the pills inside the panel.",
        "Each view keeps its own filters, sorting and visible columns, so you can switch back and forth without losing your work.",
      ],
    },
    search: {
      title: "Searching",
      bullets: [
        "The general search at the top looks at every source and view at once, by part number or description.",
        "Type at least 2 characters. With several words, every word must appear, in any order.",
        "The badge on each tab shows how many matches that source or view has, so you know where to look.",
        "Press Esc or click the X to clear the search.",
      ],
    },
    filters: {
      title: "Using the filters",
      bullets: [
        "Filter this view: pick a column and type a value. It only affects the view you are in.",
        "Price Consulting has one filter (part number, description and, in Peoplesoft Brazil, vendor).",
        "Active Registered with Manuf. accepts up to 3 filters combined (all must match). Use + Add Filter and the X to remove one.",
        "Business Units: choose which units are shown. Select All and Clear All help with quick changes.",
        "Columns: show or hide the columns of the current view.",
      ],
    },
    table: {
      title: "Reading the table",
      bullets: [
        "Click a column header to sort. Click it again to reverse the order.",
        "Drag the right edge of a header to resize the column.",
        "Click a photo to open it in full size.",
        "When the columns do not fit on screen, use the bar above the table, rest the mouse on the arrows at the table edges (they keep scrolling while the mouse stays on them) or use Shift + mouse wheel.",
        "Results are shown 100 per page. Use the buttons below the table to change pages.",
      ],
    },
    costs: {
      title: "Costs and currencies",
      bullets: [
        "All costs are shown in USD.",
        "Peoplesoft Financials prices are converted from their original currency. Peoplesoft Brazil prices are converted from BRL.",
        "The exchange rates used appear at the top of the page with their last update date. They come from the SmartBid system configuration.",
        "In Peoplesoft Brazil, the lead time is the number of days between the purchase order date and its due date.",
      ],
    },
    external: {
      title: "External View",
      paragraphs: ["Opens the page in a new browser tab, in full screen."],
    },
    refreshNote: "Data is refreshed automatically every morning.",
  },
  tour: {
    next: "Next",
    back: "Back",
    skip: "Skip tour",
    finish: "Finish",
    close: "Close tour",
    stepOf: (step, total) => `Step ${step} of ${total}`,
    steps: {
      header: {
        title: "Welcome to Peoplesoft Consulting",
        body: "This tour shows how to find prices, lead times, manufacturers and stock in the Peoplesoft data. It takes about one minute.",
      },
      language: {
        title: "Choose your language",
        body: "Switch the whole page between English and Portuguese. Your choice is remembered on this browser.",
      },
      search: {
        title: "Search everything at once",
        body: "Type a part number or a description (at least 2 characters). The search runs on every source and view at the same time.",
      },
      sources: {
        title: "Pick a data source",
        body: "Peoplesoft Financials or Peoplesoft Brazil. While you search, the badge on each tab shows how many matches it has.",
      },
      views: {
        title: "Choose a view",
        body: "Price Consulting shows last prices and lead times. Active Registered with Manuf. shows manufacturers, references and, for Brazil, stock.",
      },
      legend: {
        title: "Know what you are looking at",
        body: "This note explains what the current view contains. Hover any tab to see the same summary.",
      },
      filters: {
        title: "Filter this view",
        body: "Pick a column and type a value. In Active Registered with Manuf. you can combine up to 3 filters with + Add Filter.",
      },
      businessUnits: {
        title: "Business Units",
        body: "Show only the units you care about. The badge shows how many are selected.",
      },
      columns: {
        title: "Show or hide columns",
        body: "Keep only the columns you need for this view.",
      },
      table: {
        title: "Work with the results",
        body: "Click a header to sort, drag its right edge to resize the column and click a photo to enlarge it.",
      },
      hscroll: {
        title: "See every column",
        body: "Use this bar above the table, or rest the mouse on the arrows at the table edges, to move the table left and right. Shift + mouse wheel works too.",
      },
      pagination: {
        title: "Browse the pages",
        body: "Results come 100 per page. Use these buttons to move between pages.",
      },
      rates: {
        title: "Exchange rates",
        body: "Costs are converted to USD with these rates from the SmartBid configuration.",
      },
      external: {
        title: "External View",
        body: "Open the page in a new browser tab, in full screen.",
      },
      help: {
        title: "Need help again?",
        body: "Open How it Works at any time to read the guide or restart this tour.",
      },
    },
  },
};

const PT: IPeoplesoftConsultingText = {
  title: "Peoplesoft Consulting",
  loadingSubtitle: "Carregando dados do catálogo...",
  loadingMessage: "Carregando dados do Peoplesoft do SharePoint...",
  errorSubtitle: "Erro ao carregar os dados",
  itemsOf: (filtered, total) => `${filtered} de ${total} itens`,
  ratesUpdated: (date) => `Atualizado em ${date}`,
  howItWorks: "Como Funciona",
  howItWorksTitle: "Aprenda a usar esta página e inicie o tour guiado",
  externalView: "Visão Externa",
  externalViewTitle: "Abrir em tela cheia em uma nova aba",
  languageAria: "Idioma da página",
  searchPlaceholder:
    "Pesquise no Peoplesoft Financials e no Peoplesoft Brazil por part number ou descrição...",
  searchAria:
    "Pesquisar em todas as visões do Peoplesoft Consulting por part number ou descrição",
  searching: "Pesquisando...",
  clearSearch: "Limpar pesquisa (Esc)",
  allViews: "Todas as visões",
  allViewsTitle: "Vale para todas as fontes e visões abaixo",
  countTitle: "Resultados da pesquisa geral somados aos filtros de cada visão",
  dataSourceAria: "Fonte de dados",
  sourceViews: (source) => `Visões do ${source}`,
  sourceHints: {
    financials:
      "Histórico de compras e cadastros de fabricante do Peoplesoft Financials.",
    brazil:
      "Histórico de compras, estoque e cadastros de fabricante das unidades do Peoplesoft Brazil.",
  },
  views: {
    priceConsulting: "Consulta de Preços",
    activeRegistered: "Ativos Registrados com Fabricante",
  },
  aboutThisView: "Sobre esta visão",
  viewLegends: {
    financials: {
      priceConsulting:
        "Último preço pago por part number, convertido para USD, com a data do último pedido e o prazo de entrega.",
      activeRegistered:
        "Itens ativos cadastrados com o nome do fabricante e a referência do fabricante (MFG REF), além da data do último pedido. Use para encontrar referências do fabricante original (OEM).",
    },
    brazil: {
      priceConsulting:
        "Último preço pago no Brasil (BRL convertido para USD), fornecedor, data do último pedido e prazo de entrega calculado pelas datas do pedido de compra.",
      activeRegistered:
        "Itens ativos no Brasil com quantidade disponível e em estoque, fabricante, referência do fabricante e fornecedor.",
    },
  },
  filterThisView: "Filtrar esta visão",
  filterColumnAria: "Coluna do filtro",
  filterValueAria: "Valor do filtro",
  filterBy: (column) => `Filtrar por ${column.toLowerCase()}...`,
  filterValuePlaceholder: "Valor do filtro...",
  removeFilter: "Remover filtro",
  addFilter: "+ Adicionar Filtro",
  businessUnits: "Unidades de Negócio",
  columns: "Colunas",
  filterByBusinessUnit: "Filtrar por Unidade de Negócio",
  selectedOf: (selected, total) => `${selected} de ${total} selecionadas`,
  selectAll: "Selecionar Todas",
  clearAll: "Limpar Todas",
  noBusinessUnits: "Nenhuma Unidade de Negócio disponível",
  headers: {
    photo: "Foto",
    businessUnit: "UNIDADE DE NEGÓCIO",
    partNumber: "PART NUMBER",
    description: "DESCRIÇÃO",
    lastOrderDate: "DATA DO ÚLTIMO PEDIDO",
    cost: "CUSTO (USD)",
    leadTime: "PRAZO DE ENTREGA",
    vendor: "FORNECEDOR",
    mfgName: "FABRICANTE",
    mfgRef: "REF. FABRICANTE",
    qtyAvail: "QTD. DISPONÍVEL",
    qtyOnHand: "QTD. EM ESTOQUE",
  },
  emptyTable:
    "Nenhum resultado encontrado. Tente outros termos de pesquisa ou ajuste os filtros.",
  showing: (from, to, total) => `Exibindo ${from}-${to} de ${total} itens`,
  pageOf: (page, total) => `Página ${page} de ${total}`,
  firstPage: "Primeira página",
  previousPage: "Página anterior",
  nextPage: "Próxima página",
  lastPage: "Última página",
  scrollLeft: "Rolar a tabela para a esquerda",
  scrollRight: "Rolar a tabela para a direita",
  scrollBarAria: "Rolagem horizontal da tabela",
  footerUpdate: "Data de Atualização: atualização automática todas as manhãs.",
  footerCreatedBy: "Criado por: Raphael Costa",
  photoAlt: "Foto do equipamento",
  help: {
    title: "Como Funciona",
    close: "Fechar (Esc)",
    tourTitle: "Faça o tour guiado",
    tourBody:
      "Um passo a passo que aponta para cada parte da página. Leva cerca de um minuto.",
    startTour: "Iniciar tour guiado",
    contents: "Nesta página",
    pagesTitle: "O que cada página traz",
    pagesIntro:
      "Escolha primeiro uma fonte e depois uma de suas visões. Estas são as quatro páginas disponíveis:",
    overview: {
      title: "O que é o Peoplesoft Consulting?",
      paragraphs: [
        "O Peoplesoft Consulting permite consultar dados de compras e cadastros exportados do Peoplesoft sem precisar abrir o ERP.",
        "Use para encontrar o último preço pago por uma peça, o prazo de entrega, o fabricante e a referência do fabricante e, no Brasil, o estoque disponível.",
      ],
    },
    navigation: {
      title: "Navegando entre as páginas",
      paragraphs: [
        "A página tem dois níveis de abas. Primeiro escolha a fonte de dados nas abas de pasta (Peoplesoft Financials ou Peoplesoft Brazil) e depois escolha uma de suas visões nos botões dentro do painel.",
        "Cada visão guarda seus próprios filtros, ordenação e colunas visíveis, então você pode alternar entre elas sem perder o que já fez.",
      ],
    },
    search: {
      title: "Pesquisando",
      bullets: [
        "A pesquisa geral no topo procura em todas as fontes e visões ao mesmo tempo, por part number ou descrição.",
        "Digite pelo menos 2 caracteres. Com várias palavras, todas precisam aparecer, em qualquer ordem.",
        "O contador em cada aba mostra quantos resultados aquela fonte ou visão tem, para você saber onde procurar.",
        "Pressione Esc ou clique no X para limpar a pesquisa.",
      ],
    },
    filters: {
      title: "Usando os filtros",
      bullets: [
        "Filtrar esta visão: escolha uma coluna e digite um valor. O filtro vale apenas para a visão atual.",
        "Consulta de Preços tem um filtro (part number, descrição e, no Peoplesoft Brazil, fornecedor).",
        "Ativos Registrados com Fabricante aceita até 3 filtros combinados (todos precisam bater). Use + Adicionar Filtro e o X para remover.",
        "Unidades de Negócio: escolha quais unidades aparecem. Selecionar Todas e Limpar Todas ajudam nas mudanças rápidas.",
        "Colunas: mostre ou esconda as colunas da visão atual.",
      ],
    },
    table: {
      title: "Lendo a tabela",
      bullets: [
        "Clique no cabeçalho de uma coluna para ordenar. Clique de novo para inverter a ordem.",
        "Arraste a borda direita de um cabeçalho para ajustar a largura da coluna.",
        "Clique em uma foto para abri-la em tamanho maior.",
        "Quando as colunas não cabem na tela, use a barra acima da tabela, pare o mouse sobre as setas nas bordas da tabela (elas continuam rolando enquanto o mouse estiver em cima) ou use Shift + roda do mouse.",
        "Os resultados aparecem 100 por página. Use os botões abaixo da tabela para trocar de página.",
      ],
    },
    costs: {
      title: "Custos e moedas",
      bullets: [
        "Todos os custos são exibidos em USD.",
        "Os preços do Peoplesoft Financials são convertidos da moeda original. Os preços do Peoplesoft Brazil são convertidos de BRL.",
        "As taxas de câmbio usadas aparecem no topo da página com a data da última atualização. Elas vêm da configuração do sistema do SmartBid.",
        "No Peoplesoft Brazil, o prazo de entrega é o número de dias entre a data do pedido de compra e a data prevista de entrega.",
      ],
    },
    external: {
      title: "Visão Externa",
      paragraphs: [
        "Abre a página em uma nova aba do navegador, em tela cheia.",
      ],
    },
    refreshNote: "Os dados são atualizados automaticamente todas as manhãs.",
  },
  tour: {
    next: "Próximo",
    back: "Voltar",
    skip: "Pular tour",
    finish: "Concluir",
    close: "Fechar tour",
    stepOf: (step, total) => `Passo ${step} de ${total}`,
    steps: {
      header: {
        title: "Bem-vindo ao Peoplesoft Consulting",
        body: "Este tour mostra como encontrar preços, prazos, fabricantes e estoque nos dados do Peoplesoft. Leva cerca de um minuto.",
      },
      language: {
        title: "Escolha o idioma",
        body: "Alterne a página inteira entre inglês e português. Sua escolha fica salva neste navegador.",
      },
      search: {
        title: "Pesquise em tudo de uma vez",
        body: "Digite um part number ou uma descrição (pelo menos 2 caracteres). A pesquisa roda em todas as fontes e visões ao mesmo tempo.",
      },
      sources: {
        title: "Escolha a fonte de dados",
        body: "Peoplesoft Financials ou Peoplesoft Brazil. Durante a pesquisa, o contador em cada aba mostra quantos resultados ela tem.",
      },
      views: {
        title: "Escolha uma visão",
        body: "Consulta de Preços mostra últimos preços e prazos. Ativos Registrados com Fabricante mostra fabricantes, referências e, no Brasil, estoque.",
      },
      legend: {
        title: "Entenda o que você está vendo",
        body: "Esta nota explica o que a visão atual contém. Passe o mouse sobre qualquer aba para ver o mesmo resumo.",
      },
      filters: {
        title: "Filtre esta visão",
        body: "Escolha uma coluna e digite um valor. Em Ativos Registrados com Fabricante você pode combinar até 3 filtros com + Adicionar Filtro.",
      },
      businessUnits: {
        title: "Unidades de Negócio",
        body: "Mostre apenas as unidades que interessam. O contador indica quantas estão selecionadas.",
      },
      columns: {
        title: "Mostre ou esconda colunas",
        body: "Deixe visíveis apenas as colunas que você precisa nesta visão.",
      },
      table: {
        title: "Trabalhe com os resultados",
        body: "Clique em um cabeçalho para ordenar, arraste a borda direita para ajustar a largura e clique em uma foto para ampliá-la.",
      },
      hscroll: {
        title: "Veja todas as colunas",
        body: "Use esta barra acima da tabela, ou pare o mouse sobre as setas nas bordas da tabela, para mover a tabela para os lados. Shift + roda do mouse também funciona.",
      },
      pagination: {
        title: "Navegue pelas páginas",
        body: "Os resultados aparecem 100 por página. Use estes botões para trocar de página.",
      },
      rates: {
        title: "Taxas de câmbio",
        body: "Os custos são convertidos para USD com estas taxas da configuração do SmartBid.",
      },
      external: {
        title: "Visão Externa",
        body: "Abre a página em uma nova aba do navegador, em tela cheia.",
      },
      help: {
        title: "Precisa de ajuda de novo?",
        body: "Abra o Como Funciona a qualquer momento para ler o guia ou refazer este tour.",
      },
    },
  },
};

export const PEOPLESOFT_TEXT: Record<
  PeoplesoftLang,
  IPeoplesoftConsultingText
> = { en: EN, pt: PT };

/** Portuguese (PT-BR) is the default; English only when the user picked it. */
export function readPeoplesoftLang(): PeoplesoftLang {
  try {
    return window.localStorage.getItem(PEOPLESOFT_LANG_STORAGE_KEY) === "en"
      ? "en"
      : "pt";
  } catch {
    return "pt";
  }
}

export function savePeoplesoftLang(lang: PeoplesoftLang): void {
  try {
    window.localStorage.setItem(PEOPLESOFT_LANG_STORAGE_KEY, lang);
  } catch {
    // Storage blocked (private mode / policy): keep the in-memory choice only
  }
}
