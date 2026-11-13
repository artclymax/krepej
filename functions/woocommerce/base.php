<?php
// Отключение стилей Woocommerce
add_filter('woocommerce_enqueue_styles', '__return_empty_array');

// Поддержка темы на Woocommerce
add_action('after_setup_theme', function () {
	add_theme_support('woocommerce');
});

add_filter('woocommerce_get_breadcrumb', 'custom_product_breadcrumb', 20, 2);
function custom_product_breadcrumb($crumbs, $breadcrumb)
{

	// Проверяем, что мы на странице товара ИЛИ в категории товара
	if ((is_product() || is_product_category()) && !empty($crumbs)) {
		$new_crumbs = array();

		// 1. Оставляем "Главная" (это всегда первый элемент массива)
		$new_crumbs[] = $crumbs[0];

		// 2. Вставляем "Каталог"
		$shop_page_id = wc_get_page_id('shop');
		$shop_url = $shop_page_id > 0 ? get_permalink($shop_page_id) : home_url('/shop/');

		$new_crumbs[] = array('Каталог', $shop_url);

		// 3. Добавляем остальные элементы (Категория, Подкатегория, Товар)
		for ($i = 1; $i < count($crumbs); $i++) {
			$new_crumbs[] = $crumbs[$i];
		}

		// Перезаписываем массив крошек
		$crumbs = $new_crumbs;
	}

	return $crumbs;
}
// меняем валюту на BYN
add_filter('woocommerce_currency_symbol', 'change_existing_currency_symbol', 10, 2);
function change_existing_currency_symbol($currency_symbol, $currency)
{
	switch ($currency) {
		case 'BYN':
			$currency_symbol = 'р';
			break;
	}
	return $currency_symbol;
}
// убирает ,00
//add_filter('woocommerce_price_trim_zeros', '__return_true');

add_filter('woocommerce_loop_add_to_cart_link', 'add_icon_span_to_loop_button', 10, 3);
function add_icon_span_to_loop_button($html, $product, $args)
{
	$text = esc_html($product->add_to_cart_text());

	// Добавляем span перед текстом кнопки
	$new_text = '<span class="add-to-cart-icon"></span><span class="add-to-cart-text">' . $text . '</span>';

	$html = str_replace($text, $new_text, $html);

	return $html;
}

function declension_items($number)
{
	$number = (int) $number;
	$last_two = $number % 100;
	$last_one = $number % 10;

	if ($last_two >= 11 && $last_two <= 19) {
		return 'товаров';
	}
	if ($last_one === 1) {
		return 'товар';
	}
	if ($last_one >= 2 && $last_one <= 4) {
		return 'товара';
	}
	return 'товаров';
}

?>