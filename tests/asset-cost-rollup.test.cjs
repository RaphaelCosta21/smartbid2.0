const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

const app = path.resolve(__dirname, "../src/webparts/smartBid20/app");
const cache = new Map();

function load(relative) {
  const filename = path.resolve(app, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
    },
  }).outputText;
  const requireFromFile = (name) => {
    if (!name.startsWith(".")) return require(name);
    const target = path.resolve(path.dirname(filename), name);
    const extension = [".ts", ".tsx"].find((ext) =>
      fs.existsSync(target + ext),
    );
    return load(extension ? target + extension : path.join(target, "index.ts"));
  };
  vm.runInThisContext(`(function(require, module, exports) { ${code}\n})`, {
    filename,
  })(requireFromFile, module, module.exports);
  return module.exports;
}

const cost = load("utils/costCalculations.ts");

const scope = (overrides = {}) => ({
  id: "si-1",
  qtyOperational: 2,
  qtySpare: 1,
  resourceSubType: "",
  subItems: [
    { id: "sub-a", qty: 2 },
    { id: "sub-b", qty: 1 },
  ],
  pcfItems: [{ id: "pcf-a", qty: 4 }],
  ...overrides,
});

const child = (subItemId, unitCostUSD, costCategory = "CAPEX") => ({
  id: `cost-${subItemId}`,
  subItemId,
  availabilityStatus: "Purchase",
  acquisitionType: "Purchase",
  unitCostUSD,
  totalCostUSD: 0,
  costReference: "",
  costCategory,
  supplier: "",
  leadTimeDays: 0,
  notes: "",
});

const fee = (id, costUSD, linkedTo) => ({
  id,
  description: id,
  costUSD,
  notes: "",
  ...(linkedTo ? { linkedTo } : {}),
});

const asset = (overrides = {}) => ({
  id: "asset-1",
  scopeItemId: "si-1",
  availabilityStatus: "Purchase",
  acquisitionType: "Purchase",
  unitCostUSD: 0,
  totalCostUSD: 0,
  costReference: "",
  costCategory: "CAPEX",
  dailyRate: null,
  rentalDays: null,
  notes: "",
  subCosts: [],
  subItemCosts: [child("sub-a", 100), child("sub-b", 50)],
  pcfCosts: [child("pcf-a", 10)],
  ...overrides,
});

test("sum of sub-items becomes the unit cost, multiplied by OP + SP", () => {
  const bd = cost.getAssetCostBreakdown(
    asset({ costFromSubItems: true, subCosts: [fee("prep", 30)] }),
    scope(),
  );
  assert.equal(bd.qty, 3);
  assert.equal(bd.rollupUnit, 250);
  assert.equal(bd.main.base, 750);
  assert.equal(bd.main.fees, 30);
  assert.equal(bd.pcfCounted, 40);
  assert.equal(bd.total, 750 + 30 + 40);
  assert.equal(bd.subItemsCounted, 750);
});

test("a fee linked to a sub-item enters the unit cost", () => {
  const bd = cost.getAssetCostBreakdown(
    asset({
      costFromSubItems: true,
      subCosts: [
        fee("prep", 30),
        fee("machining", 20, { kind: "sub", subItemId: "sub-a" }),
      ],
    }),
    scope(),
  );
  assert.equal(bd.rollupUnit, 270);
  assert.equal(bd.linkedFees, 20);
  assert.equal(bd.subItems[0].fees, 20);
  assert.equal(bd.main.fees, 30);
  assert.equal(bd.total, 270 * 3 + 30 + 40);
});

test("without the roll-up, sub-items and their linked fees are counted once", () => {
  const bd = cost.getAssetCostBreakdown(
    asset({
      unitCostUSD: 10,
      subCosts: [
        fee("prep", 30),
        fee("machining", 20, { kind: "sub", subItemId: "sub-a" }),
      ],
    }),
    scope(),
  );
  assert.equal(bd.rollupUnit, 0);
  assert.equal(bd.main.base, 30);
  assert.equal(bd.main.fees, 30);
  assert.equal(bd.subItemsCounted, 270);
  assert.equal(bd.total, 30 + 30 + 270 + 40);
});

test("without the PCF roll-up, PCF and its linked fees are counted once", () => {
  const bd = cost.getAssetCostBreakdown(
    asset({
      unitCostUSD: 10,
      subCosts: [fee("test", 40, { kind: "pcf", subItemId: "pcf-a" })],
    }),
    scope(),
  );
  assert.equal(bd.linkedFees, 40);
  assert.equal(bd.main.fees, 0);
  assert.equal(bd.pcfCounted, 80);
  assert.equal(bd.total, 30 + 250 + 80);
});

test("sum of PCF rolls up per unit, Eng. Solutions contingency included", () => {
  const bd = cost.getAssetCostBreakdown(
    asset({
      costFromPCF: true,
      subItemCosts: [],
      subCosts: [fee("test", 5, { kind: "pcf", subItemId: "pcf-a" })],
    }),
    scope({ resourceSubType: "Eng. Solutions", subItems: [] }),
    { perYear: 0, applied: false, engSolutionsPct: 10 },
  );
  assert.equal(Math.round(bd.rollupUnit * 100) / 100, 49);
  assert.equal(Math.round(bd.total * 100) / 100, 147);
  assert.equal(Math.round(bd.pcfCounted * 100) / 100, 147);
});

