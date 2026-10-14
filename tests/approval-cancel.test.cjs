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

const tracks = load("utils/approvalTracks.ts");
const helpers = load("utils/approvalHelpers.ts");
const kpis = load("utils/kpiHelpers.ts");
const notifications = load("utils/notificationEvents.ts");

const approval = (round, email, status, sector = "engineering") => ({
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

const round = (n, status, started, extra = {}) => ({
  round: n,
  startedDate: started,
  startedBy: { name: "Eng", email: "eng@x.com" },
  status,
  completedDate: status === "pending" ? null : started,
  approvals: [approval(n, `p${n}@x.com`, status)],
  ...extra,
});

const override = {
  overriddenBy: { name: "Eng", email: "eng@x.com" },
  overriddenDate: "2026-10-03T00:00:00Z",
  reason: "Urgent",
  previousApprovalStatus: "pending",
  totalApprovers: 1,
  approvedCount: 0,
  approvalsAtOverride: [],
};

// Override -> Completed -> Rework (Rev B still open)
const reopened = (extra = {}) => ({
  bidNumber: "REQ-1",
  division: "OPG",
  serviceLine: "UWILD",
  currentPhase: "Rework",
  currentStatus: "Rework",
  approvalStatus: "approved",
  approvals: [approval(4, "p4@x.com", "pending")],
  approvalRounds: [round(4, "approved", "2026-10-02T00:00:00Z", { override })],
  revisions: [
    {
      revisionLetter: "B",
      openedDate: "2026-10-05T00:00:00Z",
      closedDate: null,
      status: "open",
    },
  ],
  activityLog: [],
  ...extra,
});

const atGate = { currentPhase: "Close Out", currentStatus: "Pending Approval" };

test("open revision without a round in the cycle offers a new round, even in Rework", () => {
  assert.equal(tracks.needsNewApprovalRound(reopened(), null, false), true);
  assert.equal(
    tracks.needsNewApprovalRound(
      reopened({ currentPhase: "Elaboration", currentStatus: "In Progress" }),
      null,
      false,
    ),
    true,
  );
  assert.equal(
    tracks.needsNewApprovalRound(reopened(atGate), null, false),
    true,
  );
  assert.equal(
    tracks.needsNewApprovalRound(
      reopened({ currentPhase: "Close Out", currentStatus: "Canceled" }),
      null,
      true,
    ),
    false,
  );
});

test("a round started during the revision is tracked (Start Approval bug)", () => {
  const started = reopened({
    ...atGate,
    approvalStatus: "pending",
    approvalRounds: [
      round(4, "approved", "2026-10-02T00:00:00Z", { override }),
      round(5, "pending", "2026-10-06T00:00:00Z"),
    ],
  });
  assert.equal(tracks.needsNewApprovalRound(started, null, false), false);

  const rejectedInRevision = {
    ...started,
    approvalStatus: "rejected",
    approvalRounds: [
      round(4, "approved", "2026-10-02T00:00:00Z", { override }),
      round(5, "rejected", "2026-10-06T00:00:00Z"),
    ],
  };
  assert.equal(
    tracks.needsNewApprovalRound(rejectedInRevision, null, false),
    true,
  );

  const stalePending = reopened({
    ...atGate,
    approvalStatus: "pending",
    approvalRounds: [round(4, "pending", "2026-10-02T00:00:00Z")],
  });
  assert.equal(tracks.needsNewApprovalRound(stalePending, null, false), true);
});

test("without an open revision the latest round is tracked", () => {
  const bid = reopened({
    ...atGate,
    approvalStatus: "pending",
    approvalRounds: [round(1, "pending", "2026-10-01T00:00:00Z")],
    revisions: [],
  });
  assert.equal(tracks.needsNewApprovalRound(bid, null, false), false);
  assert.equal(
    tracks.needsNewApprovalRound(
      { ...bid, approvalStatus: "not-started", approvalRounds: [] },
      null,
      false,
    ),
    true,
  );
});

test("a team approved before the Rework keeps its approval", () => {
  const bid = {
    division: "INTEGRATED",
    serviceLine: "UWILD + ROV",
    leadDivision: "OPG",
    integratedLines: { OPG: "UWILD", SSR: "ROV" },
    approvalSecondaryLine: "ROV",
    currentPhase: "Rework",
    currentStatus: "Rework",
    approvalRounds: [
      round(1, "approved", "2026-10-01T00:00:00Z", { track: "OPG" }),
      round(2, "rejected", "2026-10-02T00:00:00Z", { track: "ROV" }),
    ],
    statusHistory: [
      { status: "Pending Approval", start: "2026-10-01T00:00:00Z" },
    ],
    revisions: [{ openedDate: "2026-10-04T00:00:00Z", closedDate: null }],
  };
  assert.equal(tracks.needsNewApprovalRound(bid, "OPG", false), false);
  assert.equal(
    tracks.needsNewApprovalRound({ ...bid, ...atGate }, "ROV", false),
    true,
  );
});

test("cancelling a single round keeps it in history and pre-fills the approvers", () => {
  const bid = reopened({
    ...atGate,
    approvalStatus: "pending",
    approvalRounds: [
      round(4, "approved", "2026-10-02T00:00:00Z", { override }),
      round(5, "pending", "2026-10-06T00:00:00Z", {
        approvals: [
          approval(5, "a@x.com", "approved", "commercial"),
          approval(5, "b@x.com", "pending", "engineering"),
        ],
      }),
      round(6, "pending", "2026-10-07T00:00:00Z", {
        approvals: [
          approval(6, "a@x.com", "approved", "commercial"),
          approval(6, "c@x.com", "pending", "engineering"),
        ],
      }),
    ],
  });
  bid.approvals = bid.approvalRounds[2].approvals;
  const by = { name: "Req", email: "req@x.com" };

  assert.deepEqual(
    helpers.getCancellableRounds(bid, null).map((r) => r.round),
    [5, 6],
  );
  const patch = helpers.buildCancelledRoundsPatch(
    bid,
    null,
    by,
    "2026-10-08T00:00:00Z",
    "Wrong engineer",
  );
  assert.deepEqual(
    patch.approvalRounds.map((r) => r.status),
    ["approved", "cancelled", "cancelled"],
  );
  const cancelled = patch.approvalRounds[2];
  assert.equal(cancelled.completedDate, null);
  assert.equal(cancelled.cancellation.reason, "Wrong engineer");
  assert.equal(cancelled.cancellation.approvedCount, 1);
  assert.equal(cancelled.cancellation.totalApprovers, 2);
  assert.equal(patch.approvalStatus, "not-started");
  assert.deepEqual(patch.approvals, []);
  assert.deepEqual(
    patch.approvalDraftSelections.engineering.map((p) => p.email),
    ["c@x.com"],
  );
  assert.deepEqual(
    patch.approvalDraftSelections.commercial.map((p) => p.email),
    ["a@x.com"],
  );

  const after = { ...bid, ...patch };
  assert.equal(tracks.needsNewApprovalRound(after, null, false), true);
  assert.equal(tracks.hasPendingApprovalRound(after), false);
  assert.equal(tracks.getCurrentCycleRounds(after).length, 0);
});

test("cancelling a team round only resets that team", () => {
  const bid = {
    division: "INTEGRATED",
    serviceLine: "UWILD + ROV",
    leadDivision: "OPG",
    integratedLines: { OPG: "UWILD", SSR: "ROV" },
    approvalSecondaryLine: "ROV",
    approvalRounds: [
      round(1, "pending", "2026-10-01T00:00:00Z", { track: "OPG" }),
      round(2, "pending", "2026-10-02T00:00:00Z", { track: "ROV" }),
    ],
  };
  const patch = helpers.buildCancelledRoundsPatch(
    bid,
    "ROV",
    { name: "Req", email: "req@x.com" },
    "2026-10-03T00:00:00Z",
    "Missing approver",
  );
  assert.deepEqual(
    patch.approvalRounds.map((r) => r.status),
    ["pending", "cancelled"],
  );
  assert.equal(patch.approvalTracks.OPG.status, "pending");
  assert.equal(patch.approvalTracks.ROV.status, "not-started");
  assert.deepEqual(
    patch.approvalTracks.ROV.draftSelections.engineering.map((p) => p.email),
    ["p2@x.com"],
  );
  assert.deepEqual(
    patch.approvals.map((a) => a.round),
    [1],
  );
  assert.equal(patch.approvalStatus, "pending");
});

test("cancelled rounds are ignored by KPIs and approval durations", () => {
  const bid = {
    approvalRounds: [
      round(1, "cancelled", "2026-10-01T00:00:00Z", {
        approvals: [approval(1, "a@x.com", "approved")],
      }),
      round(2, "approved", "2026-10-03T00:00:00Z"),
    ],
  };
  assert.equal(kpis.isFirstPassApproved(bid), true);
  assert.deepEqual(
    helpers.computeBidSectorDurations(bid).map((d) => d.sector),
    ["engineering"],
  );
  assert.equal(
    helpers
      .computeBidSectorDurations({
        approvalRounds: [bid.approvalRounds[0]],
      })
      .map((d) => d.sector).length,
    0,
  );
});

test("cancel log emits the APPROVAL_CANCELLED notification", () => {
  const before = reopened({ ...atGate, approvalStatus: "pending" });
  const log = {
    id: "log-cancel",
    type: "APPROVAL_CANCELLED",
    timestamp: "2026-10-08T00:00:00Z",
    actor: "req@x.com",
    actorName: "Req",
    description: "Approval cancelled",
    metadata: {
      round: 5,
      approvedCount: 1,
      totalApprovers: 2,
      approvers: [{ name: "A", sector: "Commercial" }],
      reason: "Wrong engineer",
    },
  };
  const events = notifications.deriveBidNotifications(
    before,
    { approvalStatus: "not-started", activityLog: [log] },
    "Req",
  );
  assert.deepEqual(
    events.map((e) => e.event),
    ["APPROVAL_CANCELLED"],
  );
  assert.ok(events[0].headline.includes("rodada 5"));
});
