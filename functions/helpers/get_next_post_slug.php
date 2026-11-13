<?php
function get_next_post_slug($post_id = null)
{
	$post_id = $post_id ?: get_the_ID();

	// пробуем получить следующий
	$next = get_next_post(false);

	if (!$next) {
		// если нет — берём первый
		$posts = get_posts([
			'posts_per_page' => 1,
			'orderby' => 'date',
			'order' => 'ASC',
			'post_type' => get_post_type($post_id),
			'post_status' => 'publish',
		]);

		$next = $posts[0] ?? null;
	}

	return $next ? $next->post_name : null;
}

?>