<?php

// vite
//require_once get_template_directory() . '/functions/vite.php';

// === Helpers ===
require_once get_template_directory() . '/functions/helpers/theme_asset_version.php';
require_once get_template_directory() . '/functions/helpers/print_dump.php';
require_once get_template_directory() . '/functions/helpers/mx_logo.php';
//require_once get_template_directory() . '/functions/helpers/mx_pagination.php';
//require_once get_template_directory() . '/functions/helpers/mx_category_list.php';
//require_once get_template_directory() . '/functions/helpers/trim_text.php';
require_once get_template_directory() . '/functions/helpers/correct_phone.php';
//require_once get_template_directory() . '/functions/helpers/smart_breadcrumbs.php';


/* get_json_from_query
$json = get_json_from_query($query);
<div class="select-products-data" data-select-from-acf="<?= esc_attr($json) ?>"></div>
*/
//require_once get_template_directory() . '/functions/helpers/get_json_from_query.php';

/** Добавление картинки для кастомных полей в таблице админки
 * add_admin_thumbnail_column('castom-post-slug'); // projects
 */
//require_once get_template_directory() . '/functions/helpers/add_admin_thumbnail_column.php';
//add_admin_thumbnail_column('portfolio');

//require_once get_template_directory() . '/functions/helpers/get_prev_post_slug.php';
//require_once get_template_directory() . '/functions/helpers/get_next_post_slug.php';
//require_once get_template_directory() . '/functions/helpers/custom_product_category.php';
//require_once get_template_directory() . '/functions/helpers/get_product_attributes_array.php';

// === BASE ====
// Общая настройка темы (лого, название и т.п.)
require_once get_template_directory() . '/functions/default_settings.php';

// Подключение стилей
require_once get_template_directory() . '/functions/connect_styles.php';

// Подключение скриптов
require_once get_template_directory() . '/functions/connect_scripts.php';

// Создание меню
require_once get_template_directory() . '/functions/register_nav_menus.php';

// Регистрация новых записей
require_once get_template_directory() . '/functions/register_post_type.php';

// Убираем записи
require_once get_template_directory() . '/functions/delete_default_post.php';

// Кастомная админка (новая версия)
require_once get_template_directory() . '/functions/admin/admin-page.php';
require_once get_template_directory() . '/functions/admin/plugin-installer.php';
//add_action('admin_init', function() {
//    if (current_user_can('manage_options')) {
//        delete_transient('verda_admin_post_types');
//    }
//});

// Создание SCF-полей
require_once get_template_directory() . '/functions/scf_data.php';

// FIX Orphans (висячие и / пустые символы фигмы)
require_once get_template_directory() . '/functions/fix_orphans.php';

// NXT BREADCRUMBS
require_once get_template_directory() . '/functions/nxt-breadcrumbs.php';
//require_once get_template_directory() . '/functions/drag_and_drop_post.php';


add_action('admin_head', function () {
	echo '<style>
        #postexcerpt p {
            display: none !important;
        }
    </style>';
});

// не сжимать фото
//add_filter('big_image_size_threshold', '__return_false');



// === CF7 Redirect: Редирект после отправки формы ===
require_once get_template_directory() . '/functions/cf7-redirect.php';

// === CF7 Leads: Собственная система хранения заявок (замена Flamingo) ===
require_once get_template_directory() . '/functions/cf7-leads.php';

// === CF7: переопределение email получателя через настройки сайта ===
add_filter('wpcf7_mail_components', function ($components, $form) {
	$custom_email = get_option('form_email_to');

	if (!empty($custom_email) && is_email($custom_email)) {
		$components['recipient'] = $custom_email;
	}

	return $components;
}, 10, 2);

add_filter('wpcf7_autop', '__return_false', 20);
add_filter('wpcf7_form_elements', function ($content) {
	//$content = preg_replace('/<span class="wpcf7-form-control-wrap.*?">(.*?)<\/span>/is', '$1', $content);
	$content = str_replace('<br />', '', $content);
	return $content;
});


function sort_all_post_types_by_menu_order($query)
{

	if (is_admin() || !$query->is_main_query()) {
		return;
	}


	$post_type = $query->get('post_type');


	if (empty($post_type) || $post_type === 'any' || is_array($post_type) || is_string($post_type)) {
		$query->set('orderby', 'menu_order');
		$query->set('order', 'ASC');
	}
}
add_action('pre_get_posts', 'sort_all_post_types_by_menu_order', 99);


//!=== WOOCOMMERCE ===
require_once get_template_directory() . '/functions/woocommerce/base.php';
require_once get_template_directory() . '/functions/woocommerce/current.php';
/**
 * Глобальная замена {year} для всех полей типа textarea и wysiwyg
 */
add_filter('acf/format_value/type=textarea', 'global_replace_year_acf', 20, 3);
add_filter('acf/format_value/type=wysiwyg', 'global_replace_year_acf', 20, 3);

function global_replace_year_acf($value, $post_id, $field)
{
	if (is_string($value)) {
		$value = str_replace('{year}', date('Y'), $value);
	}
	return $value;
}

add_shortcode('year', function () {
	return date('Y');
});
