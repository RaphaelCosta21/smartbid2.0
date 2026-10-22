const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const app = path.resolve(root, "src/webparts/smartBid20/app");
const cache = {};

/** Loads a TS module (and its relative imports) without a bundler. */
function loadModule(filename) {
  if (cache[filename]) return cache[filename].exports;
  const module = { exports: {} };
  cache[filename] = module;
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
  }).outputText;
  const localRequire = (spec) => {
    if (spec.indexOf(".") === 0) {
      const base = path.resolve(path.dirname(filename), spec);
      const file = [base + ".ts", path.join(base, "index.ts")].find((f) => fs.existsSync(f));
      if (file) return loadModule(file);
    }
    return require(spec);
  };
  vm.runInThisContext(`(function(require, module, exports) { ${code}\n})`, { filename })(
    localRequire,
    module,
    module.exports,
  );
  return module.exports;
}

const graph = loadModule(path.join(app, "utils/surveySpreadGraph.ts"));
const journeys = loadModule(path.join(app, "utils/surveyDataJourney.ts"));
const formats = loadModule(path.join(app, "config/surveyDataFormats.ts"));
const packages = loadModule(path.join(app, "utils/surveyPackages.ts"));
const seed = JSON.parse(
  fs.readFileSync(path.join(root, "templates/survey-catalog/survey-catalog.seed.json"), "utf8"),
);

const equipmentById = {};
seed.equipment.forEach((e) => (equipmentById[e.id] = e));

function contextOf(spread) {
  const spreadNodes = graph.expandSpreadNodes(spread, seed);
  const nodes = spreadNodes.concat(graph.catalogNodes(spread, seed, spreadNodes));
  const links = graph.resolveSpreadLinks(spread, nodes);
  return { nodes, links, equipmentById, pipeline: spread.pipeline || [] };
}

/** Every journey the portal can start in a spread. */
function allJourneys(spread) {
  const ctx = contextOf(spread);
  const out = [];
  ctx.nodes
    .filter((n) => n.source !== "catalog")
    .forEach((node) => {
      journeys.listJourneys(node.id, ctx).forEach((o) => {
        const journey = journeys.buildDataJourney(o.sourceNodeId, o.dataType, ctx);
        if (journey) out.push({ node, option: o, journey });
      });
    });
  return { ctx, out };
}

const fullSpread = seed.spreads.filter((s) => s.id === "full-survey-spread")[0];
const full = allJourneys(fullSpread);
const find = (nodeId, dataType) =>
  full.out.filter((j) => j.option.sourceNodeId === nodeId && j.option.dataType === dataType)[0];
const text = (step) => step.caption.pt + " " + step.title.pt;
const nodeStep = (journey, nodeId) =>
  journey.steps.filter((s) => s.kind === "node" && s.nodeId === nodeId)[0];

function checksumOk(sentence) {
  const m = /^\$([^*]+)\*([0-9A-Fa-f]{2})$/.exec(sentence);
  if (!m) return false;
  let x = 0;
  for (let i = 0; i < m[1].length; i++) x ^= m[1].charCodeAt(i);
  return x === parseInt(m[2], 16);
}

test("every journey has steps and the antenna never acts as the sensor", () => {
  // A package alone may have no path to the online hub; they are only checked combined.
  const scenes = packages
    .diagramsOf(seed.spreads)
    .concat([packages.composePackages(packages.packagesOf(seed.spreads))]);
  scenes.forEach((spread) => {
    const { ctx, out } = allJourneys(spread);
    assert.ok(out.length > 0, spread.id);
    out.forEach(({ node, journey }) => {
      assert.ok(journey.steps.length >= 2, `${spread.id} ${journey.title.en}`);
      const eq = ctx.equipmentById[node.equipmentId];
      if (eq.dataRole === "rf-frontend") {
        journey.steps
          .filter((s) => s.nodeId === node.id)
          .forEach((s) => assert.ok(s.caption.pt.indexOf("transforma") < 0, text(s)));
      }
    });
  });
});

