<?php
$class = $args['class'] ?? '';
$is_address = $args['is_address'] ?? false;
$descr = $args['descr'] ?? '';

if ($is_address): ?>
	<address class="contacts-descr descr contacts-address <?= esc_attr($class) ?>">
		<?php echo wp_kses_post($descr); ?>
	</address>
<?php else: ?>
	<div class="contacts-descr descr <?= esc_attr($class) ?>">
		<?php echo wp_kses_post($descr); ?>
	</div>
<?php endif; ?>