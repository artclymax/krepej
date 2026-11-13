<?php
/**
 * Секция: Заявки
 * 
 * Таблица заявок с поиском, фильтрами и уведомлениями
 * Кеширование через transients API
 * AJAX поиск по заявкам
 */

if (!defined('ABSPATH')) {
    exit;
}

// AJAX обработчик поиска заявок
add_action('wp_ajax_verda_search_leads', function() {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized');
    }
    
    $search = sanitize_text_field($_POST['search'] ?? '');
    $paged = intval($_POST['paged'] ?? 1);
    
    $args = [
        'post_type' => 'cf7_lead',
        'posts_per_page' => 20,
        'paged' => $paged,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    ];
    
    if (!empty($search)) {
        $args['s'] = $search;
        $args['meta_query'] = [
            'relation' => 'OR',
            [
                'key' => '_cf7_lead_name',
                'value' => $search,
                'compare' => 'LIKE',
            ],
            [
                'key' => '_cf7_lead_email',
                'value' => $search,
                'compare' => 'LIKE',
            ],
            [
                'key' => '_cf7_lead_phone',
                'value' => $search,
                'compare' => 'LIKE',
            ],
        ];
    }
    
    $leads = get_posts($args);
    $total = wp_count_posts('cf7_lead')->publish;
    
    $results = [];
    foreach ($leads as $lead) {
        $form = get_post_meta($lead->ID, '_cf7_lead_form_title', true);
        $submitted = get_post_meta($lead->ID, '_cf7_lead_submitted', true);

        $email = verda_get_lead_field($lead->ID, ['your-email', 'email', 'user-email', 'user_email', 'e-mail']);
        $phone = verda_get_lead_field($lead->ID, ['your-tel', 'your-phone', 'phone', 'tel', 'user-tel', 'user_tel', 'user-phone', 'user_phone']);

        $results[] = [
            'id' => $lead->ID,
            'title' => $lead->post_title,
            'date' => $submitted ? date_i18n('d.m.Y H:i', strtotime($submitted)) : '—',
            'form' => $form ?: '—',
            'email' => $email ?: '—',
            'phone' => $phone ?: '—',
            'edit_url' => admin_url('post.php?post=' . $lead->ID . '&action=edit'),
        ];
    }
    
    wp_send_json_success([
        'leads' => $results,
        'total' => $total,
        'paged' => $paged,
    ]);
});

// AJAX обработчик очистки кеша заявок
add_action('wp_ajax_verda_clear_leads_cache', function() {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized');
    }

    delete_transient('verda_admin_leads_5');
    delete_transient('verda_admin_leads_20');
    delete_transient('verda_admin_leads_50');

    wp_send_json_success('Cache cleared');
});

// AJAX обработчик проверки новых заявок (для уведомлений)
add_action('wp_ajax_verda_check_new_leads', function() {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized');
    }
    
    $last_check = get_transient('verda_admin_last_lead_check') ?: 0;
    $current_time = current_time('timestamp');
    
    $new_leads = get_posts([
        'post_type' => 'cf7_lead',
        'post_status' => 'publish',
        'date_query' => [
            ['after' => date('Y-m-d H:i:s', $last_check)],
        ],
        'fields' => 'ids',
    ]);
    
    set_transient('verda_admin_last_lead_check', $current_time, verda_get_config('settings.cache_timeout', 3600));
    
    wp_send_json_success([
        'count' => count($new_leads),
        'leads' => count($new_leads),
    ]);
});

/**
 * Получить последние заявки (без кеширования — данные меняются часто)
 */
function verda_get_cached_leads($count = 20) {
    $query = new WP_Query([
        'post_type' => 'cf7_lead',
        'posts_per_page' => $count,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => true,
        'update_post_term_cache' => false,
        'update_post_meta_cache' => true,
    ]);

    return $query->posts;
}

/**
 * Получить общее количество заявок
 */
function verda_get_leads_count() {
    return wp_count_posts('cf7_lead')->publish ?? 0;
}

/**
 * Получить значение поля из заявки (ищет в массиве _cf7_lead_fields и в отдельных мета-ключах)
 */
