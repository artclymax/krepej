<?php 
add_action('after_setup_theme', function () {
	add_theme_support('title-tag'); // чтобы можно было менять тайтлы
	add_theme_support('post-thumbnails'); // чтобы посты поддерживали катринки
	add_theme_support('custom-logo'); // чтобы можно было менять лого

	// тоже некоторые вещи регистрируемые по умолчанию в наше время. Менять незачем.
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);
});