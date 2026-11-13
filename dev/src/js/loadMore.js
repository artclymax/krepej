// для кнопки data-load-more-btn=".item-selector" data-load-more-count="3"
export const loadMore = () => {

	const allBtns = document.querySelectorAll('[data-load-more-btn]');
	if (!allBtns.length) return;

	// Функция показа/скрытия элементов


	allBtns.forEach(btn => {
		const perPage = Number(btn.getAttribute('data-load-more-count')) ?? 3; // Сколько показывать за раз
		let currentIndex = 0;
		const items = document.querySelectorAll(btn.getAttribute('data-load-more-btn'));

		if (!items.length) return;

		function updateVisibility() {
			items.forEach((item, index) => {
				if (index <= currentIndex) {
					item.style.display = '';
				} else {
					item.style.display = 'none';
				}
			});

			// Если все показаны — скрываем кнопку
			if (currentIndex >= items.length - 1) {
				btn.style.display = 'none';
			}
		}

		// Инициализация: показываем только первые N
		currentIndex = perPage - 1;
		updateVisibility();

		// Клик по кнопке
		btn.addEventListener('click', function () {
			currentIndex += perPage;
			updateVisibility();
		});
	})



}