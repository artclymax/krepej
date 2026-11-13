<?php
if (function_exists('acf_add_local_field_group')) {
	acf_add_local_field_group([
		'key' => 'group_hero_page',
		'title' => 'Первый экран',
		'fields' => [
			[
				'key' => 'field_hero_page_tab_content',
				'label' => 'Контент',
				'name' => 'hero_tab_content',
				'type' => 'tab',
			],
			[
				'key' => 'field_hero_page_label',
				'label' => 'Надзаголовок',
				'name' => 'hero_label',
				'type' => 'text',
			],
			[
				'key' => 'field_hero_page_title',
				'label' => 'Заголовок',
				'name' => 'hero_title',
				'type' => 'text',
			],
			[
				'key' => 'field_hero_page_descr',
				'label' => 'Описание',
				'name' => 'hero_descr',
				'type' => 'wysiwyg',
			],
			[
				'key' => 'field_hero_page_btn',
				'label' => 'Акцентная кнопка',
				'name' => 'hero_btn',
				'type' => 'link',
			],
			[
				'key' => 'field_hero_page_link',
				'label' => 'Ссылка',
				'name' => 'hero_link',
				'type' => 'link',
			],
			[
				'key' => 'field_hero_page_tab_image',
				'label' => 'Медиа',
				'name' => 'hero_tab_image',
				'type' => 'tab',
			],
			[
				'key' => 'field_hero_image',
				'label' => 'Изображение',
				'name' => 'hero_image',
				'type' => 'image',
			],
		],
		'location' => [
			[
				[
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'page',
				],
				[
					'param' => 'post_template',
					'operator' => '!=',
					'value' => 'front-page.php',
				],
				[
					'param' => 'post_template',
					'operator' => '!=',
					'value' => 'archive-services.php',
				],
				[
					'param' => 'post_template',
					'operator' => '!=',
					'value' => 'template-policy.php',
				],

				//[
				//	'param' => 'post_template',
				//	'operator' => '=',
				//	'value' => 'archive-project.php',
				//],
			],
		],
	]);
	acf_add_local_field_group([
		'key' => 'group_hero_page_policy',
		'title' => 'Первый экран',
		'fields' => [
			[
				'key' => 'field_hero_page_label',
				'label' => 'Надзаголовок',
				'name' => 'hero_label',
				'type' => 'text',
			],
			[
				'key' => 'field_hero_page_title',
				'label' => 'Заголовок',
				'name' => 'hero_title',
				'type' => 'text',
			],
			[
				'key' => 'field_hero_page_version',
				'label' => 'Версия политики',
				'name' => 'hero_version',
				'type' => 'text',
			],
		],
		'location' => [
			[
				[
					'param' => 'post_template',
					'operator' => '=',
					'value' => 'template-policy.php',
				],
			],
		],
	]);

	acf_add_local_field_group([
		'key' => 'group_archive_services',
		'title' => 'Первый экран (Услуги)',
		'fields' => [
			[
				'key' => 'field_archive_services_tab_content',
				'label' => 'Контент',
				'name' => '',
				'type' => 'tab',
				'placement' => 'top',
				'endpoint' => 0,
			],
			[
				'key' => 'field_archive_services_label',
				'label' => 'Верхняя надпись',
				'name' => 'hero_page_label',
				'type' => 'text',
			],
			[
				'key' => 'field_archive_services_title',
				'label' => 'Заголовок',
				'name' => 'hero_page_title',
				'type' => 'text'
			],
			[
				'key' => 'field_archive_services_descr',
				'label' => 'Описание',
				'name' => 'hero_page_descr',
				'type' => 'wysiwyg',
			],

			[
				'key' => 'field_archive_services_tab_filter',
				'label' => 'Фильтр категорий',
				'name' => '',
				'type' => 'tab',
				'placement' => 'top',
				'endpoint' => 0,
			],
			[
				'key' => 'field_archive_services_selected_cats',
				'label' => 'Выбрать категории для вывода',
				'name' => 'hero_page_selected_cats',
				'type' => 'taxonomy',
				'taxonomy' => 'services_cat',
				'field_type' => 'multi_select',
				'return_format' => 'object',
				'multiple' => 1,
				'allow_null' => 1,
				'instructions' => 'Если ничего не выбрано — выводятся все категории.',
			],
		],
		'location' => [
			[
				[
					'param' => 'page_template',
					'operator' => '==',
					'value' => 'archive-services.php',
				]
			]
		],
	]);
}
?>