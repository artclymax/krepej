<?php
acf_add_local_field_group([
	'key' => 'group_home_hero',
	'title' => 'Главная: Первый экран',
	'fields' => [
		[
			'key' => 'field_home_hero_tab_content',
			'label' => 'Контент',
			'name' => '',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		],
		[
			'key' => 'field_home_hero_title',
			'label' => 'Заголовок (H1)',
			'name' => 'home_hero_title',
			'type' => 'text',
		],
		[
			'key' => 'field_home_hero_descr',
			'label' => 'Описание',
			'name' => 'home_hero_descr',
			'type' => 'wysiwyg',
			'tabs' => 'visual',
			'toolbar' => 'basic',
			'media_upload' => 0,
		],
		[
			'key' => 'field_home_hero_btn',
			'label' => 'Кнопка',
			'name' => 'home_hero_btn',
			'type' => 'link',
		],
		[
			'key' => 'field_home_hero_image',
			'label' => 'Изображение',
			'name' => 'home_hero_image',
			'type' => 'image',
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