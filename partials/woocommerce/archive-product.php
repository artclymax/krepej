<?php
$categories = get_terms([
	'taxonomy' => 'product_cat',
	'parent' => 0,
	'hide_empty' => false,
	'orderby' => 'menu_order',
	'order' => 'ASC',
]);

if (is_wp_error($categories)) {
	$categories = [];
}
$exclude_cats = ['misc'];
?>

<section class="section archive-product" id="archive-product">
	<div class="container archive-product__container">
		<?php if (!empty($categories)): ?>
			<div class="archive-product__grid grid">
				<?php foreach ($categories as $cat):
					if (in_array($cat->slug, $exclude_cats, true))
						continue;

					$cat_id = $cat->term_id;
					$cat_name = $cat->name;
					$cat_link = get_term_link($cat);
					$thumb_id = get_term_meta($cat_id, 'thumbnail_id', true);

					if (is_wp_error($cat_link))
						continue;
					?>
					<a class="archive-product__card product-cat-card" href="<?php echo esc_url($cat_link); ?>">
						<div class="product-cat-card__icon ">
							<div class="product-cat-card__image image-box">
								<?php if ($thumb_id): ?>
									<?php echo wp_get_attachment_image(
										$thumb_id,
										'thumbnail',
										false,
										array(
											'class' => 'img',
											'alt' => $cat_name
										)
									); ?>
								<?php else: ?>
									<!-- Placeholder если нет иконки -->
									<img src="<?php echo esc_url(wc_placeholder_img_src('thumbnail')); ?>"
										alt="<?php echo esc_attr($cat_name); ?>" class="img wc-placeholder">
								<?php endif; ?>
							</div>
						</div>

						<h3 class="product-cat-card__title title-3">
							<?php echo esc_html(mx_fix_orphans($cat_name)); ?>
						</h3>
					</a>
				<?php endforeach; ?>
			</div>
		<?php else: ?>
			<p class="archive-product__empty">Категории товаров не найдены.</p>
		<?php endif; ?>
	</div>
</section>