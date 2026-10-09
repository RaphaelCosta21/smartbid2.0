const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");
const { JSDOM } = require("jsdom");

// Install a DOM before loading ReactDOM so focus/change events use the browser path.
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
global.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
// React 17's scheduler does not close Node's MessageChannel ports after DOM tests.
global.MessageChannel = undefined;

const React = require("react");
const ReactDOM = require("react-dom");
const { act, Simulate } = require("react-dom/test-utils");
const app = path.resolve(__dirname, "../src/webparts/smartBid20/app");
const cache = new Map();
const Empty = () => null;
let config;
let locks;
let container;
const spfxContext = {
  msGraphClientFactory: { getClient: async () => ({}) },
};
const costSummary = Object.fromEntries(
  [
    "engineeringHoursCostBRL", "onshoreHoursCostBRL", "offshoreHoursCostBRL",
    "logisticsCostBRL", "certificationsCostBRL", "rtsCostBRL",
    "mobilizationCostBRL", "consumablesCostBRL", "assetsCapexUSD",
    "assetsOpexUSD", "totalCostUSD",
  ].map((key) => [key, 0]),
);
const stubs = {
  "../common/StatusBadge": {
    StatusBadge: ({ status }) => React.createElement("span", null, status),
  },
  "../common/EditLockBanner": { EditLockBanner: Empty },
  "../approval/ApprovalOverrideBanner": { ApprovalOverrideBanner: Empty },
  "../../stores/useConfigStore": {
    useConfigStore: (select) => select({ config }),
  },
  "../../stores/useUIStore": {
    useUIStore: (select) => select({ addToast: () => {} }),
  },
  "../../hooks/useConfigPhases": { useConfigPhases: () => [] },
  "../../hooks/useEditControl": {
    useEditControl: (_, section) => {
      if (!locks[section]) {
        locks[section] = {
          loading: false,
          releases: 0,
          startEditing: async () => true,
          stopEditing: () => locks[section].releases++,
        };
      }
      return locks[section];
    },
  },
  "../../hooks/useColorTheme": {
    useColorTheme: () => ({ accents: { a600: "var(--primary-accent)" } }),
  },
  "../../config/SpfxContext": { useSpfxContext: () => spfxContext },
  "../../services/MembersService": {},
  "../../services/CurrencyService": {
    CurrencyService: {
      getRatesWithFallback: async () => [{ currency: "BRL", rate: 5 }],
    },
  },
  "../../utils/statusHelpers": { isTerminalStatus: () => false },
  "../../utils/constants": { PRIORITY_COLORS: {} },
  "../../utils/approvalHelpers": { getActiveApprovalOverride: () => null },
  "../../utils/revisionHelpers": { DUE_DATE_CHANGED: "DUE_DATE_CHANGED" },
  "../../utils/formatters": {
    formatDate: (value) => value,
    formatDateTime: (value) => value,
    formatCurrency: (value) => String(value),
    getDaysUntil: () => null,
  },
  "../../utils/bidHelpers": { getDueFreezeDate: () => undefined },
  "../../utils/costCalculations": {
    buildCostSummary: () => ({ ...costSummary, ptaxUsed: 1 }),
    calculateAssetsByResourceType: () => [],
    getBidContingency: () => ({}),
  },
  "./EmptySection": { EmptySection: Empty },
  "./TechnicalProposalChip": { TechnicalProposalChip: Empty },
  "../../utils/technicalProposalHelpers": {
    getTechnicalProposalState: () => "not-requested",
  },
  "../../utils/phaseHelpers": { getPhaseLabelForBid: () => "Analysis" },
  "../../utils/durationHelpers": { calcElapsedDays: () => 0 },
  "./RevisionsTab": {
    getCurrentRevisionLetter: () => "A",
    hasActiveRevision: () => false,
  },
  "./ErnCreateModal": { ErnCreateModal: Empty },
  "./ErnDetailsModal": { ErnDetailsModal: Empty },
  "./ErnSearchModal": { ErnSearchModal: Empty },
  "./DueDateChangeModal": { DueDateChangeModal: Empty },
  "../../utils/ernHelpers": { getErnSlots: () => [] },
  "../../config/sharepoint.config": { SHAREPOINT_CONFIG: { ern: {} } },
};

