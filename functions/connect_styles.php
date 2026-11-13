<?php
add_action('wp_enqueue_scripts', function () {

	$theme = wp_get_theme();
	$handle = $theme->get_stylesheet();

	wp_enqueue_style(
		$handle . '-global',
		get_stylesheet_uri(),
		[],
		theme_asset_version('/style.css')
	);

	wp_enqueue_style(
		$handle . '-fonts',
		get_template_directory_uri() . '/assets/fonts.css',
		[],
		theme_asset_version('/assets/fonts.css')
	);

	wp_enqueue_style(
		$handle . '-byn-fonts',
		get_template_directory_uri() . '/assets/byn.css',
		[],
		theme_asset_version('/assets/byn.css')
	);

	wp_enqueue_style(
		$handle . '-main',
		get_template_directory_uri() . '/assets/style.css',
		[],
		theme_asset_version('/assets/style.css')
	);

});