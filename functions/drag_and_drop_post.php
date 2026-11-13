<?php
/**
 * Drag-and-Drop сортировка + ручной ввод порядка
 * Порядок начинается с 1, мета-бокс на странице редактирования
 */

// ============================================================
// 1. Получаем все публичные типы записей
// ============================================================
function custom_dd_get_post_types()
{
	$post_types = get_post_types(['public' => true], 'names');
	unset($post_types['attachment']);
	return $post_types;
}

// ============================================================
// 2. Добавляем две колонки в КОНЕЦ таблицы
// ============================================================
function custom_dd_add_admin_hooks()
{
	foreach (custom_dd_get_post_types() as $post_type) {
		add_filter("manage_{$post_type}_posts_columns", 'custom_dd_add_columns', 999);
		add_action("manage_{$post_type}_posts_custom_column", 'custom_dd_render_columns', 10, 2);
	}
}
add_action('admin_init', 'custom_dd_add_admin_hooks');

function custom_dd_add_columns($columns)
{
	$columns['custom_dd_order'] = 'Порядок';
	$columns['custom_dd_move'] = '<span class="screen-reader-text">Перемещение</span>';
	return $columns;
}

function custom_dd_render_columns($column_name, $post_id)
{
	if ($column_name === 'custom_dd_order') {
		$post = get_post($post_id);
		$order = $post ? (int) $post->menu_order : 0;

		// Сохраняем в мета-поле
		update_post_meta($post_id, '_custom_dd_order', $order);

		// Показываем order + 1 (чтобы начиналось с 1)
		$display_order = $order + 1;

		echo '<input type="number" class="custom-dd-order-input" data-post-id="' . esc_attr($post_id) . '" value="' . esc_attr($display_order) . '" min="1" step="1" title="Введите порядок и нажмите Enter">';
	}

	if ($column_name === 'custom_dd_move') {
		echo '<div class="custom-dd-move-cell">';
		echo '<button type="button" class="custom-dd-arrow custom-dd-up" data-post-id="' . esc_attr($post_id) . '" title="Переместить вверх">↑</button>';
		echo '<div class="custom-dd-handle" title="Перетащите для сортировки"></div>';
		echo '<button type="button" class="custom-dd-arrow custom-dd-down" data-post-id="' . esc_attr($post_id) . '" title="Переместить вниз">↓</button>';
		echo '</div>';
	}
}

// ============================================================
// 3. Мета-бокс на странице редактирования записи
// ============================================================
function custom_dd_add_meta_boxes()
{
	foreach (custom_dd_get_post_types() as $post_type) {
		add_meta_box(
			'custom_dd_order_metabox',
			'Порядок вывода',
			'custom_dd_render_metabox',
			$post_type,
			'side',
			'high'
		);
	}
}
add_action('add_meta_boxes', 'custom_dd_add_meta_boxes');

function custom_dd_render_metabox($post)
{
	wp_nonce_field('custom_dd_save_metabox', 'custom_dd_metabox_nonce');
	$order = (int) $post->menu_order;
	$display_order = $order + 1;

	echo '<label for="custom_dd_order_field" style="font-weight: bold; display: block; margin-bottom: 5px;">Порядок:</label>';
	echo '<input type="number" id="custom_dd_order_field" name="custom_dd_order" value="' . esc_attr($display_order) . '" min="1" step="1" style="width: 100%; padding: 5px;">';
	echo '<p class="description">Чем меньше число, тем выше запись в списке. Начинается с 1.</p>';
}

