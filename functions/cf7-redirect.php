<?php
/**
 * CF7 Redirect: Редирект после отправки формы на страницу "Спасибо"
 * с опциональной передачей GET-параметров формы.
 * Реализовано как встроенная вкладка в редакторе CF7 (аналог "Письмо", "Сообщения").
 */

// ========== 1. Добавляем вкладку «Редирект» в редактор CF7 ==========
add_filter('wpcf7_editor_panels', 'cf7_redirect_editor_panel');
function cf7_redirect_editor_panel($panels)
{
	$panels['redirect-panel'] = [
		'title' => 'Редирект',
		'callback' => 'cf7_redirect_panel_content',
	];
	return $panels;
}

function cf7_redirect_panel_content($post)
{
	$redirect_url = get_post_meta($post->id(), '_cf7_redirect_url', true);
	$enable_get = get_post_meta($post->id(), '_cf7_redirect_get_params', true);
	if ($enable_get === '') $enable_get = '1';
	?>
	<h2>Редирект после отправки</h2>
	<fieldset>
		<legend>Настройте страницу, на которую пользователь будет перенаправлен после успешной отправки формы.</legend>

		<table class="form-table" role="presentation">
			<tr>
				<th scope="row">
					<label for="wpcf7-redirect-url">URL для редиректа</label>
				</th>
				<td>
					<input type="text" id="wpcf7-redirect-url" name="wpcf7-redirect-url"
						value="<?php echo esc_attr($redirect_url); ?>"
						class="large-text code" placeholder="/thank-you/">
					<p class="description">
						Оставьте пустым, чтобы отключить редирект. Можно указать относительный путь или полный URL.
					</p>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="wpcf7-redirect-get-params">GET-параметры</label>
				</th>
				<td>
					<label for="wpcf7-redirect-get-params">
						<input type="checkbox" id="wpcf7-redirect-get-params" name="wpcf7-redirect-get-params"
							value="1" <?php checked($enable_get, '1'); ?>>
						Передавать данные формы как GET-параметры в URL
						<code>?name=...&amp;email=...</code>
					</label>
					<p class="description">
						Если включено, отправленные данные формы будут добавлены к URL редиректа.
					</p>
				</td>
			</tr>
		</table>
	</fieldset>
	<?php
}

// ========== 2. Сохранение настроек вкладки ==========
add_action('wpcf7_save_contact_form', 'cf7_save_redirect_settings', 10, 1);
function cf7_save_redirect_settings($contact_form)
{
	if (!isset($_POST['wpcf7-redirect-url'])) {
		return;
	}

	$redirect_url = sanitize_text_field($_POST['wpcf7-redirect-url']);
	$enable_get = isset($_POST['wpcf7-redirect-get-params']) ? '1' : '0';

	// Сохраняем как meta поста CF7
	update_post_meta($contact_form->id(), '_cf7_redirect_url', $redirect_url);
	update_post_meta($contact_form->id(), '_cf7_redirect_get_params', $enable_get);
}

// ========== 3. Обработка отправки — собираем данные и формируем URL ==========
add_action('wpcf7_mail_sent', 'cf7_handle_redirect');
function cf7_handle_redirect($contact_form)
{
	$form_id = $contact_form->id();
	$redirect_url = get_post_meta($form_id, '_cf7_redirect_url', true);
	$enable_get_params = get_post_meta($form_id, '_cf7_redirect_get_params', true);

	if (empty($redirect_url)) {
		return;
	}

	// Если путь относительный — добавляем URL сайта
	if (strpos($redirect_url, 'http') !== 0) {
		$redirect_url = home_url(ltrim($redirect_url, '/'));
	}

	$submission = WPCF7_Submission::get_instance();
	if (!$submission) {
		return;
	}

	$posted_data = $submission->get_posted_data();

	// Формируем URL с GET-параметрами
	if ($enable_get_params === '1' && !empty($posted_data)) {
		$params = [];
		foreach ($posted_data as $key => $value) {
			// Игнорируем технические поля CF7
			if (strpos($key, '_wpcf7') === 0) {
				continue;
			}
			if (is_array($value)) {
				$value = implode(',', $value);
			}
			if ($value !== '' && $value !== null) {
				$params[sanitize_key($key)] = sanitize_text_field($value);
			}
		}
		if (!empty($params)) {
			$redirect_url = add_query_arg($params, $redirect_url);
		}
	}

	// Сохраняем URL в transient для JS
	set_transient("cf7_redirect_{$form_id}", $redirect_url, 300);
}

// ========== 4. JS на фронтенде — редирект после wpcf7mailsent ==========
add_action('wp_footer', 'cf7_redirect_front_js');
function cf7_redirect_front_js()
{
	?>
	<script>
		document.addEventListener('wpcf7mailsent', function (event) {
			const formId = event.detail.contactFormId;
			const nonce = '<?php echo wp_create_nonce('cf7_redirect_nonce'); ?>';

			fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: `action=cf7_get_redirect_url&form_id=${formId}&nonce=${nonce}`
			})
			.then(res => res.json())
			.then(data => {
				if (data.success && data.data.url) {
					window.location.href = data.data.url;
				}
			})
			.catch(err => console.error('CF7 Redirect Error:', err));
		}, false);
	</script>
	<?php
}

// ========== 5. AJAX — отдаём URL из transient ==========
add_action('wp_ajax_cf7_get_redirect_url', 'cf7_ajax_get_redirect_url');
add_action('wp_ajax_nopriv_cf7_get_redirect_url', 'cf7_ajax_get_redirect_url');
function cf7_ajax_get_redirect_url()
{
	check_ajax_referer('cf7_redirect_nonce', 'nonce');

	$form_id = isset($_POST['form_id']) ? intval($_POST['form_id']) : 0;
	if (!$form_id) {
		wp_send_json_error();
	}

	$url = get_transient("cf7_redirect_{$form_id}");
	if ($url) {
		delete_transient("cf7_redirect_{$form_id}");
		wp_send_json_success(['url' => $url]);
	}

	wp_send_json_error();
}
