# tcpio-ac-m

A small, swappable accessibility module for a small website. v0 is a self-hosted toolbar script plus a thin WordPress plugin, and a generator for a Hebrew accessibility statement.

The toolbar is [nagishon](https://github.com/Roizlotolov/nagishon), MIT, Hebrew and RTL first, no runtime dependencies and no network calls of its own. This repo vendors a build and keeps it behind one adapter so it can be replaced.

## What it is

- A drop-in script visitors can use to change text size, contrast, spacing, and motion.
- A WordPress plugin that enqueues that same file.
- A statement generator that prints only the adjustments, tests, and limitations you put in a config file.

## What it is not

- Not a compliance guarantee. It does not make a site meet Israeli Standard IS 5568, and it does not by itself meet the Equal Rights regulations (including regulation 35ה).
- Not a fix for missing alternative text, unlabeled fields, heading structure, keyboard traps, or contrast in the site itself.
- Not a hosted service. There is no account, no phone-home, and no CDN.
- Not legal advice. The statement wording is a starting point. Have someone qualified review it before you publish it.

The toolbar alone does not make a site accessible.

## Static site

Host the files yourself. Copy `packages/script/dist-vendor/nagishon.iife.js` and, if you want it, `prepaint.js` onto your site. Do not load them from a CDN.

`prepaint.js` is optional. It is synchronous and belongs in `head`, so a returning visitor's saved settings apply before first paint. The toolbar tag is deferred.

```html
<script src="/vendor/prepaint.js"></script>
<script defer src="/vendor/nagishon.iife.js" data-nagishon data-locale="he" data-statement-url="/accessibility"></script>
```

No inline script. This is meant to work with:

```
Content-Security-Policy: default-src 'self'; script-src 'self'
```

The file shipped as `nagishon.iife.js` is the upstream build with `packages/script/csp-adapter.js` prepended. Upstream inserts `<style>` elements, which that policy blocks. The preamble turns those into constructable stylesheets. Browsers need that API (Safari 16.4 or later, current Chrome and Firefox). The unmodified build is in `packages/script/dist-vendor/upstream/`, with the upstream MIT license beside it.

`data-statement-url` should point at your real statement. The demo uses `demo/index.html`.

The large-cursor control uses a `data:` image. Under the policy above, turning that one control on can be blocked. The page still loads, and the other controls do not need it.

## WordPress

Copy `packages/wp-plugin` to `wp-content/plugins/tcpio-ac-m` and activate it. Settings → tcpio-ac-m sets the locale (`he`, `en`, `ar`, `ru`) and the statement URL. Values are sanitized, escaped, and saved only by someone with `manage_options`. The plugin enqueues the local files. It does not call home.

The PHP is MIT, which can be combined with the GPL. The toolbar keeps its own MIT notice in `assets/LICENSE.nagishon`.

## Statement

```bash
node --experimental-strip-types packages/statement/src/cli.ts \
  --config packages/statement/example.config.json \
  --out accessibility.html
```

The config names the controller, a coordinator or contact (`name`, `phone`, `email`), a date, `adjustments`, `limitations`, and `tests`. The page lists those arrays and nothing else. An empty array is printed as "none were supplied", which is not a claim that there are no limits. A field such as `conforms` is rejected. The page always says that the toolbar alone does not make a site accessible, and that the statement does not determine conformance.

`coordinator.appointed` defaults to false. Set it to true only when a coordinator was actually appointed. The example values are placeholders (`{{CONTROLLER_NAME}}`, `{{COORDINATOR_EMAIL}}`, and so on). Replace them before publishing.

## Swap the upstream

`packages/script/adapter.mjs` is the only place that names the package, the built files, and the data attributes.

1. Edit that file.
2. Run `node scripts/fetch-upstream.mjs`.

The script always downloads the current stable npm release. It does not take a pinned version. It checks the registry integrity, requires the registry license and the LICENSE file to be MIT, and stops otherwise. It writes `packages/script/dist-vendor/receipt.json` with the version and integrity, copies the unmodified files under `upstream/`, prepends the CSP adapter, and refreshes the WordPress `assets/` copies.

## Undo

- Static site: remove the script tag, and the prepaint tag if you added it.
- WordPress: deactivate the plugin. Deleting it removes the saved settings.
- Choices a visitor already saved stay in that browser under the upstream storage key until they clear site data.

## Development

Node 22 or newer, and PHP 8 for the plugin checks.

```bash
npm ci
npm test
npm run lint
npm run audit:demo
bash scripts/gitleaks.sh
```

`npm test` checks the statement generator, the vendor receipt, and the plugin sanitizer. `npm run audit:demo` serves `demo/index.html` with the CSP header above and runs axe-core and pa11y. Serious and critical issues fail the run. `scripts/gitleaks.sh` installs the current gitleaks release and scans this branch's history.

Do not publish this package and do not tag a release from this repo as part of v0.

## License

MIT. See [LICENSE](LICENSE).

The vendored toolbar is also MIT. Its notice ships in `packages/script/dist-vendor/LICENSE` and `packages/wp-plugin/assets/LICENSE.nagishon`. Keep it with those files.
