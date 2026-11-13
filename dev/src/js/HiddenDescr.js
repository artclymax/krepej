export default function () {
	const wrappers = document.querySelectorAll('[data-hidden-descr-content]');

	if (!wrappers.length) return;

	wrappers.forEach(function (wrapper) {
		const descr = wrapper.querySelector('.category-description__descr');
		const btn = wrapper.querySelector('[data-hidden-descr-btn]');

		if (!descr || !btn) return;

		// Определяем, помещается ли контент в свёрнутом виде
		// (например, если высота больше 200px — значит есть что раскрывать)
		const MAX_HEIGHT = 130; // Настройте под свой дизайн
		const isOverflowing = descr.scrollHeight > MAX_HEIGHT;

		if (!isOverflowing) {
			// Если контент короткий — скрываем кнопку
			btn.style.display = 'none';
			return;
		}

		// Инициализация: свёрнутое состояние
		wrapper.classList.add('is-collapsed');

		btn.addEventListener('click', function () {
			const isCollapsed = wrapper.classList.contains('is-collapsed');

			if (isCollapsed) {
				wrapper.classList.remove('is-collapsed');
				wrapper.classList.add('is-expanded');
				btn.textContent = 'Свернуть';
			} else {
				wrapper.classList.remove('is-expanded');
				wrapper.classList.add('is-collapsed');
				btn.textContent = 'Подробнее';

				// Плавный скролл к началу описания
				wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	});
}