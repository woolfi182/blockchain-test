const features = [
  "e2e/features/**/*.feature",
  "--require e2e/world.js",
  "--require e2e/helper.js",
  "--require e2e/**/*.steps.js",
  `--format-options '{"snippetInterface": "synchronous"}'`,
  "--format progress-bar",
  "--publish-quiet",
].join(" ");

module.exports = {
  default: features,
};
