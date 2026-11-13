<?php
$title = get_field('thank_you_title', 'option') ?? '';
$descr = get_field('thank_you_descr', 'option') ?? '';
$btn = get_field('thank_you_btn', 'option') ?? [];

if (empty($btn['url'])) {
	$btn = [
		'url' => home_url('/'),
		'title' => 'На главную',
	];
}
?>
<section class="page-404 section-full hero-thank-you" id="thank-you">
	<div class=" container page-404__container">
		<div class="page-404__hero">
			<div class="page-404__breadcrumbs">
				<div class="page-breadcrumbs">
					<?php if (function_exists('bcn_display')) {
						bcn_display();
					} ?>
				</div>
			</div>
			<?php if ($title): ?>
				<h1 class="page-404__title title-2"><?php echo esc_html($title); ?></h1>
			<?php endif; ?>
		</div>
		<div class="page-404__content">
			<div class="page-success-order__icon icon icon--success">
			</div>
			<?php if ($descr): ?>
				<div class="page-404__descr descr"><?php echo wp_kses_post($descr); ?></div>
			<?php endif; ?>
			<?php if (!empty($btn) && !empty($btn['url'])): ?>
				<a class="page-404__btn btn" href="<?php echo esc_url($btn['url']); ?>" <?php if (!empty($btn['target'])): ?>
						target="<?php echo esc_attr($btn['target']); ?>" <?php endif; ?>><?php echo esc_html($btn['title']); ?></a>
			<?php endif; ?>
		</div>
	</div>
</section>