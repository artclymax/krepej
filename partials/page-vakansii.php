<?php
$args = [
	'post_type' => 'vacancies',
	'posts_per_page' => -1,
	'orderby' => 'menu_order',
	'order' => 'ASC'
];

$vacancies_query = new WP_Query($args);

?>

<section class="section archive-vacancies" id="archive-vacancies">
	<div class="container archive-vacancies__container">

		<?php if ($vacancies_query->have_posts()): ?>
			<div class="archive-vacancies__list">
				<?php while ($vacancies_query->have_posts()):
					$vacancies_query->the_post();

					$location = get_field('vacancy_location') ?? '';
					$salary = get_field('vacancy_salary') ?? '';
					$descr = apply_filters('the_content', get_the_content()) ?? '';
					?>
					<div class="archive-vacancies__item vacancy-card">
						<div class="vacancy-card__info">
							<h3 class="vacancy-card__title title-3">
								<?php the_title(); ?>
							</h3>
							<?php if ($location): ?>
								<span class="vacancy-card__location">
									<?php echo esc_html($location); ?>
								</span>
							<?php endif; ?>
						</div>

						<?php if ($salary): ?>
							<div class="vacancy-card__salary title-3">
								<?php echo esc_html($salary); ?>
							</div>
						<?php endif; ?>

						<?php if (!empty($descr)): ?>
							<div class="vacancy-card__descr descr">
								<?php echo wp_kses_post($descr) ?>
							</div>
						<?php endif; ?>

						<a class="vacancy-card__btn btn" type="button" href="#modal-job"
							data-modal-title="<?php echo esc_attr(get_the_title()); ?>">
							Откликнуться
						</a>


					</div>
				<?php endwhile;
				wp_reset_postdata(); ?>
			</div>


		<?php else: ?>
			<p class="archive-vacancies__empty">На данный момент открытых вакансий нет.</p>
		<?php endif; ?>
	</div>
</section>