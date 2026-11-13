<?php
/**
 * Template Name: Оформление заказа (WooCommerce)
 */

defined('ABSPATH') || exit;

get_header();

if (!class_exists('WooCommerce') || !WC()->cart) {
	echo '<div style="padding:40px;">WooCommerce не активен.</div>';
	get_footer();
	return;
}

$pc_fields = WC()->checkout()->get_checkout_fields();

$pc_render_field = function ($section, $key) use ($pc_fields) {
	if (!isset($pc_fields[$section][$key])) {
		return;
	}
	woocommerce_form_field($key, $pc_fields[$section][$key], WC()->checkout()->get_value($key));
};

/* Доставка из ACF */
$pc_delivery_methods = function_exists('pc_checkout_delivery_methods') ? pc_checkout_delivery_methods() : array();
$pc_posted_delivery = isset($_POST['pc_delivery_method']) ? wc_clean(wp_unslash($_POST['pc_delivery_method'])) : ''; // phpcs:ignore

if (!$pc_posted_delivery && !empty($pc_delivery_methods)) {
	$first_d = $pc_delivery_methods[0];
	$pc_posted_delivery = $first_d['title'];
	if (!empty($first_d['description'])) {
		$pc_posted_delivery .= ' ' . $first_d['description'];
	}
	if (!empty($first_d['link']['title'])) {
		$pc_posted_delivery .= ' ' . $first_d['link']['title'];
	}
}

/* ОПЛАТА: Динамически получаем все доступные шлюзы WooCommerce */
$pc_available_gateways = WC()->payment_gateways->get_available_payment_gateways();
$pc_chosen_gateway = isset($_POST['payment_method']) ? wc_clean(wp_unslash($_POST['payment_method'])) : ''; // phpcs:ignore

if (!$pc_chosen_gateway && !empty($pc_available_gateways)) {
	$gateway_keys = array_keys($pc_available_gateways);
	$pc_chosen_gateway = $gateway_keys[0];
}

/* ---------- Суммы для правого блока ---------- */
$pc_regular_sum = 0.0;
$pc_current_sum = 0.0;
$pc_priced = 0;
$pc_count = 0;

