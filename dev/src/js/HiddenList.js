export default function () {
	const lists = document.querySelectorAll('[data-hide-list]');
	if (!lists.length) return;

	lists.forEach(function (list) {
		const items = list.querySelectorAll(':scope > li');
		const btn = list.parentElement.querySelector('[data-hide-list-btn]');

		if (!items.length || !btn) return;

		// Читаем количество видимых элементов из data-атрибута
		const visibleCount = parseInt(list.getAttribute('data-hide-list'), 10) || 3;

		// Если элементов меньше или равно лимиту — скрываем кнопку
		if (items.length <= visibleCount) {
			btn.style.display = 'none';
			return;
		}

		// Инициализация: скрываем все элементы после visibleCount
		items.forEach(function (item, index) {
			if (index >= visibleCount) {
				item.classList.add('is-hidden');
			}
		});

		list.classList.add('is-collapsed');

		// Обработчик клика по кнопке
		btn.addEventListener('click', function () {
			const isCollapsed = list.classList.contains('is-collapsed');

			if (isCollapsed) {
				// Показываем все элементы
				items.forEach(function (item) {
					item.classList.remove('is-hidden');
				});
				list.classList.remove('is-collapsed');
				list.classList.add('is-expanded');
				btn.textContent = 'Свернуть';
			} else {
				// Скрываем лишние элементы
				items.forEach(function (item, index) {
					if (index >= visibleCount) {
						item.classList.add('is-hidden');
					}
				});
				list.classList.remove('is-expanded');
				list.classList.add('is-collapsed');
				btn.textContent = 'Показать полностью';

				// Плавный скролл к началу списка
				list.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	});
}