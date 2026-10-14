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
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      jsx: ts.JsxEmit.React,
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

const div = load("utils/divisionHelpers.ts");
const tracks = load("utils/approvalTracks.ts");
const ern = load("utils/ernHelpers.ts");
const helpers = load("utils/approvalHelpers.ts");

const integrated = (lead, opg, ssr, extra = {}) => ({
  division: "INTEGRATED",
  serviceLine: div.composeIntegratedServiceLine(lead, { OPG: opg, SSR: ssr }),
  leadDivision: lead,
  integratedLines: { OPG: opg, SSR: ssr },
  ...extra,
});

const approval = (round, email, status, sector = "project") => ({
  id: `apr-r${round}-${sector}-${email}`,
  round,
  stakeholderRole: sector,
  sector,
  stakeholder: { name: email, email },
  status,
  requestedDate: "2026-10-01T10:00:00.000Z",
  respondedDate: status === "pending" ? null : "2026-10-02T10:00:00.000Z",
  decision: status === "pending" ? null : status,
  comments: null,
  approvedVia: null,
  notificationSent: false,
  reminderCount: 0,
});

const round = (n, track, status, started, extra = {}) => ({
  round: n,
  startedDate: started,
  startedBy: { name: "Eng", email: "eng@x.com" },
  status,
  completedDate: status === "pending" ? null : started,
  approvals: [approval(n, `p${n}@x.com`, status)],
  ...(track ? { track, trackLabel: track } : {}),
  ...extra,
});

test("business lines per division and service line", () => {
  const lines = (b) => Array.from(div.getBidBusinessLines(b));
  assert.deepEqual(lines({ division: "OPG", serviceLine: "UWILD" }), ["OPG"]);
  assert.deepEqual(lines({ division: "SSR", serviceLine: "ROV" }), ["ROV"]);
  assert.deepEqual(lines({ division: "SSR", serviceLine: "Survey" }), ["SURVEY"]);
  assert.deepEqual(lines({ division: "SSR", serviceLine: "Integrated" }), [
    "ROV",
    "SURVEY",
  ]);
  assert.deepEqual(lines({ division: "SSR-Integrated", serviceLine: "" }), [
    "ROV",
    "SURVEY",
  ]);
  assert.deepEqual(lines(integrated("OPG", "UWILD", "ROV")), ["OPG", "ROV"]);
  assert.deepEqual(lines(integrated("SSR", "UWILD", "Survey")), [
    "SURVEY",
    "OPG",
  ]);
  assert.deepEqual(lines({ division: "SSR", serviceLine: "Unknown" }), []);
});

test("division fields compose the INTEGRATED service line and clear it otherwise", () => {
  const f = div.buildDivisionFields("INTEGRATED", "", "SSR", {
    OPG: "IMR",
    SSR: "ROV",
  });
  assert.equal(f.division, "INTEGRATED");
  assert.equal(f.serviceLine, "ROV + IMR");
  assert.equal(f.leadDivision, "SSR");
  assert.deepEqual(Array.from(f.businessLines), ["ROV", "OPG"]);
  assert.deepEqual(Array.from(div.getBidServiceLines(f)), ["ROV", "IMR"]);

  const single = div.buildDivisionFields("OPG", "UWILD");
  assert.equal(single.serviceLine, "UWILD");
  assert.equal(single.leadDivision, undefined);
  assert.equal(single.integratedLines, undefined);
  assert.deepEqual(Array.from(single.businessLines), ["OPG"]);
});

test("INTEGRATED service line options exclude the SSR Integrated line", () => {
  const lines = [
    { id: "1", label: "UWILD", value: "UWILD", category: "OPG", isActive: true },
    { id: "2", label: "ROV", value: "ROV", category: "SSR", isActive: true },
    { id: "3", label: "Integrated", value: "Integrated", category: "SSR", isActive: true },
  ];
  const values = (list) => list.map((o) => o.value);
  assert.deepEqual(values(div.integratedLineOptions(lines, "SSR")), ["ROV"]);
  assert.deepEqual(values(div.serviceLineOptionsForDivision(lines, "INTEGRATED")), [
    "UWILD",
    "ROV",
  ]);
  assert.deepEqual(values(div.serviceLineOptionsForDivision(lines, "SSR")), [
    "ROV",
    "Integrated",
  ]);
});