foreach (WC()->cart->get_cart() as $pc_item) {
	$pc_count += $pc_item['quantity'];
	$pc_product = $pc_item['data'];
	$pc_base = $pc_product->get_price();
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

$pc_count = (int) $pc_count;
$pc_mod10 = $pc_count % 10;
$pc_mod100 = $pc_count % 100;
if (1 === $pc_mod10 && 11 !== $pc_mod100) {
	$pc_count_label = __('товар', 'your-theme');
} elseif ($pc_mod10 >= 2 && $pc_mod10 <= 4 && ($pc_mod100 < 10 || $pc_mod100 >= 20)) {
	$pc_count_label = __('товара', 'your-theme');
} else {
	$pc_count_label = __('товаров', 'your-theme');
}

$pc_inquire_text = apply_filters('pc_cart_inquire_text', __('Уточняйте наличие и цену', 'your-theme'));

/* Получаем уведомления. Благодаря фильтру в functions.php, здесь останутся только ошибки валидации */
$pc_notices_html = wc_print_notices(true);
?>

<section class="pc-checkout-wrap woocommerce">
	<div class="pc-checkout-wrap__container container section-gap">
		<div class="pc-checkout-wrap__hero hero-page">
			<div class="hero-page__container">
				<div class="hero-page__breadcrumbs">
					<div class="page-breadcrumbs">
						<?php if (function_exists('bcn_display')) {
							bcn_display();
						} ?>
					</div>
				</div>
				<h1 class="pc-page-title title-2">
					<?php esc_html_e('Оформление заказа', 'your-theme'); ?>
				</h1>
			</div>
		</div>

		<!-- Умный блок уведомлений: показывается только если есть реальные ошибки -->
		<?php if ($pc_notices_html): ?>
			<div id="pc-checkout-notices" class="pc-notices">
				<?php echo $pc_notices_html; // phpcs:ignore WordPress.Security.EscapeOutput ?>
			</div>
		<?php else: ?>
			<div id="pc-checkout-notices" class="pc-notices" style="display: none;"></div>
		<?php endif; ?>

		<?php if (WC()->cart->is_empty()): ?>

			<div class="pc-cart-empty">
				<p><?php esc_html_e('Ваша корзина пуста.', 'your-theme'); ?></p>
				<a class="pc-btn" href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>">
					<?php esc_html_e('Перейти в магазин', 'your-theme'); ?>
				</a>
			</div>

		<?php else: ?>

			<form name="checkout" class="checkout pc-checkout-form" method="post"
				action="<?php echo esc_url(wc_get_checkout_url()); ?>">

				<div class="pc-checkout-columns">

					<div class="pc-checkout-fields">
						<div class="pc-checkout-fields-row">
							<div class="pc-section-title"><?php esc_html_e('Контактное лицо', 'your-theme'); ?></div>
							<div class="pc-grid">
								<?php
								$pc_render_field('billing', 'billing_first_name');
								$pc_render_field('billing', 'billing_email');
								?>
							</div>
						</div>

						<div class="pc-checkout-fields-row">
							<div class="pc-section-title"><?php esc_html_e('Данные о компании', 'your-theme'); ?></div>
							<div class="pc-grid">
								<?php
								$pc_render_field('billing', 'billing_unp');
								$pc_render_field('billing', 'billing_legal_address');
								$pc_render_field('billing', 'billing_postal_address');
								$pc_render_field('billing', 'billing_iban');
								$pc_render_field('billing', 'billing_bank');
								$pc_render_field('billing', 'billing_bank_code');
								$pc_render_field('billing', 'billing_bank_address');
								?>
							</div>
						</div>

						<div class="pc-checkout-fields-row">
							<div class="pc-section-title"><?php esc_html_e('Доставка', 'your-theme'); ?></div>
							<div class="pc-radio-list">
								<?php foreach ($pc_delivery_methods as $pc_m):
									$full_title = $pc_m['title'];
									if (!empty($pc_m['description'])) {
										$full_title .= ' ' . $pc_m['description'];
									}
									if (!empty($pc_m['link']['title'])) {
										$full_title .= ' ' . $pc_m['link']['title'];
									}
									?>
									<label class="pc-radio-row">
										<input type="radio" name="pc_delivery_method" value="<?php echo esc_attr($full_title); ?>" <?php checked($pc_posted_delivery, $full_title); ?> />
										<span class="pc-radio-label">
											<?php echo esc_html($pc_m['title']); ?>
											<?php if (!empty($pc_m['description'])): ?>
												<span class="pc-radio-note">(<?php echo esc_html($pc_m['description']); ?>)</span>
											<?php endif; ?>
											<?php if (!empty($pc_m['link']['url'])): ?>
												<a class="pc-radio-link" href="<?php echo esc_url($pc_m['link']['url']); ?>" target="_blank"
													rel="noopener">
													<?php echo esc_html($pc_m['link']['title']); ?>
												</a>
											<?php endif; ?>
										</span>
									</label>
								<?php endforeach; ?>
							</div>
						</div>

						<div class="pc-checkout-fields-row">
							<div class="pc-section-title"><?php esc_html_e('Адрес доставки', 'your-theme'); ?></div>
							<div class="pc-grid">
								<?php
								$pc_render_field('shipping', 'shipping_address_1');
								$pc_render_field('shipping', 'shipping_address_2');
								$pc_render_field('shipping', 'shipping_building');
								$pc_render_field('shipping', 'shipping_office');
								?>
							</div>
						</div>

						<!-- ДИНАМИЧЕСКИЙ ВЫВОД ШЛЮЗОВ ОПЛАТЫ WOOCOMMERCE -->
						<div class="pc-checkout-fields-row">
							<div class="pc-section-title"><?php esc_html_e('Оплата', 'your-theme'); ?></div>
							<div class="pc-radio-list">
								<?php if (!empty($pc_available_gateways)): ?>
									<?php foreach ($pc_available_gateways as $gateway_id => $gateway): ?>
										<label class="pc-radio-row">
											<input type="radio" name="payment_method" value="<?php echo esc_attr($gateway->id); ?>" <?php checked($pc_chosen_gateway, $gateway->id); ?> />
											<span class="pc-radio-label">
												<?php echo esc_html($gateway->get_title()); ?>
												
											</span>
										</label>
									<?php endforeach; ?>
								<?php else: ?>
									<p class="pc-muted"><?php esc_html_e('Способы оплаты недоступны.', 'your-theme'); ?></p>
								<?php endif; ?>
							</div>

							<div class="pc-grid pc-grid-comment">
								<?php $pc_render_field('order', 'order_comments'); ?>
							</div>
						</div>
					</div>

					<aside class="pc-cart-summary pc-checkout-summary">
						<div class="pc-summary-row">
							<span class="pc-summary-label"><?php echo esc_html($pc_count . ' ' . $pc_count_label); ?></span>
							<span
								class="pc-summary-value"><?php echo $pc_all_inquire ? esc_html($pc_inquire_text) : wp_kses_post(wc_price($pc_regular_sum)); ?></span>
						</div>

						<?php if (!$pc_all_inquire && $pc_discount > 0): ?>
							<div class="pc-summary-row">
								<span class="pc-summary-label"><?php esc_html_e('Скидка', 'your-theme'); ?></span>
								<span class="pc-summary-value"><?php echo wp_kses_post(wc_price($pc_discount)); ?></span>
							</div>
						<?php endif; ?>

						<div class="pc-summary-row pc-summary-total">
							<span class="pc-summary-label"><?php esc_html_e('Итого', 'your-theme'); ?></span>
							<span
								class="pc-summary-value pc-total-value"><?php echo $pc_all_inquire ? esc_html($pc_inquire_text) : wp_kses_post(wc_price($pc_total)); ?></span>
						</div>

						<label class="pc-terms-row">
							<span class="wpcf7-form-control wpcf7-acceptance">
								<span class="wpcf7-list-item">
									<label>
										<input type="checkbox" name="consent_pd" value="1" class="form-checkbox">
										<span class="wpcf7-list-item-label">
											<span class="form-checkbox-icon"></span>
											<span class="form-checkbox-text">Соглашаюсь с <a href="/policy" target="_blank"
													rel="noopener">Политикой обработки персональных данных</a></span>
										</span>
									</label>
								</span>
							</span>
						</label>

						<button type="submit" class="pc-checkout-btn btn" id="pc-place-order">
							<?php esc_html_e('Оформить заказ', 'your-theme'); ?>
						</button>
					</aside>

				</div>

				<!-- Скрытые поля для обработки WooCommerce -->
				<input type="hidden" name="woocommerce_checkout_place_order" value="1" />
				<?php wp_nonce_field('woocommerce-process_checkout', 'woocommerce-process-checkout-nonce'); ?>
			</form>

		<?php endif; ?>
	</div>
</section>

<script>
	(function () {
		'use strict';

		var form = document.querySelector('.pc-checkout-form');
		if (!form) return;

		var btn = document.getElementById('pc-place-order');
		var ajaxUrl = '<?php echo esc_url(WC_AJAX::get_endpoint('checkout')); ?>';
		var successUrl = '<?php echo esc_url(home_url('/success-order/')); ?>';

		var notices = document.getElementById('pc-checkout-notices');

		var busy = false;

		function showLoading() {
			if (btn) {
				btn.disabled = true;
				btn.dataset.originalText = btn.textContent;
				btn.textContent = 'Отправка...';
				btn.classList.add('pc-checkout-btn--loading');
			}
			form.classList.add('pc-checkout-form--loading');
		}

		function hideLoading() {
			if (btn) {
				btn.disabled = false;
				if (btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
				btn.classList.remove('pc-checkout-btn--loading');
			}
			form.classList.remove('pc-checkout-form--loading');
		}

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			if (e.stopImmediatePropagation) e.stopImmediatePropagation();
			if (busy) return;

			busy = true;
			showLoading();

			// Показываем контейнер, если он был скрыт, и очищаем старые ошибки
			notices.style.display = 'block';
			notices.innerHTML = '<ul class="woocommerce-info" role="status"><li>Обработка заказа...</li></ul>';

			var formData = new FormData(form);

			fetch(ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'X-Requested-With': 'XMLHttpRequest' },
				body: formData
			})
				.then(function (response) { return response.json(); })
				.then(function (res) {
					if (res && res.result === 'success') {
						window.location.href = res.redirect || successUrl;
						return;
					}

					busy = false;
					hideLoading();

					var html = '';
					if (res && res.messages) {
						html = (typeof res.messages === 'string') ? res.messages : Object.values(res.messages).join('');
					}

					if (!html) {
						html = '<ul class="woocommerce-error" role="alert"><li>Не удалось оформить заказ. Проверьте правильность заполнения полей.</li></ul>';
					}

					notices.innerHTML = html;
					window.scrollTo({ top: 0, behavior: 'smooth' });
				})
				.catch(function (error) {
					busy = false;
					hideLoading();
					console.error('Checkout error:', error);
					notices.style.display = 'block';
					notices.innerHTML = '<ul class="woocommerce-error" role="alert"><li>Ошибка соединения с сервером. Попробуйте ещё раз.</li></ul>';
					window.scrollTo({ top: 0, behavior: 'smooth' });
				});
		}, true);
	})();
</script>

<?php get_footer(); ?>