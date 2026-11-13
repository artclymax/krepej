<?php
$class = $args['class'] ?? '';
$phones = get_field('contacts_phones', 'option') ?? [];

if (!empty($phones)): ?>
	<ul class="contacts-list contacts-list--phones <?= esc_attr($class) ?>">
		<?php foreach ($phones as $phone): ?>
			<li class="contacts-list__item">
				<a class="contacts-list__link link" href="tel:<?= esc_attr(correct_phone($phone['phone'])) ?>">
					<?php echo esc_html($phone['phone']) ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
<?php endif; ?>