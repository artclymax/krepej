<?php
acf_add_local_field_group([
	'key' => 'group_home_featured_products',
	'title' => 'Главная: Популярные товары',
	'fields' => [
		[
			'key' => 'field_home_featured_products_title',
			'label' => 'Заголовок',
			'name' => 'home_featured_products_title',
			'type' => 'text',
		],
		[
			'key' => 'field_home_featured_products_selected',
			'label' => 'Выбрать товары для вывода',
			'name' => 'home_featured_products_selected',
			'type' => 'post_object',
			'post_type' => ['product'],
			'return_format' => 'id',
			'multiple' => 1,
			'allow_null' => 1,
			'instructions' => 'Если ничего не выбрано — выводятся 6 последних товаров.',
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