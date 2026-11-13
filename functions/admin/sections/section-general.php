<?php
/**
 * Секция: Основные настройки
 *
 * Название сайта, описание, фавиконка, логотип,
 * email администратора, email для заявок, индексация
 */

if (!defined('ABSPATH')) {
	exit;
}

// Настройки уже зарегистрированы в admin-page.php

function render_section_general()
{
	$logo_id = get_theme_mod('custom_logo');
	$icon_id = get_option('site_icon');
	?>
	<div class="verda-card">
		<h2 class="verda-card-title">Основные настройки</h2>
		<p class="verda-card-description">Название, описание, логотип и системные параметры сайта.</p>

		<form method="post" action="options.php">
			<?php settings_fields('verda_general_settings'); ?>

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="blogname">Название сайта</label>
					</th>
					<td>
						<input type="text" id="blogname" name="blogname" value="<?= esc_attr(get_option('blogname')); ?>"
							class="regular-text">
						<p class="description">Используется на вкладке браузера и вместо логотипа (если логотип не задан)</p>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<label for="blogdescription">Описание сайта</label>
					</th>
					<td>
						<textarea id="blogdescription" name="blogdescription" rows="3"
							class="large-text"><?= esc_textarea(get_option('blogdescription')); ?></textarea>
						<p class="description">Используется в meta description</p>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<label>Логотип сайта</label>
					</th>
					<td>
						<p class="description">Если не задан, то будет использоваться название сайта</p>
						<img id="logo-preview" src="<?= $logo_id ? wp_get_attachment_image_url($logo_id, 'medium') : ''; ?>"
							style="max-width:160px; display:block; margin-bottom:10px;">

						<input type="hidden" name="custom_logo" id="custom_logo" value="<?= esc_attr($logo_id); ?>">

						<button class="button upload-logo">Выбрать логотип</button>
						<button class="button remove-logo">Удалить</button>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<label>Иконка сайта (фавиконка)</label>
					</th>
					<td>
						<p class="description">Отображается на вкладке браузера</p>
						<img id="icon-preview" src="<?= $icon_id ? wp_get_attachment_image_url($icon_id, 'thumbnail') : ''; ?>"
							style="margin-bottom:10px;">

						<input type="hidden" name="site_icon" id="site_icon" value="<?= esc_attr($icon_id); ?>">
						<br>
						<button class="button upload-icon">Выбрать иконку</button>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<label for="admin_email_display">Email администратора</label>
					</th>
					<td>
						<p>
							<strong>
								<?= esc_html(get_option('admin_email')); ?>
							</strong>
						</p>

						<a href="<?= esc_url(admin_url('options-general.php#admin_email')); ?>" class="button button-secondary">
							Изменить Административный Email
						</a>

						<p class="description">
							По умолчанию на этот email приходят системные уведомления сайта.
						</p>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<label for="form_email_to">Email получателя заявок</label>
					</th>
					<td>
						<input type="text" id="form_email_to" name="form_email_to"
							value="<?= esc_attr(get_option('form_email_to', '')); ?>" class="regular-text"
							placeholder="<?= esc_attr(get_option('admin_email')); ?>">
						<p class="description">
							Email, на который будут приходить заявки с форм. Можно указать несколько через запятую. Если не указан
							— используется Email
							администратора.
						</p>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<label>Индексация сайта</label>
					</th>
					<td>
						<label>
							<input type="checkbox" name="blog_public" value="1" <?= get_option('blog_public') ? 'checked' : ''; ?>>
							Разрешить поисковым системам индексировать сайт
						</label>
						<p class="description">
							Снимите галочку, чтобы запретить индексацию (для тестовых сайтов)
						</p>
					</td>
				</tr>
			</table>

			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}
