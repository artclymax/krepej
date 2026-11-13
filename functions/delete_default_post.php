<?php
/**
 * 1. Убираем пункт "Записи" из бокового меню админ-панели
 */
add_action('admin_menu', 'remove_default_post_type_menu');
function remove_default_post_type_menu()
{
	remove_menu_page('edit.php');
}

/**
 * 2. Перенаправляем с /wp-admin/edit.php на главную админки 
 * (защита от прямого перехода по ссылке)
 */
add_action('admin_init', 'redirect_default_post_type');
function redirect_default_post_type()
{
	// Проверяем, что это именно страница записей (без параметра post_type, чтобы не сломать другие CPT)
	if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'edit.php') !== false && !isset($_GET['post_type'])) {
		wp_safe_redirect(admin_url());
		exit;
	}
}

/**
 * 3. (Опционально) Убираем виджет "Черновики" и "Быстрый черновик" с консоли (Dashboard)
 */
add_action('wp_dashboard_setup', 'remove_default_dashboard_widgets');
function remove_default_dashboard_widgets()
{
	global $wp_meta_boxes;
	// Удаляем виджет "Черновики"
	unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_drafts']);
	// Удаляем виджет "Активность" (там тоже могут мелькать записи)
	unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_activity']);
}
?>