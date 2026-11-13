<?php
$page_footer = 'option';
$page_contacts = 'option';

$logo = get_field('footer_logo', $page_footer) ?? '';
$footer_descr = get_field('footer_descr', $page_footer) ?? '';
$footer_links = get_field('footer_links', $page_footer) ?? [];

$phone_title = get_field('contacts_phone_title', $page_contacts) ?? [];
$phones = get_field('contacts_phones', $page_contacts) ?? [];
$emails = get_field('contacts_emails', $page_contacts) ?? [];
?>

<footer class="footer" id="footer">
	<div class="container footer__container">
		<div class="footer__top">
			<div class="footer__info">
				<div class="footer__logo logo">
					<?php mx_logo('', $logo); ?>
				</div>
				<?php if ($footer_descr): ?>
					<div class="footer__descr descr">
						<?php echo wp_kses_post($footer_descr); ?>
					</div>
				<?php endif; ?>
			</div>

			<nav class="footer__nav">
				<?php
				wp_nav_menu([
					'theme_location' => 'footer-menu',
					'container' => false,
					'menu_class' => 'footer-menu',
					'depth' => 1,
					'fallback_cb' => false,
				]);
				?>
			</nav>

			<div class="footer__contacts footer-contacts">
				<?php if (!empty($phone_title)): ?>
					<p class="footer-contacts__title">
						<?php echo esc_html($phone_title) ?>
					</p>
				<?php endif; ?>
				<?php if (!empty($phones)): ?>
					<ul class="footer-contacts__list footer-contacts__phones">
						<?php foreach ($phones as $phone): ?>
							<li class="footer-contacts__item">
								<a class="footer-contacts__link link" href="tel:<?= esc_attr(correct_phone($phone['phone'])) ?>">
									<?php echo esc_html($phone['phone']) ?>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
				<?php if (!empty($emails)): ?>
					<ul class="footer-contacts__list footer-contacts__emails">
						<?php foreach ($emails as $email): ?>
							<li class="footer-contacts__item">
								<a class="footer-contacts__link link" href="mailto:<?= esc_attr($email['email']) ?>">
									<?php echo esc_html($email['email']) ?>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</div>
		</div>

		<div class="footer__bottom">
			<div class="footer__bottom-links">
				<?php if (!empty($footer_links)): ?>
					<?php foreach ($footer_links as $item):
						$link = $item['footer_links_link'] ?? [];
						if (empty($link['url']))
							continue;
						?>
						<a class="footer__bottom-link" href="<?php echo esc_url($link['url']); ?>" <?php if (!empty($link['target'])): ?> target="<?php echo esc_attr($link['target']); ?>" <?php endif; ?>>
							<?php echo esc_html($link['title']); ?>
						</a>
					<?php endforeach; ?>
				<?php endif; ?>
			</div>
		</div>
	</div>
</footer>