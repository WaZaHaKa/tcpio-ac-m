import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Swap point for the toolbar. Callers build tags from this object.
 * To change upstream: edit `npm`, `packagePaths`, and `attributes`, then run
 * `node scripts/fetch-upstream.mjs`. The license check still requires MIT.
 */
export const toolbarAdapter = {
  id: "nagishon",
  npm: "nagishon",
  registry: "https://registry.npmjs.org",
  locales: ["he", "en", "ar", "ru"],
  defaultLocale: "he",
  files: {
    toolbar: "nagishon.iife.js",
    prepaint: "prepaint.js",
    license: "LICENSE",
  },
  packagePaths: {
    toolbar: "package/dist/nagishon.iife.js",
    prepaint: "package/dist/prepaint.js",
    license: "package/LICENSE",
  },
  attributes: {
    auto: "data-nagishon",
    locale: "data-locale",
    statementUrl: "data-statement-url",
  },
  defer: true,
  prepaintOptional: true,
};

export function adapterManifest() {
  return {
    id: toolbarAdapter.id,
    npm: toolbarAdapter.npm,
    toolbar: toolbarAdapter.files.toolbar,
    prepaint: toolbarAdapter.files.prepaint,
    autoAttribute: toolbarAdapter.attributes.auto,
    localeAttribute: toolbarAdapter.attributes.locale,
    statementAttribute: toolbarAdapter.attributes.statementUrl,
    locales: toolbarAdapter.locales,
    defaultLocale: toolbarAdapter.defaultLocale,
    defer: toolbarAdapter.defer,
  };
}

export function cspAdapterPath() {
  return path.join(here, "csp-adapter.js");
}

export function cspAdapterSource() {
  return fs.readFileSync(cspAdapterPath());
}

function trimTrailingNewlines(buffer) {
  let end = buffer.length;
  while (end > 0 && (buffer[end - 1] === 0x0a || buffer[end - 1] === 0x0d)) end -= 1;
  return buffer.subarray(0, end);
}

/** Public toolbar file: CSP preamble plus the unmodified upstream build. */
export function composeToolbar(upstreamBuffer) {
  const shim = trimTrailingNewlines(cspAdapterSource());
  let body = upstreamBuffer;
  if (body.length >= 3 && body[0] === 0xef && body[1] === 0xbb && body[2] === 0xbf) {
    body = body.subarray(3);
  }
  return Buffer.concat([shim, Buffer.from("\n"), body]);
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
}

export function renderToolbarTag({ src, locale, statementUrl }) {
  const attrs = toolbarAdapter.attributes;
  return `<script defer src="${escapeAttr(src)}" ${attrs.auto} ${attrs.locale}="${escapeAttr(locale)}" ${attrs.statementUrl}="${escapeAttr(statementUrl)}"></script>`;
}

export function renderPrepaintTag({ src }) {
  return `<script src="${escapeAttr(src)}"></script>`;
}
