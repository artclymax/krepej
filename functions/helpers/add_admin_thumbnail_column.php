<?php
function add_admin_thumbnail_column($post_type)
{

	add_filter("manage_{$post_type}_posts_columns", function ($columns) {
		$columns = array_slice($columns, 0, 1, true)
			+ ['thumbnail' => 'Миниатюра']
			+ array_slice($columns, 1, null, true);

		return $columns;
	});

	add_action("manage_{$post_type}_posts_custom_column", function ($column, $post_id) {
		if ($column === 'thumbnail') {
			$url = get_the_post_thumbnail_url($post_id, 'thumbnail');
			echo $url
				? '<img src="' . esc_url($url) . '" width="80">'
				: '—';
		}
	}, 10, 2);
}
add_action('admin_head', function () {
	echo '<style>
		.wp-list-table .column-thumbnail {
			width: 100px;
			text-align: center;
		}
	</style>';
});
?>