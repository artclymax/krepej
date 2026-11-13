<?php

add_filter('bcn_breadcrumb_title', function ($title, $type, $id) {

	$front_page_id = get_option('page_on_front');

	// Если это крошка главной
	//if (in_array('home', $type) || $front_page_id) {
	//	return get_the_title($front_page_id);
	//}
	if (in_array('home', $type)) {
		return 'Главная';
	}
	if (in_array('shop', $type) || $title === 'Товары' || $title === 'Shop') {
		return 'Каталог';
	}
	return $title;

}, 10, 3);

// Убираем разделитель
add_filter('bcn_display_separator', '__return_empty_string');

?>