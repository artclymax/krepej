<?php
function custom_product_category()
{
	// Получаем все категории товаров, у которых есть товары
	$terms = get_terms([
		'taxonomy' => 'product_cat',
		'hide_empty' => false,
	]);

	if (empty($terms) || is_wp_error($terms)) {
		return;
	}
	// Определяем текущий объект
	$current_cat = get_queried_object();

	echo '<ul class="product-categories">';
	$all_class = (is_post_type_archive('product') || (is_shop() && !$current_cat)) ? 'active-category' : '';
	echo '<li><a class="' . esc_attr($all_class) . '" href="' . esc_url(get_post_type_archive_link('product')) . '">'
		. esc_html('Все категории')
		. '</a></li>';
	foreach ($terms as $term) {
		$class = ($current_cat && isset($current_cat->term_id) && $current_cat->term_id == $term->term_id) ? 'active-category' : '';
		echo '<li>';
		echo '<a class="' . esc_attr($class) . '" href="' . esc_url(get_term_link($term)) . '">'
			. esc_html($term->name)
			. '</a>';
		echo '</li>';
	}
	echo '</ul>';
}