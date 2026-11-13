<?php
function get_prev_post_slug($post_id = null)
{
	$post_id = $post_id ?: get_the_ID();

	// пробуем получить предыдущий
	$prev = get_previous_post(false);

	if (!$prev) {
		// если нет — берём последний
		$posts = get_posts([
			'posts_per_page' => 1,
			'orderby' => 'date',
			'order' => 'DESC',
			'post_type' => get_post_type($post_id),
			'post_status' => 'publish',
		]);

		$prev = $posts[0] ?? null;
	}

	return $prev ? $prev->post_name : null;
}
?>