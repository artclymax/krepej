export class Tabs {
	constructor(params) {
		const defaultParams = {
			tab: '[data-tab]',
			link: '[data-tab-link]',
			activeClass: 'active-tab',
		}

		this.params = { ...defaultParams, ...params };
		this.links = document.querySelectorAll(this.params.link);
		this.tabs = document.querySelectorAll(this.params.tab);

		this.init();
	}

	init() {
		if (!this.links.length || !this.tabs.length) return;

		// Активируем первый таб по умолчанию
		if (this.links[0]) this.links[0].classList.add(this.params.activeClass);
		if (this.tabs[0]) this.tabs[0].classList.add(this.params.activeClass);

		document.addEventListener('click', e => {
			const link = e.target.closest(this.params.link);
			if (!link) return;

			e.preventDefault();

			// Убираем решётку из href для безопасного поиска
			const targetId = (link.getAttribute('href') || '').replace('#', '');

			// Ищем таб строго по связке атрибута + id
			const tab = document.querySelector(`${this.params.tab}[id="${targetId}"]`);

			if (!tab) {
				console.warn(`[Tabs] Контент с id="${targetId}" не найден`);
				return;
			}

			// Переключаем активные классы
			this.links.forEach(l => l.classList.remove(this.params.activeClass));
			link.classList.add(this.params.activeClass);

			this.tabs.forEach(t => t.classList.remove(this.params.activeClass));
			tab.classList.add(this.params.activeClass);
		});
	}
}