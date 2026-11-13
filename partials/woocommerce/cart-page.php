<?php

defined('ABSPATH') || exit;

/* ========== 1) ОБРАБОТКА СМЕНЫ КОЛИЧЕСТВА ИЗ POST — ДО ВЫВОДА HTML ========== */
if (function_exists('WC') && WC()->cart && !empty($_POST['pc_update_qty'])) {
	$pc_nonce_in = isset($_POST['pc_nonce']) ? wc_clean(wp_unslash($_POST['pc_nonce'])) : '';
	$pc_key_in = isset($_POST['pc_key']) ? wc_clean(wp_unslash($_POST['pc_key'])) : '';
	$pc_qty_in = isset($_POST['pc_qty']) ? wc_clean(wp_unslash($_POST['pc_qty'])) : '';

	if ($pc_nonce_in && wp_verify_nonce($pc_nonce_in, 'pc-cart-update') && '' !== $pc_key_in && '' !== $pc_qty_in) {
		$pc_cart_item = WC()->cart->get_cart_item($pc_key_in);

		if ($pc_cart_item) {
			$pc_prod = $pc_cart_item['data'];
			$pc_q = wc_stock_amount($pc_qty_in);
			$pc_min = max(0, (int) $pc_prod->get_min_purchase_quantity());
			$pc_max = (int) $pc_prod->get_max_purchase_quantity();

			if ($pc_prod->is_sold_individually()) {
				$pc_max = 1;
			} elseif ($pc_max < 0) {
				$pc_max = 999999; // -1 = без лимита
			}

			$pc_q = max($pc_min, min($pc_max, $pc_q));
			if ($pc_q <= 0) {
				$pc_q = 1;
			}

			WC()->cart->set_quantity($pc_key_in, $pc_q);
			WC()->cart->calculate_totals();
		}
	}
}


$pc_inquire_text = apply_filters('pc_cart_inquire_text', __('Уточняйте наличие и цену'));

$pc_page_url = get_permalink(get_queried_object_id());
if (!$pc_page_url) {
	$pc_page_url = wc_get_cart_url();
}
?>