test("antenna journeys continue in the receiver and keep the antenna as an RF step", () => {
  const j = find("cnav-x1-antenna#1", "position");
  assert.ok(j, "antenna offers a position journey");
  const nodes = j.journey.steps.filter((s) => s.kind === "node");
  assert.equal(nodes[0].nodeId, "cnav-x1-antenna#1");
  assert.equal(nodes[0].caption.pt, formats.ROLE_CAPTIONS["rf-frontend"].pt);
  assert.equal(nodes[1].nodeId, "cnav-x1-receiver#1");
  assert.ok(nodes[1].caption.pt.indexOf("transforma") >= 0);
  assert.equal(nodes[1].format.sample.indexOf("$GPGGA"), 0);
});

test("barometer measures air pressure and its sample is TBD", () => {
  const j = find("barometer", "depth");
  assert.ok(j);
  const origin = j.journey.steps[0];
  assert.ok(origin.title.pt.indexOf("ar") >= 0 && origin.caption.pt.indexOf("atmosfera") >= 0);
  const sensor = nodeStep(j.journey, "barometer");
  assert.equal(sensor.format.sample, "TBD");
  assert.equal(sensor.format.decodable, false);
});

test("GNSS compass heading starts at the satellites with a valid GPHDT sentence", () => {
  const j = find("hemisphere-vs1000-receiver", "heading");
  assert.ok(j);
  assert.equal(j.journey.steps[0].satellites, true);
  const sample = j.journey.steps.filter((s) => s.nodeId === "hemisphere-vs1000-receiver")[0].format
    .sample;
  assert.equal(sample.indexOf("$GPHDT"), 0);
  assert.ok(checksumOk(sample), sample);
});

test("ROV gyro motion is the ROV's own motion", () => {
  const j = find("rov-gyro", "motion");
  assert.ok(j);
  assert.ok(j.journey.steps[0].caption.pt.indexOf("ROV") >= 0);
});

test("green laser has no video journey", () => {
  assert.equal(find("green-laser", "video"), undefined);
});

test("USBL: beacon answers with a pulse, only the topside outputs the position", () => {
  const j = find("c-node#1", "acoustic-position");
  assert.ok(j);
  const byNode = (id) => nodeStep(j.journey, id);
  assert.ok(byNode("c-node#1").caption.pt.indexOf("não gera mensagem digital") >= 0);
  assert.ok(byNode("ranger2-subsea-head").caption.pt.indexOf("ida e volta") >= 0);
  assert.equal(byNode("usbl-topside-unit").format.sample, "TBD");
  assert.equal(byNode("usbl-topside-unit").format.decodable, false);
});

test("subsea cables are not all labelled as umbilical serial", () => {
  const usbl = find("c-node#1", "acoustic-position").journey.steps.filter(
    (s) => s.kind === "cable" && /SPD001/.test(s.title.pt),
  )[0];
  assert.ok(usbl && usbl.title.pt.indexOf("umbilical") < 0, usbl && usbl.title.pt);
  const tss = find("tss440-coils", "pipe-tracking");
  assert.ok(tss);
  tss.journey.steps
    .filter((s) => s.kind === "cable" && /SS00[567]/.test(s.title.pt))
    .forEach((s) => assert.ok(s.title.pt.indexOf("umbilical") < 0, s.title.pt));
});

test("TSS 440: the topside unit is wired to NaviPac and the sample is TBD", () => {
  const j = find("tss440-coils", "pipe-tracking");
  const steps = j.journey.steps;
  const topside = steps.findIndex((s) => s.nodeId === "tss440-topside");
  const navipac = steps.findIndex((s) => s.id === "software:sw-navipac");
  assert.ok(topside >= 0 && navipac > topside);
  assert.ok(steps.slice(topside, navipac).some((s) => s.kind === "cable"));
  assert.equal(steps[navipac].format.sample, "TBD");
});

test("video journey flags the recorder that is missing from the diagram", () => {
  const j = find("boom-cameras#1", "video");
  assert.ok(j);
  const rec = j.journey.steps.filter((s) => s.id === "software:sw-video")[0];
  assert.ok(rec.caption.pt.indexOf("TBD") >= 0, rec.caption.pt);
});

test("corrections end up as the corrected position of the receiver", () => {
  const j = find("cnav-iridium-antenna#1", "corrections");
  assert.ok(j);
  const receiver = j.journey.steps.filter((s) => s.nodeId === "cnav-x1-receiver#1")[0];
  assert.ok(receiver.caption.pt.indexOf("não saem pelo cabo") >= 0);
  assert.equal(receiver.format.sample.indexOf("$GPGGA"), 0);
  assert.ok(j.journey.steps.some((s) => s.kind === "deliverables"));
});

