<?php
/**
 * Секция: ACF/SCF поля
 * 
 * Автоматическое обнаружение всех options pages
 * Группировка по иерархии (parent -> children)
 * Кеширование через transients API
 */

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Получить все options pages с кешированием
 */
function verda_get_cached_options_pages()
{
	$cache = get_transient('verda_admin_acf_pages');

	if ($cache === false) {
		if (!function_exists('acf_get_options_pages')) {
			return [];
		}

		$pages_raw = acf_get_options_pages();
		
		$cache = [];
		foreach ($pages_raw as $key => $page) {
			$slug = $page['menu_slug'] ?? $page['slug'] ?? $key;
			$cache[$slug] = $page;
		}
		
		$timeout = verda_get_config('settings.cache_timeout', 3600);
		set_transient('verda_admin_acf_pages', $cache, $timeout);
	}

	return $cache;
}

/**
 * Получить карту привязок: какие страницы содержат какие field groups
 */
function verda_get_page_field_groups_map() {
	static $map = null;
	
	if ($map === null) {
		$map = [];
		
		if (!function_exists('acf_get_field_groups')) {
			return $map;
		}
		
		$field_groups = acf_get_field_groups();
		
		foreach ($field_groups as $group) {
			if (!isset($group['location']) || !is_array($group['location'])) {
				continue;
			}
			
			// Собираем все options_page привязки для этой группы
			$attached_pages = [];
			foreach ($group['location'] as $rule_group) {
				foreach ($rule_group as $rule) {
					if (($rule['param'] ?? '') === 'options_page' && ($rule['operator'] ?? '') === '==') {
						$attached_pages[] = $rule['value'];
					}
				}
			}
			
			// Добавляем группу ко всем привязанным страницам
			foreach ($attached_pages as $page_slug) {
				if (!isset($map[$page_slug])) {
					$map[$page_slug] = [];
				}
				$map[$page_slug][] = [
					'key' => $group['key'],
					'title' => $group['title'],
				];
			}
		}
	}
	
	return $map;
}

/**
 * Сгруппировать options pages по категориям
 * 
 * - Страницы без дочерних → категория «📋 Другие секции»
 * - Страницы с дочерними → отдельная категория с названием родителя
 * - Учитываются привязки через location rules (множественные родители)
 */
function verda_group_options_pages_by_category($pages)
{
	$categories = [];
	$children_map = [];
	$all_slugs = array_keys($pages);
	$fg_map = verda_get_page_field_groups_map();
	
	// Собираем дочерние элементы через parent_slug (официальная иерархия ACF)
	foreach ($pages as $slug => $page) {
		$parent = $page['parent_slug'] ?? $page['menu_parent'] ?? $page['parent'] ?? null;
		
		if ($parent && in_array($parent, $all_slugs, true)) {
			if (!isset($children_map[$parent])) {
				$children_map[$parent] = [];
			}
			$children_map[$parent][] = ['slug' => $slug, 'page' => $page];
		}
	}
	
	// Дополнительно: если field group привязана к нескольким pages,
	// и одна из них — child другой, добавляем child ко всем родителям
	foreach ($pages as $slug => $page) {
		$parent = $page['parent_slug'] ?? $page['menu_parent'] ?? $page['parent'] ?? null;
		
		// Если у страницы есть официальный родитель — пропускаем (уже добавлен выше)
		if ($parent && in_array($parent, $all_slugs, true)) {
			continue;
		}
		
		// Проверяем, привязаны ли к этой странице field groups, которые также привязаны к child-страницам
		$page_groups = $fg_map[$slug] ?? [];
		if (empty($page_groups)) {
			continue;
		}
		
		// Ищем child-страницы, у которых есть общие field groups с текущей страницей
		foreach ($pages as $other_slug => $other_page) {
			$other_parent = $other_page['parent_slug'] ?? $other_page['menu_parent'] ?? $other_page['parent'] ?? null;
			
			// Пропускаем если это не child
			if (!$other_parent || !in_array($other_parent, $all_slugs, true)) {
				continue;
			}
			
			$other_groups = $fg_map[$other_slug] ?? [];
			
			// Проверяем пересечение field groups
			$common_groups = array_uintersect(
				$page_groups,
				$other_groups,
				function($a, $b) { return strcmp($a['key'], $b['key']); }
			);
			
			if (!empty($common_groups)) {
				// Эта child-страница используется и на текущей странице тоже
				if (!isset($children_map[$slug])) {
					$children_map[$slug] = [];
				}
				
				// Добавляем если ещё нет
				$exists = false;
				foreach ($children_map[$slug] as $existing) {
					if ($existing['slug'] === $other_slug) {
						$exists = true;
						break;
					}
				}
				if (!$exists) {
					$children_map[$slug][] = ['slug' => $other_slug, 'page' => $other_page];
				}
			}
		}
	}
	
	// Распределяем по категориям
	foreach ($pages as $slug => $page) {
		$parent = $page['parent_slug'] ?? $page['menu_parent'] ?? $page['parent'] ?? null;
		
		// Если это корневой элемент
		if (!$parent || !in_array($parent, $all_slugs, true)) {
			$children = $children_map[$slug] ?? [];
			
			if (!empty($children)) {
				$page_title = $page['page_title'] ?? $page['menu_title'] ?? $slug;
				$categories[$slug] = [
					'label' => '📂 ' . $page_title,
					'parent' => ['slug' => $slug, 'page' => $page],
					'children' => $children,
				];
			} else {
				if (!isset($categories['_other'])) {
					$categories['_other'] = [
						'label' => '📋 Основные секции',
						'parents' => [],
					];
				}
				$categories['_other']['parents'][] = ['slug' => $slug, 'page' => $page];
			}
		}
	}
	
	// Сортируем
	$categories_copy = $categories;
	uksort($categories, function($a, $b) use ($categories_copy) {
		if ($a === '_other') return 1;
		if ($b === '_other') return -1;
		return $categories_copy[$a]['label'] <=> $categories_copy[$b]['label'];
	});

	return $categories;
}

