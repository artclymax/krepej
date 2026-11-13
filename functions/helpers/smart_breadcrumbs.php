<?php
/**
 * Вспомогательная функция для получения родительского slug из URL
 */
function mx_get_parent_slug_from_permalink(int $post_id): ?string
{
	$permalink = get_permalink($post_id);
	$home_url = home_url('/');

	if (strpos($permalink, $home_url) !== 0) {
		return null;
	}

	$path = trim(str_replace($home_url, '', $permalink), '/');
	$path_parts = explode('/', $path);

	return $path_parts[0] ?? null;
}

/**
 * Вспомогательная функция для поиска страницы по slug
 */
function mx_get_page_by_slug(string $slug): ?WP_Post
{
	$pages = get_posts([
		'name' => $slug,
		'post_type' => 'page',
		'post_status' => 'publish',
		'numberposts' => 1,
		'fields' => 'all',
	]);

	return !empty($pages) ? $pages[0] : null;
}

/**
 * Вспомогательная функция для получения иерархии таксономии записи
 */
function mx_get_post_term_hierarchy(int $post_id, string $taxonomy): array
{
	$terms = get_the_terms($post_id, $taxonomy);

	if (empty($terms) || is_wp_error($terms)) {
		return [];
	}

	// Берем первую категорию
	$term = $terms[0];
	$hierarchy = [];

	// Получаем всех родителей категории
	$ancestors = get_ancestors($term->term_id, $taxonomy);
	$ancestors = array_reverse($ancestors);

	// Добавляем родителей
	foreach ($ancestors as $ancestor_id) {
		$ancestor_term = get_term($ancestor_id, $taxonomy);
		if ($ancestor_term && !is_wp_error($ancestor_term)) {
			$hierarchy[] = [
				'title' => $ancestor_term->name,
				'url' => get_term_link($ancestor_term, $taxonomy),
				'is_current' => false,
			];
		}
	}

	// Добавляем саму категорию
	$hierarchy[] = [
		'title' => $term->name,
		'url' => get_term_link($term, $taxonomy),
		'is_current' => false,
	];

	return $hierarchy;
}

/**
 * Умные динамические хлебные крошки с микроразметкой Schema.org
 */
