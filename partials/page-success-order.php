<section class="section page-success-order" id="page-success-order">
	<div class="container page-success-order__container section-gap">
		<div class="page-success-order__hero page-success-order-hero">
			<div class="page-success-order-hero__breadcrumbs">
				<div class="page-breadcrumbs">
					<?php if (function_exists('bcn_display')) {
						bcn_display();
					} ?>
				</div>
			</div>
			<h1 class="page-success-order-hero__title title-2">
				<?php echo esc_html(get_the_title()) ?>
			</h1>
		</div>
		<div class="page-success-order__content">
			<div class="page-success-order__icon icon icon--success">
			</div>
			<div class="page-success-order__descr descr">
				<?php the_content(); ?>
			</div>
		</div>
	</div>
</section>