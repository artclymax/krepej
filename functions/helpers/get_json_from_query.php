<?php
/**
 * Преобразует WP_Query (Custom Post Type) в JSON строку
 *
 * @param WP_Query $query Объект запроса WP_Query
 * @return string JSON строка
 */
function get_json_from_query($query)
{
	$data = [];

	// Проверяем, есть ли записи в запросе
	if (!$query->have_posts()) {
		return wp_json_encode(['status' => 'empty', 'data' => []]);
	}

	while ($query->have_posts()) {
		$query->the_post();
		$post_id = get_the_ID();

		// Получаем URL миниатюры записи (полный размер)
		$thumbnail_url = get_the_post_thumbnail_url($post_id, 'full');

		// Формируем массив данных для текущей записи
		$item = [
			'id' => $post_id,
			'title' => get_the_title(),
			'slug' => get_post_field('post_name', $post_id),
			'content' => apply_filters('the_content', get_the_content()), // Применяем стандартные фильтры (например, для шорткодов)
			'excerpt' => get_the_excerpt(),
			'date' => get_the_date('c', $post_id), // Формат 'c' дает ISO 8601 (удобно для JS/Frontend)
			'permalink' => get_permalink($post_id),
			'thumbnail' => $thumbnail_url ? $thumbnail_url : '',

			// --- ПРИМЕРЫ ДОБАВЛЕНИЯ ВАШИХ МЕТА-ПОЛЕЙ (ACF или стандартных) ---
			// Раскомментируйте и замените 'your_meta_key' на реальные ключи ваших полей
			// 'price'         => get_post_meta( $post_id, 'your_price_key', true ),
			// 'specifications'=> get_post_meta( $post_id, 'your_specs_key', true ),
		];

		$data[] = $item;
	}

	// Обязательно сбрасываем данные поста, чтобы не сломать другие циклы на странице
	wp_reset_postdata();

	// Кодируем в JSON. 
	// JSON_UNESCAPED_UNICODE сохраняет кириллицу в читаемом виде (не \u043f...)
	// JSON_PRETTY_PRINT делает вывод красивым (для продакшена этот флаг можно убрать для экономии трафика)
	return wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
?>