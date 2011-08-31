<?php
/*
Plugin Name: Weasel's HTML Bios
Plugin URI: http://www.thedailyblitz.org/weasels-html-bios
Description: Disables the HTML-tag-stripping of author bios.
Author: Andy Moore
Version: 1.0
Author URI: http://www.thedailyblitz.org
*/

// ##### ---------- NOTHING USER-CONFIGURABLE AFTER HERE ------------
remove_filter('pre_user_description', 'wp_filter_kses');
?>