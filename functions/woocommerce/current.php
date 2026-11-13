<?php
/**
 * 1. Разрешаем покупку товаров и вариаций без указанной цены
 */
add_filter('woocommerce_is_purchasable', 'custom_allow_empty_price_purchasable', 10, 2);
add_filter('woocommerce_variation_is_purchasable', 'custom_allow_empty_price_purchasable', 10, 2);
function custom_allow_empty_price_purchasable($purchasable, $product)
{
	if ('' === $product->get_price()) {
		$purchasable = true;
	}
	return $purchasable;
}

/**
 * 2. Делаем вариации с пустой ценой активными во фронтенде
 */
add_filter('woocommerce_variation_is_active', 'custom_allow_empty_price_variation_active', 10, 2);
function custom_allow_empty_price_variation_active($active, $variation)
{
	if ('' === $variation->get_price()) {
		return true;
	}
	return $active;
}

/**
 * 3. Заменяем пустую цену на текст «Уточнить наличие и цену»
 */
add_filter('woocommerce_empty_price_html', 'custom_empty_price_message', 10, 2);
function custom_empty_price_message($price, $product)
{
	return '<span class="price-on-request">Уточнить наличие и цену</span>';
}

/**
 * 4. Передаем наш текст в JSON-данные вариации, если цена вариации пустая или 0
 */
add_filter('woocommerce_available_variation', 'custom_variation_empty_price_data', 10, 3);
function custom_variation_empty_price_data($variation_data, $product, $variation)
{
	if ('' === $variation->get_price() || 0 == $variation->get_price()) {
		$variation_data['price_html'] = '<span class="price"><span class="price-on-request">Уточнить наличие и цену</span></span>';
	}
	return $variation_data;
}

/**
 * 5. При добавлении товара без цены в корзину устанавливаем техническую цену 0, 
 * чтобы не возникало ошибок при расчете итогов корзины
 */
add_action('woocommerce_before_calculate_totals', 'custom_set_zero_price_in_cart', 10, 1);
function custom_set_zero_price_in_cart($cart)
{
	if (is_admin() && !defined('DOING_AJAX'))
		return;

	foreach ($cart->get_cart() as $cart_item) {
		if ('' === $cart_item['data']->get_price()) {
			$cart_item['data']->set_price(0);
		}
	}
}


/**
 * 7. Автоматический выбор первой вариации по умолчанию, если в админке не задано иное
 */
add_filter('woocommerce_dropdown_variation_attribute_options_args', 'custom_select_first_variation_by_default', 10, 1);
function custom_select_first_variation_by_default($args)
{
	if (empty($args['selected']) && !empty($args['options'])) {
		$args['selected'] = $args['options'][0];
	}
	return $args;
}
/**
 * 9. Перехватываем добавление в корзину для вариативных товаров без созданной вариации (variation_id = 0)
 */
