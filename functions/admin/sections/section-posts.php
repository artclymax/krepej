<?php
if (!defined('ABSPATH'))
	exit;

/**
 * Получить все кастомные типы записей (исправленная версия)
 */
function verda_get_cached_post_types()
{
	$cache_key = 'verda_admin_post_types';
	$cache = get_transient($cache_key);

	if ($cache === false) {
		// Берём ВСЕ кастомные типы, фильтруем вручную
		$post_types = get_post_types(['_builtin' => false], 'objects');

		// Исключаем системные и невидимые в админке
		$excluded = ['flamingo_inbound', 'flamingo_contact', 'attachment', 'acf-field', 'acf-field-group', 'custom_css', 'customize_changeset', 'oembed_cache', 'user_request', 'wp_block', 'wp_navigation', 'wp_template', 'wp_template_part', 'wp_global_styles'];

		$post_types = array_filter($post_types, function ($pt) use ($excluded) {
			return $pt->show_ui === true
				&& !in_array($pt->name, $excluded, true);
		});

		$timeout = function_exists('verda_get_config')
			? verda_get_config('settings.cache_timeout', 3600)
			: 3600;

		set_transient($cache_key, $post_types, (int) $timeout);
		$cache = $post_types;
	}

	return $cache;
}

function verda_get_post_count($post_type)
{
	$count = wp_count_posts($post_type);
	return (int) ($count->publish ?? 0);
}

// Сброс кеша
add_action('save_post', function () {
	delete_transient('verda_admin_post_types');
});
add_action('registered_post_type', function ($post_type) {
	delete_transient('verda_admin_post_types');
}, 10, 1);
add_action('unregistered_post_type', function ($post_type) {
	delete_transient('verda_admin_post_types');
}, 10, 1);

// Принудительная очистка при каждом заходе в админку (для отладки — можно убрать в продакшене)
add_action('admin_init', function () {
	// delete_transient('verda_admin_post_types'); // раскомментируй для теста
});

function render_section_posts()
{
	// Принудительно чистим перед рендером, если нужно (debug only)
	// delete_transient('verda_admin_post_types');

	$post_types = verda_get_cached_post_types();

	if (empty($post_types)) {
		?>
		<div class="verda-card">
			<h2 class="verda-card-title">Записи</h2>
			<p class="verda-card-description">
				Кастомные типы записей не найдены.
				<br><a href="#" onclick="location.reload(); return false;" class="button button-small"
					style="margin-top:10px;">Перезагрузить кеш</a>
			</p>
		</div>
		<?php
		return;
	}
	?>
	<div class="verda-card">
		<h2 class="verda-card-title">Записи</h2>
		<p class="verda-card-description">Все типы записей с быстрым доступом.</p>

		<table class="widefat striped verda-table">
			<thead>
				<tr>
					<th>Тип записей</th>
					<th>Количество</th>
					<th class="verda-table-actions">Действия</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($post_types as $post_type): ?>
					<?php
					$count = verda_get_post_count($post_type->name);
					$edit_link = admin_url('edit.php?post_type=' . $post_type->name);
					$add_link = admin_url('post-new.php?post_type=' . $post_type->name);
					$singular_name = $post_type->labels->singular_name ?? 'Запись';
					?>
					<tr>
						<td>
							<a href="<?= esc_url($edit_link); ?>">
								<?= esc_html($post_type->labels->name); ?>
							</a>
						</td>
						<td>
							<span class="verda-count-badge"><?= $count; ?></span>
						</td>
						<td class="verda-table-actions">
							<a class="button button-small" href="<?= esc_url($edit_link); ?>">
								Все записи
							</a>
							<a class="button button-small button-primary" href="<?= esc_url($add_link); ?>">
								Добавить <?= esc_html(mb_strtolower($singular_name)); ?>
							</a>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>
	<?php
}