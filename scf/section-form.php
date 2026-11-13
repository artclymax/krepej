<?php
acf_add_local_field_group([
	'key' => 'group_section_form',
	'title' => 'Секция: Форма обратной связи',
	'fields' => [
		[
			'key' => 'field_section_form_title',
			'label' => 'Заголовок',
			'name' => 'section_form_title',
			'type' => 'text',
		],
		[
			'key' => 'field_section_form_descr',
			'label' => 'Описание',
			'name' => 'section_form_descr',
			'type' => 'wysiwyg',
		],
		[
			'key' => 'field_section_form_image',
			'label' => 'Изображение',
			'name' => 'section_form_image',
			'type' => 'image',
		],
		[
			'key' => 'field_section_form_shortcode',
			'label' => 'Шорткод формы Contact Form 7',
			'name' => 'section_form_shortcode',
			'type' => 'text',
			'instructions' => 'Вставьте шорткод формы'
		],
	],
	'location' => [
		[
			[
				'param' => 'options_page',
				'operator' => '==',
				'value' => 'opt-page',
			]
		]
	],
]);
?>