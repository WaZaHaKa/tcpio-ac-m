#!/usr/bin/env bash
# Install the current gitleaks release (checksummed) and scan this branch history.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

meta="$(mktemp)"
binfile="$(mktemp)"
trap 'rm -f "$meta" "$binfile"' EXIT
curl -fsSL "https://api.github.com/repos/gitleaks/gitleaks/releases/latest" -o "$meta"

GITLEAKS_META="$meta" GITLEAKS_BINFILE="$binfile" node --input-type=module <<'EOF'
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const meta = JSON.parse(fs.readFileSync(process.env.GITLEAKS_META, "utf8"));
const tag = meta.tag_name;
if (!tag) throw new Error("gitleaks release has no tag");
const archive = meta.assets.find((item) => /linux_x64\.tar\.gz$/.test(item.name) && !item.name.includes("arm"));
const sums = meta.assets.find((item) => item.name.endsWith("checksums.txt"));
if (!archive || !sums) throw new Error("gitleaks release is missing a linux asset");

const dir = path.join("/tmp", `gitleaks-${tag}`);
const bin = path.join(dir, "gitleaks");
if (!fs.existsSync(bin)) {
  fs.mkdirSync(dir, { recursive: true });
  const archivePath = path.join(dir, archive.name);
  const sumsPath = path.join(dir, "checksums.txt");
  execFileSync("curl", ["-fsSL", "-o", archivePath, archive.browser_download_url], { stdio: "inherit" });
  execFileSync("curl", ["-fsSL", "-o", sumsPath, sums.browser_download_url], { stdio: "inherit" });
  const wanted = fs
    .readFileSync(sumsPath, "utf8")
    .split("\n")
    .find((line) => line.includes(archive.name));
  if (!wanted) throw new Error("checksum entry missing");
  const expected = wanted.trim().split(/\s+/)[0];
  const actual = execFileSync("sha256sum", [archivePath], { encoding: "utf8" }).trim().split(/\s+/)[0];
  if (expected !== actual) throw new Error("gitleaks checksum mismatch");
  execFileSync("tar", ["-xzf", archivePath, "-C", dir]);
  fs.chmodSync(bin, 0o755);
}
fs.writeFileSync(process.env.GITLEAKS_BINFILE, bin);
console.log(`gitleaks ${tag}`);
EOF

bin="$(cat "$binfile")"
"$bin" version
"$bin" detect --source "$root" --redact --verbose --exit-code 1
