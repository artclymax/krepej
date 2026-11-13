<?php
add_action('acf/init', function () {

	if (function_exists('acf_add_options_page')) {
		acf_add_options_page([
			'page_title' => 'Контактные данные',
			'menu_title' => 'Контактные данные',
			'menu_slug' => 'opt-contacts',
			'position' => 20,
		]);
	}

	if (!function_exists('acf_add_local_field_group')) {
		return;
	}

	acf_add_local_field_group([
		'key' => 'group_contacts_page',
		'title' => 'Контактные данные',
		'fields' => [
			[
				'key' => 'field_contacts_tab_phones',
				'label' => 'Телефон',
				'name' => '',
				'type' => 'tab',
				'placement' => 'top',
				'endpoint' => 0,
			],
			[
				'key' => 'field_contacts_phone_title',
				'label' => 'Заголовок телефона',
				'name' => 'contacts_phone_title',
				'type' => 'text'
			],
			[
				'key' => 'field_contacts_phones',
				'label' => 'Телефоны',
				'name' => 'contacts_phones',
				'type' => 'repeater',
				'layout' => 'table',
				'collapsed' => 'field_contact_phone_number',
				'button_label' => 'Добавить телефон',
				'sub_fields' => [
					[
						'key' => 'field_contact_phone_number',
						'label' => 'Номер телефона',
						'name' => 'phone',
						'type' => 'text',
					],
				],
			],
			[
				'key' => 'field_contacts_phone_title_2',
				'label' => 'Заголовок телефона 2',
				'name' => 'contacts_phone_title_2',
				'type' => 'text'
			],
			[
				'key' => 'field_contacts_phones_2',
				'label' => 'Телефоны',
				'name' => 'contacts_phones_2',
				'type' => 'repeater',
				'layout' => 'table',
				'collapsed' => 'field_contact_phone_number',
				'button_label' => 'Добавить телефон',
				'sub_fields' => [
					[
						'key' => 'field_contact_phone_number',
						'label' => 'Номер телефона',
						'name' => 'phone',
						'type' => 'text',
					],
				],
			],

			[
				'key' => 'field_contacts_tab_emails',
				'label' => 'Email',
				'name' => '',
				'type' => 'tab',
				'placement' => 'top',
				'endpoint' => 0,
			],
			[
				'key' => 'field_contacts_emails',
				'label' => 'Email',
				'name' => 'contacts_emails',
				'type' => 'repeater',
				'layout' => 'table',
				'collapsed' => 'field_contact_phone_number',
				'button_label' => 'Добавить email',
				'sub_fields' => [
					[
						'key' => 'field_contact_email',
						'label' => 'Email',
						'name' => 'email',
						'type' => 'text',
					],
				],
			],

			[
				'key' => 'field_contacts_tab_address_time',
				'label' => 'Адрес',
				'name' => '',
				'type' => 'tab',
				'placement' => 'top',
				'endpoint' => 0,
			],
			[
				'key' => 'field_contacts_address',
				'label' => 'Код карты (iframe)',
				'name' => 'contacts_address',
				'type' => 'wysiwyg',
			],
			[
				'key' => 'field_of_tab_map',
				'label' => 'Карта',
				'name' => '',
				'type' => 'tab',
				'placement' => 'top',
				'endpoint' => 0,
			],
			[
				'key' => 'field_contacts_map',
				'label' => 'Код карты (iframe)',
				'name' => 'contacts_map',
				'type' => 'textarea',
				'rows' => 6,
				'new_lines' => '',
				'instructions' => 'Вставьте iframe из виджета Яндекс.Карт или Google Maps.',
			],
		],
		'location' => [
			[
				[
					'param' => 'options_page',
					'operator' => '==',
					'value' => 'opt-contacts',
				],
			]
		],
	]);

});