<?php
acf_add_local_field_group([
	'key' => 'group_product_cat_image',
	'title' => 'Категория товара: Изображение',
	'fields' => [
		[
			'key' => 'field_product_cat_image',
			'label' => 'Изображение (фото)',
			'name' => 'product_cat_image',
			'type' => 'image',
		],
	],
	'location' => [
		[
			[
				'param' => 'taxonomy',
				'operator' => '==',
				'value' => 'product_cat'
			]
		]
	],
]);
?>