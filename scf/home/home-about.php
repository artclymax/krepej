<?php
acf_add_local_field_group([
	'key' => 'group_home_about',
	'title' => 'О компании',
	'fields' => [
		[
			'key' => 'field_home_about_tab_content',
			'label' => 'Контент',
			'name' => '',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		],
		[
			'key' => 'field_home_about_title',
			'label' => 'Заголовок',
			'name' => 'home_about_title',
			'type' => 'text',
		],
		[
			'key' => 'field_home_about_descr',
			'label' => 'Описание',
			'name' => 'home_about_descr',
			'type' => 'wysiwyg',
		],
		[
			'key' => 'field_home_about_image',
			'label' => 'Изображение',
			'name' => 'home_about_image',
			'type' => 'image',
		],

		[
			'key' => 'field_home_about_tab_features',
			'label' => 'Преимущества',
			'name' => '',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		],
		[
			'key' => 'field_home_about_features',
			'label' => 'Список преимуществ',
			'name' => 'home_about_features',
			'type' => 'repeater',
			'layout' => 'block',
			'button_label' => 'Добавить преимущество',
			'sub_fields' => [
				[
					'key' => 'field_home_about_features_icon',
					'label' => 'Иконка',
					'name' => 'icon',
					'type' => 'image',
				],
				[
					'key' => 'field_home_about_features_text',
					'label' => 'Текст',
					'name' => 'text',
					'type' => 'text',
				],
			]
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