function custom_dd_save_metabox($post_id)
{
	if (!isset($_POST['custom_dd_metabox_nonce'])) {
		return;
	}

	if (!wp_verify_nonce($_POST['custom_dd_metabox_nonce'], 'custom_dd_save_metabox')) {
		return;
	}

	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return;
	}

	if (!current_user_can('edit_post', $post_id)) {
		return;
	}

	if (!isset($_POST['custom_dd_order'])) {
		return;
	}

	$display_order = intval($_POST['custom_dd_order']);
	$order = max(0, $display_order - 1); // Вычитаем 1 для хранения в БД

	global $wpdb;
	$wpdb->update(
		$wpdb->posts,
		['menu_order' => $order],
		['ID' => $post_id],
		['%d'],
		['%d']
	);

	update_post_meta($post_id, '_custom_dd_order', $order);
	clean_post_cache($post_id);
}
add_action('save_post', 'custom_dd_save_metabox');

// ============================================================
// 4. Подключаем скрипты и стили
// ============================================================
function custom_dd_enqueue_scripts($hook)
{
	if (!in_array($hook, ['edit.php', 'upload.php'], true)) {
		return;
	}

	global $post_type;
	if (!in_array($post_type, custom_dd_get_post_types(), true)) {
		return;
	}

	if (!empty($_GET['s'])) {
		return;
	}

	wp_enqueue_script('jquery-ui-sortable');

	$nonce = wp_create_nonce('custom_dd_nonce');
	$js_post_type = esc_js($post_type);

	$inline_js = <<<JS
    jQuery(document).ready(function($) {
        var \$tbody = $('.wp-list-table tbody');

        // ---------- Drag & Drop ----------
        \$tbody.sortable({
            items: 'tr:not(.no-items)',
            cursor: 'move',
            axis: 'y',
            handle: '.custom-dd-handle',
            opacity: 0.8,
            placeholder: 'custom-dd-placeholder',
            update: function(event, ui) {
                var order = [];
                \$tbody.find('tr').each(function(i) {
                    var id = $(this).attr('id');
                    if (id) {
                        var postId = id.replace('post-', '');
                        order.push(postId);
                        // Обновляем визуально (i начинается с 0, показываем i+1)
                        $(this).find('.custom-dd-order-input').val(i + 1);
                    }
                });

                $.post(ajaxurl, {
                    action: 'custom_dd_save_order',
                    nonce: '{$nonce}',
                    order: order,
                    post_type: '{$js_post_type}'
                });
            }
        });

        // ---------- Ручной ввод порядка ----------
        var saveTimeout;
        \$tbody.on('change keyup', '.custom-dd-order-input', function(e) {
            if (e.type === 'keyup' && e.which !== 13) return;
            
            var \$input = $(this);
            var postId = \$input.data('post-id');
            var displayOrder = parseInt(\$input.val(), 10);

            if (isNaN(displayOrder) || displayOrder < 1) {
                displayOrder = 1;
                \$input.val(1);
            }

            // Вычитаем 1 для БД
            var dbOrder = displayOrder - 1;

            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(function() {
                $.post(ajaxurl, {
                    action: 'custom_dd_save_manual_order',
                    nonce: '{$nonce}',
                    post_id: postId,
                    order: dbOrder,
                    post_type: '{$js_post_type}'
                }).done(function() {
                    \$input.css('background', '#dff0d8');
                    setTimeout(function() { \$input.css('background', ''); }, 600);
                });
            }, 400);
        });

        // ---------- Стрелки вверх / вниз ----------
        \$tbody.on('click', '.custom-dd-arrow', function(e) {
            e.preventDefault();
            var \$btn = $(this);
            var postId = \$btn.data('post-id');
            var direction = \$btn.hasClass('custom-dd-up') ? 'up' : 'down';
            var \$row = \$btn.closest('tr');

            var \$neighbor = direction === 'up' ? \$row.prev('tr') : \$row.next('tr');
            if (!\$neighbor.length) return;

            var neighborId = \$neighbor.attr('id').replace('post-', '');
            var currentDisplayOrder = parseInt(\$row.find('.custom-dd-order-input').val(), 10);
            var neighborDisplayOrder = parseInt(\$neighbor.find('.custom-dd-order-input').val(), 10);

            // Меняем значения местами
            \$row.find('.custom-dd-order-input').val(neighborDisplayOrder);
            \$neighbor.find('.custom-dd-order-input').val(currentDisplayOrder);

            // Визуально меняем строки
            if (direction === 'up') {
                \$row.insertBefore(\$neighbor);
            } else {
                \$row.insertAfter(\$neighbor);
            }

            // Сохраняем (вычитаем 1 для БД)
            $.post(ajaxurl, {
                action: 'custom_dd_swap_order',
                nonce: '{$nonce}',
                post_id_1: postId,
                post_id_2: neighborId,
                order_1: neighborDisplayOrder - 1,
                order_2: currentDisplayOrder - 1,
                post_type: '{$js_post_type}'
            });
        });
    });
    JS;

	wp_add_inline_script('jquery-ui-sortable', $inline_js);

	$inline_css = <<<CSS
    .column-custom_dd_order {
        width: 90px !important;
    }
    .custom-dd-order-input {
        width: 60px;
        padding: 3px 6px;
        border: 1px solid #8c8f94;
        border-radius: 3px;
        text-align: center;
        font-size: 13px;
        transition: background 0.3s;
    }
    .custom-dd-order-input:focus {
        border-color: #2271b1;
        outline: none;
        box-shadow: 0 0 0 1px #2271b1;
    }

    .column-custom_dd_move {
        width: 70px !important;
        text-align: center;
    }
    .custom-dd-move-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }

    .custom-dd-handle {
        cursor: move;
        width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #a7aaad;
        transition: color 0.2s;
    }
    .custom-dd-handle:hover {
        color: #2271b1;
    }
    .custom-dd-handle::before {
        content: '';
        display: block;
        width: 12px;
        height: 12px;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a7aaad'><circle cx='9' cy='5' r='1.5'/><circle cx='15' cy='5' r='1.5'/><circle cx='9' cy='12' r='1.5'/><circle cx='15' cy='12' r='1.5'/><circle cx='9' cy='19' r='1.5'/><circle cx='15' cy='19' r='1.5'/></svg>");
        background-size: contain;
        background-repeat: no-repeat;
    }
    .custom-dd-handle:hover::before {
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232271b1'><circle cx='9' cy='5' r='1.5'/><circle cx='15' cy='5' r='1.5'/><circle cx='9' cy='12' r='1.5'/><circle cx='15' cy='12' r='1.5'/><circle cx='9' cy='19' r='1.5'/><circle cx='15' cy='19' r='1.5'/></svg>");
    }

    .custom-dd-arrow {
        background: none;
        border: 1px solid #c3c4c7;
        border-radius: 3px;
        cursor: pointer;
        padding: 2px 6px;
        font-size: 12px;
        line-height: 1;
        color: #50575e;
        transition: all 0.15s;
    }
    .custom-dd-arrow:hover {
        background: #f0f0f1;
        border-color: #2271b1;
        color: #2271b1;
    }
    .custom-dd-arrow:active {
        background: #2271b1;
        color: #fff;
    }

    .custom-dd-placeholder {
        background: #f0f6fc;
        border: 2px dashed #2271b1;
        height: 45px;
    }
    .ui-sortable-helper {
        background: #fff !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    CSS;

	wp_add_inline_style('wp-admin', $inline_css);
}
add_action('admin_enqueue_scripts', 'custom_dd_enqueue_scripts');

