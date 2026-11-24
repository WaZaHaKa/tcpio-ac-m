<?php

require dirname(__DIR__) . '/includes/sanitize.php';

$failed = 0;

function check($condition, $message)
{
    global $failed;
    if (!$condition) {
        fwrite(STDERR, "FAIL {$message}\n");
        $failed++;
        return;
    }
    fwrite(STDOUT, "ok {$message}\n");
}

check(tcpio_ac_m_sanitize_locale('HE') === 'he', 'locale folds case');
check(tcpio_ac_m_sanitize_locale('en') === 'en', 'en allowed');
check(tcpio_ac_m_sanitize_locale('ar') === 'ar', 'ar allowed');
check(tcpio_ac_m_sanitize_locale('ru') === 'ru', 'ru allowed');
check(tcpio_ac_m_sanitize_locale('fr') === 'he', 'unknown locale falls back');
check(tcpio_ac_m_sanitize_locale('he<script>') === 'he', 'locale markup falls back');
check(tcpio_ac_m_sanitize_locale('en', array('he')) === 'he', 'locale respects allowlist');

check(tcpio_ac_m_sanitize_statement_url('https://example.com/a') === 'https://example.com/a', 'https url');
check(tcpio_ac_m_sanitize_statement_url('HTTP://example.com/a') === 'http://example.com/a', 'scheme folded');
check(tcpio_ac_m_sanitize_statement_url('/accessibility') === '/accessibility', 'site path');
check(tcpio_ac_m_sanitize_statement_url('statement.html') === 'statement.html', 'relative file');
check(tcpio_ac_m_sanitize_statement_url('') === '', 'empty url');
check(tcpio_ac_m_sanitize_statement_url('javascript:alert(1)') === '', 'javascript rejected');
check(tcpio_ac_m_sanitize_statement_url('data:text/html,hi') === '', 'data rejected');
check(tcpio_ac_m_sanitize_statement_url('https://user:pass@example.com/a') === '', 'userinfo rejected');
check(tcpio_ac_m_sanitize_statement_url('//example.com/a') === '', 'protocol-relative rejected');
check(tcpio_ac_m_sanitize_statement_url('ftp://example.com/a') === '', 'ftp rejected');
check(tcpio_ac_m_sanitize_statement_url("https://example.com/a b") === '', 'space rejected');

$adapter = array(
    'autoAttribute' => 'data-nagishon',
    'localeAttribute' => 'data-locale',
    'statementAttribute' => 'data-statement-url',
    'locales' => array('he', 'en'),
);
$html = tcpio_ac_m_toolbar_attribute_html($adapter, array(
    'locale' => 'en',
    'statement_url' => '/accessibility',
));
check($html === 'data-nagishon data-locale="en" data-statement-url="/accessibility"', 'attribute html');

$bad = $adapter;
$bad['autoAttribute'] = 'onclick';
check(tcpio_ac_m_toolbar_attribute_html($bad, array('locale' => 'he', 'statement_url' => '/a')) === '', 'bad attribute name');

$quoted = tcpio_ac_m_toolbar_attribute_html($adapter, array(
    'locale' => 'he',
    'statement_url' => '/a"onload="alert(1)',
));
check($quoted === 'data-nagishon data-locale="he"', 'quote in url dropped');

exit($failed === 0 ? 0 : 1);
