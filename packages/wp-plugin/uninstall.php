<?php

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

delete_option('tcpio_ac_m_settings');
