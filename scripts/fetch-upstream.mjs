import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { adapterManifest, composeToolbar, toolbarAdapter } from "../packages/script/adapter.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendorRoot = path.join(repoRoot, "packages", "script", "dist-vendor");
const upstreamRoot = path.join(vendorRoot, "upstream");
const pluginAssets = path.join(repoRoot, "packages", "wp-plugin", "assets");
const MAX_TARBALL = 8 * 1024 * 1024;

export function licenseId(license) {
  if (typeof license === "string") return license.trim();
  if (license && typeof license === "object" && typeof license.type === "string") return license.type.trim();
  return "";
}

export function assertMitRegistryLicense(license) {
  const id = licenseId(license);
  if (id !== "MIT") {
    throw new Error(`Refusing to vendor: registry license is ${id || "missing"}, expected MIT.`);
  }
}

export function assertMitLicenseText(text) {
  const body = String(text);
  if (!body.includes("Permission is hereby granted")) {
    throw new Error("Refusing to vendor: LICENSE is not the MIT license.");
  }
  if (!body.includes('THE SOFTWARE IS PROVIDED "AS IS"')) {
    throw new Error("Refusing to vendor: LICENSE is missing the MIT disclaimer.");
  }
  if (body.includes("Apache License") || body.includes("GNU GENERAL PUBLIC LICENSE")) {
    throw new Error("Refusing to vendor: LICENSE is not MIT-only.");
  }
}

export function assertStableVersion(version) {
  if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(String(version))) {
    throw new Error(`Refusing to vendor: ${version} is not a stable release.`);
  }
}

export function verifyIntegrity(buffer, integrity) {
  const match = /^sha512-([A-Za-z0-9+/]+={0,2})$/.exec(String(integrity));
  if (!match) throw new Error("Refusing to vendor: missing sha512 integrity.");
  const expected = Buffer.from(match[1], "base64");
  const actual = createHash("sha512").update(buffer).digest();
  if (expected.length !== actual.length || !expected.equals(actual)) {
    throw new Error("Refusing to vendor: tarball integrity does not match.");
  }
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function assertSafeTarEntries(listing) {
  for (const line of listing.split("\n")) {
    if (!line) continue;
    if (line.startsWith("/") || line.split("/").includes("..")) {
      throw new Error(`Refusing to vendor: unsafe archive path ${line}`);
    }
  }
}

async function fetchRegistryLatest() {
  const npmName = toolbarAdapter.npm;
  const registry = new URL(toolbarAdapter.registry);
  if (registry.protocol !== "https:" || registry.host !== "registry.npmjs.org") {
    throw new Error("Refusing to vendor: registry host is not registry.npmjs.org.");
  }
  const url = new URL(`/${npmName}/latest`, registry);
  const response = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: "follow" });
  const finalHost = new URL(response.url).host;
  if (finalHost !== "registry.npmjs.org") {
    throw new Error(`Refusing to vendor: registry redirected to ${finalHost}.`);
  }
  if (!response.ok) throw new Error(`Registry request failed (${response.status}).`);
  return response.json();
}

async function downloadTarball(meta) {
  const tarball = meta?.dist?.tarball;
  const integrity = meta?.dist?.integrity;
  if (typeof tarball !== "string") throw new Error("Refusing to vendor: registry metadata has no tarball.");
  const url = new URL(tarball);
  const npmName = toolbarAdapter.npm;
  const expectedPrefix = `/${npmName}/-/`;
  if (url.protocol !== "https:" || url.host !== "registry.npmjs.org" || !url.pathname.startsWith(expectedPrefix)) {
    throw new Error("Refusing to vendor: tarball URL is not the npm registry.");
  }
  if (!url.pathname.endsWith(`${npmName}-${meta.version}.tgz`)) {
    throw new Error("Refusing to vendor: tarball name does not match the fetched version.");
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: "follow" });
  if (new URL(response.url).host !== "registry.npmjs.org") {
    throw new Error("Refusing to vendor: tarball download left the npm registry.");
  }
  if (!response.ok) throw new Error(`Tarball download failed (${response.status}).`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_TARBALL) throw new Error("Refusing to vendor: tarball is too large.");
  verifyIntegrity(buffer, integrity);
  return buffer;
}

