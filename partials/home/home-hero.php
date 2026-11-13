<?php
$title = get_field('home_hero_title') ?? '';
$descr = get_field('home_hero_descr') ?? '';
$btn = get_field('home_hero_btn') ?? [];
$image = get_field('home_hero_image') ?? null;
?>

<?php if ($title || $descr): ?>
	<section class="home-hero" id="home-hero">
		<div class="container home-hero__container">
			<div class="home-hero__wrapper">
				<div class="home-hero__content">
				<?php if ($title): ?>
					<h1 class="home-hero__title title-1">
						<?php echo esc_html($title); ?>
					</h1>
				<?php endif; ?>

				<?php if ($descr): ?>
					<div class="home-hero__descr descr">
						<?php echo wp_kses_post($descr); ?>
					</div>
				<?php endif; ?>

				<?php if (!empty($btn['url'])): ?>
					<a class="home-hero__btn btn" href="<?php echo esc_url($btn['url']); ?>" <?php if (!empty($btn['target'])): ?>
							target="<?php echo esc_attr($btn['target']); ?>" <?php endif; ?>>
						<?php echo esc_html($btn['title'] ?? 'Подробнее'); ?>
					</a>
				<?php endif; ?>
				</div>
				<?php if (!empty($image) && is_array($image) && !empty($image['ID'])): ?>
				<div class="home-hero__image image-box">
					<?php echo wp_get_attachment_image(
						$image['ID'],
						'large',
						false,
						array(
							'class' => 'img',
							'alt' => $image['alt'] ?: ''
						)
					); ?>
				</div>
			<?php endif; ?>
			</div>
		</div>
	</section>
<?php endif; ?>