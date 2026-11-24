import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { parseStatementConfig } from "../packages/statement/src/config.ts";
import { escapeHtml, NON_CLAIM, renderStatement, TOOLBAR_DISCLAIMER } from "../packages/statement/src/render.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const base = {
  controller: "{{CONTROLLER_NAME}}",
  coordinator: {
    name: "{{COORDINATOR_NAME}}",
    phone: "{{COORDINATOR_PHONE}}",
    email: "{{COORDINATOR_EMAIL}}",
  },
  date: "2026-11-24",
  limitations: ["CANARY_LIMIT_ONLY"],
  tests: ["CANARY_TEST_ONLY"],
  adjustments: ["CANARY_ADJ_ONLY"],
};

test("disclaimer says the toolbar is not enough", () => {
  assert.match(TOOLBAR_DISCLAIMER, /אינו הופך אתר לנגיש/);
  assert.match(NON_CLAIM, /אינה קובעת/);
  const html = renderStatement(parseStatementConfig(base));
  assert.ok(html.includes(escapeHtml(TOOLBAR_DISCLAIMER)));
  assert.ok(html.includes(escapeHtml(NON_CLAIM)));
});

test("statement lists only configured tests, adjustments, and limitations", () => {
  const html = renderStatement(parseStatementConfig(base));
  assert.match(html, /CANARY_TEST_ONLY/);
  assert.match(html, /CANARY_LIMIT_ONLY/);
  assert.match(html, /CANARY_ADJ_ONLY/);
  assert.doesNotMatch(html, /CANARY_NOT_LISTED/);
  assert.doesNotMatch(html, /NVDA|VoiceOver|WCAG|compliant|certified|עומד בתקן|הונגש במלואו/);
  assert.doesNotMatch(html, />AA</);
});

test("empty lists do not invent tests or a clean bill of health", () => {
  const html = renderStatement(
    parseStatementConfig({
      ...base,
      limitations: [],
      tests: [],
      adjustments: [],
    }),
  );
  assert.match(html, /לא נמסרו בדיקות שבוצעו/);
  assert.match(html, /לא נמסר תיאור של התאמות שבוצעו/);
  assert.match(html, /אין בכך קביעה שאין מגבלות/);
  assert.doesNotMatch(html, /CANARY_/);
});

test("config values are escaped and conformance fields are refused", () => {
  const html = renderStatement(
    parseStatementConfig({
      ...base,
      limitations: ['<script>alert("x")</script>'],
    }),
  );
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /&lt;script&gt;/);
  assert.throws(() => parseStatementConfig({ ...base, conforms: true }), /unknown field/);
  assert.throws(() => parseStatementConfig({ ...base, date: "2026-02-31" }), /real calendar date/);
  assert.throws(() => parseStatementConfig({ ...base, tests: undefined }), /tests must be an array/);
});

test("unappointed coordinator is not described as appointed", () => {
  const html = renderStatement(parseStatementConfig(base));
  assert.match(html, /לא נמסר שמונה רכז נגישות/);
  const appointed = renderStatement(
    parseStatementConfig({
      ...base,
      coordinator: { ...base.coordinator, appointed: true },
    }),
  );
  assert.match(appointed, /נמסרו כפרטי רכז הנגישות/);
  assert.doesNotMatch(appointed, /לא נמסר שמונה רכז/);
});

test("demo statement file matches the renderer", () => {
  const raw: unknown = JSON.parse(fs.readFileSync(path.join(root, "demo", "statement.config.json"), "utf8"));
  const expected = renderStatement(parseStatementConfig(raw), "html", "demo.css");
  const actual = fs.readFileSync(path.join(root, "demo", "statement.html"), "utf8");
  assert.equal(actual, expected);
  assert.doesNotMatch(actual, /<script/);
  assert.doesNotMatch(actual, /\sstyle=/);
});

test("cli writes html and rejects a conformance field", () => {
  const out = path.join(root, "demo", ".statement-cli-out.html");
  const ok = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      path.join(root, "packages", "statement", "src", "cli.ts"),
      "--config",
      path.join(root, "demo", "statement.config.json"),
      "--out",
      out,
      "--stylesheet",
      "demo.css",
    ],
    { encoding: "utf8" },
  );
  assert.equal(ok.status, 0, ok.stderr);
  assert.ok(fs.readFileSync(out, "utf8").includes("הצהרת נגישות"));
  fs.unlinkSync(out);

  const badPath = path.join(root, "demo", ".bad-statement.json");
  fs.writeFileSync(badPath, JSON.stringify({ ...base, level: "AA" }));
  const bad = spawnSync(
    process.execPath,
    ["--experimental-strip-types", path.join(root, "packages", "statement", "src", "cli.ts"), "--config", badPath],
    { encoding: "utf8" },
  );
  fs.unlinkSync(badPath);
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /unknown field/);
});