<section class="section pc-cart-wrap woocommerce" id="pc-cart-wrap">
	<div class="pc-cart-wrap__container container section-gap">

		<div class="pc-cart-wrap__hero">
			<div class="pc-cart-wrap__breadcrumbs">
				<div class="page-breadcrumbs">
					<?php if (function_exists('bcn_display')) {
						bcn_display();
					} ?>
				</div>
			</div>
			<h1 class="pc-cart-title title-2"><?php esc_html_e('Корзина'); ?></h1>
		</div>

		<?php if (!WC()->cart || WC()->cart->is_empty()): ?>

			<div class="pc-cart-empty">
				<p><?php esc_html_e('Ваша корзина пуста.'); ?></p>
				<a class="pc-btn btn"
					href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>"><?php esc_html_e('Перейти в магазин'); ?></a>
			</div>

		<?php else: ?>

			<div class="pc-cart-columns">

				<form class="woocommerce-cart-form pc-cart-form" action="<?php echo esc_url($pc_page_url); ?>" method="post">

					<?php do_action('woocommerce_before_cart_contents'); ?>

					<?php
					/* ---------- Подсчёт сумм для правого блока ---------- */
					$pc_regular_sum = 0.0;
					$pc_current_sum = 0.0;
					$pc_priced = 0;
					$pc_count = 0;

					foreach (WC()->cart->get_cart() as $pc_item) {
						$pc_count += $pc_item['quantity'];
						$pc_product = $pc_item['data'];
						$pc_base = $pc_product->get_price();

						// Цены нет (пустая или 0) => "Уточняйте наличие и цену", в суммы не входит.
						if ('' === $pc_base || null === $pc_base || (float) $pc_base <= 0) {
							continue;
						}

						$pc_priced++;
						$pc_cur = (float) wc_get_price_to_display($pc_product, array('price' => (float) $pc_base));
						$pc_reg = (float) wc_get_price_to_display($pc_product, array('price' => (float) $pc_product->get_regular_price()));
						if ($pc_reg <= 0) {
							$pc_reg = $pc_cur;
						}
						$pc_current_sum += $pc_cur * $pc_item['quantity'];
						$pc_regular_sum += $pc_reg * $pc_item['quantity'];
					}

					$pc_all_inquire = (0 === $pc_priced);

					$pc_coupon = (float) WC()->cart->get_discount_total();
					if (wc_tax_enabled() && 'incl' === get_option('woocommerce_tax_display_cart')) {
						$pc_coupon += (float) WC()->cart->get_discount_tax();
					}
					$pc_discount = max(0, $pc_regular_sum - $pc_current_sum) + $pc_coupon;
					$pc_total = max(0, $pc_current_sum - $pc_coupon);

					// Склонение: 1 товар / 2 товара / 5 товаров.
					$pc_count = (int) $pc_count;
					$pc_mod10 = $pc_count % 10;
					$pc_mod100 = $pc_count % 100;
					if (1 === $pc_mod10 && 11 !== $pc_mod100) {
						$pc_count_label = __('товар');
					} elseif ($pc_mod10 >= 2 && $pc_mod10 <= 4 && ($pc_mod100 < 10 || $pc_mod100 >= 20)) {
						$pc_count_label = __('товара');
					} else {
						$pc_count_label = __('товаров');
					}
					?>

					<?php foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item):
						$_product = apply_filters('woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key);

						if (!$_product || !$_product->exists() || $cart_item['quantity'] <= 0) {
							continue;
						}

						$pc_base_price = $_product->get_price();
						$pc_is_inquire = ('' === $pc_base_price || null === $pc_base_price || (float) $pc_base_price <= 0);

						$pc_cur_unit = $pc_is_inquire ? 0.0 : (float) wc_get_price_to_display($_product, array('price' => (float) $pc_base_price));
						$pc_reg_unit = $pc_is_inquire ? 0.0 : (float) wc_get_price_to_display($_product, array('price' => (float) $_product->get_regular_price()));
						if ($pc_reg_unit <= 0) {
							$pc_reg_unit = $pc_cur_unit;
						}
						$pc_cur_line = $pc_cur_unit * $cart_item['quantity'];
						$pc_reg_line = $pc_reg_unit * $cart_item['quantity'];

						$pc_permalink = apply_filters('woocommerce_cart_item_permalink', $_product->get_permalink($cart_item), $cart_item, $cart_item_key);
						$pc_sku = $_product->get_sku();

						// Название товара БЕЗ значений вариаций (чистое название родительского товара).
						$pc_display_name = $_product->get_name();
						if ($_product->is_type('variation') && $_product->get_parent_id()) {
							$pc_parent = wc_get_product($_product->get_parent_id());
							if ($pc_parent) {
								$pc_display_name = $pc_parent->get_name();
							}
						}
						// ВАЖНО: -1 (без лимита) => пустой max.
						$pc_max = $_product->get_max_purchase_quantity();
						if ($pc_max < 0) {
							$pc_max = '';
						}

						// Удаление: штатный обработчик, остаёмся на этой странице.
						$pc_remove_url = add_query_arg(
							array(
								'remove_item' => $cart_item_key,
								'_wpnonce' => wp_create_nonce('woocommerce-cart'),
							),
							$pc_page_url
						);
						?>

						<div class="pc-cart-item" data-cart-item-key="<?php echo esc_attr($cart_item_key); ?>">

							<a class="pc-thumb" href="<?php echo esc_url($pc_permalink); ?>">
								<?php echo wp_kses_post($_product->get_image('woocommerce_thumbnail')); ?>
							</a>

							<div class="pc-info">
								<a class="pc-name"
									href="<?php echo esc_url($pc_permalink); ?>"><?php echo wp_kses_post($pc_display_name); ?></a>
								<?php if ($pc_sku): ?>
									<div class="pc-sku"><?php esc_html_e('Арт.'); ?> 			<?php echo esc_html($pc_sku); ?></div>
								<?php endif; ?>
							</div>

							<div class="pc-options">
								<?php
								/* Вариации: атрибут и значение, напр. "Фасовка: 100 шт" */
								if (!empty($cart_item['variation'])):
									foreach ($cart_item['variation'] as $pc_attr_name => $pc_attr_value):
										if ('' === $pc_attr_value || null === $pc_attr_value) {
											continue;
										}
										$pc_label = wc_attribute_label(str_replace('attribute_', '', $pc_attr_name), $_product);
										?>
										<div class="pc-variation">
											<span class="pc-variation-label"><?php echo esc_html($pc_label); ?>:</span>
											<span class="pc-variation-value"><?php echo esc_html($pc_attr_value); ?></span>
										</div>
										<?php
									endforeach;
								endif;
								?>

								<?php if (!$_product->is_sold_individually()): ?>
									<div class="pc-qty">
										<button type="button" class="pc-qty-btn" data-qty-step="-1"
											aria-label="<?php esc_attr_e('Уменьшить количество'); ?>">-</button>
										<?php
										woocommerce_quantity_input(
											array(
												'input_name' => "cart[{$cart_item_key}][qty]",
												'input_value' => $cart_item['quantity'],
												'max_value' => $pc_max,
												'min_value' => $_product->get_min_purchase_quantity(),
												'product_name' => $pc_display_name,
											),
											$_product
										);
										?>
										<button type="button" class="pc-qty-btn" data-qty-step="1"
											aria-label="<?php esc_attr_e('Увеличить количество'); ?>">+</button>
									</div>
								<?php else: ?>
									<span class="pc-sku"><?php esc_html_e('1 шт.'); ?></span>
								<?php endif; ?>
							</div>

							<div class="pc-price-col">
								<?php if ($pc_is_inquire): ?>
									<div class="pc-price-inquire"><?php echo esc_html($pc_inquire_text); ?></div>
								<?php else: ?>
									<?php if ($pc_reg_line > $pc_cur_line): ?>
										<del class="pc-old-price"><?php echo wp_kses_post(wc_price($pc_reg_line)); ?></del>
									<?php endif; ?>
									<div class="pc-price"><?php echo wp_kses_post(wc_price($pc_cur_line)); ?></div>
								<?php endif; ?>
							</div>

							<a class="pc-remove" href="<?php echo esc_url($pc_remove_url); ?>"
								title="<?php esc_attr_e('Удалить'); ?>" aria-label="<?php esc_attr_e('Удалить товар'); ?>">
								<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M6.5 6.5L11.5 11.5M6.5 6.5L1.5 1.5M6.5 6.5L1.5 11.5M6.5 6.5L11.5 1.5"
										stroke-linecap="square" stroke="currentColor" />
								</svg>
							</a>
						</div>

					<?php endforeach; ?>

					<?php do_action('woocommerce_cart_contents'); ?>

					<!-- Скрытые поля собственного обработчика количества -->
					<input type="hidden" name="pc_update_qty" value="1" />
					<input type="hidden" name="pc_key" value="" />
					<input type="hidden" name="pc_qty" value="" />
					<?php wp_nonce_field('pc-cart-update', 'pc_nonce'); ?>

					<?php do_action('woocommerce_after_cart_contents'); ?>
				</form>

				<aside class="pc-cart-summary">
					<div class="pc-summary-row">
						<span class="pc-summary-label"><?php echo esc_html($pc_count . ' ' . $pc_count_label); ?></span>
						<span
							class="pc-summary-value"><?php echo $pc_all_inquire ? esc_html($pc_inquire_text) : wp_kses_post(wc_price($pc_regular_sum)); ?></span>
					</div>

					<?php if (!$pc_all_inquire && $pc_discount > 0): ?>
						<div class="pc-summary-row">
							<span class="pc-summary-label"><?php esc_html_e('Скидка'); ?></span>
							<span class="pc-summary-value"><?php echo wp_kses_post(wc_price($pc_discount)); ?></span>
						</div>
					<?php endif; ?>

					<div class="pc-summary-row pc-summary-total">
						<span class="pc-summary-label"><?php esc_html_e('Итого'); ?></span>
						<span
							class="pc-summary-value pc-total-value"><?php echo $pc_all_inquire ? esc_html($pc_inquire_text) : wp_kses_post(wc_price($pc_total)); ?></span>
					</div>

					<a class="pc-checkout-btn btn"
						href="<?php echo esc_url(wc_get_checkout_url()); ?>"><?php esc_html_e('Оформить заказ'); ?></a>
				</aside>

			</div>
			<?php do_action('woocommerce_after_cart'); ?>

		<?php endif; ?>
	</div>
</section>


<script>
	(function () {
		'use strict';

		/* Текст подтверждения. %s подставится как название товара. */
		var PC_CONFIRM = '<?php echo esc_js(__('Удалить товар «%s» из корзины?')); ?>';

		function bump(input, dir) {
			var step = parseFloat(input.getAttribute('step'));
			step = isNaN(step) || step <= 0 ? 1 : step;
			var min = parseFloat(input.getAttribute('min'));
			min = isNaN(min) ? 0 : min;
			var maxAttr = parseFloat(input.getAttribute('max'));
			var max = (isNaN(maxAttr) || maxAttr <= 0) ? Infinity : maxAttr; // пустой max = без лимита
			var val = parseFloat(input.value);
			val = isNaN(val) ? min : val + dir * step;
			val = Math.min(max, Math.max(min, val));
			val = Math.round(val / step) * step;
			input.value = String(parseFloat(val.toFixed(4)));
		}

		function showLoader() {
			var wrap = document.getElementById('pc-cart-wrap');
			if (wrap) { wrap.classList.add('pc-loading'); }
		}

		/* Кладём ключ товара и новое количество в скрытые поля и отправляем форму */
		function sendQty(itemEl, input) {
			var form = input.closest('form');
			if (!form || form.dataset.pcSending === '1') { return; }
			var k = form.querySelector('input[name="pc_key"]');
			var q = form.querySelector('input[name="pc_qty"]');
			if (!k || !q || !itemEl) { return; }
			k.value = itemEl.getAttribute('data-cart-item-key') || '';
			q.value = input.value;
			form.dataset.pcSending = '1';
			showLoader();
			form.submit();
		}

		/* Удаление товара с подтверждением (через рабочую ссылку remove_item + nonce) */
		function confirmRemove(itemEl) {
			var rm = itemEl ? itemEl.querySelector('.pc-remove') : null;
			if (!rm) { return; }
			var nameEl = itemEl.querySelector('.pc-name');
			var name = nameEl ? nameEl.textContent.trim() : '';
			if (window.confirm(PC_CONFIRM.replace('%s', name))) {
				showLoader();
				window.location.href = rm.getAttribute('href');
			}
		}

		document.addEventListener('click', function (e) {
			var btn = e.target.closest('.pc-qty-btn');
			if (btn) {
				e.preventDefault();
				var wrapQty = btn.closest('.pc-qty');
				var input = wrapQty ? wrapQty.querySelector('input.qty') : null;
				var item = btn.closest('.pc-cart-item');
				if (!input || !item) { return; }

				var dir = parseFloat(btn.getAttribute('data-qty-step')) || 0;

				/* Нажали "−" и количество уже минимальное (1) => удаление с подтверждением */
				if (dir < 0) {
					var step = parseFloat(input.getAttribute('step'));
					step = isNaN(step) || step <= 0 ? 1 : step;
					var min = parseFloat(input.getAttribute('min'));
					min = isNaN(min) ? 0 : min;
					var cur = parseFloat(input.value);
					cur = isNaN(cur) ? min : cur;

					if ((cur - step) < Math.max(min, 1)) {
						confirmRemove(item);
						return;
					}
				}

				bump(input, dir);
				sendQty(item, input);
				return;
			}

			/* Крестик "×": пока удаляет сразу */
			var rm = e.target.closest('.pc-remove');
			if (rm) {
				showLoader();
				// Если захотите confirm и на крестик — удалите showLoader() выше
				// и раскомментируйте две строки ниже:
				// e.preventDefault();
				// confirmRemove( rm.closest( '.pc-cart-item' ) );
			}
		});

		// Ручной ввод: по change (потеря фокуса) и по Enter
		document.addEventListener('change', function (e) {
			var t = e.target;
			if (t && t.classList && t.classList.contains('qty') && t.closest && t.closest('.pc-cart-form')) {
				sendQty(t.closest('.pc-cart-item'), t);
			}
		});
		document.addEventListener('keypress', function (e) {
			var t = e.target;
			if (t && t.classList && t.classList.contains('qty') && e.key === 'Enter') {
				e.preventDefault();
				sendQty(t.closest('.pc-cart-item'), t);
			}
		});

		// Кнопка "назад" браузера: убрать крутилку и разблокировать форму
		window.addEventListener('pageshow', function () {
			var wrap = document.getElementById('pc-cart-wrap');
			if (wrap) { wrap.classList.remove('pc-loading'); }
			var form = document.querySelector('.pc-cart-form');
			if (form) { delete form.dataset.pcSending; }
		});
	})();
</script>