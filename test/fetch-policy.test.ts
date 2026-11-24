import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertMitLicenseText,
  assertMitRegistryLicense,
  assertStableVersion,
  verifyIntegrity,
} from "../scripts/fetch-upstream.mjs";
import { createHash } from "node:crypto";

const MIT = `MIT License

Copyright (c) 2026 Example

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
`;

test("registry license must be MIT", () => {
  assert.doesNotThrow(() => assertMitRegistryLicense("MIT"));
  assert.doesNotThrow(() => assertMitRegistryLicense({ type: "MIT" }));
  assert.throws(() => assertMitRegistryLicense("Apache-2.0"), /expected MIT/);
  assert.throws(() => assertMitRegistryLicense("MIT OR Apache-2.0"), /expected MIT/);
  assert.throws(() => assertMitRegistryLicense(""), /expected MIT/);
});

test("license text must be the MIT license", () => {
  assert.doesNotThrow(() => assertMitLicenseText(MIT));
  assert.throws(() => assertMitLicenseText("Apache License, Version 2.0"), /not the MIT license|not MIT-only/);
  assert.throws(() => assertMitLicenseText(`${MIT}\nApache License`), /not MIT-only/);
  assert.throws(() => assertMitLicenseText(`${MIT}\nGNU GENERAL PUBLIC LICENSE`), /not MIT-only/);
});

test("prerelease versions are refused", () => {
  assert.doesNotThrow(() => assertStableVersion("1.0.0"));
  assert.throws(() => assertStableVersion("1.0.0-stage"), /not a stable release/);
  assert.throws(() => assertStableVersion("latest"), /not a stable release/);
});

test("sha512 integrity is checked", () => {
  const body = Buffer.from("tcpio-ac-m");
  const digest = createHash("sha512").update(body).digest("base64");
  assert.doesNotThrow(() => verifyIntegrity(body, `sha512-${digest}`));
  assert.throws(() => verifyIntegrity(body, `sha512-${digest.slice(0, -2)}aa`), /does not match/);
  assert.throws(() => verifyIntegrity(body, "sha256-abcd"), /sha512 integrity/);
});
