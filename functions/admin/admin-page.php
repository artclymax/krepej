<?php
/**
 * Главная кастомной админ-панели
 * 
 * Регистрирует страницу настроек, подключает все секции,
 * стили, скрипты и управляет редиректом dashboard
 */

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Получить конфигурацию админ-панели
 */
function verda_get_config($key = null, $default = null)
{
	static $config = null;

	if ($config === null) {
		$config_file = __DIR__ . '/config.php';
		if (file_exists($config_file)) {
			$config = require $config_file;
		} else {
			$config = [];
		}
	}

	if ($key === null) {
		return $config;
	}

	// Поддержка вложенных ключей через точку
	$keys = explode('.', $key);
	$value = $config;

	foreach ($keys as $k) {
		if (isset($value[$k])) {
			$value = $value[$k];
		} else {
			return $default;
		}
	}

	return $value;
}

/**
 * Проверить, включена ли секция
 */
function verda_is_section_enabled($section_name)
{
	$sections = verda_get_config('sections', []);
	return !empty($sections[$section_name]);
}

/**
 * Регистрация страницы в меню админки
 */
add_action('admin_menu', function () {
	add_menu_page(
		'Панель управления',
		'Панель управления',
		'manage_options',
		'verda-settings',
		'render_verda_admin_page',
		'dashicons-admin-settings',
		2
	);
});

/**
 * Редирект с Dashboard на нашу страницу (по умолчанию)
 * Можно зайти на стандартный Dashboard, добавив ?no-redirect=1
 */
add_action('load-index.php', function () {
	if (!verda_get_config('settings.redirect_dashboard', false)) {
		return;
	}

	if (!current_user_can('manage_options')) {
		return;
	}

	// Можно зайти на стандартный Dashboard, добавив ?no-redirect=1
	if (isset($_GET['no-redirect'])) {
		return;
	}

	// Не редиректим если есть другие query параметры
	if (!empty($_SERVER['QUERY_STRING'])) {
		return;
	}

	wp_redirect(admin_url('admin.php?page=verda-settings'));
	exit;
});

/**
 * Регистрация настроек (должна быть ДО admin_init)
 */
add_action('admin_init', function () {
	// Основные настройки
	register_setting('verda_general_settings', 'blogname');
	register_setting('verda_general_settings', 'blogdescription');
	register_setting('verda_general_settings', 'site_icon');
	register_setting('verda_general_settings', 'form_email_to');
	register_setting('verda_general_settings', 'blog_public');
});

/**
 * Сохранение логотипа
 */
add_action('admin_init', function () {
	if (!isset($_POST['option_page']) || $_POST['option_page'] !== 'verda_general_settings') {
		return;
	}

	if (!current_user_can('manage_options')) {
		return;
	}

	if (isset($_POST['custom_logo'])) {
		set_theme_mod('custom_logo', absint($_POST['custom_logo']));
	}
});

/**
 * Баннер на всех страницах админки
 */
add_action('admin_notices', function () {
	if (!verda_get_config('settings.show_banner', false)) {
		return;
	}

	if (!current_user_can('manage_options')) {
		return;
	}

	require __DIR__ . '/banner.php';
});

/**
 * Подключение стилей и скриптов
 */
add_action('admin_enqueue_scripts', function ($hook) {
	// Подключаем только на нашей странице
	if ($hook !== 'toplevel_page_verda-settings') {
		return;
	}

	// Медиа для загрузки изображений
	wp_enqueue_media();

	// Наши стили
	wp_enqueue_style(
		'verda-admin-custom',
		get_template_directory_uri() . '/functions/admin/assets/css/admin-custom.css',
		[],
		'1.0.0'
	);

	// Наши скрипты
	wp_enqueue_script(
		'verda-admin-custom',
		get_template_directory_uri() . '/functions/admin/assets/js/admin-custom.js',
		['jquery'],
		'1.0.0',
		true
	);

	// Локализация для AJAX
	wp_localize_script('verda-admin-custom', 'verdaAdmin', [
		'ajaxUrl' => admin_url('admin-ajax.php'),
		'nonce' => wp_create_nonce('verda_admin_nonce'),
		'strings' => [
			'searchPlaceholder' => '🔍 Поиск по имени, email, телефону или форме...',
			'noResults' => 'Ничего не найдено',
			'error' => 'Произошла ошибка',
			'newLeads' => 'новых заявок!',
			'refresh' => 'Обновить',
		],
	]);
});