test("both roll-ups add up into the same unit cost", () => {
  const bd = cost.getAssetCostBreakdown(
    asset({ costFromSubItems: true, costFromPCF: true }),
    scope(),
  );
  assert.equal(bd.rollupUnit, 290);
  assert.equal(bd.total, 870);
});

test("a link to a removed item counts the fee directly in the total", () => {
  const bd = cost.getAssetCostBreakdown(
    asset({
      costFromSubItems: true,
      subCosts: [fee("ghost", 15, { kind: "sub", subItemId: "sub-gone" })],
    }),
    scope(),
  );
  assert.equal(bd.linkedFees, 0);
  assert.equal(bd.main.fees, 15);
  assert.equal(bd.total, 750 + 15 + 40);
});

test("transit rates are never linked", () => {
  const links = cost.resolveFeeLinks(
    asset({
      subCosts: [
        {
          ...fee("transit", 0, { kind: "sub", subItemId: "sub-a" }),
          isTransitRate: true,
        },
      ],
    }),
  );
  assert.equal(links.unlinked.length, 1);
  assert.deepEqual(Object.keys(links.linked), []);
});

test("rolled-up children keep their own CAPEX / OPEX, scaled by qty", () => {
  const bd = cost.getAssetCostBreakdown(
    asset({
      costFromSubItems: true,
      costCategory: "OPEX",
      subItemCosts: [child("sub-a", 100, "CAPEX"), child("sub-b", 50, "OPEX")],
      subCosts: [
        fee("prep", 30),
        fee("assembly", 10, { kind: "sub", subItemId: "sub-a" }),
      ],
    }),
    scope(),
  );
  assert.equal(bd.capex, 210 * 3 + 40);
  assert.equal(bd.opex, 50 * 3 + 30);
  assert.equal(bd.uncategorized, 0);
});

test("with splits the roll-up is off, linked fees stay with their sub-item", () => {
  const bd = cost.getAssetCostBreakdown(
    asset({
      costFromSubItems: true,
      availabilitySplits: [
        {
          id: "split-1",
          qty: 3,
          availabilityStatus: "Purchase",
          acquisitionType: "Purchase",
          unitCostUSD: 5,
          totalCostUSD: 0,
          costReference: "",
          costCategory: "CAPEX",
          supplier: "",
          leadTimeDays: 0,
          dailyRate: null,
          rentalDays: null,
          notes: "",
        },
      ],
      subCosts: [
        fee("prep", 30),
        fee("assembly", 10, { kind: "sub", subItemId: "sub-a" }),
      ],
    }),
    scope(),
  );
  assert.equal(bd.rollupUnit, 0);
  assert.equal(bd.orphanFees, 30);
  assert.equal(bd.total, 15 + 260 + 40);
});

test("own cost + fees + sub-items + PCF always add up to the total", () => {
  const split = {
    id: "split-1",
    qty: 3,
    availabilityStatus: "Purchase",
    acquisitionType: "Purchase",
    unitCostUSD: 5,
    totalCostUSD: 0,
    costReference: "",
    costCategory: "CAPEX",
    supplier: "",
    leadTimeDays: 0,
    dailyRate: null,
    rentalDays: null,
    notes: "",
    subCosts: [fee("split-fee", 7)],
  };
  const fees = [
    fee("prep", 30),
    fee("assembly", 10, { kind: "sub", subItemId: "sub-a" }),
    fee("test", 5, { kind: "pcf", subItemId: "pcf-a" }),
  ];
  const cases = [
    { unitCostUSD: 10, subCosts: fees },
    { costFromSubItems: true, subCosts: fees },
    { costFromPCF: true, subCosts: fees },
    { costFromSubItems: true, costFromPCF: true, subCosts: fees },
    {
      acquisitionType: "Rental",
      dailyRate: 100,
      rentalDays: 10,
      subCosts: fees,
    },
    { availabilitySplits: [split], subCosts: fees },
  ];
  cases.forEach((overrides) => {
    const bd = cost.getAssetCostBreakdown(asset(overrides), scope());
    const parts =
      bd.ownCost + bd.feesCounted + bd.subItemsCounted + bd.pcfCounted;
    assert.equal(Math.round(parts * 100), Math.round(bd.total * 100));
  });
});

test("pruneOrphanCosts drops links whose item no longer exists", () => {
  const bid = {
    scopeItems: [scope({ subItems: [{ id: "sub-b", qty: 1 }] })],
    assetBreakdown: [
      asset({
        subCosts: [
          fee("kept", 1, { kind: "sub", subItemId: "sub-b" }),
          fee("stale", 2, { kind: "sub", subItemId: "sub-a" }),
          fee("pcf", 3, { kind: "pcf", subItemId: "pcf-a" }),
        ],
      }),
    ],
    certificationsBreakdown: [],
  };
  const pruned = cost.pruneOrphanCosts(bid);
  const fees = pruned.assetBreakdown[0].subCosts;
  assert.deepEqual(fees[0].linkedTo, { kind: "sub", subItemId: "sub-b" });
  assert.equal(fees[1].linkedTo, null);
  assert.deepEqual(fees[2].linkedTo, { kind: "pcf", subItemId: "pcf-a" });
});