test("Bullet PoE cable is Ethernet, not coax or serial server", () => {
  const link = graph.resolveSpreadLinks(fullSpread, contextOf(fullSpread).nodes).filter(
    (l) => l.from === "bullet-wifi-antenna" && l.to === "bullet-poe",
  )[0];
  assert.ok(link);
  const j = find("bullet-wifi-antenna", "comms");
  if (j) {
    const cable = j.journey.steps.filter((s) => s.kind === "cable" && s.linkKey === link.key)[0];
    if (cable) assert.ok(cable.title.pt.indexOf("Ethernet") >= 0, cable.title.pt);
  }
});

test("every decodable sample has a valid NMEA checksum and TBD is never decodable", () => {
  Object.keys(formats.DATA_SAMPLES).forEach((type) => {
    const s = formats.DATA_SAMPLES[type];
    if (s.decodable) assert.ok(checksumOk(s.sample), `${type}: ${s.sample}`);
    if (s.sample === "TBD") assert.ok(!s.decodable, type);
  });
  Object.keys(formats.JOURNEY_OVERRIDES).forEach((id) => {
    const byType = formats.JOURNEY_OVERRIDES[id];
    Object.keys(byType).forEach((type) => {
      const p = byType[type].payload;
      if (p && p.decodable) assert.ok(checksumOk(p.sample), `${id}/${type}: ${p.sample}`);
      if (p && p.sample === "TBD") assert.ok(!p.decodable, `${id}/${type}`);
    });
  });
});

test("lab samples decode with a valid checksum and the glossary anatomy matches the GGA", () => {
  const nmea = loadModule(path.join(app, "utils/nmeaDecode.ts"));
  const glossary = loadModule(path.join(app, "config/surveyGlossary.ts"));
  glossary.NMEA_LAB_SAMPLES.forEach((s) => {
    const r = nmea.parseNmea(s.sentence);
    assert.ok(r.ok, s.id);
    assert.equal(r.checksum.valid, true, s.id);
  });
  const gga = glossary.NMEA_LAB_SAMPLES.filter((s) => s.id === "gga")[0].sentence;
  assert.equal(gga, formats.DATA_SAMPLES.position.sample);
  const term = glossary.SURVEY_GLOSSARY.filter((x) => x.id === "nmea-0183")[0];
  assert.equal(term.anatomy.segments.map((s) => s.text).join(""), gga);
});

test("physical effects: origins play over the vessel and every effect has a builder", () => {
  const effects = loadModule(path.join(app, "components/survey/survey3d/effects/index.ts"));
  const used = {};
  Object.keys(formats.DATA_ORIGINS).forEach((type) => {
    const e = formats.DATA_ORIGINS[type].effect;
    if (e) used[e] = true;
  });
  Object.keys(formats.JOURNEY_OVERRIDES).forEach((id) => {
    const byType = formats.JOURNEY_OVERRIDES[id];
    Object.keys(byType).forEach((type) => {
      const o = byType[type].origin;
      if (o && o.effect) used[o.effect] = true;
    });
  });
  Object.keys(used).forEach((kind) => assert.equal(typeof effects.EFFECT_BUILDERS[kind], "function", kind));
  Object.keys(effects.EFFECT_BUILDERS).forEach((kind) => assert.ok(used[kind], `unused effect ${kind}`));
  full.out.forEach(({ journey }) => {
    const origin = journey.steps[0];
    if (origin.effect) {
      assert.equal(origin.zoneId, null, journey.title.en);
      assert.equal(origin.nodeId, undefined, journey.title.en);
    }
  });
  const effectOf = (nodeId, type) => find(nodeId, type).journey.steps[0].effect;
  assert.equal(effectOf("octans-9", "motion"), "motion-vessel");
  assert.equal(effectOf("octans-9", "heading"), "heading");
  assert.equal(effectOf("rov-gyro", "motion"), "motion-rov");
  assert.equal(effectOf("rov-gyro", "heading"), "heading-rov");
  assert.equal(effectOf("barometer", "depth"), "air-pressure");
  assert.equal(effectOf("dq", "depth"), "water-pressure");
  assert.equal(effectOf("altimeter", "altitude"), "altimeter-echo");
  assert.equal(effectOf("r2sonic-heads#1", "bathymetry"), "bathymetry");
  assert.equal(effectOf("c-node#1", "acoustic-position"), "usbl-ping");
  assert.equal(effectOf("tss440-coils", "pipe-tracking"), "pipe-field");
  assert.equal(effectOf("boom-cameras#1", "video"), "camera-view");
  assert.equal(effectOf("svx2", "sound-velocity"), "sound-column");
  const time = find("cnav-x1-receiver#1", "time-sync").journey.steps[0];
  assert.equal(time.effect, "pps-tick");
  assert.equal(time.satellites, true);
  assert.equal(find("cnav-x1-receiver#1", "position").journey.steps[0].effect, undefined);
  // The VS1000 heading comes from the satellites, not from a gyro phenomenon.
  const vs = find("hemisphere-vs1000-receiver", "heading").journey.steps[0];
  assert.equal(vs.satellites, true);
  assert.equal(vs.effect, undefined);
});

