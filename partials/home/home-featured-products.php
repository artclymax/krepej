<?php
$title = get_field('home_featured_products_title') ?? '';
$selected_ids = get_field('home_featured_products_selected') ?? [];

// Настройки запроса
$args = [
	'post_type' => 'product',
	'posts_per_page' => 6,
	'post_status' => 'publish',
	'orderby' => 'date',
	'order' => 'DESC',
];

// Если выбраны конкретные товары
if (!empty($selected_ids)) {
	$args['post__in'] = (array) $selected_ids;
	$args['orderby'] = 'post__in';
	$args['posts_per_page'] = count((array) $selected_ids);
} else {
	// По умолчанию — только featured (избранные) товары
	$args['featured'] = true;
}

$products_query = new WC_Product_Query($args);
$products = $products_query->get_products();
?>

<?php if (!empty($products)): ?>
	<section class="section home-featured-products" id="home-featured-products">
		<div class="container home-featured-products__container section-gap">
			<?php if ($title): ?>
				<h2 class="home-featured-products__title title-2">
					<?php echo esc_html($title); ?>
				</h2>
			<?php endif; ?>

			<?php if (!empty($products)): ?>
				<div class="home-featured-products__grid grid">
					<?php foreach ($products as $product): ?>
						<?php get_template_part('partials/woocommerce/product-card', null, ['product' => $product]); ?>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>