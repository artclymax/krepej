<?php
add_action('acf/init', function () {

	if (function_exists('acf_add_options_page')) {
		acf_add_options_page(array(
			'page_title' => 'Настройка темы',
			'menu_title' => 'Настройка темы',
			'menu_slug' => 'opt-page',
			'position' => 10,
		));
	}
	acf_add_local_field_group(array(
		'key' => 'flds_opt_page_general',
		'title' => 'Общие настройки',
		'fields' => array(
			array(
				'key' => 'field_general_opt_bg_image',
				'name' => 'general_opt_bg_image',
				'label' => 'Основной фон',
				'type' => 'image',
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'options_page',
					'operator' => '==',
					'value' => 'opt-page',
				),
			),
		),
	));
});

if (function_exists('acf_add_local_field_group')) {
	acf_add_local_field_group(array(
		'title' => __('Доставка и Оплата'),
		'fields' => array(
			array(
				'key' => 'field_pc_delivery_methods',
				'name' => 'pc_delivery_methods',
				'label' => __('Способы доставки'),
				'type' => 'repeater',
				'button_label' => __('Добавить способ'),
				'sub_fields' => array(
					array('key' => 'field_pc_dm_title', 'name' => 'title', 'label' => __('Название'), 'type' => 'text'),
					array('key' => 'field_pc_dm_link', 'name' => 'link', 'label' => __('Ссылка URL (необязательно)'), 'type' => 'link'),
				),
			),
			array(
				'key' => 'field_pc_payment_methods',
				'name' => 'pc_payment_methods',
				'label' => __('Способы оплаты'),
				'type' => 'repeater',
				'button_label' => __('Добавить способ'),
				'sub_fields' => array(
					array('key' => 'field_pc_pm_title', 'name' => 'title', 'label' => __('Название'), 'type' => 'text'),
				),
			),
		),
		'location' => array(array(array('param' => 'options_page', 'operator' => '==', 'value' => 'opt-page'))),
		'menu_order' => 4
	));
}
?>