function load(relative) {
  const filename = path.resolve(app, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      jsx: ts.JsxEmit.React,
    },
  }).outputText;
  const requireFromFile = (name) => {
    if (name.endsWith(".scss"))
      return { default: new Proxy({}, { get: (_, key) => key }) };
    if (name.endsWith("/stores/useConfigStore"))
      return stubs["../../stores/useConfigStore"];
    if (filename.endsWith("OverviewTab.tsx") && stubs[name]) return stubs[name];
    if (!name.startsWith(".")) return require(name);
    const target = path.resolve(path.dirname(filename), name);
    const extension = [".ts", ".tsx"].find((ext) => fs.existsSync(target + ext));
    return load(extension ? target + extension : path.join(target, "index.ts"));
  };
  vm.runInThisContext(`(function(require, module, exports) { ${code}\n})`, {
    filename,
  })(requireFromFile, module, module.exports);
  return module.exports;
}

const { OverviewTab } = load("components/bid/OverviewTab.tsx");
const { withCurrentOption } = load("utils/clarificationHelpers.ts");
const makeBid = () => ({
  bidNumber: "test-bid",
  crmNumber: "CRM-1",
  division: "Legacy division",
  serviceLine: "Legacy service",
  bidType: "Legacy type",
  bidSize: "Small",
  priority: "Normal",
  currentStatus: "In Progress",
  currentPhase: "Analysis",
  approvalStatus: "not-started",
  opportunityInfo: {
    projectName: "Original project",
    client: "Legacy client",
    clientContact: "Original contact",
    region: "Legacy region",
    vessel: "Original vessel",
    field: "Original field",
    waterDepth: 150,
    waterDepthUnit: "ft",
    operationStartDate: "2026-11-16",
    totalDuration: 2,
    totalDurationUnit: "weeks",
    projectDescription: "Commercial description",
    currency: "USD",
    ptax: 4,
    ptaxDate: "2026-10-01",
    exchangeRatesSnapshot: [{ currency: "BRL", rate: 4 }],
    qualifications: ["Original qualification"],
  },
  activityLog: [],
  bidNotes: { Analysis: "Original analysis", general: "Commercial note" },
  engineerBidOverview: "Original overview",
});

test.beforeEach(() => {
  config = {};
  locks = {};
  container = document.createElement("div");
  document.body.appendChild(container);
});
test.afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});
test.after(() => dom.window.close());

function mount(initial = makeBid(), canEdit = true) {
  const patches = [];
  let bid = initial;
  function Harness() {
    const [current, setCurrent] = React.useState(initial);
    return React.createElement(OverviewTab, {
      bid: current,
      currentPhaseIndex: 0,
      canEdit,
      currentUser: { displayName: "Test User", email: "test@example.com" },
      onSave: (patch) => {
        patches.push(patch);
        // Simulate the persisted BID returning through the parent/store.
        bid = JSON.parse(JSON.stringify({ ...bid, ...patch }));
        setCurrent(bid);
      },
    });
  }
  act(() => { ReactDOM.render(React.createElement(Harness), container); });
  return { patches, get bid() { return bid; } };
}

function card(title) {
  const heading = Array.from(container.querySelectorAll("h4"))
    .find((el) => el.textContent === title);
  assert.ok(heading, `Missing card ${title}`);
  return heading.closest(".infoSection");
}
function row(section, label) {
  const item = Array.from(section.querySelectorAll(".infoItem"))
    .find((el) => el.querySelector(".infoLabel").textContent.startsWith(label));
  assert.ok(item, `Missing field ${label}`);
  return item;
}
function control(section, label) {
  const input = row(section, label).querySelector("input, select, textarea");
  assert.ok(input, `Missing editable control ${label}`);
  return input;
}
async function click(section, text) {
  const button = Array.from(section.querySelectorAll("button"))
    .find((el) => el.textContent === text);
  assert.ok(button, `Missing button ${text}`);
  await act(async () => { Simulate.click(button); });
}
function change(input, value) {
  act(() => {
    input.value = value;
    Simulate.change(input);
  });
}
function type(section, label, text) {
  const input = control(section, label);
  input.focus();
  for (let i = 1; i <= text.length; i++) {
    change(input, text.slice(0, i));
    assert.equal(control(section, label), input, `${label} was remounted`);
    assert.equal(document.activeElement, input, `${label} lost focus`);
    assert.equal(input.value, text.slice(0, i));
  }
}

test("Operational Summary retains all nine fields and stored units in Edit", async () => {
  mount();
  const section = card("Operational Summary");
  const labels = Array.from(section.querySelectorAll(".infoLabel"))
    .map((el) => el.textContent);
  await click(section, "Edit");
  assert.deepEqual(
    Array.from(section.querySelectorAll(".infoLabel"))
      .map((el) => el.textContent.replace(/ \(.+\)$/, "")),
    labels,
  );
  for (const [label, value] of [
    ["Project Name", "Original project"], ["Client", "Legacy client"],
    ["Client Contact", "Original contact"], ["Region", "Legacy region"],
    ["Vessel", "Original vessel"], ["Field", "Original field"],
    ["Water Depth", "150"], ["Operation Start", "2026-11-16"], ["Duration", "2"],
  ]) assert.equal(control(section, label).value, value);
  assert.match(row(section, "Water Depth").textContent, /Water Depth \(ft\)/);
  assert.match(row(section, "Duration").textContent, /Duration \(weeks\)/);
});

