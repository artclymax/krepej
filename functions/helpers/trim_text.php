<?php
function trim_text($text, $limit = 120)
{
	$text = wp_strip_all_tags($text);
	if (strlen($text) <= $limit)
		return $text;
	return mb_substr($text, 0, $limit) . '…';
}