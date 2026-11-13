<?php
$title = get_field('page_404_title', 'option') ?? 'Страница не найдена';
$descr = get_field('page_404_descr', 'option') ?? 'Возможно, она была удалена или адрес указан неверно.';
$btn = get_field('page_404_btn', 'option') ?? ['url' => home_url('/'), 'title' => 'Вернуться на главную'];

?>
<section class="page-404 section-full" id="page-404">
	<div class="container page-404__container">
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