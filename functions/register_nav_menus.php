<?php

add_action('after_setup_theme', function () {
	$theme = wp_get_theme();
	$textdomain = $theme->get('TextDomain') ?: 'sitedomain';

	register_nav_menus(
		array(
			'header-menu' => __('Меню шапки', $textdomain),
			'footer-menu' => __('Меню подвала (и мобильного меню)', $textdomain),
			'catalog-menu' => __('Меню каталога', $textdomain),
		)
	);
});

add_filter('nav_menu_link_attributes', function ($atts, $item) {
	if (empty($atts['href'])) {
		return $atts;
	}

	// Нормализация: убираем трейлинг-слэш для точного сравнения
	$menu_url = untrailingslashit($atts['href']);
	$current_url = untrailingslashit(
		(is_ssl() ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']
	);

	// ---- 0. Якорные ссылки — привязываем к главной ----
	if (!is_front_page() && strpos($menu_url, '#') !== false) {
		if (strpos($menu_url, '#') === 0) {
			$atts['href'] = home_url('/') . $menu_url;
		} else {
			$anchor = substr($menu_url, strpos($menu_url, '#'));
			$atts['href'] = home_url('/') . $anchor;
		}
		$menu_url = untrailingslashit($atts['href']);
	}

	// ---- 1. Точное совпадение полного URL (универсальный случай) ----
	// Работает для: обычных страниц, записей, кастомных постов, таксономий
	if ($menu_url === $current_url) {
		$atts['aria-current'] = 'page';
		return $atts;
	}

	// ---- 2. Спец. обработка для архивов CPT (на случай, если ЧПУ отличаются) ----
	if (is_post_type_archive()) {
		$post_type = get_query_var('post_type');
		if (is_array($post_type)) {
			$post_type = reset($post_type);
		}
		$archive_link = get_post_type_archive_link($post_type);

		if ($archive_link && untrailingslashit($menu_url) === untrailingslashit($archive_link)) {
			$atts['aria-current'] = 'page';
			return $atts;
		}
	}

	return $atts;
}, 10, 2);