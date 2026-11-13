<?php
$title = get_field('home_about_title') ?? '';
$descr = get_field('home_about_descr') ?? '';
$image = get_field('home_about_image') ?? null;
$features = get_field('home_about_features') ?? [];
?>

<?php if ($title || $descr || !empty($features)): ?>
	<section class="section home-about" id="home-about">
		<div class="container home-about__container section-gap">
			<div class="home-about__grid">
				<?php if (!empty($image) && is_array($image) && !empty($image['ID'])): ?>
					<div class="home-about__image image-box">
						<?php echo wp_get_attachment_image(
							$image['ID'],
							'large',
							false,
							array(
								'class' => 'img',
								'alt' => $image['alt'] ?: $title
							)
						); ?>
					</div>
				<?php endif; ?>

				<div class="home-about__content">
					<?php if ($title): ?>
						<h2 class="home-about__title title-2">
							<?php echo esc_html($title); ?>
						</h2>
					<?php endif; ?>

					<?php if ($descr): ?>
						<div class="home-about__descr descr">
							<?php echo wp_kses_post($descr); ?>
						</div>
					<?php endif; ?>
				</div>
			</div>

			<?php if (!empty($features)): ?>
				<div class="home-about__features grid">
					<?php foreach ($features as $feature):
						$icon = $feature['icon'] ?? null;
						$text = $feature['text'] ?? '';
						if (!$text)
							continue;
						?>
						<div class="home-about__feature feature-card">
							<?php if (!empty($icon) && is_array($icon) && !empty($icon['ID'])): ?>
								<div class="feature-card__icon">
									<?php echo wp_get_attachment_image(
										$icon['ID'],
										'thumbnail',
										false,
										array(
											'class' => 'img',
											'alt' => $text
										)
									); ?>
								</div>
							<?php endif; ?>

							<div class="feature-card__text title-3">
								<?php echo esc_html($text); ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>