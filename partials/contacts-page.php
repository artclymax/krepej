<?php

$phone_title_1 = get_field('contacts_phone_title', 'option') ?? '';
$phones_1 = get_field('contacts_phones', 'option') ?? [];
$phone_title_2 = get_field('contacts_phone_title_2', 'option') ?? '';
$phones_2 = get_field('contacts_phones_2', 'option') ?? [];
$emails = get_field('contacts_emails', 'option') ?? [];
$address = get_field('contacts_address', 'option') ?? '';
$map = get_field('contacts_map', 'option') ?? '';
?>

<section class="section page-contacts" id="page-contacts">
	<div class="container page-contacts__container">
		<div class="page-contacts__grid">
			<!-- Левая колонка: информация -->
			<div class="page-contacts__info">

				<?php if ($phone_title_1 || !empty($phones_1)): ?>
					<div class="page-contacts__phone-group">
						<?php if ($phone_title_1): ?>
							<h3 class="page-contacts__phone-group-title title-3">
								<?php echo esc_html($phone_title_1); ?>
							</h3>
						<?php endif; ?>
						<?php if (!empty($phones_1)): ?>
							<div class="page-contacts__phone-list">
								<?php foreach ($phones_1 as $phone_item):
									$phone_number = $phone_item['phone'] ?? '';
									if (!$phone_number)
										continue;
									?>
									<a class="page-contacts__phone-link link"
										href="tel:<?php echo esc_attr(correct_phone($phone_number)); ?>">
										<?php echo esc_html($phone_number); ?>
									</a>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<!-- Группа телефонов 2 (Бухгалтерия) -->
				<?php if ($phone_title_2 || !empty($phones_2)): ?>
					<div class="page-contacts__phone-group">
						<?php if ($phone_title_2): ?>
							<h3 class="page-contacts__phone-group-title title-3">
								<?php echo esc_html($phone_title_2); ?>
							</h3>
						<?php endif; ?>
						<?php if (!empty($phones_2)): ?>
							<div class="page-contacts__phone-list">
								<?php foreach ($phones_2 as $phone_item):
									$phone_number = $phone_item['phone'] ?? '';
									if (!$phone_number)
										continue;
									?>
									<a class="page-contacts__phone-link link"
										href="tel:<?php echo esc_attr(correct_phone($phone_number)); ?>">
										<?php echo esc_html($phone_number); ?>
									</a>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<!-- Email -->
				<?php if (!empty($emails)): ?>
					<div class="page-contacts__phone-group page-contacts__emails-group">
						<h3 class="page-contacts__phone-group-title title-3">
							Email:
						</h3>
						<div class="page-contacts_phones">
							<?php foreach ($emails as $email_item):
								$email = $email_item['email'] ?? '';
								if (!$email)
									continue;
								?>
								<a class="page-contacts__phone-link link" href="mailto:<?php echo esc_attr($email); ?>">
									<?php echo esc_html($email); ?>
								</a>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endif; ?>

				<!-- Адреса (WYSIWYG) -->
				<?php if ($address): ?>
					<div class="page-contacts__address title-3 descr">
						<?php echo wp_kses_post($address); ?>
					</div>
				<?php endif; ?>

			</div>

			<!-- Правая колонка: карта -->
			<?php if ($map): ?>
				<div class="page-contacts__map">
					<?php echo wp_kses($map, [
						'iframe' => [
							'src' => true,
							'width' => true,
							'height' => true,
							'style' => true,
							'allowfullscreen' => true,
							'loading' => true,
							'frameborder' => true,
						],
					]); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>