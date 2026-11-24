import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { renderPrepaintTag, renderToolbarTag } from "../packages/script/adapter.mjs";
import { checkVendorTree } from "../scripts/fetch-upstream.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("vendored files match the receipt and the adapter", () => {
  const receipt = checkVendorTree();
  assert.equal(receipt.name, "nagishon");
  assert.equal(receipt.license, "MIT");
  assert.match(receipt.integrity, /^sha512-/);
  assert.match(receipt.version, /^\d+\.\d+\.\d+$/);
});

test("csp adapter does not call the network or eval", () => {
  const source = fs.readFileSync(path.join(root, "packages", "script", "csp-adapter.js"), "utf8");
  assert.doesNotMatch(source, /https?:\/\//);
  assert.doesNotMatch(source, /\beval\b|new Function/);
  const publicFile = fs.readFileSync(path.join(root, "packages", "script", "dist-vendor", "nagishon.iife.js"));
  assert.ok(publicFile.subarray(0, source.trimEnd().length).equals(Buffer.from(source.trimEnd())));
});

test("demo snippet is the self-hosted toolbar tag", () => {
  const html = fs.readFileSync(path.join(root, "demo", "index.html"), "utf8");
  const toolbar = renderToolbarTag({
    src: "../packages/script/dist-vendor/nagishon.iife.js",
    locale: "he",
    statementUrl: "statement.html",
  });
  const prepaint = renderPrepaintTag({ src: "../packages/script/dist-vendor/prepaint.js" });
  assert.ok(html.includes(toolbar), toolbar);
  assert.ok(html.includes(prepaint));
  assert.equal(html.match(/<script\b/g)?.length, 2);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/);
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /\son[a-z]+=/i);
  assert.doesNotMatch(html, /\sstyle=/);
  assert.match(html, /lang="he"/);
  assert.match(html, /dir="rtl"/);
  assert.match(html, /אינו הופך אתר לנגיש/);
});