test("all Operational Summary text inputs keep focus and persist through Save/Edit", async () => {
  const state = mount();
  const before = state.bid.opportunityInfo;
  const section = card("Operational Summary");
  await click(section, "Edit");
  const edits = [
    ["Project Name", "projectName", "Updated project"],
    ["Client Contact", "clientContact", "Updated contact"],
    ["Vessel", "vessel", "Updated vessel"],
    ["Field", "field", "Updated field"],
  ];
  for (const [label, , value] of edits) type(section, label, value);
  change(control(section, "Water Depth"), "200");
  change(control(section, "Duration"), "3");
  change(control(section, "Operation Start"), "2026-12-01");
  await click(section, "Save");
  assert.equal(state.patches.length, 1);
  assert.equal(locks["overview-ops"].releases, 1);
  for (const [label, key, value] of edits) {
    assert.equal(state.bid.opportunityInfo[key], value);
    assert.equal(row(section, label).querySelector(".infoValue").textContent, value);
  }
  for (const key of ["client", "region", "waterDepthUnit", "totalDurationUnit",
    "projectDescription", "currency", "ptax", "ptaxDate", "exchangeRatesSnapshot",
    "qualifications"])
    assert.deepEqual(state.bid.opportunityInfo[key], before[key]);
  assert.match(state.patches[0].activityLog[0].description, /Project Name/);
  await click(section, "Edit");
  for (const [label, , value] of edits) assert.equal(control(section, label).value, value);
  assert.equal(control(section, "Water Depth").value, "200");
  assert.equal(control(section, "Duration").value, "3");
  assert.equal(control(section, "Operation Start").value, "2026-12-01");
});

test("Project Name alone triggers saving, including clearing it", async () => {
  const state = mount();
  const section = card("Operational Summary");
  for (const value of ["Renamed project", ""]) {
    await click(section, "Edit");
    change(control(section, "Project Name"), value);
    await click(section, "Save");
    assert.equal(state.bid.opportunityInfo.projectName, value);
    assert.match(state.patches[state.patches.length - 1].activityLog.slice(-1)[0].description,
      /Project Name/);
  }
  assert.equal(state.patches.length, 2);
});

test("Cancel discards drafts; unchanged Save preserves legacy fields without a patch", async () => {
  const state = mount();
  const section = card("Operational Summary");
  await click(section, "Edit");
  type(section, "Vessel", "Discarded vessel");
  await click(section, "Cancel");
  await click(section, "Edit");
  assert.equal(control(section, "Vessel").value, "Original vessel");
  assert.equal(control(section, "Client").value, "Legacy client");
  await click(section, "Save");
  assert.equal(state.patches.length, 0);
  assert.equal(locks["overview-ops"].releases, 2);
});

test("inactive and label-only client/region values remain selected and can be changed", async () => {
  config = {
    clientList: [
      { id: "inactive", value: "Legacy client", label: "Legacy client", isActive: false },
      { id: "active", value: "client-id", label: "Active client" },
    ],
    regions: [{ id: "region", value: "region-id", label: "Legacy region" }],
  };
  const state = mount();
  const section = card("Operational Summary");
  await click(section, "Edit");
  assert.equal(control(section, "Client").value, "Legacy client");
  assert.equal(control(section, "Region").value, "Legacy region");
  change(control(section, "Client"), "client-id");
  change(control(section, "Region"), "region-id");
  await click(section, "Save");
  await click(section, "Edit");
  assert.equal(control(section, "Client").value, "client-id");
  assert.equal(control(section, "Region").value, "region-id");
  assert.equal(state.bid.opportunityInfo.projectName, "Original project");
});

