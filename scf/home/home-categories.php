<?php
acf_add_local_field_group([
	'key' => 'group_home_categories',
	'title' => 'Главная: Категории товаров',
	'fields' => [
		[
			'key' => 'field_home_categories_tab_content',
			'label' => 'Контент',
			'name' => '',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		],
		[
			'key' => 'field_home_categories_title',
			'label' => 'Заголовок',
			'name' => 'home_categories_title',
			'type' => 'text',
		],
		[
			'key' => 'field_home_categories_link',
			'label' => 'Кнопка "Смотреть всё"',
			'name' => 'home_categories_link',
			'type' => 'link',
			'instructions' => 'Обычно ведёт на страницу магазина (/shop/) или архив категорий.',
		],

		[
			'key' => 'field_home_categories_tab_filter',
			'label' => 'Фильтр категорий',
			'name' => '',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		],
		[
			'key' => 'field_home_categories_selected',
			'label' => 'Выбрать категории для вывода',
			'name' => 'home_categories_selected',
			'type' => 'taxonomy',
			'taxonomy' => 'product_cat',
			'field_type' => 'multi_select',
			'return_format' => 'object',
			'multiple' => 1,
			'allow_null' => 1,
			'instructions' => 'Если ничего не выбрано — выводятся все категории первого уровня.',
		],
	],
	'location' => [
		[
			[
				'param' => 'page_template',
				'operator' => '==',
				'value' => 'front-page.php'
			]
		]
	],
]);
?>