add_action('wp_loaded', 'custom_intercept_missing_variation_add_to_cart', 15);
function custom_intercept_missing_variation_add_to_cart()
{
	if (empty($_REQUEST['add-to-cart']) || !is_numeric(wp_unslash($_REQUEST['add-to-cart']))) {
		return;
	}

	$product_id = absint(wp_unslash($_REQUEST['add-to-cart']));
	$variation_id = isset($_REQUEST['variation_id']) ? absint(wp_unslash($_REQUEST['variation_id'])) : 0;
	$product = wc_get_product($product_id);

	// Если товар вариативный, но вариация не существует (variation_id == 0)
	if ($product && $product->is_type('variable') && empty($variation_id)) {
		$quantity = empty($_REQUEST['quantity']) ? 1 : wc_stock_amount(wp_unslash($_REQUEST['quantity']));

		// Собираем выбранные атрибуты из запроса (например, attribute_pa_fasovka)
		$custom_attributes = array();
		foreach ($_REQUEST as $key => $value) {
			if (strpos($key, 'attribute_') === 0 && '' !== $value) {
				$custom_attributes[sanitize_key($key)] = sanitize_text_field(wp_unslash($value));
			}
		}

		// Временно разрешаем добавление variable-товара без variation_id в сессию корзины
		$cart_item_data = array(
			'custom_missing_variation_attrs' => $custom_attributes,
			'unique_key' => md5(serialize($custom_attributes)), // Чтобы разные фасовки не сливались в одну строку
		);

		// Вручную формируем элемент корзины в обход жесткой проверки на variation_id в ядре WC
		$cart_id = WC()->cart->generate_cart_id($product_id, 0, array(), $cart_item_data);
		$cart_item_key = WC()->cart->find_product_in_cart($cart_id);

		$product->set_price(0);

		if ($cart_item_key) {
			$new_qty = $quantity + WC()->cart->cart_contents[$cart_item_key]['quantity'];
			WC()->cart->set_quantity($cart_item_key, $new_qty, false);
		} else {
			$cart_item_key = $cart_id;
			WC()->cart->cart_contents[$cart_item_key] = apply_filters(
				'woocommerce_add_cart_item',
				array_merge(
					$cart_item_data,
					array(
						'key' => $cart_item_key,
						'product_id' => $product_id,
						'variation_id' => 0,
						'variation' => array(),
						'quantity' => $quantity,
						'data' => $product,
						'data_hash' => wc_get_cart_item_data_hash($product),
					)
				),
				$cart_item_key
			);
		}

		WC()->cart->calculate_totals();

		// Выводим стандартное зеленое уведомление об успешном добавлении
		wc_add_to_cart_message(array($product_id => $quantity), true);

		// Убираем параметр add-to-cart, чтобы стандартный обработчик WC на приоритете 20 не выдал ошибку
		unset($_REQUEST['add-to-cart'], $_POST['add-to-cart'], $_GET['add-to-cart']);

		// Если в настройках включен редирект в корзину после добавления
		if ('yes' === get_option('woocommerce_cart_redirect_after_add')) {
			wp_safe_redirect(wc_get_cart_url());
			exit;
		}
	}
}
/**
 * 10. Разрешаем классу WC_Cart принимать родительский variable-товар напрямую (с ценой 0)
 */
add_action('woocommerce_before_calculate_totals', 'custom_handle_missing_variation_price_in_cart', 20, 1);
function custom_handle_missing_variation_price_in_cart($cart)
{
	if (is_admin() && !defined('DOING_AJAX'))
		return;

	foreach ($cart->get_cart() as $cart_item) {
		if (!empty($cart_item['custom_missing_variation_attrs']) || '' === $cart_item['data']->get_price()) {
			$cart_item['data']->set_price(0);
		}
	}
}

/**
 * 11. Выводим выбранные атрибуты (например, Фасовку) в корзине и при оформлении заказа, 
 * даже если вариация не существовала
 */
add_filter('woocommerce_get_item_data', 'custom_display_missing_variation_attrs_in_cart', 10, 2);
function custom_display_missing_variation_attrs_in_cart($item_data, $cart_item)
{
	if (!empty($cart_item['custom_missing_variation_attrs'])) {
		foreach ($cart_item['custom_missing_variation_attrs'] as $attr_key => $attr_val) {
			$taxonomy = str_replace('attribute_', '', $attr_key);
			$label = wc_attribute_label($taxonomy, $cart_item['data']);
			$term = get_term_by('slug', $attr_val, $taxonomy);
			$val_text = $term ? $term->name : $attr_val;

			$item_data[] = array(
				'key' => $label,
				'value' => $val_text,
			);
		}
	}
	return $item_data;
}

/**
 * 12. Сохраняем выбранные атрибуты несуществующей вариации в заказ (в админку и письма)
 */