test("ERN slots: one per team, lead first, with the team service line", () => {
  const slots = ern.getErnSlots(integrated("OPG", "UWILD", "ROV"));
  assert.deepEqual(
    slots.map((s) => [s.division, s.serviceLine]),
    [
      ["OPG", "UWILD"],
      ["ROV", "ROV"],
    ],
  );
  const single = ern.getErnSlots({ division: "OPG", serviceLine: "IMR" });
  assert.equal(single.length, 1);
  assert.equal(single[0].division, null);
});

test("retag moves items of a removed team to the remaining one", () => {
  const bid = {
    scopeItems: [
      { id: "a", integratedDivision: "ROV" },
      { id: "b", integratedDivision: "OPG" },
    ],
    hoursSummary: {
      engineeringHours: { items: [{ integratedDivision: "ROV" }], engineeringItems: [] },
      onshoreHours: { items: [] },
      offshoreHours: { items: [] },
    },
  };
  const { patch, count } = div.retagBusinessLineItems(bid, ["ROV"], "OPG");
  assert.equal(count, 2);
  assert.deepEqual(
    patch.scopeItems.map((i) => i.integratedDivision),
    ["OPG", "OPG"],
  );
  assert.equal(patch.hoursSummary.engineeringHours.items[0].integratedDivision, "OPG");
  assert.equal(patch.assetBreakdown, undefined);
});

test("secondary approval candidates and tracks", () => {
  const opgLead = integrated("OPG", "UWILD", "ROV");
  assert.deepEqual(Array.from(tracks.getSecondaryCandidates(opgLead)), ["ROV"]);
  const ssrInt = { division: "SSR", serviceLine: "Integrated" };
  assert.deepEqual(Array.from(tracks.getSecondaryCandidates(ssrInt)), [
    "ROV",
    "SURVEY",
  ]);
  assert.deepEqual(
    Array.from(tracks.getSecondaryCandidates({ division: "OPG", serviceLine: "IMR" })),
    [],
  );
  assert.deepEqual(
    Array.from(tracks.getApprovalTracks({ ...opgLead, approvalSecondaryLine: "ROV" })),
    ["OPG", "ROV"],
  );
  assert.deepEqual(
    Array.from(tracks.getApprovalTracks({ ...ssrInt, approvalSecondaryLine: "ROV" })),
    ["SURVEY", "ROV"],
  );
  assert.equal(tracks.isSplitApproval(opgLead), false);
});

test("split status: each team keeps its own latest round", () => {
  const base = { ...integrated("OPG", "UWILD", "ROV"), approvalSecondaryLine: "ROV" };
  const at = (rounds) => ({ ...base, approvalRounds: rounds });

  assert.equal(tracks.getSplitApprovalStatus(at([])), "not-started");
  const primaryPending = at([round(1, "OPG", "pending", "2026-10-01T00:00:00Z")]);
  assert.equal(tracks.getSplitApprovalStatus(primaryPending), "pending");
  assert.equal(tracks.hasPendingApprovalRound(primaryPending), true);

  const primaryDone = at([round(1, "OPG", "approved", "2026-10-01T00:00:00Z")]);
  assert.equal(tracks.getTrackStatus(primaryDone, "ROV"), "not-started");
  assert.equal(tracks.getSplitApprovalStatus(primaryDone), "pending");
  assert.equal(tracks.isSplitApprovalComplete(primaryDone), false);

  const rejected = at([
    round(1, "OPG", "approved", "2026-10-01T00:00:00Z"),
    round(2, "ROV", "rejected", "2026-10-02T00:00:00Z"),
  ]);
  assert.equal(tracks.getSplitApprovalStatus(rejected), "rejected");

  const rerun = at([
    round(1, "OPG", "approved", "2026-10-01T00:00:00Z"),
    round(2, "ROV", "rejected", "2026-10-02T00:00:00Z"),
    round(3, "ROV", "approved", "2026-10-05T00:00:00Z"),
  ]);
  assert.equal(tracks.getSplitApprovalStatus(rerun), "approved");
  assert.equal(tracks.isSplitApprovalComplete(rerun), true);
});

