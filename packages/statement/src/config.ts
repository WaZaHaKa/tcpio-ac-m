export interface Coordinator {
  name: string;
  phone: string;
  email: string;
  appointed: boolean;
}

export interface StatementConfig {
  controller: string;
  coordinator: Coordinator;
  date: string;
  limitations: string[];
  tests: string[];
  adjustments: string[];
}

const TOP_KEYS = new Set(["controller", "coordinator", "date", "limitations", "tests", "adjustments"]);
const COORD_KEYS = new Set(["name", "phone", "email", "appointed"]);
const MAX_SHORT = 400;
const MAX_ITEM = 2000;
const MAX_ITEMS = 40;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rejectUnknown(record: Record<string, unknown>, allowed: Set<string>, label: string): void {
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      throw new Error(`${label} has unknown field "${key}". Conformance fields are not accepted.`);
    }
  }
}

function requireText(value: unknown, label: string, max: number): string {
  if (typeof value !== "string") throw new Error(`${label} must be a string.`);
  const text = value.trim();
  if (!text) throw new Error(`${label} is required.`);
  if (text.length > max) throw new Error(`${label} is too long.`);
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) {
    throw new Error(`${label} contains a control character.`);
  }
  return text;
}

function requireList(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  if (value.length > MAX_ITEMS) throw new Error(`${label} has too many items.`);
  return value.map((item, index) => requireText(item, `${label}[${index}]`, MAX_ITEM));
}

function requireDate(value: unknown): string {
  const text = requireText(value, "date", 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) throw new Error("date must be YYYY-MM-DD.");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) {
    throw new Error("date is not a real calendar date.");
  }
  return text;
}

export function parseStatementConfig(input: unknown): StatementConfig {
  if (!isRecord(input)) throw new Error("Config must be a JSON object.");
  rejectUnknown(input, TOP_KEYS, "Config");
  if (!isRecord(input.coordinator)) throw new Error("coordinator must be an object.");
  rejectUnknown(input.coordinator, COORD_KEYS, "coordinator");
  if (input.coordinator.appointed !== undefined && typeof input.coordinator.appointed !== "boolean") {
    throw new Error("coordinator.appointed must be a boolean.");
  }
  return {
    controller: requireText(input.controller, "controller", MAX_SHORT),
    coordinator: {
      name: requireText(input.coordinator.name, "coordinator.name", MAX_SHORT),
      phone: requireText(input.coordinator.phone, "coordinator.phone", MAX_SHORT),
      email: requireText(input.coordinator.email, "coordinator.email", MAX_SHORT),
      appointed: input.coordinator.appointed === true,
    },
    date: requireDate(input.date),
    limitations: requireList(input.limitations, "limitations"),
    tests: requireList(input.tests, "tests"),
    adjustments: input.adjustments === undefined ? [] : requireList(input.adjustments, "adjustments"),
  };
}
