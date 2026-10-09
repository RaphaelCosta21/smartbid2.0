const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

const app = path.resolve(__dirname, "../src/webparts/smartBid20/app");

function load(relative, imports = {}) {
  const filename = path.join(app, relative);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInThisContext(`(function(require, module, exports) { ${code}\n})`, {
    filename,
  })(
    (name) => {
      if (Object.hasOwn(imports, name)) return imports[name];
      throw new Error(`Unexpected import: ${name}`);
    },
    module,
    module.exports,
  );
  return module.exports;
}

function setup({
  exists = false,
  denied = false,
  fields = {},
  failField,
} = {}) {
  const schema = new Map([
    ["Title", { TypeAsString: "Text" }],
    ...Object.entries(fields),
  ]);
  const calls = [];
  const fieldApi = {
    select: () => async () =>
      Array.from(schema, ([InternalName, data]) => ({
        InternalName,
        ...data,
      })),
    getByInternalNameOrTitle: (name) => ({
      update: async (properties, type) => {
        calls.push(["update", name, properties, type]);
        if (name === failField) throw new Error("Field update failed");
        Object.assign(schema.get(name), properties);
      },
    }),
  };
  for (const [method, type] of [
    ["addText", "Text"],
    ["addMultilineText", "Note"],
    ["addChoice", "Choice"],
  ]) {
    fieldApi[method] = async (name, properties) => {
      calls.push(["add", name]);
      schema.set(name, { TypeAsString: type, ...properties });
    };
  }
  const list = {
    select: () => async () => {
      if (denied) throw Object.assign(new Error("Forbidden"), { status: 403 });
      if (!exists) throw Object.assign(new Error("Not found"), { status: 404 });
      return { Id: "list-id" };
    },
    fields: fieldApi,
  };
  const config = load("config/sharepoint.config.ts");
  const service = load("services/NotificationLogService.ts", {
    "./SPService": {
      SPService: {
        sp: {
          web: {
            lists: {
              getByTitle: (name) => {
                assert.equal(
                  name,
                  config.SHAREPOINT_CONFIG.lists.notificationLog,
                );
                return list;
              },
              add: async (...args) => {
                calls.push(["list", ...args]);
                exists = true;
              },
            },
          },
        },
      },
    },
    "@pnp/sp/fields": {},
    "../config/sharepoint.config": config,
  }).NotificationLogService;
  return {
    service,
    schema,
    calls,
    recover: () => {
      failField = undefined;
    },
  };
}

test("creates notification list, all eight fields and strict deduplication", async () => {
  const { service, schema, calls } = setup();
  await service.ensureList();
  assert.equal(calls.filter(([kind]) => kind === "list").length, 1);
  assert.deepEqual(Array.from(schema.keys()).sort(), [
    "Actor",
    "BidNumber",
    "DeliveryStatus",
    "Event",
    "Notes",
    "Payload",
    "Recipients",
    "Source",
    "Title",
  ]);
  assert.equal(schema.get("Title").Indexed, true);
  assert.equal(schema.get("Title").EnforceUniqueValues, true);
  assert.equal(schema.get("Title").Required, true);
  const titleUpdates = calls.filter(
    ([kind, name]) => kind === "update" && name === "Title",
  );
  assert.deepEqual(titleUpdates[0][2], { Indexed: true });
  assert.equal(titleUpdates[1][2].EnforceUniqueValues, true);
  const status = schema.get("DeliveryStatus");
  assert.deepEqual(status.Choices, ["Received", "Sent", "Skipped", "Failed"]);
  assert.equal(status.DefaultValue, "Received");
  for (const name of ["Recipients", "Payload", "Notes"]) {
    assert.equal(schema.get(name).TypeAsString, "Note");
    assert.equal(schema.get(name).RichText, false);
    assert.equal(schema.get(name).AppendOnly, false);
  }
});

test("reruns skip existing fields and repair rich text settings", async () => {
  const { service, calls, schema } = setup({
    exists: true,
    fields: {
      Notes: { TypeAsString: "Note", RichText: true, AppendOnly: true },
    },
  });
  await service.ensureList();
  const additions = calls.filter(([kind]) => kind === "add").length;
  await service.ensureList();
  assert.equal(calls.filter(([kind]) => kind === "list").length, 0);
  assert.equal(calls.filter(([kind]) => kind === "add").length, additions);
  assert.equal(schema.get("Notes").RichText, false);
  assert.equal(schema.get("Notes").AppendOnly, false);
});

test("concurrent callers share provisioning", async () => {
  const { service, calls } = setup();
  const first = service.ensureList();
  assert.equal(service.ensureList(), first);
  await first;
  assert.equal(calls.filter(([kind]) => kind === "list").length, 1);
});

test("permission errors do not trigger list creation", async () => {
  const { service, calls } = setup({ denied: true });
  await assert.rejects(service.ensureList(), /Forbidden/);
  assert.equal(calls.length, 0);
});

test("unique Title failures are surfaced, not treated as success", async () => {
  const { service } = setup({ exists: true, failField: "Title" });
  await assert.rejects(
    service.ensureList(),
    /Title: could not enforce unique event keys/,
  );
});

test("partial failures can be retried without duplicating fields", async () => {
  const state = setup({ failField: "DeliveryStatus" });
  await assert.rejects(
    state.service.ensureList(),
    /DeliveryStatus: Field update failed/,
  );
  state.recover();
  await state.service.ensureList();
  assert.equal(state.schema.size, 9);
  assert.equal(
    state.calls.filter(
      ([kind, name]) => kind === "add" && name === "DeliveryStatus",
    ).length,
    1,
  );
});

test("incompatible existing field types are reported without replacing fields", async () => {
  const { service, schema } = setup({
    exists: true,
    fields: { Payload: { TypeAsString: "Text" } },
  });
  await assert.rejects(
    service.ensureList(),
    /Payload: Expected Note, found Text/,
  );
  assert.equal(schema.get("Payload").TypeAsString, "Text");
});
