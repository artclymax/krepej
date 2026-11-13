<?php
/**
 * Секция: Поддержка
 *
 * Рекомендуемые плагины (с установкой), текущая тема, PHP версия, контакты поддержки
 */

if (!defined('ABSPATH')) {
	exit;
}

function render_section_support()
{
	$plugins = verda_required_plugins();
	$theme = wp_get_theme();
	$installed = isset($_GET['installed']) ? sanitize_text_field($_GET['installed']) : '';
	?>

	<?php if ($installed === '1'): ?>
		<div class="notice notice-success is-dismissible">
			<p>Плагины успешно установлены и активированы.</p>
		</div>
	<?php elseif ($installed === 'error'): ?>
		<div class="notice notice-error is-dismissible">
			<p>Произошла ошибка при установке плагинов. Проверьте права доступа и логи.</p>
		</div>
	<?php endif; ?>

	<div class="verda-card">
		<h2 class="verda-card-title">Рекомендуемые плагины</h2>
		<p class="verda-card-description">Быстрая установка необходимых плагинов для проекта.</p>

		<form method="post" action="<?php echo admin_url('admin-post.php'); ?>" style="margin-bottom:15px;">
			<input type="hidden" name="action" value="verda_install_all_plugins">
			<?php wp_nonce_field('verda_install_all_plugins'); ?>
			<button type="submit" class="button button-primary">Установить все отсутствующие</button>
		</form>

		<table class="widefat striped verda-table">
			<thead>
				<tr>
					<th>Плагин</th>
					<th>Статус</th>
					<th class="verda-table-actions">Действие</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($plugins as $plugin): ?>
					<?php
					$slug = $plugin['slug'];
					$is_installed = verda_is_plugin_installed($slug);

					if ($is_installed) {
						$status = '<span class="verda-status-ok">✅ Установлен</span>';
						$button = '';
					} else {
						$status = '<span class="verda-status-error">❌ Не установлен</span>';
						ob_start();
						?>
						<form method="post" action="<?php echo admin_url('admin-post.php'); ?>" style="display:inline;">
							<input type="hidden" name="action" value="verda_install_single_plugin">
							<input type="hidden" name="slug" value="<?php echo esc_attr($slug); ?>">
							<?php wp_nonce_field('verda_install_single_plugin'); ?>
							<button type="submit" class="button button-small button-primary">Установить</button>
						</form>
						<?php
						$button = ob_get_clean();
					}
					?>
					<tr>
						<td><strong><?php echo esc_html($plugin['name']); ?></strong></td>
						<td><?php echo $status; ?></td>
						<td class="verda-table-actions"><?php echo $button; ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>

	<div class="verda-card">
		<h2 class="verda-card-title">Техническая информация</h2>

		<table class="widefat verda-table">
			<tbody>
				<tr>
					<th style="width:200px;">WordPress</th>
					<td><?php echo get_bloginfo('version'); ?></td>
				</tr>
				<tr>
					<th>PHP</th>
					<td><?php echo phpversion(); ?></td>
				</tr>
				<tr>
					<th>Тема</th>
					<td><?php echo $theme->get('Name') . ' ' . $theme->get('Version'); ?></td>
				</tr>
				<tr>
					<th>Шаблон</th>
					<td><?php echo $theme->get_template(); ?></td>
				</tr>
				<tr>
					<th>Сайт</th>
					<td><a href="<?= home_url('/'); ?>" target="_blank"><?= home_url('/'); ?></a></td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="verda-card">
		<h2 class="verda-card-title">Поддержка сайта</h2>
		<p class="verda-card-description">Связаться с разработчиком для решения любых вопросов.</p>

		<div class="verda-support-contacts">
			<div class="verda-support-logo">
				<a href="https://artcly.by/" target="_blank">
					<img
						src="https://cdn-ru.bitrix24.by/b18173214/bitrix24/4cd/4cdc51766a6144158d8d82e34051da16/logo_2I6sgS4a.png"
						alt="Веб студия" style="max-width:150px;">
				</a>
			</div>

			<div class="verda-support-info">
				<p>
					<strong>E-mail:</strong>
					<a href="mailto:info@artcly.by" class="email">info@artcly.by</a>
				</p>
				<p>
					<strong>Телефон:</strong>
					<a href="tel:375292389851" class="phone">+375 (29) 238-98-51</a>
				</p>

				<div class="verda-socials">
					<a href="viber://chat?number=%2B375292389851" class="social-icon" target="_blank">
						<img src="https://artcly.by/wp-content/themes/artcly_ready/image/Group 48100988.png" alt="Viber">
					</a>
					<a href="https://t.me/+375292389851" class="social-icon" target="_blank">
						<img src="https://artcly.by/wp-content/themes/artcly_ready/image/Group 48100987.png" alt="Telegram">
					</a>
					<a href="https://wa.me/375292389851" class="social-icon" target="_blank">
						<img src="https://artcly.by/wp-content/themes/artcly_ready/image/Group 48100986.png" alt="WhatsApp">
					</a>
				</div>
			</div>
		</div>
	</div>
	<?php
}
