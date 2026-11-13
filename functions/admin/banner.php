<?php
/**
 * Баннер навигации - показывается на всех страницах админки
 */

if (!defined('ABSPATH')) {
    exit;
}

$current_page = isset($_GET['page']) ? $_GET['page'] : '';

// Не показываем баннер на нашей странице настроек
if ($current_page === 'verda-settings') {
    return;
}

$settings_url = admin_url('admin.php?page=verda-settings');
$home_url = home_url('/');
?>

<style>
    .verda-admin-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        background: linear-gradient(135deg, #2271b1, #1d4ed8);
        color: #fff;
        padding: 16px 24px;
        margin: 0 0 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
        text-decoration: none;
        border-radius: 4px;
        transition: box-shadow 0.3s ease;
    }

    .verda-admin-banner:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, .25);
        text-decoration: none;
    }

    .verda-admin-banner__text {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .verda-admin-banner h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
    }

    .verda-admin-banner p {
        margin: 0;
        font-size: 13px;
        opacity: .9;
        color: #fff;
    }

    .verda-admin-banner__actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .verda-admin-banner .button {
        font-size: 14px;
        padding: 6px 16px;
        height: auto;
        background: #fff;
        color: #2271b1;
        border: none;
        font-weight: 600;
        transition: all 0.3s;
    }

    .verda-admin-banner .button:hover {
        background: #f0f6fc;
        color: #1d4ed8;
    }

    .verda-admin-banner .button.button-outline {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.5);
        color: #fff;
    }

    .verda-admin-banner .button.button-outline:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
    }
</style>

<div class="verda-admin-banner">
    <div class="verda-admin-banner__text">
        <h3>⚙️ Панель управления сайтом</h3>
        <p>Быстрый доступ к настройкам и контенту сайта</p>
    </div>
    
    <div class="verda-admin-banner__actions">
        <a href="<?php echo esc_url($home_url); ?>" target="_blank" class="button button-outline">
            🏠 Главная сайта
        </a>
        <a href="<?php echo esc_url($settings_url); ?>" class="button">
            Открыть настройки
        </a>
    </div>
</div>
