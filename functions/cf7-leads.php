<?php
/**
 * CPT Leads: Собственная система хранения заявок с Contact Form 7
 * Заменяет Flamingo. Заявки создаются автоматически при отправке форм.
 * Ручное создание запрещено.
 */

// ========== 1. Регистрация CPT «Заявки» ==========
add_action('init', 'cf7_leads_register_post_type');
function cf7_leads_register_post_type()
{
	register_post_type('cf7_lead', [
		'labels' => [
			'name' => 'Заявки с сайта',
			'singular_name' => 'Заявка',
			'menu_name' => 'Заявки',
			'all_items' => 'Все заявки',
			'add_new' => 'Добавить заявку',
			'add_new_item' => 'Добавить новую заявку',
			'edit_item' => 'Просмотр заявки',
			'view_item' => 'Просмотреть',
			'search_items' => 'Поиск заявок',
			'not_found' => 'Заявок пока нет',
			'not_found_in_trash' => 'В корзине заявок нет',
		],
		'public' => false,
		'show_ui' => true,
		'show_in_menu' => true,
		'menu_icon' => 'dashicons-email',
		'menu_position' => 25,
		'capability_type' => 'post',
		'hierarchical' => false,
		'supports' => ['title', 'custom-fields'],
		'exclude_from_search' => true,
		'publicly_queryable' => false,
		'show_in_rest' => false,
		'rewrite' => false,
		'has_archive' => false,
	]);
}

// ========== 2. Запрет ручного создания заявок ==========
add_action('admin_init', 'cf7_leads_disable_create');
function cf7_leads_disable_create()
{
	global $pagenow;
	if ($pagenow === 'post-new.php' && isset($_GET['post_type']) && $_GET['post_type'] === 'cf7_lead') {
		wp_redirect(admin_url('edit.php?post_type=cf7_lead'));
		exit;
	}
}

// Скрываем кнопку «Добавить» в списке
add_filter('post_row_actions', 'cf7_leads_hide_actions', 10, 2);
function cf7_leads_hide_actions($actions, $post)
{
	if ($post->post_type === 'cf7_lead') {
		unset($actions['inline hide-if-no-js']);
		unset($actions['trash']);
	}
	return $actions;
}

add_filter('bulk_actions-edit-cf7_lead', 'cf7_leads_bulk_actions');
function cf7_leads_bulk_actions($actions)
{
	unset($actions['edit']);
	$actions['trash'] = 'Удалить';
	return $actions;
}

// ========== 3. Сохранение заявки при отправке CF7 ==========
add_action('wpcf7_mail_sent', 'cf7_leads_save_lead', 20);
function cf7_leads_save_lead($contact_form)
{
	$submission = WPCF7_Submission::get_instance();
	if (!$submission) {
		return;
	}

	$posted_data = $submission->get_posted_data();
	$form_title = $contact_form->title();
	$form_id = $contact_form->id();

	// Формируем заголовок из имени или email
	$title = '';
	foreach (['your-name', 'name', 'full-name', 'fullname', 'your-email', 'email'] as $field) {
		if (!empty($posted_data[$field])) {
			$title = is_array($posted_data[$field]) ? $posted_data[$field][0] : $posted_data[$field];
			break;
		}
	}
	if (empty($title)) {
		$title = 'Заявка #' . time();
	}

	// Создаём запись
	$lead_id = wp_insert_post([
		'post_type' => 'cf7_lead',
		'post_title' => sanitize_text_field($title),
		'post_status' => 'publish',
		'post_date' => current_time('mysql'),
	]);

	if (!$lead_id || is_wp_error($lead_id)) {
		return;
	}

	// Сохраняем мета-данные
	update_post_meta($lead_id, '_cf7_lead_form_id', $form_id);
	update_post_meta($lead_id, '_cf7_lead_form_title', $form_title);
	update_post_meta($lead_id, '_cf7_lead_submitted', current_time('mysql'));
	update_post_meta($lead_id, '_cf7_lead_ip', $submission->get_meta('remote_ip'));
	update_post_meta($lead_id, '_cf7_lead_user_agent', $submission->get_meta('user_agent'));

	// Сохраняем все поля формы
	$fields = [];
	foreach ($posted_data as $key => $value) {
		if (strpos($key, '_wpcf7') === 0) {
			continue;
		}
		if (is_array($value)) {
			$value = implode(', ', $value);
		}
		$fields[$key] = sanitize_text_field($value);
		update_post_meta($lead_id, '_cf7_lead_field_' . sanitize_key($key), $value);
	}

	// Сохраняем все поля в одном массиве для удобного вывода
	update_post_meta($lead_id, '_cf7_lead_fields', $fields);

	// Сохраняем тело сообщения (как в оригинальной форме)
	$mail = $contact_form->prop('mail');
	$mail_body = $mail['body'] ?? '';
	update_post_meta($lead_id, '_cf7_lead_mail_body', $mail_body);
}

// ========== 4. Кастомные колонки в таблице заявок ==========
add_filter('manage_cf7_lead_posts_columns', 'cf7_leads_columns');
function cf7_leads_columns($columns)
{
	return [
		'cb' => '<input type="checkbox" />',
		'title' => 'Отправитель',
		'form' => 'Форма',
		'email' => 'Email',
		'phone' => 'Телефон',
		'date' => 'Дата',
	];
}