test("a later single round or a reopened completed BID supersedes team rounds", () => {
  const base = { ...integrated("OPG", "UWILD", "ROV"), approvalSecondaryLine: "ROV" };
  const withSingle = {
    ...base,
    approvalRounds: [
      round(1, "OPG", "approved", "2026-10-01T00:00:00Z"),
      round(2, null, "rejected", "2026-10-02T00:00:00Z"),
    ],
  };
  assert.equal(tracks.getTrackStatus(withSingle, "OPG"), "not-started");

  const reopened = {
    ...base,
    approvalRounds: [
      round(1, "OPG", "approved", "2026-10-01T00:00:00Z"),
      round(2, "ROV", "approved", "2026-10-02T00:00:00Z"),
    ],
    statusHistory: [{ status: "Completed", start: "2026-10-03T00:00:00Z" }],
    revisions: [{ openedDate: "2026-10-04T00:00:00Z", closedDate: null }],
  };
  assert.equal(tracks.getSplitApprovalStatus(reopened), "not-started");

  const reworkAfterRejection = {
    ...base,
    approvalRounds: [
      round(1, "OPG", "approved", "2026-10-01T00:00:00Z"),
      round(2, "ROV", "rejected", "2026-10-02T00:00:00Z"),
    ],
    statusHistory: [{ status: "Pending Approval", start: "2026-10-01T00:00:00Z" }],
    revisions: [{ openedDate: "2026-10-04T00:00:00Z", closedDate: null }],
  };
  assert.equal(tracks.getTrackStatus(reworkAfterRejection, "OPG"), "approved");
});

test("track round patch merges approvals and per-team statuses", () => {
  const base = {
    ...integrated("OPG", "UWILD", "ROV"),
    approvalSecondaryLine: "ROV",
    approvalRounds: [round(1, "OPG", "approved", "2026-10-01T00:00:00Z")],
  };
  const patch = tracks.buildTrackRoundPatch(
    base,
    round(2, "ROV", "pending", "2026-10-02T00:00:00Z"),
    { status: "pending", draftSelections: {} },
  );
  assert.equal(patch.approvalRounds.length, 2);
  assert.deepEqual(
    patch.approvals.map((a) => a.round),
    [1, 2],
  );
  assert.equal(patch.approvalTracks.OPG.status, "approved");
  assert.equal(patch.approvalTracks.ROV.status, "pending");
  assert.equal(patch.approvalStatus, "pending");
});

test("project managers of a team: saved team first, then member tags", () => {
  const bid = {
    ...integrated("OPG", "UWILD", "ROV"),
    approvalSecondaryLine: "ROV",
    projectManager: [
      { name: "A", email: "a@x.com", businessLine: "OPG" },
      { name: "B", email: "b@x.com" },
      { name: "C", email: "c@x.com" },
    ],
  };
  const members = [
    { email: "b@x.com", businessLines: ["ROV"] },
    { email: "c@x.com", businessLines: [] },
  ];
  const names = (t) =>
    tracks.projectManagersForTrack(bid, t, members).map((p) => p.name);
  assert.deepEqual(names("OPG"), ["A", "C"]);
  assert.deepEqual(names("ROV"), ["B"]);
});

test("split completion logs each team once and the BID completion once", () => {
  const bid = {
    ...integrated("OPG", "UWILD", "ROV"),
    approvalSecondaryLine: "ROV",
    currentStatus: "Completed",
    completedDate: "2026-10-06T00:00:00Z",
    approvalRounds: [
      { ...round(1, "OPG", "approved", "2026-10-01T00:00:00Z"), completedDate: "2026-10-02T00:00:00Z" },
      { ...round(2, "ROV", "approved", "2026-10-03T00:00:00Z"), completedDate: "2026-10-05T00:00:00Z" },
    ],
    activityLog: [],
  };
  const ids = helpers.getMissingApprovalActivityEntries(bid).map((e) => e.id);
  assert.ok(ids.includes("log-apr-r1-track-approved"));
  assert.ok(ids.includes("log-apr-r2-track-approved"));
  assert.deepEqual(
    ids.filter((id) => id.endsWith("-completed")),
    ["log-apr-r2-completed"],
  );
  const again = helpers.getMissingApprovalActivityEntries({
    ...bid,
    activityLog: ids.map((id) => ({ id })),
  });
  assert.equal(again.length, 0);
  assert.equal(helpers.getFinalApprovedRounds(bid).length, 2);
});
