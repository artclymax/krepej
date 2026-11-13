<?php
/**
 * Хуки для установки плагинов
 *
 * Подключается через functions.php, чтобы хуки admin_post_*
 * работали ДО рендеринга страницы (при обработке admin-post.php)
 */

if (!defined('ABSPATH')) {
	exit;
}

function verda_required_plugins()
{
	return [
		['slug' => 'cyr2lat', 'name' => 'Cyr-To-Lat'],
		['slug' => 'secure-custom-fields', 'name' => 'Secure Custom Fields'],
		['slug' => 'contact-form-7', 'name' => 'Contact Form 7'],
		['slug' => 'breadcrumb-navxt', 'name' => 'Breadcrumb NavXT'],
		['slug' => 'safe-svg', 'name' => 'Safe SVG'],
		['slug' => 'wp-mail-smtp', 'name' => 'WP Mail SMTP'],
		['slug' => 'simple-page-ordering', 'name' => 'Simple Page Ordering'],
	];
}

/**
 * Проверка: установлен ли плагин
 */
function verda_is_plugin_installed($slug)
{
	$installed = get_plugins("/{$slug}");
	return !empty($installed);
}

/**
 * Установка и активация плагина по slug
 */
function verda_install_and_activate_plugin($slug)
{
	if (verda_is_plugin_installed($slug)) {
		return true; // Уже установлен
	}

	require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
	require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
	require_once ABSPATH . 'wp-admin/includes/plugin.php';

	$api = plugins_api('plugin_information', [
		'slug' => $slug,
		'fields' => ['sections' => false],
	]);

	if (is_wp_error($api)) {
		return $api;
	}

	$upgrader = new Plugin_Upgrader(new Automatic_Upgrader_Skin());
	$result = $upgrader->install($api->download_link);

	if (!$result || is_wp_error($result)) {
		return $result;
	}

	// Активация
	$plugin_files = get_plugins("/{$slug}");
	if ($plugin_files) {
		$plugin_file = $slug . '/' . array_key_first($plugin_files);
		activate_plugin($plugin_file);
	}

	return true;
}

// Установка одного плагина
add_action('admin_post_verda_install_single_plugin', function () {
	if (!current_user_can('install_plugins')) {
		wp_die('Недостаточно прав');
	}

	check_admin_referer('verda_install_single_plugin');

	if (!isset($_POST['slug'])) {
		wp_die('Нет плагина');
	}

	$slug = sanitize_text_field($_POST['slug']);
	$result = verda_install_and_activate_plugin($slug);

	$status = is_wp_error($result) ? 'error' : '1';
	wp_safe_redirect(admin_url('admin.php?page=verda-settings&tab=support&installed=' . $status));
	exit;
});

// Установка всех плагинов
add_action('admin_post_verda_install_all_plugins', function () {
	if (!current_user_can('install_plugins')) {
		wp_die('Недостаточно прав');
	}

	check_admin_referer('verda_install_all_plugins');

	$errors = [];
	foreach (verda_required_plugins() as $plugin) {
		$result = verda_install_and_activate_plugin($plugin['slug']);
		if (is_wp_error($result)) {
			$errors[] = $plugin['name'] . ': ' . $result->get_error_message();
		}
	}

	$status = empty($errors) ? '1' : 'error';
	$query_args = ['page' => 'verda-settings', 'tab' => 'support', 'installed' => $status];
	if (!empty($errors)) {
		$query_args['install_errors'] = urlencode(implode('|', $errors));
	}

	wp_safe_redirect(add_query_arg($query_args, admin_url('admin.php')));
	exit;
});
