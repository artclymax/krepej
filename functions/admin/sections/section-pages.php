<?php
/**
 * Секция: Страницы
 *
 * Список всех страниц с быстрыми ссылками
 */

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Получить все страницы (без кеширования — запрос быстрый)
 */
function verda_get_cached_pages()
{
	return get_pages([
		'sort_column' => 'post_title',
		'sort_order' => 'asc',
	]);
}

function render_section_pages()
{
	$pages = verda_get_cached_pages();

	if (empty($pages)) {
		?>
		<div class="verda-card">
			<h2 class="verda-card-title">Страницы</h2>
			<p class="verda-card-description">Страницы не найдены.</p>
		</div>
		<?php
		return;
	}
	?>

	<div class="verda-card">
		<div class="verda-card-header">
			<div>
				<h2 class="verda-card-title">Страницы</h2>
				<p class="verda-card-description">Все страницы сайта с быстрым доступом к редактированию.</p>
			</div>
			<a href="<?= esc_url(admin_url('post-new.php?post_type=page')); ?>" class="button button-primary">
				+ Добавить страницу
			</a>
		</div>

		<table class="widefat striped verda-table">
			<thead>
				<tr>
					<th>Название</th>
					<th>Статус</th>
					<th class="verda-table-actions">Действие</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($pages as $page): ?>
					<?php
					$edit_link = get_edit_post_link($page->ID);
					$view_link = get_permalink($page->ID);
					$status = $page->post_status === 'publish' ? 'Опубликована' : $page->post_status;
					?>
					<tr>
						<td>
							<a href="<?= esc_url($view_link); ?>" target="_blank">
								<?= esc_html($page->post_title); ?>
							</a>
						</td>
						<td>
							<span class="verda-status-badge verda-status-<?= esc_attr($page->post_status); ?>">
								<?= esc_html($status); ?>
							</span>
						</td>
						<td class="verda-table-actions">
							<a class="button button-small" href="<?= esc_url($edit_link); ?>">
								Редактировать
							</a>
							<a class="button button-small button-outline" href="<?= esc_url($view_link); ?>" target="_blank">
								Просмотр
							</a>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>
	<?php
}
