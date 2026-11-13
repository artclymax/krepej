export class ScrollToTop {
	constructor(selector, options) {
		const defaultOptions = {
			activeClass: 'active',
			scrollThreshold: 200, // Порог, после которого появляется кнопка
		}

		this.options = Object.assign(defaultOptions, options);
		this.selector = selector || '.scroll-to-top';
		this.btn = document.querySelector(this.selector);
		this.init();
	}

	toggleButton(btn) {
		// Показываем кнопку, если прокручено больше, чем пороговое значение
		if (window.scrollY > this.options.scrollThreshold) {
			btn.classList.add(this.options.activeClass);
		} else {
			btn.classList.remove(this.options.activeClass);
		}
	}

	init() {
		if (!this.btn) return;
		// Добавляем обработчик на скроллинг окна
		this.btn.addEventListener('click', (e) => {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
		window.addEventListener('scroll', () => this.toggleButton(this.btn));
	}
}