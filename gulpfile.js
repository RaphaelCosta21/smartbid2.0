"use strict";

const build = require("@microsoft/sp-build-web");

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`,
);
build.addSuppression(/Warning - lint -/gi);
build.addSuppression(/Warning - \[sass\]/gi);

// Treat lint warnings as non-fatal
build.mergeConfig({
  shouldWarningsFailBuild: false,
});

// Lint only on bundle/package; skipping it on serve saves minutes per dev cycle.
if (process.argv.indexOf("serve") !== -1) {
  build.lintCmd.enabled = false;
}

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set("serve", result.get("serve-deprecated"));

  return result;
};

build.initialize(require("gulp"));
