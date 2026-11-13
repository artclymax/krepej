<?php
while (have_posts()):
	the_post();
	global $product;

	// ===== УПРОЩЕННАЯ ЛОГИКА ИЗОБРАЖЕНИЙ =====
	$main_image_id = $product->get_image_id();
	$gallery_image_ids = $product->get_gallery_image_ids();

	$all_images = [];
	if ($main_image_id) {
		$all_images[] = $main_image_id;
	}
	if (!empty($gallery_image_ids)) {
		$all_images = array_unique(array_merge($all_images, $gallery_image_ids));
	}
	?>

	<div id="product-<?php the_ID(); ?>" <?php wc_product_class('custom-single-product container', $product); ?>>

		<div class="custom-single-product__header">
			<div class="custom-single-product__breadcrumbs">
				<div class="page-breadcrumbs">
					<?php if (function_exists('bcn_display')) {
						bcn_display();
					} ?>
				</div>
			</div>
			<h1 class="custom-single-product__title title-2"><?php the_title(); ?></h1>
		</div>

		<div class="custom-single-product__top product-top-grid">

			<!-- ЛЕВАЯ КОЛОНКА: Галерея или Фото -->
			<div class="product-left-col">
				<?php if (count($all_images) > 1): ?>
					<!-- Слайдер -->
					<div class="swiper product-main-swiper">
						<div class="swiper-wrapper">
							<?php foreach ($all_images as $img_id): ?>
								<a class="swiper-slide" data-fancybox="product-gallery"
									href="<?= esc_url(wp_get_attachment_image_url($img_id, 'full')) ?>">
									<?php echo wp_get_attachment_image($img_id, 'woocommerce_single', false, [
										'class' => 'product-main-image',
										'alt' => $product->get_name()
									]); ?>
								</a>
							<?php endforeach; ?>
						</div>
					</div>

					<div class="swiper product-thumbs-swiper">
						<div class="swiper-wrapper">
							<?php foreach ($all_images as $img_id): ?>
								<div class="swiper-slide">
									<?php echo wp_get_attachment_image($img_id, 'woocommerce_gallery_thumbnail', false, [
										'class' => 'product-thumb-image',
										'alt' => $product->get_name()
									]); ?>
								</div>
							<?php endforeach; ?>
						</div>
					</div>

				<?php elseif (count($all_images) === 1): ?>
					<!-- Одиночное фото -->
					<a class="product-single-image image-box"
						href="<?= esc_url(wp_get_attachment_image_url($all_images[0], 'full')) ?>" data-fancybox="product-gallery">
						<?php echo wp_get_attachment_image($all_images[0], 'woocommerce_single', false, [
							'class' => 'product-main-image',
							'alt' => $product->get_name()
						]); ?>
					</a>

				<?php else: ?>
					<!-- Стандартный placeholder WooCommerce -->
					<div class="product-single-image image-box">
						<?php echo wc_placeholder_img('woocommerce_single'); ?>
					</div>
				<?php endif; ?>
			</div>

			<!-- ПРАВАЯ КОЛОНКА -->
			<div class="product-right-col">

				<?php if (wc_product_sku_enabled() && ($product->get_sku() || $product->is_type('variable'))): ?>
					<div class="product-sku-wrap">
						Арт. <span
							class="sku"><?php echo ($sku = $product->get_sku()) ? esc_html($sku) : esc_html__('N/A', 'woocommerce'); ?></span>
					</div>
				<?php endif; ?>

				<div class="product-short-specs">
					<h2 class="specs-title title-product-2">Коротко о товаре</h2>
					<?php wc_display_product_attributes($product); ?>
				</div>

				<!-- БЛОК ПОКУПКИ -->
				<div class="product-purchase-area">

					<?php if ($product->is_type('simple')): ?>
						<div class="simple-product-price-wrap">
							<?php
							$price_html = $product->get_price_html();
							if (!empty($price_html)) {
								echo '<div class="price">' . $price_html . '</div>';
							} else {
								echo '<div class="price no-price">Уточнить наличие и цену</div>';
							}
							?>
						</div>
					<?php endif; ?>

					<?php woocommerce_template_single_add_to_cart(); ?>

				</div>

			</div>
		</div>

		<div class="product-description-section">
			<h2 class="description-title title-product-2">Описание</h2>
			<div class="description-content">
				<?php
				$content = get_the_content();
				if (!empty(trim($content))) {
					the_content();
				} else {
					the_excerpt();
				}
				?>
			</div>
		</div>

	</div>

<?php endwhile; ?>