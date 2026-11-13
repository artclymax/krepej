<?php
$class = $args['class'] ?? '';
$emails = get_field('contacts_emails', 'option') ?? [];

if (!empty($emails)): ?>
	<ul class="contacts-list contacts-list--emails <?= esc_attr($class) ?>">
		<?php foreach ($emails as $email): ?>
			<li class="contacts-list__item">
				<a class="contacts-list__link link" href="mailto:<?= esc_attr($email['email']) ?>" target="_blank">
					<?php echo esc_html($email['email']) ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
<?php endif; ?>