/**
 * Добавляем ссылку в admin bar
 */
add_action('admin_bar_menu', function ($wp_admin_bar) {
	if (!current_user_can('manage_options')) {
		return;
	}

	$wp_admin_bar->add_node([
		'id' => 'verda-settings',
		'title' => '⚙️ Панель управления',
		'href' => admin_url('admin.php?page=verda-settings'),
		'meta' => ['title' => 'Перейти к панели управления сайтом'],
	]);

}, 100);

/**
 * Главная функция рендера страницы
 */
function render_verda_admin_page()
{
	// Определяем активную вкладку
	$active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'general';

	// Список доступных вкладок (только включенные секции)
	$tabs = [];

	if (verda_is_section_enabled('general')) {
		$tabs['general'] = ['label' => 'Основные', 'icon' => '⚙️'];
	}
	if (verda_is_section_enabled('acf_fields')) {
		$tabs['acf_fields'] = ['label' => 'Редактирование контента', 'icon' => '📋'];
	}
	if (verda_is_section_enabled('posts')) {
		$tabs['posts'] = ['label' => 'Записи', 'icon' => '📝'];
	}
	if (verda_is_section_enabled('pages')) {
		$tabs['pages'] = ['label' => 'Страницы', 'icon' => '📄'];
	}
	if (verda_is_section_enabled('menus')) {
		$tabs['menus'] = ['label' => 'Меню', 'icon' => '🧭'];
	}
	if (verda_is_section_enabled('leads')) {
		$tabs['leads'] = ['label' => 'Заявки', 'icon' => '📬'];
	}
	if (verda_is_section_enabled('support')) {
		$tabs['support'] = ['label' => 'Поддержка', 'icon' => '🛠️'];
	}

	// Проверяем, что активная вкладка существует
	if (!isset($tabs[$active_tab])) {
		$active_tab = array_key_first($tabs);
	}
	?>

	<div class="wrap verda-admin-page">
		<h1>Панель управления сайтом</h1>

		<!-- Навигация по вкладкам -->
		<h2 class="nav-tab-wrapper verda-tabs">
			<?php foreach ($tabs as $tab_id => $tab): ?>
				<a href="?page=verda-settings&tab=<?= esc_attr($tab_id); ?>"
					class="nav-tab <?= $active_tab === $tab_id ? 'nav-tab-active' : ''; ?>">
					<span class="verda-tab-icon"><?= $tab['icon']; ?></span>
					<span class="verda-tab-label"><?= esc_html($tab['label']); ?></span>
				</a>
			<?php endforeach; ?>
		</h2>

		<!-- Контент вкладки -->
		<div class="verda-tab-content">
			<?php
			// Подключаем файл секции в зависимости от активной вкладки
			$sections_map = [
				'general' => 'section-general.php',
				'acf_fields' => 'section-acf-fields.php',
				'posts' => 'section-posts.php',
				'pages' => 'section-pages.php',
				'menus' => 'section-menus.php',
				'leads' => 'section-leads.php',
				'support' => 'section-support.php',
			];

			$section_file = $sections_map[$active_tab] ?? null;

			if ($section_file) {
				$section_path = __DIR__ . '/sections/' . $section_file;

				if (file_exists($section_path)) {
					require $section_path;

					// Вызываем функцию рендера
					// section-general.php -> render_section_general
					$function_name = str_replace('section-', '', basename($section_file, '.php'));
					$render_function = 'render_section_' . str_replace('-', '_', $function_name);

					if (function_exists($render_function)) {
						$render_function();
					} else {
						echo '<p>Функция рендера не найдена: <code>' . esc_html($render_function) . '</code></p>';
					}
				} else {
					echo '<p>Файл секции не найден: ' . esc_html($section_file) . '</p>';
				}
			}
			?>
		</div>
	</div>

	<?php
}
