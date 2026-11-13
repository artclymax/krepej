<?php
/**
 * Компонент карточки товара WooCommerce
 *
 * @var WC_Product $product Передаётся через get_template_part()
 */

// Получаем товар из аргументов
$product = $args['product'] ?? null;

if (!is_a($product, 'WC_Product')) {
	return;
}

$product_id = $product->get_id();
$product_link = get_permalink($product_id);
$product_name = $product->get_name();

// Изображение товара
$product_image_id = $product->get_image_id();

// Цены
$regular_price = $product->get_regular_price();
$sale_price = $product->get_sale_price();

// Определяем бэйджи
$badges = [];

// NEW — товар опубликован менее 30 дней назад
$post_date = get_post_field('post_date', $product_id);
$days_old = (time() - strtotime($post_date)) / (60 * 60 * 24);
if ($days_old <= 30) {
	$badges[] = ['type' => 'new', 'text' => 'New'];
}

// TOP — featured товар
if ($product->is_featured()) {
	$badges[] = ['type' => 'top', 'text' => 'Top'];
}

// Скидка
$discount_percent = 0;
if ($regular_price && $sale_price && $regular_price > $sale_price) {
	$discount_percent = round((($regular_price - $sale_price) / $regular_price) * 100);
	$badges[] = ['type' => 'sale', 'text' => '-' . $discount_percent . '%'];
}
?>

<div class="product-card">
	<a class="product-card__link" href="<?php echo esc_url($product_link); ?>">
		<!-- Бэйджи -->
		<?php if (!empty($badges)): ?>
			<div class="product-card__badges">
				<?php foreach ($badges as $badge): ?>
					<span class="product-card__badge product-card__badge--<?php echo esc_attr($badge['type']); ?>">
						<?php echo esc_html($badge['text']); ?>
					</span>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<!-- Изображение -->
		<div class="product-card__image image-box">
			<?php if ($product_image_id): ?>
				<?php echo wp_get_attachment_image(
					$product_image_id,
					'woocommerce_thumbnail',
					false,
					array(
						'class' => 'img',
						'alt' => $product_name
					)
				); ?>
			<?php else: ?>
				<!-- Placeholder WooCommerce -->
				<img src="<?php echo esc_url(wc_placeholder_img_src('woocommerce_thumbnail')); ?>"
					alt="<?php echo esc_attr($product_name); ?>" class="img wc-placeholder" loading="lazy">
			<?php endif; ?>
		</div>

		<!-- Контент -->
		<h3 class="product-card__title title-3">
			<?php echo esc_html($product_name); ?>
		</h3>

		<div class="product-card__price">
			<?php if ($regular_price || $sale_price): ?>
				<?php if ($sale_price && $regular_price): ?>
					<span class="product-card__price-old">
						<?php echo wc_price($regular_price); ?>
					</span>
				<?php endif; ?>
				<span class="product-card__price-current">
					<?php echo wc_price($sale_price ?: $regular_price); ?>
				</span>
			<?php else: ?>
				<span class="product-card__price-empty">
					Уточняйте наличие и цену
				</span>
			<?php endif; ?>
		</div>

		<span class="product-card__btn btn">
			В корзину
		</span>
	</a>
</div>