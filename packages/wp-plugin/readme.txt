=== tcpio-ac-m ===
Contributors: tcpio-ac-m
License: MIT
License URI: https://opensource.org/licenses/MIT
Requires at least: 6.3
Requires PHP: 8.0
Stable tag: 0.1.0

Self-hosted accessibility toolbar for a small site. Not a conformance claim.

== Description ==

Enqueues the vendored toolbar from this plugin's assets directory. Settings are the toolbar locale and the accessibility-statement URL. The plugin does not call home.

The toolbar alone does not make a site accessible and does not show that the site meets Israeli Standard IS 5568 or the Equal Rights regulations.

The PHP is MIT, which is compatible with the GNU GPL. The toolbar files keep their own MIT notice in `assets/LICENSE.nagishon`.

== Installation ==

1. Copy this directory to `wp-content/plugins/tcpio-ac-m`.
2. Activate it.
3. Open Settings → tcpio-ac-m and set the statement URL.

== Removal ==

Deactivate the plugin to stop loading the toolbar. Delete it to remove the saved settings. A visitor's saved toolbar choices stay in their browser until they clear site data.

== Changelog ==

= 0.1.0 =
First drop-in.
