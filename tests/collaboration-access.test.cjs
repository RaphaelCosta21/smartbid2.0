const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const app = path.resolve(__dirname, "../src/webparts/smartBid20/app");
const cache = new Map();
const Container = ({ children }) => React.createElement("div", null, children);
const Empty = () => null;
const componentStubs = {
  "../common/GlassCard": { GlassCard: Container },
  "./BidComments": { BidComments: Empty },
  "./EmptySection": { EmptySection: Empty },
  "../common/EditLockBanner": { EditToolbar: Empty },
  "./ExportClarificationModal": { ExportClarificationModal: Empty },
  "./ImportClarificationModal": { ImportClarificationModal: Empty },
  "./ClarificationSuggestionsModal": { ClarificationSuggestionsModal: Empty },
  "../knowledge/ClarificationBadges": { ClarificationCategoryChip: Empty },
  "../../hooks/useEditControl": { useEditControl: () => ({ isEditing: true }) },
  "../../stores/useUIStore": { useUIStore: (select) => select({ addToast: () => {} }) },
  "../../stores/useConfigStore": { useConfigStore: (select) => select({ config: {} }) },
  "../../services/AIAnalysisService": {},
  "../../utils/aiContext": {},
  "../../utils/aiClarificationMapper": {},
  "../../utils/clarificationHelpers": { activeConfigOptions: () => [] },
  "../../utils/formatters": { formatDateTime: (value) => value },
};

function load(relative) {
  const filename = path.resolve(app, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  let code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      jsx: ts.JsxEmit.React,
    },
  }).outputText;
  if (filename.endsWith("AccessMatrix.tsx")) code += "\nexports.nextLevel = nextLevel;";
  const requireFromFile = (name) => {
    if (name.endsWith(".scss")) return new Proxy({}, { get: (_, key) => key });
    if (name.endsWith("/hooks/useColorTheme")) {
      return { resolveSemanticColor: (_, __, fallback) => fallback };
    }
    if (filename.endsWith("Tab.tsx") && componentStubs[name]) return componentStubs[name];
    if (!name.startsWith(".")) return require(name);
    const target = path.resolve(path.dirname(filename), name);
    const extension = [".ts", ".tsx"].find((ext) => fs.existsSync(target + ext));
    return load(extension ? target + extension : path.join(target, "index.ts"));
  };
  vm.runInThisContext(`(function(require, module, exports) { ${code}\n})`, { filename })(
    requireFromFile, module, module.exports,
  );
  return module.exports;
}

const config = load("config/accessControl.config.ts");
const access = load("utils/accessControl.ts");
const matrix = load("components/settings/AccessMatrix.tsx");
const { NotesTab } = load("components/bid/NotesTab.tsx");
const { QualificationsTab } = load("components/bid/QualificationsTab.tsx");
const makeBid = () => ({
  bidNumber: "test-bid",
  bidNotes: { Analysis: "Original note" },
  quickNotes: [{ id: "quick-1", text: "Quick note" }],
  comments: [{ id: "comment-1", text: "Comment" }],
  qualificationTables: [{
    id: "table-1", title: "Qualification", items: [{ id: "item-1", item: 1, description: "Requirement" }],
  }],
  clarifications: [{ id: "clar-1", description: "Clarification", isAutoImported: false }],
  scopeItems: [],
});

test("Edit* permits reading and editing but not deleting", () => {
  assert.equal(access.canViewLevel("editNoDelete"), true);
  assert.equal(access.canEditLevel("editNoDelete"), true);
  assert.equal(access.canDeleteLevel("editNoDelete"), false);
  assert.equal(access.canDeleteLevel("edit"), true);
  for (const level of ["view", "none"]) {
    assert.equal(access.canEditLevel(level), false);
    assert.equal(access.canDeleteLevel(level), false);
  }
});

test("Edit* persists through JSON normalization and inheritance", () => {
  const levels = config.normalizeBidAccessLevels({ commercial: { collaboration: "editNoDelete" } });
  const stored = JSON.parse(JSON.stringify({ bidAccessLevels: levels }));
  for (const tab of ["notes", "qualifications"]) {
    assert.equal(access.resolveBidTabLevel(stored, "commercial", tab), "editNoDelete");
  }
  assert.equal(config.normalizeBidAccessLevels(stored.bidAccessLevels).commercial.collaboration, "editNoDelete");
});