function verda_get_lead_field($post_id, $possible_keys = []) {
    // 1. Сначала ищем в массиве всех полей
    $all_fields = get_post_meta($post_id, '_cf7_lead_fields', true);
    if (is_array($all_fields)) {
        foreach ($possible_keys as $key) {
            if (!empty($all_fields[$key])) {
                return $all_fields[$key];
            }
        }
    }

    // 2. Ищем в отдельных мета-ключах с префиксом _cf7_lead_field_
    foreach ($possible_keys as $key) {
        $value = get_post_meta($post_id, '_cf7_lead_field_' . $key, true);
        if (!empty($value)) {
            return $value;
        }
    }

    return '';
}

/**
 * Очистить кеш при новой заявке (на всякий случай)
 */
add_action('save_post_cf7_lead', function() {
    delete_transient('verda_admin_leads_5');
    delete_transient('verda_admin_leads_20');
    delete_transient('verda_admin_leads_50');
});

function render_section_leads() {
    if (!post_type_exists('cf7_lead')) {
        ?>
        <div class="verda-card">
            <h2 class="verda-card-title">Заявки</h2>
            <p class="verda-card-description">Система заявок не активна. Убедитесь, что плагин CF7 Leads установлен.</p>
        </div>
        <?php
        return;
    }
    
    $leads = verda_get_cached_leads(20);
    $total = verda_get_leads_count();
    $form_email = get_option('form_email_to') ?: get_option('admin_email');
    ?>

    <div class="verda-card">
        <div class="verda-card-header">
            <div>
                <h2 class="verda-card-title">Заявки</h2>
                <p class="verda-card-description">
                    📬 Заявки приходят на email: <code><?= esc_html($form_email); ?></code>
                    <a href="<?= esc_url(admin_url('admin.php?page=verda-settings&tab=general')); ?>" style="margin-left:10px;">
                        Изменить email
                    </a>
                </p>
            </div>
            <a href="<?= esc_url(admin_url('edit.php?post_type=cf7_lead')); ?>" class="button">
                Все заявки (<?= $total; ?>)
            </a>
        </div>
        
        <!-- Поиск -->
        <div class="verda-search-box">
            <input type="text" id="verda-leads-search" class="verda-search-input" 
                   placeholder="🔍 Поиск по имени, email, телефону или форме...">
            <span class="verda-search-spinner" style="display:none;">⏳</span>
        </div>
        
        <!-- Уведомление о новых заявках -->
        <div id="verda-new-leads-notice" class="verda-notice verda-notice-info" style="display:none;">
            <span id="verda-new-leads-count">0</span> новых заявок!
            <button class="button button-small" onclick="verdaRefreshLeads()">Обновить</button>
        </div>
        
        <!-- Таблица заявок -->
        <div id="verda-leads-container">
            <?php if ($leads): ?>
                <table class="widefat striped verda-table">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Отправитель</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Форма</th>
                            <th class="verda-table-actions">Действие</th>
                        </tr>
                    </thead>
                    <tbody id="verda-leads-tbody">
                        <?php foreach ($leads as $lead): ?>
                            <?php
                            $edit_url = admin_url('post.php?post=' . $lead->ID . '&action=edit');
                            $form = get_post_meta($lead->ID, '_cf7_lead_form_title', true);
                            $submitted = get_post_meta($lead->ID, '_cf7_lead_submitted', true);

                            $email = verda_get_lead_field($lead->ID, ['your-email', 'email', 'user-email', 'user_email', 'e-mail']);
                            $phone = verda_get_lead_field($lead->ID, ['your-tel', 'your-phone', 'phone', 'tel', 'user-tel', 'user_tel', 'user-phone', 'user_phone']);
                            ?>
                            <tr>
                                <td>
                                    <a href="<?= esc_url($edit_url); ?>">
                                        <?= esc_html($submitted ? date_i18n('d.m.Y H:i', strtotime($submitted)) : '—'); ?>
                                    </a>
                                </td>
                                <td>
                                    <a href="<?= esc_url($edit_url); ?>">
                                        <?= esc_html($lead->post_title); ?>
                                    </a>
                                </td>
                                <td><?= esc_html($email ?: '—'); ?></td>
                                <td><?= esc_html($phone ?: '—'); ?></td>
                                <td><?= esc_html($form ?: '—'); ?></td>
                                <td class="verda-table-actions">
                                    <a class="button button-small" href="<?= esc_url($edit_url); ?>">
                                        Открыть
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="verda-empty-state">
                    <p class="description">Заявок пока нет. Они появятся здесь после отправки формы на сайте.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
}
