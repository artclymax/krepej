<?php
/**
 * Template: Категория товара WooCommerce
 */

get_header();
get_template_part('partials/components/hero-page');

// Текущая категория
$current_cat = get_queried_object();

if (!is_a($current_cat, 'WP_Term')) {
	get_template_part('404');
	get_footer();
	return;
}

$cat_id = $current_cat->term_id;
$cat_name = $current_cat->name;
$cat_slug = $current_cat->slug;
$cat_link = get_term_link($current_cat);
$cat_desc = term_description($cat_id, 'product_cat');

// 1. Находим ID верхнеуровневого родителя для отображения его дочерних категорий
$display_parent_id = $cat_id;
$ancestors = get_ancestors($cat_id, 'product_cat');

if (!empty($ancestors)) {
	// get_ancestors возвращает массив от ближайшего к самому дальнему. 
	// end() берет самый верхний уровень (top-level parent).
	$display_parent_id = end($ancestors);
}

// 2. Получаем дочерние категории именно этого верхнего родителя
$sub_categories = get_terms([
	'taxonomy' => 'product_cat',
	'parent' => $display_parent_id,
	'hide_empty' => false,
	'orderby' => 'menu_order',
	'order' => 'ASC',
]);

if (is_wp_error($sub_categories)) {
	$sub_categories = [];
}

// Категории для исключения
$exclude_cats = ['misc'];

// Стандартная сортировка WooCommerce
$orderby = isset($_GET['orderby']) ? sanitize_text_field($_GET['orderby']) : apply_filters('woocommerce_default_catalog_orderby', 'menu_order');

$allowed_orderby = ['menu_order', 'popularity', 'price', 'price-desc', 'date', 'rating'];
if (!in_array($orderby, $allowed_orderby, true)) {
	$orderby = 'menu_order';
}

// Параметры сортировки для WP_Query
$order_args = [
	'orderby' => 'menu_order',
	'order' => 'ASC',
];

switch ($orderby) {
	case 'popularity':
		$order_args['meta_key'] = 'total_sales';
		$order_args['orderby'] = 'meta_value_num';
		$order_args['order'] = 'DESC';
		break;
	case 'price':
		$order_args['meta_key'] = '_price';
		$order_args['orderby'] = 'meta_value_num';
		$order_args['order'] = 'ASC';
		break;
	case 'price-desc':
		$order_args['meta_key'] = '_price';
		$order_args['orderby'] = 'meta_value_num';
		$order_args['order'] = 'DESC';
		break;
	case 'date':
		$order_args['orderby'] = 'date';
		$order_args['order'] = 'DESC';
		break;
	case 'rating':
		$order_args['meta_key'] = '_wc_average_rating';
		$order_args['orderby'] = 'meta_value_num';
		$order_args['order'] = 'DESC';
		break;
}

// Пагинация
$paged = max(1, get_query_var('paged'));
$products_per_page = get_option('posts_per_page', 12);

// Запрос товаров через WP_Query (поддерживает пагинацию)
$products_query = new WP_Query(array_merge([
	'post_type' => 'product',
	'posts_per_page' => $products_per_page,
	'paged' => $paged,
	'post_status' => 'publish',
	'tax_query' => [
		[
			'taxonomy' => 'product_cat',
			'field' => 'term_id',
			'terms' => $cat_id,
		]
	],
], $order_args));
?>

