const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const app = path.resolve(__dirname, "../src/webparts/smartBid20/app");
const Empty = () => null;
let canEdit = false;

const stubs = {
  "react": React,
  "lucide-react": new Proxy({}, { get: () => Empty }),
  "../common/PageHeader": {
    PageHeader: ({ title }) => React.createElement("h1", null, title),
  },
  "../common/EmptyState": { EmptyState: Empty },
  "../insights/MultiSelectDropdown": { MultiSelectDropdown: Empty },
  "../insights/SegmentedControl": { SegmentedControl: Empty },
  "../../services/DocLibraryCatalogService": {},
  "../../services/AIAnalysisService": {},
  "../../services/SystemConfigService": {},
  "../../stores/useConfigStore": {
    useConfigStore: (select) => select({ config: null }),
  },
  "../../hooks/useDebounce": { useDebounce: (value) => value },
  "../../utils/formatters": {},
  "../../utils/idGenerator": {},
  "../../utils/docCatalogHelpers": {},
  "../hooks/usePageAccess": { usePageAccess: () => ({ canEdit }) },
  "../config/sharepoint.config": {
    SHAREPOINT_CONFIG: {
      docLibrary: {
        serverRelativeUrl: "/documents",
        folders: { manualsCatalogs: "manuals" },
      },
    },
  },
};

function load(relative) {
  const filename = path.resolve(app, relative);
  const module = { exports: {} };
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
    assert.ok(Object.hasOwn(stubs, name), `Unexpected import: ${name}`);
    return stubs[name];
  };
  vm.runInThisContext(`(function(require, module, exports) { ${code}\n})`, {
    filename,
  })(requireFromFile, module, module.exports);
  return module.exports;
}

const { DocLibraryCatalog } = load("components/knowledge/DocLibraryCatalog.tsx");
stubs["../components/knowledge/DocLibraryCatalog"] = { DocLibraryCatalog };
const { ManualsCatalogsPage } = load("pages/ManualsCatalogsPage.tsx");

for (const editable of [false, true]) {
  test(`Manuals notice is visible while loading, canEdit=${editable}`, () => {
    canEdit = editable;
    const html = renderToStaticMarkup(React.createElement(ManualsCatalogsPage));
    assert.match(html, /role="note"/);
    assert.match(html, /aria-label="Document version notice"/);
    assert.match(html, /Documents and OMMs.*may not be the latest revision/);
    assert.match(html, /consult the Engineering system or the supplier/);
    assert.match(html, /confirm and obtain the most up-to-date version/);
    assert.ok(html.indexOf('role="note"') < html.indexOf('class="filterBar"'));
    assert.match(html, /Loading documents/);
  });
}

test("shared catalog does not show a notice when none is provided", () => {
  const html = renderToStaticMarkup(
    React.createElement(DocLibraryCatalog, {
      title: "Other catalog",
      folderServerRelativeUrl: "/documents/other",
      docTypeOptions: ["Manual"],
      defaultDocType: "Manual",
      canManage: false,
    }),
  );
  assert.doesNotMatch(html, /role="note"|Document version notice/);
});