add_action('woocommerce_checkout_create_order_line_item', 'custom_save_missing_variation_attrs_to_order', 10, 4);
function custom_save_missing_variation_attrs_to_order($item, $cart_item_key, $values, $order)
{
	if (!empty($values['custom_missing_variation_attrs'])) {
		foreach ($values['custom_missing_variation_attrs'] as $attr_key => $attr_val) {
			$taxonomy = str_replace('attribute_', '', $attr_key);
			$label = wc_attribute_label($taxonomy);
			$term = get_term_by('slug', $attr_val, $taxonomy);
			$val_text = $term ? $term->name : $attr_val;

			$item->add_meta_data($label, $val_text, true);
		}
	}
}
/**
 * 13. Заменяем стандартное сообщение "Жаль, но товаров... не обнаружено" 
 * на наш блок "Уточнить наличие и цену" на уровне шаблона WooCommerce
 */
add_action('wp_footer', 'custom_override_unavailable_variation_template', 99);
function custom_override_unavailable_variation_template()
{
	if (!is_product())
		return;
	?>
	<script type="text/template" id="tmpl-unavailable-variation-template">
																	  <div class="woocommerce-variation-price">
																			<span class="price"><span class="price-on-request">Уточняйте наличие и цену</span></span>
																	  </div>
																 </script>
	<?php
}
//!=====================

/* ================= ОФОРМЛЕНИЕ ЗАКАЗА (ЧИСТОВАЯ ВЕРСИЯ) ================= */

/* 1. Хелперы для ACF (используются в шаблоне для вывода радио-кнопок) */
function pc_checkout_delivery_methods()
{
	$rows = function_exists('get_field') ? get_field('pc_delivery_methods', 'option') : array();
	if (!is_array($rows) || !$rows) {
		$rows = array(
			array('title' => __('Самовывоз со склада'), 'link' => array('url' => home_url('/warehouse/'), 'title' => __('склада'))),
			array('title' => __('Доставка курьером'), 'description' => __('(бесплатная от 500 р)')),
			array('title' => __('Доставка транспортной компанией')),
		);
	}
	$out = array();
	foreach ($rows as $row) {
		if (empty($row['title']))
			continue;
		$link = isset($row['link']) && is_array($row['link']) ? $row['link'] : array('url' => '', 'title' => '');
		$out[] = array(
			'title' => $row['title'],
			'description' => isset($row['description']) ? $row['description'] : '',
			'link' => array('url' => $link['url'], 'title' => $link['title']),
		);
	}
	return $out;
}

function pc_checkout_payment_methods()
{
	$rows = function_exists('get_field') ? get_field('pc_payment_methods', 'option') : array();
	if (!is_array($rows) || !$rows) {
		$rows = array(array('title' => __('Безналичный расчёт')));
	}
	$out = array();
	foreach ($rows as $row) {
		if (empty($row['title']))
			continue;
		$out[] = array(
			'title' => $row['title'],
			'description' => isset($row['description']) ? $row['description'] : '',
		);
	}
	return $out;
}