// ============================================================
// 5. AJAX: сохранение порядка после drag-and-drop
// ============================================================
function custom_dd_handle_save_order()
{
	check_ajax_referer('custom_dd_nonce', 'nonce');
	if (!current_user_can('edit_posts')) {
		wp_die('Недостаточно прав');
	}

	$order = isset($_POST['order']) ? array_map('intval', $_POST['order']) : [];
	if (empty($order)) {
		wp_die();
	}

	global $wpdb;
	foreach ($order as $position => $post_id) {
		$wpdb->update(
			$wpdb->posts,
			['menu_order' => $position],
			['ID' => $post_id],
			['%d'],
			['%d']
		);
		update_post_meta($post_id, '_custom_dd_order', $position);
		clean_post_cache($post_id);
	}

	wp_die();
}
add_action('wp_ajax_custom_dd_save_order', 'custom_dd_handle_save_order');

// ============================================================
// 6. AJAX: сохранение ручного ввода порядка
// ============================================================
function custom_dd_handle_save_manual_order()
{
	check_ajax_referer('custom_dd_nonce', 'nonce');
	if (!current_user_can('edit_posts')) {
		wp_die('Недостаточно прав');
	}

	$post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
	$order = isset($_POST['order']) ? intval($_POST['order']) : 0;

	if (!$post_id) {
		wp_die();
	}

	global $wpdb;
	$wpdb->update(
		$wpdb->posts,
		['menu_order' => $order],
		['ID' => $post_id],
		['%d'],
		['%d']
	);
	update_post_meta($post_id, '_custom_dd_order', $order);
	clean_post_cache($post_id);

	wp_die();
}
add_action('wp_ajax_custom_dd_save_manual_order', 'custom_dd_handle_save_manual_order');