/**
 * Очистить кеш при сохранении опций ACF
 */
add_action('acf/save_post', function () {
	delete_transient('verda_admin_acf_pages');
}, 1);

function render_section_acf_fields()
{
	// Очищаем кеш при каждом заходе (для корректного отображения иерархии)
	delete_transient('verda_admin_acf_pages');
	
	$pages = verda_get_cached_options_pages();

	if (empty($pages)) {
		?>
		<div class="verda-card">
			<h2 class="verda-card-title">Редактирование контента</h2>
			<p class="verda-card-description">Options pages не найдены. Убедитесь, что плагин ACF активен.</p>
		</div>
		<?php
		return;
	}

	$categories = verda_group_options_pages_by_category($pages);
	?>

	<div class="verda-card">
		<h2 class="verda-card-title">Редактирование контента</h2>
		<p class="verda-card-description">Контактные данные, основные страницы и секции, шапка и подвал сайта.</p>

	<?php foreach ($categories as $category_key => $category): ?>
			<div class="verda-acf-category">
				<h3 class="verda-acf-category-title"><?= esc_html($category['label']); ?></h3>
				
				<table class="widefat verda-table verda-acf-table">
					<tbody>
						<?php
						// Категория с дочерними (отдельная страница-родитель)
						if (isset($category['parent'])):
							$parent = $category['parent'];
							$children = $category['children'];
							$page_title = $parent['page']['page_title'] ?? $parent['page']['menu_title'] ?? $parent['slug'];
							$edit_link = admin_url('admin.php?page=' . $parent['slug']);
							?>
							
							<tr class="verda-acf-row-parent">
								<td class="verda-acf-title-cell">
									<span class="verda-acf-parent-icon">📁</span>
									<a href="<?= esc_url($edit_link); ?>" class="verda-acf-parent-link">
										<?= esc_html($page_title); ?>
									</a>
									<?php if (!empty($children)): ?>
										<span class="verda-acf-children-count"><?= count($children); ?></span>
									<?php endif; ?>
								</td>
								<td class="verda-table-actions">
									<a class="button button-small button-primary" href="<?= esc_url($edit_link); ?>">
										Редактировать
									</a>
								</td>
							</tr>
							
							<?php if (!empty($children)): ?>
								<?php foreach ($children as $child): ?>
									<?php
									$child_page = $child['page'];
									$child_title = $child_page['page_title'] ?? $child_page['menu_title'] ?? $child['slug'];
									$child_link = admin_url('admin.php?page=' . $child['slug']);
									?>
									<tr class="verda-acf-row-child">
										<td class="verda-acf-title-cell">
											<span class="verda-acf-child-indent">
												<span class="verda-acf-child-icon">📄</span>
												<a href="<?= esc_url($child_link); ?>">
													<?= esc_html($child_title); ?>
												</a>
											</span>
										</td>
										<td class="verda-table-actions">
											<a class="button button-small" href="<?= esc_url($child_link); ?>">
												Редактировать
											</a>
										</td>
									</tr>
								<?php endforeach; ?>
							<?php endif; ?>
							
						<?php else: ?>
							<!-- Категория «Другие секции» — просто список без детей -->
							<?php if (isset($category['parents'])): ?>
								<?php foreach ($category['parents'] as $item): ?>
									<?php
									$page_title = $item['page']['page_title'] ?? $item['page']['menu_title'] ?? $item['slug'];
									$edit_link = admin_url('admin.php?page=' . $item['slug']);
									?>
									<tr class="verda-acf-row-parent">
										<td class="verda-acf-title-cell">
											<a href="<?= esc_url($edit_link); ?>" class="verda-acf-parent-link">
												<?= esc_html($page_title); ?>
											</a>
										</td>
										<td class="verda-table-actions">
											<a class="button button-small button-primary" href="<?= esc_url($edit_link); ?>">
												Редактировать
											</a>
										</td>
									</tr>
								<?php endforeach; ?>
							<?php endif; ?>
						<?php endif; ?>
					</tbody>
				</table>
			</div>
		<?php endforeach; ?>
	</div>
	<?php
}