add_action('manage_cf7_lead_posts_custom_column', 'cf7_leads_column_content', 10, 2);
function cf7_leads_column_content($column, $post_id)
{
	switch ($column) {
		case 'form':
			$form = get_post_meta($post_id, '_cf7_lead_form_title', true);
			echo esc_html($form ?: '—');
			break;

		case 'email':
			$email = get_post_meta($post_id, '_cf7_lead_field_your-email', true)
				?: get_post_meta($post_id, '_cf7_lead_field_email', true);
			if ($email) {
				echo '<a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>';
			} else {
				echo '—';
			}
			break;

		case 'phone':
			$phone = get_post_meta($post_id, '_cf7_lead_field_your-tel', true)
				?: get_post_meta($post_id, '_cf7_lead_field_your-phone', true)
				?: get_post_meta($post_id, '_cf7_lead_field_phone', true);
			echo esc_html($phone ?: '—');
			break;

		case 'date':
			$submitted = get_post_meta($post_id, '_cf7_lead_submitted', true);
			if ($submitted) {
				echo esc_html(date_i18n('d.m.Y H:i', strtotime($submitted)));
			}
			break;
	}
}

add_filter('manage_edit-cf7_lead_sortable_columns', 'cf7_leads_sortable_columns');
function cf7_leads_sortable_columns($columns)
{
	$columns['date'] = 'date';
	$columns['form'] = '_cf7_lead_form_title';
	return $columns;
}

// ========== 5. Страница просмотра заявки ==========
add_action('add_meta_boxes_cf7_lead', 'cf7_leads_meta_box');
function cf7_leads_meta_box()
{
	add_meta_box(
		'cf7_lead_data',
		'Данные заявки',
		'cf7_lead_data_callback',
		'cf7_lead',
		'normal',
		'high'
	);

	add_meta_box(
		'cf7_lead_info',
		'Информация',
		'cf7_lead_info_callback',
		'cf7_lead',
		'side',
		'default'
	);
}

function cf7_lead_data_callback($post)
{
	$fields = get_post_meta($post->ID, '_cf7_lead_fields', true);
	if (empty($fields)) {
		echo '<p>Нет данных</p>';
		return;
	}

	// Словарь красивых названий полей
	$labels = [
		'your-name' => 'Имя',
		'name' => 'Имя',
		'full-name' => 'Имя',
		'fullname' => 'Имя',
		'your-email' => 'Email',
		'email' => 'Email',
		'your-tel' => 'Телефон',
		'your-phone' => 'Телефон',
		'phone' => 'Телефон',
		'tel' => 'Телефон',
		'your-message' => 'Сообщение',
		'message' => 'Сообщение',
		'your-subject' => 'Тема',
		'subject' => 'Тема',
	];

	echo '<table class="widefat striped">';
	echo '<thead><tr><th style="width:200px;">Поле</th><th>Значение</th></tr></thead>';
	echo '<tbody>';

	foreach ($fields as $key => $value) {
		$label = $labels[$key] ?? ucfirst(str_replace(['your-', 'your_'], '', $key));
		$is_long = strlen($value) > 100;
		echo '<tr>';
		echo '<td><strong>' . esc_html($label) . '</strong></td>';
		echo '<td>';
		if ($is_long) {
			echo '<div style="max-height:200px; overflow-y:auto; white-space:pre-wrap;">' . esc_html($value) . '</div>';
		} else {
			echo esc_html($value);
		}
		echo '</td>';
		echo '</tr>';
	}

	echo '</tbody></table>';
}

function cf7_lead_info_callback($post)
{
	$form = get_post_meta($post->ID, '_cf7_lead_form_title', true);
	$form_id = get_post_meta($post->ID, '_cf7_lead_form_id', true);
	$ip = get_post_meta($post->ID, '_cf7_lead_ip', true);
	$submitted = get_post_meta($post->ID, '_cf7_lead_submitted', true);
	$ua = get_post_meta($post->ID, '_cf7_lead_user_agent', true);
	?>
	<table class="widefat">
		<tr>
			<th style="width:120px;">Форма</th>
			<td>
				<?php if ($form_id): ?>
					<a href="<?php echo admin_url('admin.php?page=wpcf7&post=' . $form_id); ?>">
						<?php echo esc_html($form ?: '—'); ?>
					</a>
				<?php else: ?>
					<?php echo esc_html($form ?: '—'); ?>
				<?php endif; ?>
			</td>
		</tr>
		<tr>
			<th>Дата</th>
			<td><?php echo $submitted ? date_i18n('d.m.Y H:i:s', strtotime($submitted)) : '—'; ?></td>
		</tr>
		<tr>
			<th>IP</th>
			<td><code><?php echo esc_html($ip ?: '—'); ?></code></td>
		</tr>
		<?php if ($ua): ?>
			<tr>
				<th>Браузер</th>
				<td><code style="font-size:11px;"><?php echo esc_html($ua); ?></code></td>
			</tr>
		<?php endif; ?>
	</table>
	<?php
}

// ========== 6. Автоочистка старых заявок (старше 90 дней) ==========
add_action('cf7_leads_cleanup', 'cf7_leads_cleanup_old');
function cf7_leads_cleanup_old()
{
	$days = apply_filters('cf7_leads_retention_days', 90);
	$old_date = date('Y-m-d H:i:s', strtotime("-{$days} days"));

	$old_leads = get_posts([
		'post_type' => 'cf7_lead',
		'post_status' => 'any',
		'posts_per_page' => -1,
		'date_query' => [
			['before' => $old_date],
		],
		'fields' => 'ids',
	]);

	foreach ($old_leads as $lead_id) {
		wp_delete_post($lead_id, true);
	}
}

// Запускаем очистку раз в день
if (!wp_next_scheduled('cf7_leads_cleanup')) {
	wp_schedule_event(time(), 'daily', 'cf7_leads_cleanup');
}