/* 2. Настройка полей чекаута */
add_filter('woocommerce_checkout_fields', 'pc_customize_checkout_fields');
function pc_customize_checkout_fields($fields)
{
	$fields['billing']['billing_first_name']['label'] = __('ФИО');
	$fields['billing']['billing_first_name']['placeholder'] = __('ФИО');
	$fields['billing']['billing_first_name']['required'] = true;
	$fields['billing']['billing_first_name']['class'] = array('form-row-first');
	unset($fields['billing']['billing_last_name']);
	$fields['billing']['billing_email']['placeholder'] = 'E-mail';
	$fields['billing']['billing_email']['class'] = array('form-row-last');

	foreach (array('billing_company', 'billing_phone', 'billing_country', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_state', 'billing_postcode') as $k) {
		unset($fields['billing'][$k]);
	}

	$company = array('billing_unp', 'billing_legal_address', 'billing_postal_address', 'billing_iban', 'billing_bank', 'billing_bank_code', 'billing_bank_address');
	$labels = array('УНП', 'Юр адрес компании', 'Почтовый адрес компании', 'Расчетный счет (IBAN)', 'Банк', 'Код банка', 'Адрес банка');
	$i = 0;
	foreach ($company as $k => $field) {
		$fields['billing'][$field] = array('type' => 'text', 'label' => __($labels[$k]), 'placeholder' => __($labels[$k]), 'required' => false, 'class' => array($i % 2 === 0 ? 'form-row-first' : 'form-row-last'));
		$i++;
	}

	foreach (array('shipping_first_name', 'shipping_last_name', 'shipping_company', 'shipping_country', 'shipping_city', 'shipping_state', 'shipping_postcode', 'shipping_phone') as $k) {
		unset($fields['shipping'][$k]);
	}
	$fields['shipping']['shipping_address_1']['label'] = __('Улица');
	$fields['shipping']['shipping_address_1']['placeholder'] = __('Улица');
	$fields['shipping']['shipping_address_1']['required'] = false;
	$fields['shipping']['shipping_address_1']['class'] = array('form-row-first');
	$fields['shipping']['shipping_address_2']['label'] = __('Дом');
	$fields['shipping']['shipping_address_2']['placeholder'] = __('Дом');
	$fields['shipping']['shipping_address_2']['required'] = false;
	$fields['shipping']['shipping_address_2']['class'] = array('form-row-last');
	$fields['shipping']['shipping_building'] = array('type' => 'text', 'label' => __('Корпус'), 'placeholder' => __('Корпус'), 'required' => false, 'class' => array('form-row-first'));
	$fields['shipping']['shipping_office'] = array('type' => 'text', 'label' => __('Офис'), 'placeholder' => __('Офис'), 'required' => false, 'class' => array('form-row-last'));

	$fields['order']['order_comments']['label'] = __('Комментарий к заказу');
	$fields['order']['order_comments']['placeholder'] = __('Комментарий к заказу');
	$fields['order']['order_comments']['required'] = false;
	$fields['order']['order_comments']['class'] = array('form-row-wide', 'pc-full');

	return $fields;
}

/* 3. Валидация */
add_action('woocommerce_after_checkout_validation', 'pc_validate_checkout', 10, 2);
function pc_validate_checkout($data, $errors)
{
	// Проверяем доставку (наше кастомное поле из ACF)
	if (empty($_POST['pc_delivery_method'])) {
		$errors->add('pc_delivery_method', __('Выберите способ доставки.'));
	}

	// Проверяем оплату (теперь это стандартное поле payment_method)
	if (empty($_POST['payment_method'])) {
		$errors->add('payment_method', __('Выберите способ оплаты.'));
	}

	// Проверяем согласие
	if (empty($_POST['consent_pd'])) {
		$errors->add('consent_pd', __('Необходимо согласие с политикой обработки персональных данных.'));
	}
}
/* 4. Сохранение данных заказа (исправленная версия) */
add_action('woocommerce_checkout_order_created', 'pc_save_checkout_data', 10, 1);
function pc_save_checkout_data($order)
{
	if (!$order || !is_object($order)) {
		return;
	}

	try {
		// 1. Доставка
		if (isset($_POST['pc_delivery_method'])) {
			$delivery = sanitize_text_field(wp_unslash($_POST['pc_delivery_method']));
			if (!empty($delivery)) {
				$order->update_meta_data('_pc_delivery_method', $delivery);
			}
		}

		// 2. Оплата
		if (isset($_POST['payment_method'])) {
			$payment_method = sanitize_text_field(wp_unslash($_POST['payment_method']));
			if (!empty($payment_method) && class_exists('WC_Payment_Gateways')) {
				$gateways = WC()->payment_gateways->get_available_payment_gateways();
				if (isset($gateways[$payment_method]) && is_object($gateways[$payment_method])) {
					$gateway_title = $gateways[$payment_method]->get_title();
					$order->update_meta_data('_pc_payment_method', $gateway_title);
					$order->set_payment_method_title($gateway_title);
				}
			}
		}

		// 3. Согласие
		if (!empty($_POST['consent_pd'])) {
			$order->update_meta_data('_pc_consent_pd', 'Принято');
		}

		$order->save();
	} catch (Exception $e) {
		// Логируем ошибку, но не прерываем оформление заказа
		error_log('Ошибка сохранения данных заказа: ' . $e->getMessage());
	}
}

/* 5. Переименование строки доставки в заказе */
add_action('woocommerce_checkout_create_order_shipping_item', 'pc_rename_shipping', 10, 4);
function pc_rename_shipping($item, $package_key, $package, $order)
{
	$delivery = isset($_POST['pc_delivery_method']) ? sanitize_text_field(wp_unslash($_POST['pc_delivery_method'])) : '';
	if ($delivery) {
		$item->set_method_title($delivery);
	}
}

/* 6. Письмо */
add_action('woocommerce_email_after_order_table', 'pc_email_extra', 10, 4);
function pc_email_extra($order, $sent_to_admin, $plain_text, $email)
{
	if ($plain_text || !$order)
		return;

	$rows = array(
		array(__('Контактное лицо (ФИО)'), $order->get_billing_first_name()),
		array('E-mail', $order->get_billing_email()),
	);

	$company = array('_billing_unp' => 'УНП', '_billing_legal_address' => 'Юр адрес', '_billing_postal_address' => 'Почтовый адрес', '_billing_iban' => 'IBAN', '_billing_bank' => 'Банк', '_billing_bank_code' => 'Код банка', '_billing_bank_address' => 'Адрес банка');
	foreach ($company as $meta => $label) {
		$v = $order->get_meta($meta);
		if ($v)
			$rows[] = array(__($label), $v);
	}

	$addr = array_filter(array($order->get_shipping_address_1(), $order->get_shipping_address_2(), $order->get_meta('_shipping_building') ? 'корп. ' . $order->get_meta('_shipping_building') : '', $order->get_meta('_shipping_office') ? 'офис ' . $order->get_meta('_shipping_office') : ''));
	if ($addr)
		$rows[] = array(__('Адрес доставки'), implode(', ', $addr));

	$d = $order->get_meta('_pc_delivery_method');
	if ($d)
		$rows[] = array(__('Доставка'), $d);

	$p = $order->get_meta('_pc_payment_method');
	if ($p)
		$rows[] = array(__('Оплата'), $p);

	if ($order->get_meta('_pc_consent_pd'))
		$rows[] = array(__('Согласие на обработку ПД'), $order->get_meta('_pc_consent_pd'));
	if ($order->get_customer_note())
		$rows[] = array(__('Комментарий'), $order->get_customer_note());

	echo '<h2 style="font-size:16px;margin:24px 0 10px;">Дополнительные данные заказа</h2><table style="width:100%;border:1px solid #e4e6e8;border-collapse:collapse;">';
	foreach ($rows as $r) {
		if (empty($r[1]))
			continue;
		echo '<tr><td style="border-bottom:1px solid #eee;padding:8px 12px;width:40%;"><strong>' . esc_html($r[0]) . ':</strong></td><td style="border-bottom:1px solid #eee;padding:8px 12px;">' . esc_html($r[1]) . '</td></tr>';
	}
	echo '</table>';
}

/* 7. Админка */
add_action('woocommerce_admin_order_data_after_billing_address', 'pc_admin_extra');
function pc_admin_extra($order)
{
	$map = array('_billing_unp' => 'УНП', '_billing_legal_address' => 'Юр адрес', '_billing_postal_address' => 'Почтовый адрес', '_billing_iban' => 'IBAN', '_billing_bank' => 'Банк', '_billing_bank_code' => 'Код банка', '_billing_bank_address' => 'Адрес банка', '_shipping_building' => 'Корпус', '_shipping_office' => 'Офис', '_pc_delivery_method' => 'Доставка', '_pc_payment_method' => 'Оплата', '_pc_consent_pd' => 'Согласие');
	echo '<div style="margin-top:10px;">';
	foreach ($map as $meta => $label) {
		$v = $order->get_meta($meta);
		if ($v)
			echo '<p><strong>' . $label . ':</strong> ' . esc_html($v) . '</p>';
	}
	echo '</div>';
}

/* 8. Редирект */
add_filter('woocommerce_get_checkout_order_received_url', 'pc_success_url', 10, 2);
function pc_success_url($url, $order)
{
	return add_query_arg(array('order' => $order->get_order_number(), 'key' => $order->get_order_key()), home_url('/success-order/'));
}

/* 9. Отключение штатного скрипта чекаута (защита от двойной отправки) */
add_action('wp_enqueue_scripts', function () {
	if (is_page() && 'page-checkout.php' === get_page_template_slug()) {
		wp_dequeue_script('wc-checkout');
	}
}, 100);

/* Убираем уведомления "Товар добавлен в корзину" на странице оформления заказа */
add_action('wp', 'pc_filter_checkout_notices');
function pc_filter_checkout_notices()
{
	if (is_checkout()) {
		$notices = WC()->session->get('wc_notices', array());
		// Удаляем сообщения об успехе и обычные заметки, оставляем только ошибки (error)
		unset($notices['success']);
		unset($notices['notice']);
		WC()->session->set('wc_notices', $notices);
	}
}

/* ========================================================================
	ЗАМЕНА "0 РУБ" НА "УТОЧНЯЙТЕ НАЛИЧИЕ И ЦЕНУ" (БЕЗОПАСНАЯ ВЕРСИЯ)
	======================================================================== */

// 1. Заменяем итоговую сумму заказа, если она равна 0
add_filter('woocommerce_get_formatted_order_total', 'pc_format_zero_order_total_safe', 10, 2);
function pc_format_zero_order_total_safe($formatted_total, $order)
{
	// Строгая проверка: $order должен быть объектом заказа
	if (!is_a($order, 'WC_Order')) {
		return $formatted_total;
	}

	if ((float) $order->get_total() === 0.0) {
		$inquire_text = apply_filters('pc_cart_inquire_text', __('Уточняйте наличие и цену', 'krepej'));
		return '<span class="woocommerce-Price-amount amount"><bdi>' . esc_html($inquire_text) . '</bdi></span>';
	}

	return $formatted_total;
}

// 2. Заменяем стоимость позиций в таблице заказа, если у товара нет цены
add_filter('woocommerce_order_formatted_line_subtotal', 'pc_format_zero_line_subtotal_safe', 10, 3);
function pc_format_zero_line_subtotal_safe($subtotal, $item, $order)
{
	// Строгая проверка: $item должен быть объектом и иметь метод get_product
	if (!is_object($item) || !method_exists($item, 'get_product')) {
		return $subtotal;
	}

	$product = $item->get_product();

	// Проверка: $product должен быть объектом товара
	if (!is_a($product, 'WC_Product')) {
		return $subtotal;
	}

	$price = $product->get_price();

	// Если цена пустая или равна 0
	if ('' === $price || null === $price || (float) $price === 0.0) {
		$inquire_text = apply_filters('pc_cart_inquire_text', __('Уточняйте наличие и цену', 'krepej'));
		return '<span class="woocommerce-Price-amount amount"><bdi>' . esc_html($inquire_text) . '</bdi></span>';
	}

	return $subtotal;
}
/* 10. Гарантированная очистка корзины после успешного оформления заказа */
add_action('woocommerce_checkout_order_processed', 'pc_clear_cart_after_order', 10, 3);
function pc_clear_cart_after_order($order_id, $posted_data, $order)
{
	if (WC()->cart) {
		WC()->cart->empty_cart();
	}
}