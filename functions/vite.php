<?php
add_action('wp_head', function () {
	if (defined('WP_DEBUG')) {
		$vite_server = 'http://localhost:5173';
		echo "<!-- VITE DEV INJECT: start -->\n";
		echo '<script type="module" src="' . esc_url($vite_server) . '/@vite/client"></script>';
		echo '<script type="module" src="' . esc_url($vite_server) . '/main.js"></script>';
		echo "<!-- VITE DEV INJECT: end -->\n";
	};
});
?>