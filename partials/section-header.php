<?php
$class = $args['class'] ?? '';
$label = $args['label'] ?? '';
$title = $args['title'] ?? '';
$title_tag = $args['title_tag'] ?? 'h2';
$title_class = $args['title_class'] ?? 'title-2';
$descr = $args['descr'] ?? '';

if (!empty($label) || !empty($title) || !empty($descr)): ?>
	<div class="section-header <?= esc_attr($class) ?>">
		<?php if ($label): ?>
			<div class="section-header__label label">
				<?php echo esc_html($label); ?>
			</div>
		<?php endif; ?>

		<?php if ($title): ?>
			<<?= esc_attr($title_tag) ?> class="section-header__title <?= esc_attr($title_class) ?>">
				<?php echo esc_html($title); ?>
			</<?= esc_attr($title_tag) ?>>
		<?php endif; ?>

		<?php if ($descr): ?>
			<div class="section-header__descr descr">
				<?php echo wp_kses_post($descr); ?>
			</div>
		<?php endif; ?>
	</div>
<?php endif; ?>