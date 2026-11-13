<?php
function mx_category_list($cpt = null)
{
	// 1. Автоопределение CPT из текущего запроса (если передан archive таксономии)
	if (empty($cpt)) {
		$queried = get_queried_object();
		if ($queried instanceof WP_Term && taxonomy_exists($queried->taxonomy)) {
			$tax_obj = get_taxonomy($queried->taxonomy);
			$cpt = !empty($tax_obj->object_type) ? reset($tax_obj->object_type) : null;
		}
	}
	if (empty($cpt))
		return;

	// 2. Поиск таксономии-категории для данного CPT
	$taxonomies = get_object_taxonomies($cpt);
	$taxonomy_slug = '';
	foreach ($taxonomies as $tax) {
		$t_obj = get_taxonomy($tax);
		// Ищем первую публичную иерархическую таксономию (это и есть категории)
		if ($t_obj->hierarchical && $t_obj->public) {
			$taxonomy_slug = $tax;
			break;
		}
	}
	// Фолбэк: если не нашли, пробуем стандартное имя {cpt}_category
	if (empty($taxonomy_slug)) {
		$taxonomy_slug = $cpt . '_category';
		if (!taxonomy_exists($taxonomy_slug))
			return;
	}

	// 3. Получаем термины
	$terms = get_terms([
		'taxonomy' => $taxonomy_slug,
		'hide_empty' => false,
		'orderby' => 'name',
		'order' => 'ASC',
	]);

	if (empty($terms) || is_wp_error($terms))
		return;

	// 4. Определяем текущий контекст
	$current_term = get_queried_object();
	$is_tax = is_tax($taxonomy_slug);
	$archive_link = get_post_type_archive_link($cpt) ?: home_url();

	// 5. Генерация HTML
	echo '<ul class="category">';

	// Ссылка "Все"
	echo '<li class="category__item">';
	echo '<a class="category__link ' . (!$is_tax ? 'active' : '') . '" href="' . esc_url($archive_link) . '">Все</a>';
	echo '</li>';

	// Список категорий
	foreach ($terms as $term) {
		if ($term->slug === 'all')
			continue; // Пропускаем зарезервированный слаг

		$is_active = ($is_tax && isset($current_term->term_id) && $current_term->term_id === $term->term_id);

		echo '<li class="category__item">';
		echo '<a class="category__link ' . ($is_active ? 'active' : '') . '" href="' . esc_url(get_term_link($term)) . '">';
		echo esc_html($term->name);
		echo '</a>';
		echo '</li>';
	}

	echo '</ul>';
}
?>