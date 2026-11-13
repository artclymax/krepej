<?php
acf_add_local_field_group([
	'key' => 'group_vacancy',
	'title' => 'Вакансия',
	'fields' => [
		[
			'key' => 'field_vacancy_location',
			'label' => 'Место работы',
			'name' => 'vacancy_location',
			'type' => 'text',
			'instructions' => 'Например: Склад, Офис, Производство',
		],
		[
			'key' => 'field_vacancy_salary',
			'label' => 'Заработная плата',
			'name' => 'vacancy_salary',
			'type' => 'text',
			'instructions' => 'Например: от 2000 руб, 1500 - 2500 руб',
		],
	],
	'location' => [
		[
			[
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'vacancies'
			]
		]
	],
]);