test("General Information retains legacy selections and input focus", async () => {
  config = {
    divisions: [{ id: "div", value: "new-div", label: "New division" }],
    serviceLines: [
      { id: "sl", value: "new-sl", label: "New service", category: "new-div" },
      { id: "sl-other", value: "other-sl", label: "Other service", category: "new-div" },
    ],
    bidTypes: [
      { id: "type", value: "Legacy type", label: "Legacy type", isActive: false },
      { id: "type-active", value: "new-type", label: "New type" },
    ],
  };
  const state = mount();
  const section = card("General Information");
  await click(section, "Edit");
  for (const [label, value] of [
    ["Division", "Legacy division"], ["Service Line", "Legacy service"], ["Type", "Legacy type"],
  ]) assert.equal(control(section, label).value, value);
  type(section, "CRM Number", "CRM-Updated");
  type(section, "Size", "Large");
  await click(section, "Save");
  assert.equal(state.bid.crmNumber, "CRM-Updated");
  assert.equal(state.bid.bidSize, "Large");
  assert.equal(state.bid.serviceLine, "Legacy service");
  await click(section, "Edit");
  change(control(section, "Division"), "new-div");
  assert.equal(control(section, "Service Line").value, "new-sl");
  await click(section, "Save");
  assert.equal(state.bid.serviceLine, "new-sl");
  await click(section, "Edit");
  change(control(section, "Service Line"), "other-sl");
  change(control(section, "Type"), "new-type");
  await click(section, "Save");
  await click(section, "Edit");
  assert.equal(control(section, "Service Line").value, "other-sl");
  assert.equal(control(section, "Type").value, "new-type");
});

test("Engineer Overview and Analysis Notes retain focus and edited content", async () => {
  const state = mount();
  const overview = card("Engineer BID Overview");
  await click(overview, "Edit");
  const textarea = overview.querySelector("textarea");
  textarea.focus();
  change(textarea, "Updated engineering overview");
  assert.equal(document.activeElement, textarea);
  await click(overview, "Save");
  await click(overview, "Edit");
  assert.equal(overview.querySelector("textarea").value, "Updated engineering overview");
  await click(overview, "Cancel");
  const notes = card("BID Analysis Notes / Premisses");
  await click(notes, "Edit");
  const note = notes.querySelector("textarea");
  note.focus();
  change(note, "Updated analysis");
  assert.equal(document.activeElement, note);
  await click(notes, "Save");
  assert.equal(state.bid.bidNotes.Analysis, "Updated analysis");
  assert.equal(state.bid.bidNotes.general, "Commercial note");
  await click(notes, "Edit");
  assert.equal(notes.querySelector("textarea").value, "Updated analysis");
});

test("Exchange Rates refresh preserves the operational fields", async () => {
  const state = mount();
  const before = state.bid.opportunityInfo;
  const section = card("Exchange Rates");
  await click(section, "Edit");
  await click(section, "\uD83D\uDD04 Update Rates (BCB)");
  assert.equal(state.bid.opportunityInfo.ptax, 5);
  for (const key of ["projectName", "client", "vessel", "waterDepthUnit", "totalDurationUnit"])
    assert.equal(state.bid.opportunityInfo[key], before[key]);
});

test("saving an open Operational Summary draft does not revert updated exchange rates", async () => {
  const state = mount();
  const ops = card("Operational Summary");
  await click(ops, "Edit");
  type(ops, "Vessel", "Updated vessel");
  const rates = card("Exchange Rates");
  await click(rates, "Edit");
  await click(rates, "\uD83D\uDD04 Update Rates (BCB)");
  const snapshot = state.bid.opportunityInfo.exchangeRatesSnapshot;
  const rateDate = state.bid.opportunityInfo.ptaxDate;
  await click(ops, "Save");
  assert.equal(state.bid.opportunityInfo.vessel, "Updated vessel");
  assert.equal(state.bid.opportunityInfo.ptax, 5);
  assert.equal(state.bid.opportunityInfo.ptaxDate, rateDate);
  assert.deepEqual(state.bid.opportunityInfo.exchangeRatesSnapshot, snapshot);
});

test("native date control displays the calendar date of an ISO timestamp", async () => {
  const bid = makeBid();
  bid.opportunityInfo.operationStartDate = "2026-11-16T00:00:00Z";
  mount(bid);
  const section = card("Operational Summary");
  await click(section, "Edit");
  assert.equal(control(section, "Operation Start").value, "2026-11-16");
});

test("read-only Overview does not expose Edit buttons", () => {
  mount(makeBid(), false);
  assert.equal(Array.from(container.querySelectorAll("button"))
    .some((el) => el.textContent === "Edit"), false);
});

test("withCurrentOption matches values, not just labels, without duplicates or mutations", () => {
  const options = [{ id: "client", value: "client-id", label: "Client name" }];
  assert.deepEqual(withCurrentOption(options, "client-id"), [
    { value: "client-id", label: "Client name" },
  ]);
  assert.deepEqual(withCurrentOption(options, "Client name").map((o) => o.value),
    ["client-id", "Client name"]);
  assert.equal(withCurrentOption(options, "").length, 1);
  assert.equal(options.length, 1);
});