function readExtracted(root, relativePath, { optional = false } = {}) {
  const full = path.resolve(root, relativePath);
  const relative = path.relative(root, full);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to read ${relativePath}`);
  }
  if (!fs.existsSync(full)) {
    if (optional) return null;
    throw new Error(`Refusing to vendor: ${relativePath} is missing from the package.`);
  }
  return fs.readFileSync(full);
}

function writeFile(file, buffer) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buffer);
}

function vendorLayout(pieces) {
  const manifest = `${JSON.stringify(adapterManifest(), null, 2)}\n`;
  const receipt = {
    name: toolbarAdapter.npm,
    version: pieces.version,
    integrity: pieces.integrity,
    license: "MIT",
    fetchedAt: pieces.fetchedAt,
    adapter: "csp-style-adopted-stylesheets",
    files: {
      "upstream/nagishon.iife.js": sha256(pieces.toolbar),
      "upstream/LICENSE": sha256(pieces.license),
      "nagishon.iife.js": sha256(pieces.composed),
      "prepaint.js": pieces.prepaint ? sha256(pieces.prepaint) : null,
    },
  };
  const receiptText = `${JSON.stringify(receipt, null, 2)}\n`;
  const note = [
    "Files in upstream/ are an unmodified copy of the fetched package.",
    "receipt.json records the version and the registry integrity.",
    "LICENSE is the upstream MIT license. Keep it with these files.",
    "nagishon.iife.js is that build with packages/script/csp-adapter.js prepended,",
    "so the toolbar can apply its CSS under default-src 'self'; script-src 'self'.",
    "prepaint.js is unmodified.",
    "",
  ].join("\n");

  writeFile(path.join(upstreamRoot, "nagishon.iife.js"), pieces.toolbar);
  writeFile(path.join(upstreamRoot, "LICENSE"), pieces.license);
  writeFile(path.join(vendorRoot, "LICENSE"), pieces.license);
  writeFile(path.join(vendorRoot, "nagishon.iife.js"), pieces.composed);
  writeFile(path.join(vendorRoot, "UPSTREAM.txt"), note);
  writeFile(path.join(vendorRoot, "adapter.json"), manifest);
  writeFile(path.join(vendorRoot, "receipt.json"), receiptText);
  if (pieces.prepaint) {
    writeFile(path.join(upstreamRoot, "prepaint.js"), pieces.prepaint);
    writeFile(path.join(vendorRoot, "prepaint.js"), pieces.prepaint);
  }

  writeFile(path.join(pluginAssets, "nagishon.iife.js"), pieces.composed);
  writeFile(path.join(pluginAssets, "LICENSE.nagishon"), pieces.license);
  writeFile(path.join(pluginAssets, "adapter.json"), manifest);
  writeFile(path.join(pluginAssets, "receipt.json"), receiptText);
  if (pieces.prepaint) writeFile(path.join(pluginAssets, "prepaint.js"), pieces.prepaint);
  return receipt;
}

function assertIntegrityShape(integrity) {
  if (!/^sha512-[A-Za-z0-9+/]+={0,2}$/.test(String(integrity))) {
    throw new Error("Receipt integrity is not a sha512 hash.");
  }
}

export function checkVendorTree() {
  const receipt = JSON.parse(fs.readFileSync(path.join(vendorRoot, "receipt.json"), "utf8"));
  assertStableVersion(receipt.version);
  if (receipt.license !== "MIT") throw new Error("Receipt license is not MIT.");
  assertIntegrityShape(receipt.integrity);
  assertMitLicenseText(fs.readFileSync(path.join(upstreamRoot, "LICENSE"), "utf8"));
  assertMitLicenseText(fs.readFileSync(path.join(vendorRoot, "LICENSE"), "utf8"));

  const pristine = fs.readFileSync(path.join(upstreamRoot, "nagishon.iife.js"));
  const composed = fs.readFileSync(path.join(vendorRoot, "nagishon.iife.js"));
  const expected = composeToolbar(pristine);
  if (!composed.equals(expected)) {
    throw new Error("Public toolbar file is not the CSP adapter plus the upstream build.");
  }

  const files = {
    "upstream/nagishon.iife.js": pristine,
    "upstream/LICENSE": fs.readFileSync(path.join(upstreamRoot, "LICENSE")),
    "nagishon.iife.js": composed,
    "prepaint.js": fs.existsSync(path.join(vendorRoot, "prepaint.js"))
      ? fs.readFileSync(path.join(vendorRoot, "prepaint.js"))
      : null,
  };
  for (const [name, buffer] of Object.entries(files)) {
    const recorded = receipt.files[name];
    if (buffer === null) {
      if (recorded !== null) throw new Error(`Receipt lists ${name} but the file is missing.`);
      continue;
    }
    if (recorded !== sha256(buffer)) throw new Error(`Hash mismatch for ${name}.`);
  }
  if (files["prepaint.js"]) {
    const upstreamPrepaint = fs.readFileSync(path.join(upstreamRoot, "prepaint.js"));
    if (!upstreamPrepaint.equals(files["prepaint.js"])) {
      throw new Error("prepaint.js does not match the upstream copy.");
    }
  }

  const manifest = `${JSON.stringify(adapterManifest(), null, 2)}\n`;
  if (fs.readFileSync(path.join(vendorRoot, "adapter.json"), "utf8") !== manifest) {
    throw new Error("dist-vendor/adapter.json does not match the adapter.");
  }
  if (fs.readFileSync(path.join(pluginAssets, "adapter.json"), "utf8") !== manifest) {
    throw new Error("WordPress adapter.json does not match the adapter.");
  }
  for (const name of ["nagishon.iife.js", "prepaint.js", "receipt.json"]) {
    const left = fs.readFileSync(path.join(vendorRoot, name));
    const right = fs.readFileSync(path.join(pluginAssets, name));
    if (!left.equals(right)) throw new Error(`Plugin asset ${name} is out of date.`);
  }
  if (!fs.readFileSync(path.join(pluginAssets, "LICENSE.nagishon")).equals(files["upstream/LICENSE"])) {
    throw new Error("Plugin upstream license copy is out of date.");
  }
  return receipt;
}

export async function fetchAndVendor() {
  const meta = await fetchRegistryLatest();
  assertStableVersion(meta.version);
  assertMitRegistryLicense(meta.license);
  const tarball = await downloadTarball(meta);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tcpio-ac-m-"));
  try {
    const archive = path.join(tmp, "upstream.tgz");
    fs.writeFileSync(archive, tarball);
    const listing = execFileSync("tar", ["-tzf", archive], { encoding: "utf8" });
    assertSafeTarEntries(listing);
    execFileSync("tar", ["-xzf", archive, "-C", tmp]);
    const packed = JSON.parse(fs.readFileSync(path.join(tmp, "package", "package.json"), "utf8"));
    assertMitRegistryLicense(packed.license);
    const license = readExtracted(tmp, toolbarAdapter.packagePaths.license);
    assertMitLicenseText(license.toString("utf8"));
    const toolbar = readExtracted(tmp, toolbarAdapter.packagePaths.toolbar);
    const prepaint = readExtracted(tmp, toolbarAdapter.packagePaths.prepaint, {
      optional: toolbarAdapter.prepaintOptional,
    });
    const fetchedAt = new Date().toISOString();
    const receipt = vendorLayout({
      version: meta.version,
      integrity: meta.dist.integrity,
      fetchedAt,
      toolbar,
      prepaint,
      license,
      composed: composeToolbar(toolbar),
    });
    checkVendorTree();
    return receipt;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function invokedDirectly() {
  const entry = process.argv[1];
  return Boolean(entry) && path.resolve(entry) === fileURLToPath(import.meta.url);
}

async function main() {
  if (process.argv.includes("--check")) {
    const receipt = checkVendorTree();
    console.log(`vendor ok ${receipt.name}@${receipt.version} ${receipt.integrity}`);
    return;
  }
  const receipt = await fetchAndVendor();
  console.log(`vendored ${receipt.name}@${receipt.version}`);
  console.log(receipt.integrity);
}

if (invokedDirectly()) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
