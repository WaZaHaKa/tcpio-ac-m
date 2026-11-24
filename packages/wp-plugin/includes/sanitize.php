<?php
/**
 * Pure helpers. No remote calls.
 */

if (!function_exists('tcpio_ac_m_default_locales')) {
    function tcpio_ac_m_default_locales()
    {
        return array('he', 'en', 'ar', 'ru');
    }
}

if (!function_exists('tcpio_ac_m_sanitize_locale')) {
    function tcpio_ac_m_sanitize_locale($value, $allowed = null)
    {
        if (!is_array($allowed) || $allowed === array()) {
            $allowed = tcpio_ac_m_default_locales();
        }
        $clean = array();
        foreach ($allowed as $item) {
            if (is_string($item) && preg_match('/^[a-z]{2}$/', $item)) {
                $clean[] = $item;
            }
        }
        if ($clean === array()) {
            $clean = tcpio_ac_m_default_locales();
        }
        $locale = is_string($value) ? strtolower(trim($value)) : '';
        return in_array($locale, $clean, true) ? $locale : $clean[0];
    }
}

if (!function_exists('tcpio_ac_m_sanitize_statement_url')) {
    function tcpio_ac_m_sanitize_statement_url($value)
    {
        if (!is_string($value)) {
            return '';
        }
        $value = trim($value);
        if ($value === '' || preg_match('/[\s\x00-\x1F]/', $value)) {
            return '';
        }
        if (preg_match('/^([a-z][a-z0-9+.-]*):/i', $value, $match)) {
            $scheme = strtolower($match[1]);
            if ($scheme !== 'https' && $scheme !== 'http') {
                return '';
            }
            $rest = substr($value, strlen($match[0]));
            if (!str_starts_with($rest, '//')) {
                return '';
            }
            $authority = substr($rest, 2);
            $host = explode('/', $authority, 2)[0];
            if ($host === '' || str_contains($host, '@')) {
                return '';
            }
            return $scheme . ':' . $rest;
        }
        if (str_starts_with($value, '//') || str_starts_with($value, '\\')) {
            return '';
        }
        if (!preg_match('#^[A-Za-z0-9_./?&=%+\-]+$#', $value)) {
            return '';
        }
        return $value;
    }
}

if (!function_exists('tcpio_ac_m_attribute_name_ok')) {
    function tcpio_ac_m_attribute_name_ok($name)
    {
        return is_string($name) && preg_match('/^data-[a-z][a-z0-9-]*$/', $name) === 1;
    }
}

if (!function_exists('tcpio_ac_m_esc')) {
    function tcpio_ac_m_esc($value)
    {
        return htmlspecialchars((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
}

if (!function_exists('tcpio_ac_m_toolbar_attribute_html')) {
    /**
     * @param array<string, mixed> $adapter
     * @param array<string, string> $settings
     */
    function tcpio_ac_m_toolbar_attribute_html($adapter, $settings)
    {
        $auto = $adapter['autoAttribute'] ?? '';
        $locale_attr = $adapter['localeAttribute'] ?? '';
        $url_attr = $adapter['statementAttribute'] ?? '';
        if (
            !tcpio_ac_m_attribute_name_ok($auto)
            || !tcpio_ac_m_attribute_name_ok($locale_attr)
            || !tcpio_ac_m_attribute_name_ok($url_attr)
        ) {
            return '';
        }
        $locales = isset($adapter['locales']) && is_array($adapter['locales']) ? $adapter['locales'] : null;
        $locale = tcpio_ac_m_sanitize_locale($settings['locale'] ?? '', $locales);
        $url = tcpio_ac_m_sanitize_statement_url($settings['statement_url'] ?? '');
        $html = $auto . ' ' . $locale_attr . '="' . tcpio_ac_m_esc($locale) . '"';
        if ($url !== '') {
            $html .= ' ' . $url_attr . '="' . tcpio_ac_m_esc($url) . '"';
        }
        return $html;
    }
}
