<?php
$title = get_field('home_categories_title') ?? '';
$link = get_field('home_categories_link') ?? [];
$selected_ids = get_field('home_categories_selected') ?? [];

// Базовые аргументы запроса
$args = [
	'taxonomy' => 'product_cat',
	'parent' => 0,
	'hide_empty' => false,
	'orderby' => 'menu_order',
	'order' => 'ASC',
];

// Если выбраны конкретные категории — фильтруем по ним
if (!empty($selected_ids)) {
	$args['include'] = array_map(function ($cat) {
		return is_object($cat) ? $cat->term_id : $cat;
	}, (array) $selected_ids);
	// Сбрасываем parent => 0, чтобы не конфликтовать с include
	unset($args['parent']);
}

$categories = get_terms($args);

if (is_wp_error($categories)) {
	$categories = [];
}
?>

<?php if ($title || !empty($categories)): ?>
	<section class="section home-categories" id="home-categories">
		<div class="container home-categories__container section-gap">
			<div class="home-categories__header">
				<?php if ($title): ?>
					<h2 class="home-categories__title title-2">
						<?php echo esc_html($title); ?>
					</h2>
				<?php endif; ?>

				<?php if (!empty($link['url'])): ?>
					<a class="home-categories__btn btn hidden-mobile" href="<?php echo esc_url($link['url']); ?>" <?php if (!empty($link['target'])): ?> target="<?php echo esc_attr($link['target']); ?>" <?php endif; ?>>
						<?php echo esc_html($link['title'] ?? 'Смотреть всё'); ?>
					</a>
				<?php endif; ?>
			</div>

			<?php if (!empty($categories)): ?>
				<div class="home-categories__grid grid">
					<?php foreach ($categories as $cat):
						$exclude_cats = ['misc', 'uncategorized', 'sale'];

						if (in_array($cat->slug, $exclude_cats, true)) {
							continue;
						}

						$cat_id = $cat->term_id;
						$cat_name = $cat->name;
						$cat_link = get_term_link($cat);
						$cat_image = get_field('product_cat_image', 'product_cat_' . $cat_id) ?? null;

						if (is_wp_error($cat_link))
							continue;
						?>
						<a class="home-categories__card categories-card" href="<?php echo esc_url($cat_link); ?>">
							<div class="categories-card__image image-box">
								<?php if (!empty($cat_image) && is_array($cat_image) && !empty($cat_image['ID'])): ?>
									<?php echo wp_get_attachment_image(
										$cat_image['ID'],
										'large',
										false,
										array(
											'class' => 'img',
											'alt' => $cat_image['alt'] ?: $cat_name
										)
									); ?>
								<?php endif; ?>

								<span class="categories-card__overlay-text">
									Подробнее
								</span>
							</div>

							<h3 class="categories-card__title title-3">
								<?php echo esc_html($cat_name); ?>
							</h3>
						</a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
			<?php if (!empty($link['url'])): ?>
				<a class="home-categories__btn btn visible-mobile" href="<?php echo esc_url($link['url']); ?>" <?php if (!empty($link['target'])): ?> target="<?php echo esc_attr($link['target']); ?>" <?php endif; ?>>
					<?php echo esc_html($link['title'] ?? 'Смотреть всё'); ?>
				</a>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>