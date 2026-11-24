<?php
/**
 * Plugin Name: tcpio-ac-m
 * Description: Self-hosted accessibility toolbar. The toolbar does not make a site accessible and is not a conformance claim.
 * Version: 0.1.0
 * Requires at least: 6.3
 * Requires PHP: 8.0
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: tcpio-ac-m
 *
 * MIT is compatible with the GNU GPL. The vendored toolbar keeps its own MIT notice in assets/LICENSE.nagishon.
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/includes/sanitize.php';

const TCPIO_AC_M_OPTION = 'tcpio_ac_m_settings';

function tcpio_ac_m_defaults()
{
    return array(
        'locale' => 'he',
        'statement_url' => '',
    );
}

function tcpio_ac_m_adapter()
{
    $path = __DIR__ . '/assets/adapter.json';
    if (!is_readable($path)) {
        return null;
    }
    $data = json_decode((string) file_get_contents($path), true);
    if (!is_array($data)) {
        return null;
    }
    $html = tcpio_ac_m_toolbar_attribute_html($data, tcpio_ac_m_defaults());
    if ($html === '') {
        return null;
    }
    return $data;
}

function tcpio_ac_m_settings()
{
    $stored = get_option(TCPIO_AC_M_OPTION, array());
    if (!is_array($stored)) {
        $stored = array();
    }
    $adapter = tcpio_ac_m_adapter();
    $locales = is_array($adapter) && isset($adapter['locales']) ? $adapter['locales'] : null;
    return array(
        'locale' => tcpio_ac_m_sanitize_locale($stored['locale'] ?? '', $locales),
        'statement_url' => tcpio_ac_m_sanitize_statement_url($stored['statement_url'] ?? ''),
    );
}

function tcpio_ac_m_sanitize_settings($input)
{
    if (!current_user_can('manage_options')) {
        return tcpio_ac_m_settings();
    }
    if (!is_array($input)) {
        $input = array();
    }
    $adapter = tcpio_ac_m_adapter();
    $locales = is_array($adapter) && isset($adapter['locales']) ? $adapter['locales'] : null;
    return array(
        'locale' => tcpio_ac_m_sanitize_locale($input['locale'] ?? '', $locales),
        'statement_url' => tcpio_ac_m_sanitize_statement_url($input['statement_url'] ?? ''),
    );
}

function tcpio_ac_m_asset_version($relative)
{
    $path = __DIR__ . '/assets/' . $relative;
    if (!is_readable($path)) {
        return '0';
    }
    return substr(hash_file('sha256', $path), 0, 12);
}

function tcpio_ac_m_enqueue()
{
    $adapter = tcpio_ac_m_adapter();
    if (!is_array($adapter)) {
        return;
    }
    $settings = tcpio_ac_m_settings();
    $prepaint = isset($adapter['prepaint']) && is_string($adapter['prepaint']) ? $adapter['prepaint'] : '';
    $toolbar = isset($adapter['toolbar']) && is_string($adapter['toolbar']) ? $adapter['toolbar'] : '';
    if (!preg_match('/^[a-z0-9.-]+$/', $prepaint) || !preg_match('/^[a-z0-9.-]+$/', $toolbar)) {
        return;
    }
    wp_enqueue_script(
        'tcpio-ac-m-prepaint',
        plugins_url('assets/' . $prepaint, __FILE__),
        array(),
        tcpio_ac_m_asset_version($prepaint),
        false
    );
    wp_enqueue_script(
        'tcpio-ac-m',
        plugins_url('assets/' . $toolbar, __FILE__),
        array(),
        tcpio_ac_m_asset_version($toolbar),
        array(
            'strategy' => 'defer',
            'in_footer' => true,
        )
    );
}

function tcpio_ac_m_script_loader_tag($tag, $handle)
{
    if ($handle === 'tcpio-ac-m-prepaint') {
        return $tag;
    }
    if ($handle !== 'tcpio-ac-m') {
        return $tag;
    }
    if (!str_contains($tag, ' defer')) {
        $tag = preg_replace('/<script\b/', '<script defer', $tag, 1);
    }
    if (str_contains($tag, ' data-nagishon')) {
        return $tag;
    }
    $adapter = tcpio_ac_m_adapter();
    if (!is_array($adapter)) {
        return $tag;
    }
    $extra = tcpio_ac_m_toolbar_attribute_html($adapter, tcpio_ac_m_settings());
    if ($extra === '') {
        return $tag;
    }
    $updated = preg_replace('/<script\b/', '<script ' . $extra, $tag, 1);
    return is_string($updated) ? $updated : $tag;
}

function tcpio_ac_m_render_settings()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $settings = tcpio_ac_m_settings();
    $adapter = tcpio_ac_m_adapter();
    $locales = is_array($adapter) && isset($adapter['locales']) && is_array($adapter['locales'])
        ? $adapter['locales']
        : tcpio_ac_m_default_locales();
    ?>
    <div class="wrap">
        <h1>tcpio-ac-m</h1>
        <p>תפריט הנגישות לבדו אינו הופך אתר לנגיש ואינו מעיד על עמידה בתקן או בתקנות.</p>
        <form action="options.php" method="post">
            <?php settings_fields('tcpio_ac_m'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="tcpio-ac-m-locale">שפת התפריט</label></th>
                    <td>
                        <select id="tcpio-ac-m-locale" name="<?php echo esc_attr(TCPIO_AC_M_OPTION); ?>[locale]">
                            <?php foreach ($locales as $locale) : ?>
                                <?php if (!is_string($locale)) { continue; } ?>
                                <option value="<?php echo esc_attr($locale); ?>" <?php selected($settings['locale'], $locale); ?>>
                                    <?php echo esc_html($locale); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="tcpio-ac-m-statement">כתובת הצהרת הנגישות</label></th>
                    <td>
                        <input
                            id="tcpio-ac-m-statement"
                            name="<?php echo esc_attr(TCPIO_AC_M_OPTION); ?>[statement_url]"
                            type="text"
                            class="regular-text"
                            value="<?php echo esc_attr($settings['statement_url']); ?>"
                        >
                        <p class="description">נתיב באתר, או כתובת http/https. בלי סקריפט מוטמע.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

add_action('admin_init', function () {
    register_setting('tcpio_ac_m', TCPIO_AC_M_OPTION, array(
        'type' => 'array',
        'sanitize_callback' => 'tcpio_ac_m_sanitize_settings',
        'default' => tcpio_ac_m_defaults(),
    ));
});

add_action('admin_menu', function () {
    add_options_page(
        'tcpio-ac-m',
        'tcpio-ac-m',
        'manage_options',
        'tcpio-ac-m',
        'tcpio_ac_m_render_settings'
    );
});

add_action('wp_enqueue_scripts', 'tcpio_ac_m_enqueue');
add_filter('script_loader_tag', 'tcpio_ac_m_script_loader_tag', 10, 2);
