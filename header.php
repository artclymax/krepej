<!doctype html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php
	wp_body_open();
	$bg = get_field('general_opt_bg_image', 'option') ?? '';
	?>
	<div class="wrapper" style="--bg-url: url('<?= esc_url($bg['url']) ?>');">
		<?php get_template_part('partials/components/header', null, ['class' => $args['class'] ?? '', 'is_dark' => $args['is_dark'] ?? true]); ?>
		<main class="main">