<?php
$page = $args['page'] ?? get_queried_object();
$class = $args['class'] ?? '';

if (!empty($args['page'])) {
	$page = get_page_by_path($args['page'], OBJECT, 'page');
}

if (is_archive()) {
	$archive_name = '';

	$queried = get_queried_object();
	$archive_name = $queried->has_archive ? $queried->name : $queried->has_archive;


	$archive_page = $archive_name ? get_page_by_path($archive_name, OBJECT, 'page') : null;

	if ($archive_page) {
		$page = $archive_page;
	}
}
if (is_tax()) {
	$term = get_queried_object();
	if (!empty($args['page'])) {
		$term = get_page_by_path($args['page'], OBJECT, 'page');
	}
	$page = get_page_by_path(get_taxonomy($term->taxonomy)->object_type[0], OBJECT, 'page');
	$title = get_field('hero_title', $term) ?? '';

} else {
	$label = get_field('hero_label', $page) ?? '';
	$title = get_field('hero_title', $page) ?? '';
	$descr = get_field('hero_descr', $page) ?? '';
	$image = get_field('hero_image', $page) ?? '';
	$btn = get_field('hero_btn', $page) ?? '';
	$link = get_field('hero_link', $page) ?? '';

}

if (!$title) {
	if (is_tax() || is_category() || is_tag()) {
		$title = single_term_title('', false);
	} elseif (is_post_type_archive()) {
		$title = post_type_archive_title('', false);
	} else {
		$title = get_the_title();
	}
}



if ($title || $descr):
	?>
	<section class="hero-page <?php echo esc_attr($class); ?>" id="hero-page">
		<div class="hero-page__container container">
			<div class="hero-page__breadcrumbs">
				<div class="page-breadcrumbs">
					<?php if (function_exists('bcn_display')) {
						bcn_display();
					} ?>
				</div>
			</div>
			<h1 class="hero-page__title title-2">
				<?php echo esc_html($title) ?>
			</h1>
		</div>
	</section>
<?php endif; ?>