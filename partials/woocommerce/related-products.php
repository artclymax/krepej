<?php
/**
 * Template: Рекомендуемые товары (кроссейлы / похожие / рандомные)
 */

global $product;

if (!$product)
	return;

$product_id = $product->get_id();

// 1. Пробуем получить кроссейлы (cross-sells)
$cross_sell_ids = $product->get_cross_sell_ids();

// 2. Если нет кроссейлов — получаем похожие товары (related)
if (empty($cross_sell_ids)) {
	$related_args = apply_filters('woocommerce_related_products_args', [
		'posts_per_page' => 4,
		'orderby' => 'rand',
		'post__not_in' => [$product_id],
	]);

	$related_products = wc_get_products($related_args);

	if (!empty($related_products)) {
		$cross_sell_ids = wp_list_pluck($related_products, 'id');
	}
}

// 3. Если всё ещё пусто — берём 4 рандомных товара
if (empty($cross_sell_ids)) {
	$random_args = [
		'limit' => 4,
		'exclude' => [$product_id],
		'orderby' => 'rand',
		'status' => 'publish',
		'catalog_visibility' => 'visible',
	];

	$random_products = wc_get_products($random_args);

	if (!empty($random_products)) {
		$cross_sell_ids = wp_list_pluck($random_products, 'id');
	}
}

// Если вообще ничего не нашли — выходим
if (empty($cross_sell_ids))
	return;

// Получаем объекты товаров
$products = [];
foreach ($cross_sell_ids as $id) {
	$product_obj = wc_get_product($id);
	if ($product_obj && $product_obj->is_visible()) {
		$products[] = $product_obj;
	}
}

if (empty($products))
	return;
?>

<section class="section related-products" id="related-products">
	<div class="container related-products__container section-gap">
		<h2 class="related-products__title title-product-2">
			Рекомендуемые товары
		</h2>

		<div class="related-products__grid grid">
			<?php foreach ($products as $product_item): ?>
				<?php get_template_part('partials/woocommerce/product-card', null, ['product' => $product_item]); ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>