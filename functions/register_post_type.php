<?php
add_action('init', function () {
	register_post_type('vacancies', [
		'label' => 'Вакансии',
		'labels' => [
			'name' => 'Вакансии',
			'singular_name' => 'Вакансия',
			'add_new' => 'Добавить вакансию',
			'add_new_item' => 'Добавить новую вакансию',
			'edit_item' => 'Редактировать вакансию',
			'new_item' => 'Новая вакансия',
			'view_item' => 'Посмотреть вакансию',
			'search_items' => 'Найти вакансию',
			'not_found' => 'Вакансии не найдены',
			'not_found_in_trash' => 'В корзине не найдено',
		],
		'public' => true,
		'has_archive' => false,
		'show_in_rest' => true,
		'menu_icon' => 'dashicons-businessman',
		'supports' => ['title', 'editor', 'thumbnail'],
		'rewrite' => ['slug' => 'vacancies'],
	]);
});