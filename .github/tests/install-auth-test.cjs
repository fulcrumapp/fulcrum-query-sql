const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

for (const file of ["workflows/ci.yml", "actions/npm-publish-github/action.yml"]) {
  const contents = readFileSync(path.resolve(__dirname, "..", file), "utf8");
  const install = contents.match(/- name: Install dependencies\n(?: +shell: bash\n)? +run: \|\n([\s\S]*?)(?=^ +env:)/m)?.[1];
  assert.ok(install, `${file}: install script is present`);

  test(`${file}: install auth is private, step-local and cleaned up even on failure`, () => {
    for (const exitCode of [0, 1]) {
      const dir = mkdtempSync(path.join(os.tmpdir(), "install-auth-"));
      try {
        writeFileSync(path.join(dir, "yarn"), `#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const config = process.env.NPM_CONFIG_USERCONFIG;
assert.ok(config.startsWith(process.env.RUNNER_TEMP + "/"));
assert.equal(fs.statSync(config).mode & 0o777, 0o600);
assert.equal(fs.readFileSync(config, "utf8"), '@fulcrumapp:registry=https://npm.pkg.github.com/\\n//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}\\n');
assert.equal(process.env.NODE_AUTH_TOKEN, "test-install-token");
assert.deepEqual(process.argv.slice(2), ["install", "--frozen-lockfile", "--production=false", "--ignore-scripts", "--non-interactive"]);
fs.writeFileSync(process.env.RUNNER_TEMP + "/verified", "");
process.exit(${exitCode});
`, { mode: 0o755 });
        const result = spawnSync("bash", ["-e", "-o", "pipefail", "-c", install], {
          encoding: "utf8",
          env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, RUNNER_TEMP: dir, NODE_AUTH_TOKEN: "test-install-token" }
        });
        assert.equal(result.status, exitCode, result.stderr);
        assert.deepEqual(readdirSync(dir), ["verified", "yarn"], "install must run and auth config must be removed");
        assert.doesNotMatch(install, /GITHUB_ENV|GITHUB_OUTPUT/);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });
}

test("setup-node does not create job-wide registry auth for CI or publishing", () => {
  for (const file of ["ci.yml", "publish.yml"]) {
    const contents = readFileSync(path.resolve(__dirname, "../workflows", file), "utf8");
    assert.doesNotMatch(contents, /registry-url:|scope:|NPM_CONFIG_USERCONFIG:/);
    assert.doesNotMatch(contents, /- name: (?:Lint|Build|Type check|Test)\n(?:[^\n]*\n)*? +NODE_AUTH_TOKEN:/);
  }
});
