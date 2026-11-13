<?php
add_action('acf/init', function () {

	if (function_exists('acf_add_options_page')) {
		acf_add_options_page(array(
			'page_title' => 'Страница 404',
			'menu_title' => 'Страница 404',
			'menu_slug' => 'opt-page-404',
			'position' => 24,
		));
	}

	if (!function_exists('acf_add_local_field_group')) {
		return;
	}

	// PAGE 404
	acf_add_local_field_group(array(
		'key' => 'flds_opt_page_404',
		'title' => 'Страница 404',
		'fields' => array(
		
			array(
				'key' => 'field_page_404_title',
				'name' => 'page_404_title',
				'label' => 'Заголовок',
				'type' => 'text',
			),
			array(
				'key' => 'field_page_404_descr',
				'name' => 'page_404_descr',
				'label' => 'Описание',
				'type' => 'wysiwyg',
			),
			array(
				'key' => 'field_page_404_btn',
				'name' => 'page_404_btn',
				'label' => 'Кнопка',
				'type' => 'link',
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'options_page',
					'operator' => '==',
					'value' => 'opt-page-404',
				),
			),
		),
	));

});
?>