test("journey counts", () => {
  const partial = full.out.filter((j) => j.journey.partial).length;
  console.log(`full spread: ${full.out.length} journeys, ${partial} partial`);
  assert.ok(full.out.length > 0);
});

const pkg = (id) => seed.spreads.filter((s) => s.id === id)[0];
const lineOf = (spread, zoneId, equipmentId) =>
  spread.zones
    .filter((z) => z.id === zoneId)[0]
    .lines.filter((l) => l.equipmentId === equipmentId)[0];
const hasLink = (spread, from, to) =>
  spread.links.some((l) => l.from === from && l.to === to);

test("packages: only diagrams are listed as diagrams", () => {
  const diagramIds = packages.diagramsOf(seed.spreads).map((s) => s.id);
  assert.ok(diagramIds.indexOf("full-survey-spread") >= 0);
  assert.equal(diagramIds.indexOf("survey-surface-navigation"), -1);
  assert.deepEqual(
    packages.packagesOf(seed.spreads).map((s) => s.id),
    ["survey-surface-navigation", "mbes-spread", "subsea-equipments-basic"],
  );
});

test("packages: shared rooms merge and repeated equipment sums operational and spare", () => {
  const combo = packages.composePackages([pkg("survey-surface-navigation"), pkg("mbes-spread")]);
  assert.equal(combo.zones.filter((z) => z.id === "survey-online").length, 1);
  const attu = lineOf(combo, "survey-online", "attu");
  assert.equal(attu.qty, 2);
  assert.equal(attu.qtySpare, 1);
  // The seed itself is never mutated by the merge.
  assert.equal(lineOf(pkg("survey-surface-navigation"), "survey-online", "attu").qty, 1);
  const store = combo.pipeline.filter((p) => p.id === "store-server")[0];
  assert.equal(store.hostEquipmentId, "raid-storage");
  assert.equal(combo.kind, "package");
});

test("packages: cross-package cables only appear when both packages are ticked", () => {
  const subsea = packages.composePackages([pkg("subsea-equipments-basic")]);
  assert.equal(hasLink(subsea, "innova-subsea-mux", "svp"), false);
  assert.equal(graph.expandSpreadNodes(subsea, seed).some((n) => n.equipmentId === "innova-subsea-mux"), false);
  const both = packages.composePackages([pkg("mbes-spread"), pkg("subsea-equipments-basic")]);
  assert.equal(hasLink(both, "innova-subsea-mux", "svp"), true);
  const mbesAlone = packages.composePackages([pkg("mbes-spread")]);
  assert.equal(hasLink(mbesAlone, "attu", "online-master-pc"), false);
  assert.equal(mbesAlone.pipeline.filter((p) => p.id === "store-server")[0].hostEquipmentId, "naviscan-mbes-pc");
});

test("packages: the active spread falls back to the first diagram", () => {
  const ids = ["mbes-spread"];
  assert.equal(packages.resolveActiveSpread(seed, null, ids).id, "full-survey-spread");
  assert.equal(packages.resolveActiveSpread(seed, "mbes-spread", ids).id, "full-survey-spread");
  assert.equal(packages.resolveActiveSpread(seed, packages.PACKAGES_SPREAD_ID, ids).title, "MBES Spread");
  assert.equal(packages.resolveActiveSpread(seed, packages.PACKAGES_SPREAD_ID, []).id, "full-survey-spread");
});
