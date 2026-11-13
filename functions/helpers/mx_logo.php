<?php
function mx_logo($text = '', $image = '')
{
	if ($image) { ?>
		<a href="<?php echo esc_url(home_url('/')); ?>" class="logo__link-img">
			<?php echo wp_get_attachment_image(
				$image['ID'],
				'large',
				false,
				array(
					'class' => 'img',
					'alt' => $image['alt'] ?: ''
				)
			); ?>
		</a>
	<?php } else if (has_custom_logo()) {
		the_custom_logo();
	} else {
		?>
			<a href="<?php echo esc_url(home_url('/')); ?>" class="logo__link-text">
			<?php echo $text ?: get_bloginfo('name'); ?>
			</a>
		<?php
	}
}

