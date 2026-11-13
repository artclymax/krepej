export class MapScrollLock {
	constructor(selector = '[data-map-scroll-lock]', text = 'Нажмите, чтобы прокрутить карту') {
		this.selector = selector;
		this.text = text;
		this.init();
	}

	init() {
		const containers = document.querySelectorAll(this.selector);
		if (!containers.length) return;

		containers.forEach(container => {
			const iframe = container.querySelector('iframe');
			if (!iframe || iframe.dataset.scrollLocked) return;
			iframe.dataset.scrollLocked = 'true';

			// Создаём overlay
			const overlay = document.createElement('div');
			overlay.className = 'map-scroll-lock__overlay';
			overlay.innerHTML = `<span>${this.text}</span>`;
			container.appendChild(overlay);

			// Клик на overlay — активируем карту
			overlay.addEventListener('click', () => {
				container.classList.add('is-active');
			});

			// Уход мыши с контейнера — блокируем карту
			container.addEventListener('mouseleave', () => {
				container.classList.remove('is-active');
			});
		});
	}
}
