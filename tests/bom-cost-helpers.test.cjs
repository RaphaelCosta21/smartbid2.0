const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

const app = path.resolve(__dirname, "../src/webparts/smartBid20/app");

function load(relative) {
  const filename = path.resolve(app, relative);
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
    },
  }).outputText;
  vm.runInThisContext(`(function(require, module, exports) { ${code}\n})`, {
    filename,
  })(require, module, module.exports);
  return module.exports;
}

const h = load("utils/bomCostHelpers.ts");

const item = (id, parentId, level, overrides = {}) => ({
  id,
  parentId,
  level,
  findNumber: "1",
  partNumber: id,
  description: id,
  revision: "",
  qty: 1,
  costPerItemUSD: 0,
  contingencyPercent: 0,
  totalCostInclCont: 0,
  leadTimeDays: 0,
  costReference: "",
  dateReference: "",
  comments: "",
  sourceTab: "",
  originalCurrency: "",
  originalCost: 0,
  isManual: false,
  isRolledUp: false,
  ...overrides,
});

const priced = (id, parentId, level, cost, overrides = {}) =>
  item(id, parentId, level, {
    costPerItemUSD: cost,
    totalCostInclCont: cost,
    sourceTab: "BUMBL",
    ...overrides,
  });

test("children of a parent with own cost leave both sides of Costed", () => {
  const items = [
    priced("root", null, 1, 100),
    item("a", "root", 2),
    priced("b", "root", 2, 5),
  ];
  const cov = h.getBomCoverage(items);
  assert.equal(cov.covered, 2);
  assert.equal(cov.eligible, 1);
  assert.equal(cov.costed, 1);
  assert.deepEqual(cov.missingIds, []);
  assert.equal(cov.isComplete, true);
  assert.equal(cov.statuses.get("a"), "covered");
});

test("manual row with cost 0 is missing", () => {
  const items = [
    item("root", null, 1, { isRolledUp: true, sourceTab: "manual" }),
    item("a", "root", 2, { isManual: true, sourceTab: "manual" }),
    priced("b", "root", 2, 5),
  ];
  const cov = h.getBomCoverage(items);
  assert.deepEqual(cov.missingIds, ["a"]);
  assert.equal(cov.costed, 2);
  assert.equal(cov.eligible, 3);
  assert.equal(cov.isComplete, false);
  assert.equal(cov.statuses.get("root"), "partial");
});

test("rolled-up parent is complete when every child has a cost", () => {
  const rolled = h.rollUpParentCosts([
    item("root", null, 1),
    priced("a", "root", 2, 10),
    priced("b", "root", 2, 20),
  ]);
  const cov = h.getBomCoverage(rolled);
  assert.equal(cov.statuses.get("root"), "rolled");
  assert.equal(cov.isComplete, true);
  assert.equal(h.computeSmartTotal(rolled), 30);
});

test("smart total does not double count a parent with own cost", () => {
  const items = [
    priced("root", null, 1, 100),
    priced("a", "root", 2, 40),
    priced("b", "root", 2, 30),
  ];
  assert.equal(h.computeSmartTotal(items), 100);
});

test("missing ids follow tree order and ancestors resolve root-first", () => {
  const items = [
    item("root", null, 1, { isRolledUp: true, sourceTab: "manual" }),
    item("a", "root", 2),
    item("a1", "a", 3),
    item("b", "root", 2),
  ];
  const cov = h.getBomCoverage(items);
  assert.deepEqual(cov.missingIds, ["a", "a1", "b"]);
  assert.deepEqual(h.getAncestorIds("a1", items), ["root", "a"]);
});
