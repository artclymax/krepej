<?php
$header_class = $args['class'] ?? '';
$phone_title = get_field('contacts_phone_title', 'option') ?? '';
$phones = get_field('contacts_phones', 'option') ?? [];

// WooCommerce cart
$cart_count = 0;
$cart_url = '';
if (class_exists('WooCommerce')) {
	$cart_count = WC()->cart->get_cart_contents_count();
	$cart_url = wc_get_cart_url();
}
?>

<header class="header <?php echo esc_attr($header_class); ?>" data-auto-calc="header, height">
	<div class="header__container container">
		<button class="header__burger-btn burger-btn visible-tablet" type="button" aria-label="Открыть меню">
			<span></span>
		</button>

		<!-- Logo -->
		<div class="header__logo logo">
			<?php mx_logo(); ?>
		</div>

		<div class="header__menu-wrapper">
			<!-- Catalog button (desktop) -->
			<button class="header__catalog-btn catalog-btn hidden-tablet" type="button" aria-label="Открыть меню каталога">
				<span class="catalog-btn__icon burger-btn">
					<span></span>
				</span>
				Каталог
			</button>

			<!-- Catalog menu -->
			<nav class="header__catalog header-catalog" aria-label="Категории">
				<div class="header-catalog__wrapper">
					<!-- Шапка (всегда видна) -->
					<div class="header-catalog__header">
						<button class="catalog-back-btn" type="button" aria-label="Назад" style="display: none;">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round" />
							</svg>
							Назад
						</button>
						<h2 class="catalog-title">Каталог</h2>
					</div>

					<!-- Контейнер для всех уровней меню -->
					<div class="header-catalog__levels">
						<div class="header-catalog__level header-catalog__level--0 is-active">
							<?php
							// Проверяем, есть ли назначенное меню для локации catalog-menu
							if (has_nav_menu('catalog-menu')) {
								// Меню назначено — выводим его
								wp_nav_menu([
									'theme_location' => 'catalog-menu',
									'container' => false,
									'menu_class' => 'header-catalog__list',
									'depth' => 3,
								]);
							} else {
								$categories = get_terms([
									'taxonomy' => 'product_cat',
									'parent' => 0,
									'hide_empty' => false,
									'orderby' => 'menu_order',
									'order' => 'ASC',
								]);

								if (!is_wp_error($categories) && !empty($categories)): ?>
									<ul class="header-catalog__list">
										<?php
										// Ссылка "Все категории"
										$shop_page_id = function_exists('wc_get_page_id') ? wc_get_page_id('shop') : 0;
										if ($shop_page_id > 0): ?>
											<li class="menu-item menu-item-type-post_type menu-item-object-page">
												<a href="<?php echo esc_url(get_permalink($shop_page_id)); ?>">Все категории</a>
											</li>
										<?php endif;

										$exclude_cats = ['misc'];

										foreach ($categories as $cat):
											if (in_array($cat->slug, $exclude_cats, true))
												continue;

											$cat_link = get_term_link($cat);
											if (is_wp_error($cat_link))
												continue;

											// Проверяем дочерние категории
											$children = get_terms([
												'taxonomy' => 'product_cat',
												'parent' => $cat->term_id,
												'hide_empty' => false,
												'orderby' => 'menu_order',
												'order' => 'ASC',
											]);

											$has_children = !is_wp_error($children) && !empty($children);
											$li_classes = ['menu-item', 'menu-item-type-taxonomy', 'menu-item-object-product_cat'];
											if ($has_children) {
												$li_classes[] = 'menu-item-has-children';
											}
											?>
											<li id="menu-item-<?php echo esc_attr($cat->term_id); ?>"
												class="<?php echo esc_attr(implode(' ', $li_classes)); ?>">
												<a href="<?php echo esc_url($cat_link); ?>"><?php echo esc_html($cat->name); ?></a>
												<?php if ($has_children): ?>
													<ul class="sub-menu">
														<?php foreach ($children as $child):
															if (in_array($child->slug, $exclude_cats, true))
																continue;
															$child_link = get_term_link($child);
															if (is_wp_error($child_link))
																continue;
															?>
															<li id="menu-item-<?php echo esc_attr($child->term_id); ?>"
																class="menu-item menu-item-type-taxonomy menu-item-object-product_cat">
																<a href="<?php echo esc_url($child_link); ?>"><?php echo esc_html($child->name); ?></a>
															</li>
														<?php endforeach; ?>
													</ul>
												<?php endif; ?>
											</li>
										<?php endforeach; ?>
									</ul>
								<?php endif;
							}
							?>
						</div>
					</div>
				</div>
			</nav>

			<div class="catalog-overlay"></div>

			<!-- Main menu -->
			<nav class="header__menu header-menu" aria-label="Главное меню">
				<div class="header-menu__wrapper">
					<?php
					wp_nav_menu([
						'theme_location' => 'header-menu',
						'container' => false,
						'menu_class' => 'header-menu__list hidden-tablet',
						'fallback_cb' => false,
						'depth' => 1,
					]);
					?>
					<?php
					wp_nav_menu([
						'theme_location' => 'footer-menu',
						'container' => false,
						'menu_class' => 'header-menu__list visible-tablet',
						'fallback_cb' => false,
						'depth' => 1,
					]);
					?>
				</div>
			</nav>

			<!-- Phones (desktop) -->
			<?php if (!empty($phones)): ?>
				<div class="header__phone-wrapper header-phone-box">
					<?php if (!empty($phone_title)): ?>
						<p class="header-phone-box__title">
							<?php echo esc_html($phone_title); ?>
						</p>
					<?php endif; ?>
					<?php foreach ($phones as $phone): ?>
						<a class="header-phone-box__link link" href="tel:<?= esc_attr(correct_phone($phone['phone'])) ?>">
							<?php echo esc_html($phone['phone']); ?>
						</a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>

		<!-- Phone button (mobile) -->
		<button class="header__phone-btn phone-btn visible-tablet" type="button" aria-label="Открыть телефоны">
			<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12.5397 7.59474C12.226 6.5484 12.0103 5.47515 11.8954 4.38887C11.7806 3.30586 10.8351 2.5 9.74624 2.5H4.69463C3.39517 2.5 2.39479 3.6225 2.50887 4.91611C3.66062 17.9539 14.0461 28.3386 27.0839 29.4911C28.3782 29.6052 29.5 28.6085 29.5 27.309V22.8044C29.5 21.1605 28.6941 20.2186 27.6111 20.1038C26.5249 19.9891 25.4516 19.7737 24.4053 19.4603C23.7849 19.2763 23.1263 19.2637 22.4993 19.4237C21.8723 19.5838 21.3003 19.9105 20.844 20.3693L18.6816 22.5316C14.782 20.419 11.581 17.2179 9.46836 13.3184L11.6307 11.156C12.0896 10.6998 12.4165 10.1278 12.5766 9.50082C12.7368 8.87384 12.7235 8.21519 12.5397 7.59474Z"
					stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" />
			</svg>
		</button>

		<!-- Cart button -->
		<?php if (class_exists('WooCommerce')): ?>
			<a class="header__cart cart-btn" href="<?php echo esc_url($cart_url); ?>" aria-label="Корзина">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M18.9174 4.40902H4.48072C4.36191 4.40902 4.26929 4.512 4.28184 4.63015L5.06439 11.9987C5.07671 12.1148 5.18538 12.1957 5.30009 12.1742L18.9493 9.61726C19.0314 9.60194 19.0909 9.53061 19.0909 9.44749V4.58175C19.0909 4.48636 19.0132 4.40902 18.9174 4.40902Z"
						fill="#F07F1C" />
					<path
						d="M3.47107 19.0908C2.51256 19.0908 1.73554 18.3175 1.73554 17.3636C1.73554 16.4096 2.51256 15.6363 3.47107 15.6363C4.42959 15.6363 5.20661 16.4096 5.20661 17.3636C5.20661 18.3175 4.42959 19.0908 3.47107 19.0908Z"
						fill="#F07F1C" />
					<path
						d="M15.6198 17.3636C15.6198 18.3175 16.3969 19.0908 17.3554 19.0908C18.3139 19.0908 19.0909 18.3175 19.0909 17.3636C19.0909 16.4096 18.3139 15.6363 17.3554 15.6363C16.3969 15.6363 15.6198 16.4096 15.6198 17.3636Z"
						fill="#F07F1C" />
					<path
						d="M17.3554 15.6363C18.3139 15.6363 19.0909 16.4096 19.0909 17.3636C19.0909 18.3175 18.3139 19.0908 17.3554 19.0908C16.3969 19.0908 15.6198 18.3175 15.6198 17.3636C15.6198 16.4096 16.3969 15.6363 17.3554 15.6363ZM17.3554 15.6363H3.96867C3.84233 15.6363 3.75833 15.5062 3.81079 15.3919L5.10157 12.5772C5.11446 12.5491 5.11954 12.518 5.11627 12.4873L3.99962 1.97269C3.99028 1.88481 3.91581 1.81812 3.82702 1.81812H0M18.9174 4.40902H4.48072C4.36191 4.40902 4.26929 4.512 4.28184 4.63015L5.06439 11.9987C5.07671 12.1148 5.18538 12.1957 5.30009 12.1742L18.9493 9.61726C19.0314 9.60194 19.0909 9.53061 19.0909 9.44749V4.58175C19.0909 4.48636 19.0132 4.40902 18.9174 4.40902ZM3.47107 19.0908C2.51256 19.0908 1.73554 18.3175 1.73554 17.3636C1.73554 16.4096 2.51256 15.6363 3.47107 15.6363C4.42959 15.6363 5.20661 16.4096 5.20661 17.3636C5.20661 18.3175 4.42959 19.0908 3.47107 19.0908Z"
						stroke-linecap="round" stroke-linejoin="round" stroke="#F07F1C" />
				</svg>

				<?php if ($cart_count > 0): ?>
					<span class="cart-btn__counter" data-cart-counter>
						<?php echo esc_html($cart_count); ?>
					</span>
				<?php endif; ?>
			</a>
		<?php endif; ?>
	</div>
</header>