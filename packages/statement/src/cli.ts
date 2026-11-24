import fs from "node:fs";
import { parseStatementConfig } from "./config.ts";
import { renderStatement } from "./render.ts";

interface Flags {
  configPath: string;
  outPath?: string;
  format: "html" | "md";
  stylesheet?: string;
}

function usage(): string {
  return [
    "Usage: node --experimental-strip-types packages/statement/src/cli.ts --config <file> [--out <file>] [--format html|md] [--stylesheet <relative>]",
    "Prints a Hebrew accessibility statement from a JSON config.",
    "The statement lists only the adjustments, tests, and limitations in that file.",
  ].join("\n");
}

export function parseArgs(argv: readonly string[]): Flags {
  const flags: Flags = { configPath: "", format: "html" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === "--help" || arg === "-h") throw new Error(usage());
    if (arg === "--config" && next) {
      flags.configPath = next;
      index += 1;
      continue;
    }
    if (arg === "--out" && next) {
      flags.outPath = next;
      index += 1;
      continue;
    }
    if (arg === "--format" && next) {
      if (next !== "html" && next !== "md") throw new Error("format must be html or md.");
      flags.format = next;
      index += 1;
      continue;
    }
    if (arg === "--stylesheet" && next) {
      flags.stylesheet = next;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument ${arg}\n${usage()}`);
  }
  if (!flags.configPath) throw new Error(`Missing --config\n${usage()}`);
  return flags;
}

export function renderConfigFile(flags: Flags): string {
  const raw: unknown = JSON.parse(fs.readFileSync(flags.configPath, "utf8"));
  const config = parseStatementConfig(raw);
  return renderStatement(config, flags.format, flags.stylesheet);
}

export function main(argv: readonly string[]): number {
  try {
    const flags = parseArgs(argv);
    const document = renderConfigFile(flags);
    if (flags.outPath) fs.writeFileSync(flags.outPath, document);
    else process.stdout.write(document);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    return 1;
  }
}

const entry = process.argv[1] ?? "";
if (entry.endsWith("cli.ts")) {
  process.exitCode = main(process.argv.slice(2));
}