<section class="section archive-product-cat" id="archive-product-cat">
	<div class="container archive-product-cat__container">

		<!-- Подкатегории (дочерние категории верхнеуровневого родителя) -->
		<?php if (!empty($sub_categories)): ?>
			<div class="archive-product-cat__subcats">
				<div class="archive-product-cat__subcats-grid grid">
					<?php foreach ($sub_categories as $sub_cat):
						if (in_array($sub_cat->slug, $exclude_cats, true)) {
							continue;
						}

						$sub_cat_id = $sub_cat->term_id;
						$sub_cat_name = $sub_cat->name;
						$sub_cat_link = get_term_link($sub_cat);

						if (is_wp_error($sub_cat_link)) {
							continue;
						}

						// Проверяем, является ли эта подкатегория текущей (для подсветки)
						$is_active = ($sub_cat_id === $cat_id) ? ' is-active' : '';
						?>
						<a class="archive-product-cat__subcat-card product-cat-card<?php echo esc_attr($is_active); ?>"
							href="<?php echo esc_url($sub_cat_link); ?>">
							<h3 class="product-cat-card__title title-3">
								<?php echo esc_html($sub_cat_name); ?>
							</h3>
						</a>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>

		<!-- Сортировка -->
		<?php if ($products_query->have_posts()): ?>
			<div class="archive-product-cat__toolbar">
				<div class="archive-product-cat__sorting">
					<span class="archive-product-cat__sorting-label">Сортировка:</span>

					<?php
					$base_url = remove_query_arg(['orderby', 'paged'], $cat_link);

					$sort_options = [
						'menu_order' => 'По умолчанию',
						'popularity' => 'По популярности',
						'price' => 'По возрастанию цены',
						'price-desc' => 'По убыванию цены',
						'date' => 'По новизне',
					];
					?>

					<!-- Список сортировки (виден на десктопе) -->
					<ul class="archive-product-cat__sorting-list hidden-mobile">
						<?php foreach ($sort_options as $value => $label): ?>
							<?php
							$is_active = ($orderby === $value);
							$sort_url = add_query_arg('orderby', $value, $base_url);
							?>
							<li class="archive-product-cat__sorting-item">
								<a href="<?php echo esc_url($sort_url); ?>"
									class="archive-product-cat__sorting-link <?php echo $is_active ? 'is-active' : ''; ?>"
									data-sort-value="<?php echo esc_attr($value); ?>">
									<?php echo esc_html($label); ?>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>

					<!-- Кастомный селект (виден на мобильном) -->
					<div class="archive-product-cat__sorting-select-wrapper visible-mobile">
						<select class="archive-product-cat__sorting-select" data-sort-select
							data-base-url="<?php echo esc_url($base_url); ?>"
							data-current-value="<?php echo esc_attr($orderby); ?>">
							<?php foreach ($sort_options as $value => $label): ?>
								<option value="<?php echo esc_attr($value); ?>" <?php selected($orderby, $value); ?>>
									<?php echo esc_html($label); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</div>
				</div>
			</div>

			<!-- Сетка товаров -->
			<div class="archive-product-cat__grid grid">
				<?php while ($products_query->have_posts()):
					$products_query->the_post();
					$product = wc_get_product(get_the_ID());
					?>
					<?php if ($product): ?>
						<?php get_template_part('partials/woocommerce/product-card', null, ['product' => $product]); ?>
					<?php endif; ?>
				<?php endwhile;
				wp_reset_postdata(); ?>
			</div>

			<!-- Пагинация -->
			<?php
			$total_pages = $products_query->max_num_pages;
			if ($total_pages > 1):
				$big = 999999999;
				$pagination_args = [
					'base' => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
					'format' => '?paged=%#%',
					'current' => $paged,
					'total' => $total_pages,
					'prev_text' => '<svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.5 16.4617L0.939141 8.75067C0.678963 8.38989 0.688363 7.90063 0.962207 7.55011L6.5 0.461731" stroke-width="1.5" stroke="currentColor" />
</svg>',
					'next_text' => '<svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.608398 0.438721L6.16926 8.14978C6.42944 8.51056 6.42004 8.99982 6.14619 9.35034L0.608398 16.4387" stroke-width="1.5" stroke="currentColor" />
</svg>',
					'type' => 'list',
					'add_args' => ['orderby' => $orderby],
				];
				?>
				<div class="archive-product-cat__pagination page-pagination">
					<?php echo paginate_links($pagination_args); ?>
				</div>
			<?php endif; ?>

		<?php else: ?>
			<div class="archive-product-cat__empty">
				<p>В этой категории пока нет товаров.</p>
			</div>
		<?php endif; ?>

	</div>
</section>

<?php get_footer(); ?>