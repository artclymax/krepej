<?php
$class = $args['class'] ?? '';
$socials = get_field('contacts_socials', 'option') ?? [];

if (!empty($socials)):
	?>
	<div class="socials <?= esc_attr($class) ?>">
		<?php foreach ($socials as $social):
			$social_link = $social['link'] ?? [];
			$image = $social['image'] ?? [];
			if (empty($social_link['url']))
				continue;
			?>
			<a class="social-link link-icon" href="<?php echo esc_attr($social_link['url']); ?>" target="_blank"
				rel="noopener noreferrer">
				<?php echo wp_get_attachment_image(
					$image['ID'],
					'large',
					false,
					array(
						'class' => 'img',
						'alt' => $image['alt'] ?: $social_link['title']
					)
				); ?>
			</a>
		<?php endforeach; ?>
	</div>
<?php endif; ?>