// ============================================================
// 7. AJAX: обмен порядком между двумя записями (стрелки)
// ============================================================
function custom_dd_handle_swap_order()
{
	check_ajax_referer('custom_dd_nonce', 'nonce');
	if (!current_user_can('edit_posts')) {
		wp_die('Недостаточно прав');
	}

	$post_id_1 = isset($_POST['post_id_1']) ? intval($_POST['post_id_1']) : 0;
	$post_id_2 = isset($_POST['post_id_2']) ? intval($_POST['post_id_2']) : 0;
	$order_1 = isset($_POST['order_1']) ? intval($_POST['order_1']) : 0;
	$order_2 = isset($_POST['order_2']) ? intval($_POST['order_2']) : 0;

	if (!$post_id_1 || !$post_id_2) {
		wp_die();
	}

	global $wpdb;
	$wpdb->update($wpdb->posts, ['menu_order' => $order_1], ['ID' => $post_id_2], ['%d'], ['%d']);
	$wpdb->update($wpdb->posts, ['menu_order' => $order_2], ['ID' => $post_id_1], ['%d'], ['%d']);

	update_post_meta($post_id_1, '_custom_dd_order', $order_2);
	update_post_meta($post_id_2, '_custom_dd_order', $order_1);

	clean_post_cache($post_id_1);
	clean_post_cache($post_id_2);

	wp_die();
}
add_action('wp_ajax_custom_dd_swap_order', 'custom_dd_handle_swap_order');

// ============================================================
// 8. Сортировка в админке по menu_order
// ============================================================
function custom_dd_sort_admin_query($query)
{
	if (!is_admin() || !$query->is_main_query()) {
		return;
	}

	$post_type = $query->get('post_type');
	if (in_array($post_type, custom_dd_get_post_types(), true) && empty($_GET['s'])) {
		$query->set('orderby', 'menu_order');
		$query->set('order', 'ASC');
	}
}
add_action('pre_get_posts', 'custom_dd_sort_admin_query');

// ============================================================
// 9. Инициализация порядка для записей без menu_order (одноразово)
// ============================================================
function custom_dd_init_orders()
{
	global $wpdb;

	// Находим записи с menu_order = 0 и обновляем их последовательно
	foreach (custom_dd_get_post_types() as $post_type) {
		$posts = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT ID FROM {$wpdb->posts} WHERE post_type = %s AND post_status = 'publish' ORDER BY ID ASC",
				$post_type
			)
		);

		foreach ($posts as $index => $post) {
			$wpdb->update(
				$wpdb->posts,
				['menu_order' => $index],
				['ID' => $post->ID],
				['%d'],
				['%d']
			);
			update_post_meta($post->ID, '_custom_dd_order', $index);
		}
	}
}
// Раскомментируйте следующую строку один раз, затем закомментируйте обратно
// add_action( 'admin_init', 'custom_dd_init_orders' );
?>