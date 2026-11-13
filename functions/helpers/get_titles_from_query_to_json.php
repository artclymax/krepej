<?php
function get_titles_from_query_to_json($query)
{
	if (!($query instanceof WP_Query)) {
		return json_encode([], JSON_UNESCAPED_UNICODE);
	}

	$result = [];

	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$result[] = [
				'name' => get_the_title()
			];
		}
		wp_reset_postdata();
	}

	return json_encode($result, JSON_UNESCAPED_UNICODE);
}