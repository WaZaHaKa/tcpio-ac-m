import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const plugin = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "packages", "wp-plugin");

function phpSources(): string {
  const files = ["tcpio-ac-m.php", "uninstall.php", "includes/sanitize.php"];
  return files.map((file) => fs.readFileSync(path.join(plugin, file), "utf8")).join("\n");
}

test("plugin does not phone home and checks capability", () => {
  const source = phpSources();
  assert.match(source, /current_user_can\('manage_options'\)/);
  assert.match(source, /settings_fields\('tcpio_ac_m'\)/);
  assert.match(fs.readFileSync(path.join(plugin, "tcpio-ac-m.php"), "utf8"), /defined\('ABSPATH'\)/);
  assert.match(fs.readFileSync(path.join(plugin, "uninstall.php"), "utf8"), /WP_UNINSTALL_PLUGIN/);
  assert.doesNotMatch(source, /wp_remote_|curl_exec|fsockopen|file_get_contents\(\s*['"]https?:/);
  assert.match(fs.readFileSync(path.join(plugin, "readme.txt"), "utf8"), /does not call home/);
});
