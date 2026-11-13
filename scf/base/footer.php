<?php
add_action('acf/init', function () {

	if (function_exists('acf_add_options_page')) {
		acf_add_options_page([
			'page_title' => 'Подвал / Футер',
			'menu_title' => 'Подвал / Футер',
			'menu_slug' => 'opt-footer',
			'position' => 22,
		]);
	}

	if (!function_exists('acf_add_local_field_group')) {
		return;
	}

	acf_add_local_field_group([
		'key' => 'group_footer_settings',
		'title' => 'Настройки футера',
		'fields' => [
			[
				'key' => 'field_footer_info_message',
				'label' => 'Инструкция',
				'name' => '',
				'type' => 'message',
				'message' => '<b>Логотип</b> — в <a href="' . esc_url(admin_url('admin.php?page=opt-header')) . '" target="_blank" rel="noopener">Шапке</a>.<br>' .
					'<b>Контакты</b> (телефон, адрес, соцсети) — в <a href="' . esc_url(admin_url('admin.php?page=opt-contacts')) . '" target="_blank" rel="noopener">Контактных данных</a>.<br>' .
					'<b>Меню</b> — в разделе <a href="' . esc_url(admin_url('nav-menus.php')) . '" target="_blank" rel="noopener">Внешний вид → Меню</a> (расположения "footer-nav" и "footer-services").<br>' .
					'Здесь настраиваются только описание под логотипом, ссылки и копирайт.',
				'new_lines' => 'wpautop',
				'esc_html' => 0,
			],
			[
				'key' => 'field_footer_logo',
				'label' => 'Логотип',
				'name' => 'footer_logo',
				'type' => 'image',
			],
			[
				'key' => 'field_footer_descr',
				'label' => 'Описание',
				'name' => 'footer_descr',
				'type' => 'wysiwyg',
			],
			[
				'key' => 'field_footer_links',
				'label' => 'Ссылки',
				'name' => 'footer_links',
				'type' => 'repeater',
				'layout' => 'block',
				'button_label' => 'Добавить ссылку',
				'sub_fields' => [
					[
						'key' => 'field_footer_links_link',
						'label' => 'Ссылка',
						'name' => 'footer_links_link',
						'type' => 'link',
					],
				],
			],
		],
		'location' => [
			[
				[
					'param' => 'options_page',
					'operator' => '==',
					'value' => 'opt-footer',
				],
			],
		],
	]);

});