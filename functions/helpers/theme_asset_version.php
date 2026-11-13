<?php
function theme_asset_version($path)
{
	$file = get_template_directory() . $path;

	return file_exists($file) ? filemtime($file) : null;
}