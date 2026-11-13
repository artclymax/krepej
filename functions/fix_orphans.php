<?php

function mx_fix_orphans($text)
{
	if (is_admin())
		return $text;
	if (!is_string($text))
		return $text;

	// Фикс для Safari: удаляем скрытые символы Figma (LSEP \u2028 и PARAGRAPH SEPARATOR \u2029)
	$lsep = json_decode('"\u2028"');
	$psep = json_decode('"\u2029"');
	$text = str_replace(array($lsep, $psep), ' ', $text);

	// Если нет коротких слов — сразу выходим (оптимизация)
	if (!preg_match('/\s[а-яА-Яa-zA-Z]{1,2}\s/u', $text)) {
		return $text;
	}

	// Разделяем текст на блоки: защищённые (script, style, code, pre, textarea) и обычный текст
	$protected_pattern = '/(<script\b[^>]*>.*?<\/script>|<style\b[^>]*>.*?<\/style>|<code\b[^>]*>.*?<\/code>|<pre\b[^>]*>.*?<\/pre>|<textarea\b[^>]*>.*?<\/textarea>)/uis';

	// Разбиваем текст на части: [текст, защищённый_блок, текст, защищённый_блок, ...]
	$parts = preg_split($protected_pattern, $text, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);

	$result = '';
	foreach ($parts as $part) {
		// Если часть — защищённый блок (начинается с <script, <style и т.д.), не трогаем
		if (preg_match('/^<(script|style|code|pre|textarea)\b/i', $part)) {
			$result .= $part;
		} else {
			// Иначе применяем замену неразрывных пробелов
			$result .= preg_replace('/(\s|&nbsp;)([а-яА-Яa-zA-Z]{1,2})\s/u', '$1$2&nbsp;', $part);
		}
	}

	return $result;
}

add_filter('acf/format_value', 'mx_fix_orphans', 20);
add_filter('the_content', 'mx_fix_orphans', 20);
add_filter('the_title', 'mx_fix_orphans', 20);
add_filter('the_excerpt', 'mx_fix_orphans', 20);
add_filter('nav_menu_item_title', 'mx_fix_orphans', 20);

// Внимание: навигация и ACF требуют осторожности
// add_filter('nav_menu_item_title', 'mx_fix_orphans', 20); 
// add_filter('acf/format_value', 'mx_fix_orphans', 20); 
?>