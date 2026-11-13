<?php
$title = get_field('section_form_title', 'option') ?? '';
$descr = get_field('section_form_descr', 'option') ?? '';
$image = get_field('section_form_image', 'option') ?? null;
$shortcode = get_field('section_form_shortcode', 'option') ?? '';
?>

<?php if ($title || $descr || $shortcode): ?>
	<section class="section section-form" id="section-form">
		<div class="container section-form__container">
			<div class="section-form__grid">
				<div class="section-form__content">
					<?php if ($title): ?>
						<h2 class="section-form__title title-2">
							<?php echo esc_html($title); ?>
						</h2>
					<?php endif; ?>

					<?php if ($descr): ?>
						<div class="section-form__descr descr">
							<?php echo wp_kses_post($descr); ?>
						</div>
					<?php endif; ?>

					<?php if ($shortcode): ?>
						<div class="section-form__form">
							<?php echo do_shortcode($shortcode); ?>
						</div>
					<?php endif; ?>
				</div>

				<?php if (!empty($image) && is_array($image) && !empty($image['ID'])): ?>
					<div class="section-form__image image-box">
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
			</div>
		</div>
	</section>
<?php endif; ?>