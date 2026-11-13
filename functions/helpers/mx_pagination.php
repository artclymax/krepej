<?php
function mx_pagination($wp_query, $prev_text = '« Previous', $next_text = 'Next »', $prev_next = true)
{
	echo paginate_links([
		'total' => $wp_query->max_num_pages,
		'mid_size' => 1,
		'current' => max(1, get_query_var('paged')),
		'prev_next' => $prev_next,
		'prev_text' => $prev_text,
		'next_text' => $next_text,
	]);
}
?>