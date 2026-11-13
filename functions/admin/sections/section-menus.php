<?php
/**
 * Секция: Меню
 * 
 * Список всех меню сайта с быстрым доступом
 */

if (!defined('ABSPATH')) {
    exit;
}

function render_section_menus() {
    $menus = wp_get_nav_menus();
    ?>
    
    <div class="verda-card">
        <div class="verda-card-header">
            <div>
                <h2 class="verda-card-title">Меню сайта</h2>
                <p class="verda-card-description">Управление навигационными меню сайта.</p>
            </div>
            <a href="<?= esc_url(admin_url('nav-menus.php?action=edit&menu=0')); ?>" class="button button-primary">
                + Создать меню
            </a>
        </div>
        
        <?php if ($menus): ?>
            <table class="widefat striped verda-table">
                <thead>
                    <tr>
                        <th>Название меню</th>
                        <th>Количество элементов</th>
                        <th class="verda-table-actions">Действие</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($menus as $menu): ?>
                        <?php
                        $menu_items = wp_get_nav_menu_items($menu->term_id);
                        $item_count = $menu_items ? count($menu_items) : 0;
                        $edit_link = admin_url('nav-menus.php?action=edit&menu=' . $menu->term_id);
                        ?>
                        <tr>
                            <td>
                                <a href="<?= esc_url($edit_link); ?>">
                                    <?= esc_html($menu->name); ?>
                                </a>
                            </td>
                            <td>
                                <span class="verda-count-badge"><?= $item_count; ?></span>
                            </td>
                            <td class="verda-table-actions">
                                <a class="button button-small" href="<?= esc_url($edit_link); ?>">
                                    Редактировать
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <div class="verda-empty-state">
                <p class="description">Меню пока не созданы. Нажмите «Создать меню», чтобы добавить первое меню.</p>
            </div>
        <?php endif; ?>
    </div>
    <?php
}