if (!function_exists('mx_breadcrumbs')) {
	function mx_breadcrumbs(array $args = []): void
	{
		$defaults = [
			'separator' => '', // &gt; 
			'home_text' => 'Главная',
			'show_category' => false,
			'wrap_before' => '<nav class="smart-breadcrumbs" aria-label="Breadcrumb"><ol itemscope itemtype="https://schema.org/BreadcrumbList">',
			'wrap_after' => '</ol></nav>',
			'list_item_before' => '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">',
			'list_item_after' => '</li>',
		];

		$args = wp_parse_args($args, $defaults);
		global $post;

		$breadcrumbs = [];

		// 1. Всегда добавляем "Главную"
		$breadcrumbs[] = [
			'title' => $args['home_text'],
			'url' => home_url('/'),
			'is_current' => is_front_page(),
		];

		// 2. Динамическая логика для разных типов страниц
		if (is_single()) {
			$post_type = get_post_type($post);
			$post_type_object = get_post_type_object($post_type);

			// ВАРИАНТ А: Произвольный тип записи (CPT)
			if ($post_type !== 'post' && $post_type !== 'page' && $post_type_object) {

				// Логика промежуточного звена: архив или страница-костыль
				$show_intermediate = ($args['show_archive'] !== false);

				if ($show_intermediate) {
					// Если разрешено показывать промежуточное звено
					if ($post_type_object->has_archive) {
						// Приоритет: нативный архив CPT
						$breadcrumbs[] = [
							'title' => $post_type_object->labels->name,
							'url' => get_post_type_archive_link($post_type),
							'is_current' => false,
						];
					} else {
						// Фолбэк: ищем страницу-костыль по slug
						$parent_slug = mx_get_parent_slug_from_permalink($post->ID);
						if ($parent_slug) {
							$parent_page = mx_get_page_by_slug($parent_slug);
							if ($parent_page) {
								$breadcrumbs[] = [
									'title' => get_the_title($parent_page),
									'url' => get_permalink($parent_page),
									'is_current' => false,
								];
							} else {
								// Последний фолбэк: ссылка на slug главной
								$breadcrumbs[] = [
									'title' => $post_type_object->labels->name,
									'url' => home_url($parent_slug),
									'is_current' => false,
								];
							}
						}
					}
				}
				// Если $show_intermediate === false — просто не добавляем ничего,
				// и хлебные крошки сразу перейдут к текущей записи

				// === КАТЕГОРИИ ДЛЯ CPT (если включено) ===
				// Показываем таксономии только если не скрыто промежуточное звено
				// (опционально: можно вынести в отдельный аргумент $show_category_in_cpt)
				if ($args['show_category'] && $show_intermediate) {
					$taxonomies = get_object_taxonomies($post_type, 'names');
					foreach ($taxonomies as $taxonomy) {
						if (in_array($taxonomy, ['post_format', 'post_tag'])) {
							continue;
						}
						$term_hierarchy = mx_get_post_term_hierarchy($post->ID, $taxonomy);
						if (!empty($term_hierarchy)) {
							foreach ($term_hierarchy as $term_crumb) {
								$breadcrumbs[] = $term_crumb;
							}
							break;
						}
					}
				}
			}
			// ВАРИАНТ Б: Обычная запись ('post')
			elseif ($post_type === 'post') {
				// Сначала добавляем родительскую страницу (если есть)
				$parent_slug = mx_get_parent_slug_from_permalink($post->ID);

				if ($parent_slug) {
					$parent_page = mx_get_page_by_slug($parent_slug);

					if ($parent_page) {
						$breadcrumbs[] = [
							'title' => get_the_title($parent_page),
							'url' => get_permalink($parent_page),
							'is_current' => false,
						];
					}
				}

				// === ДОБАВЛЯЕМ КАТЕГОРИИ ДЛЯ ОБЫЧНЫХ ЗАПИСЕЙ (если включено) ===
				if ($args['show_category']) {
					$category_hierarchy = mx_get_post_term_hierarchy($post->ID, 'category');

					if (!empty($category_hierarchy)) {
						foreach ($category_hierarchy as $term_crumb) {
							$breadcrumbs[] = $term_crumb;
						}
					}
				}
			}

			// Добавляем текущую запись
			$breadcrumbs[] = [
				'title' => get_the_title($post),
				'url' => '',
				'is_current' => true,
			];

		} elseif (is_page()) {
			// Для обычных страниц добавляем иерархию родителей
			$ancestors = get_post_ancestors($post->ID);
			$ancestors = array_reverse($ancestors);

			foreach ($ancestors as $ancestor_id) {
				$breadcrumbs[] = [
					'title' => get_the_title($ancestor_id),
					'url' => get_permalink($ancestor_id),
					'is_current' => false,
				];
			}

			// Текущая страница
			$breadcrumbs[] = [
				'title' => get_the_title($post),
				'url' => '',
				'is_current' => true,
			];

		} elseif (is_category() || is_tag() || is_tax()) {
			// Для архивов таксономий добавляем иерархию родителей
			$term = get_queried_object();

			if ($term && isset($term->term_id)) {
				$taxonomy = $term->taxonomy;
				$ancestors = get_ancestors($term->term_id, $taxonomy);
				$ancestors = array_reverse($ancestors);

				foreach ($ancestors as $ancestor_id) {
					$ancestor_term = get_term($ancestor_id, $taxonomy);
					if ($ancestor_term && !is_wp_error($ancestor_term)) {
						$breadcrumbs[] = [
							'title' => $ancestor_term->name,
							'url' => get_term_link($ancestor_term, $taxonomy),
							'is_current' => false,
						];
					}
				}
			}

			// Текущая категория/таксономия
			$breadcrumbs[] = [
				'title' => single_term_title('', false),
				'url' => '',
				'is_current' => true,
			];

		} elseif (is_search()) {
			$breadcrumbs[] = [
				'title' => 'Поиск: ' . get_search_query(),
				'url' => '',
				'is_current' => true,
			];

		} elseif (is_404()) {
			$breadcrumbs[] = [
				'title' => '404: Страница не найдена',
				'url' => '',
				'is_current' => true,
			];
		}

		// 3. Генерация HTML с микроразметкой Schema.org
		if (empty($breadcrumbs)) {
			return;
		}

		echo $args['wrap_before'];

		$count = count($breadcrumbs);
		foreach ($breadcrumbs as $index => $crumb) {
			echo $args['list_item_before'];
			echo '<meta itemprop="position" content="' . ($index + 1) . '" />';

			if (!empty($crumb['url']) && !$crumb['is_current']) {
				echo '<a itemprop="item" href="' . esc_url($crumb['url']) . '">';
				echo '<span itemprop="name">' . esc_html($crumb['title']) . '</span>';
				echo '</a>';
			} else {
				echo '<span itemprop="name">' . esc_html($crumb['title']) . '</span>';
			}

			if ($index < ($count - 1) && !empty($args['separator'])) {
				echo '<span class="breadcrumb-separator">' . $args['separator'] . '</span>';
			}

			echo $args['list_item_after'];
		}

		echo $args['wrap_after'];
	}
}