test("tab overrides may grant full Edit or View over inherited Edit*", () => {
  const levels = config.normalizeBidAccessLevels({
    commercial: { collaboration: "editNoDelete", tabs: { notes: "edit", qualifications: "view" } },
  });
  assert.equal(access.resolveBidTabLevel({ bidAccessLevels: levels }, "commercial", "notes"), "edit");
  assert.equal(access.resolveBidTabLevel({ bidAccessLevels: levels }, "commercial", "qualifications"), "view");
  delete levels.commercial.tabs.notes;
  assert.equal(access.resolveBidTabLevel({ bidAccessLevels: levels }, "commercial", "notes"), "editNoDelete");
});

test("Edit* overrides survive normalization only in Collaboration", () => {
  const levels = config.normalizeBidAccessLevels({ commercial: {
    general: "editNoDelete", tabs: { notes: "editNoDelete", scope: "editNoDelete" },
  } });
  assert.equal(levels.commercial.general, "edit");
  assert.equal(levels.commercial.tabs.notes, "editNoDelete");
  assert.equal(levels.commercial.tabs.scope, undefined);
  const pages = config.normalizeAccessLevels({ commercial: { workspace: "editNoDelete", pages: { tracker: "editNoDelete" } } });
  assert.equal(pages.commercial.workspace, "edit");
  assert.equal(pages.commercial.pages.tracker, undefined);
});

test("only Collaboration includes Edit* in its click cycle", () => {
  assert.equal(matrix.nextLevel("view", true), "editNoDelete");
  assert.equal(matrix.nextLevel("editNoDelete", true), "edit");
  assert.equal(matrix.nextLevel("edit", true), "none");
  assert.equal(matrix.nextLevel("view", false), "edit");
});

for (const [label, tab, patch] of [
  ["analysis note", "notes", { bidNotes: {} }],
  ["quick note", "notes", { quickNotes: [] }],
  ["comment", "notes", { comments: [] }],
  ["clarification", "qualifications", { clarifications: [] }],
  ["table", "qualifications", { qualificationTables: [] }],
  ["table item", "qualifications", { qualificationTables: [{ id: "table-1", items: [] }] }],
]) {
  test(`save guard detects removal of a ${label}`, () => {
    assert.equal(access.removesCollaborationContent(makeBid(), patch, tab), true);
  });
}

test("save guard allows edits, additions and unrelated patches", () => {
  const bid = makeBid();
  const updated = {
    bidNotes: { Analysis: "Edited", Additional: "New" },
    quickNotes: [...bid.quickNotes, { id: "quick-2", text: "Added" }],
    clarifications: bid.clarifications.map((c) => ({ ...c, description: "Edited" })),
    qualificationTables: bid.qualificationTables.map((t) => ({
      ...t, title: "Edited", items: [...t.items, { id: "item-2", item: 2 }],
    })),
  };
  for (const tab of ["notes", "qualifications"]) {
    assert.equal(access.removesCollaborationContent(bid, updated, tab), false);
    assert.equal(access.removesCollaborationContent(bid, { currentStatus: "Completed" }, tab), false);
  }
});

test("Notes keeps add/edit but hides both delete controls under Edit*", () => {
  const html = renderToStaticMarkup(React.createElement(NotesTab, {
    bid: makeBid(), canEdit: true, canDelete: false,
  }));
  assert.match(html, /Add Note/);
  assert.match(html, />Edit</);
  assert.doesNotMatch(html, />Delete</);
  assert.doesNotMatch(html, /\u2715/);
  const full = renderToStaticMarkup(React.createElement(NotesTab, {
    bid: makeBid(), canEdit: true, canDelete: true,
  }));
  assert.match(full, />Delete</);
  assert.match(full, /\u2715/);
});

test("Qualifications keeps editing and additions but hides removal controls under Edit*", () => {
  const html = renderToStaticMarkup(React.createElement(QualificationsTab, {
    bid: makeBid(), canEdit: true, canDelete: false,
  }));
  assert.match(html, /Add Qualification Table/);
  assert.match(html, /Add Clarification/);
  assert.match(html, /value="Requirement"/);
  assert.doesNotMatch(html, /Remove Table|\u2715/);
  const full = renderToStaticMarkup(React.createElement(QualificationsTab, {
    bid: makeBid(), canEdit: true, canDelete: true,
  }));
  assert.match(full, /Remove Table/);
  assert.match(full, /\u2715/);
});

test("View still has neither additions nor deletions", () => {
  for (const Component of [NotesTab, QualificationsTab]) {
    const html = renderToStaticMarkup(React.createElement(Component, {
      bid: makeBid(), canEdit: false, canDelete: false,
    }));
    assert.doesNotMatch(html, /Add Note|Add Qualification Table|Add Clarification|Remove Table|>Delete<|\u2715/);
  }
});