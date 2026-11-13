<?php
function correct_phone($phone)
{
	$has_plus = (strpos($phone, '+') === 0);

	$clean = preg_replace('/\D+/', '', $phone);

	return $has_plus ? '+' . $clean : $clean;
}