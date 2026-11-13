export class Spoiler {
	constructor(selector, options) {
		let defaultOptions = {
			onlyOneOpen: false,
			speed: 300,
			fixSpoilerHeightOnResize: true,
			media: false,
			titleSelector: '[data-spoiler-title]',
			contentSelector: '[data-spoiler-content]',
			buttonClass: 'spoiler-button-title',
			activeClass: 'spoiler-active',
			createdClass: 'spoiler-created',
			createButton: true,
			resetButtonStylesClass: 'spoiler-styles',
			resetButtonStyles: `
				display: block;
				width: 100%;
				font: inherit;
				color: inherit;
				cursor: pointer;
				background: transparent;
				border: unset;
				padding: unset;
				margin: unset;
			`,

			create: () => { },
			open: () => { },
			close: () => { },
			remove: () => { },
		}

		this.selector = selector || '[data-spoiler]';
		this.allSpoilers = document.querySelectorAll(this.selector);
		this.options = Object.assign(defaultOptions, options);
		this.matchMedia = window.matchMedia(`(${this.options.media})`);
		this.isCreated = false; // для media, т.к. вешала на кнопку сразу несколько событий по клику (и для методов create и remove)

		this.event();
	}

	createButton(spoiler) {
		const title = spoiler.querySelector(this.options.titleSelector ? this.options.titleSelector : '[data-spoiler-title]') || spoiler.children[0];

		if (title.tagName.toLowerCase() !== 'button') {
			const button = document.createElement('button');
			button.classList.add(this.options.buttonClass);
			button.setAttribute('role', 'button');

			if (title.hasAttribute('data-spoiler-title')) {
				button.setAttribute('data-spoiler-title', '');
				title.removeAttribute('data-spoiler-title');
			}

			spoiler.insertAdjacentElement('afterbegin', button);
			button.insertAdjacentElement('afterbegin', title);
		}
	}

	removeButton(spoiler) {
		const button = spoiler.querySelector(`.${this.options.buttonClass}`);

		if (button) {
			const title = button.children[0];

			if (button.hasAttribute('data-spoiler-title')) {
				title.setAttribute('data-spoiler-title', '');
				button.removeAttribute('data-spoiler-title');
			}
			spoiler.insertAdjacentElement('afterbegin', title);
			button.remove();
		}
	}

	resetButtonStyles() {
		if (this.options.resetButtonStyles && this.options.createButton) {
			// чтобы не было сразу несколько одинаковых стилей
			if (!document.querySelector(`.${this.options.resetButtonStylesClass}`)) {
				const style = document.createElement('style');
				style.classList.add(this.options.resetButtonStylesClass);
				style.innerHTML = `.${this.options.buttonClass}{${this.options.resetButtonStyles}}`.trim().replaceAll('\t', '').replaceAll('\n', '');
				document.head.insertAdjacentElement('afterbegin', style);
			}
		}
	}

	returnToInitial(spoiler) {
		const title = spoiler.querySelector(this.options.titleSelector ? this.options.titleSelector : '[data-spoiler-title]') || spoiler.children[0];
		const content = spoiler.querySelector(this.options.contentSelector ? this.options.contentSelector : '[data-spoiler-content]') || spoiler.children[1];
		const contentHeight = content.scrollHeight;

		spoiler.classList.remove(this.options.activeClass);
		title.removeAttribute('aria-expanded');
		content.removeAttribute('aria-hidden');

		content.style.cssText = `max-height: 100%; opacity: 1; visibility: visible; will-change: max-height; transition: all var(--spoiler-animation-time, 0.3s);`;
	}

	openSpoiler(spoiler) {
		const title = spoiler.querySelector(this.options.titleSelector ? this.options.titleSelector : '[data-spoiler-title]') || spoiler.children[0];
		const content = spoiler.querySelector(this.options.contentSelector ? this.options.contentSelector : '[data-spoiler-content]') || spoiler.children[1];
		const contentHeight = content.scrollHeight;

		spoiler.classList.add(this.options.activeClass);
		title.setAttribute('aria-expanded', true);
		content.setAttribute('aria-hidden', false);

		content.style.cssText = `max-height: ${contentHeight}px; opacity: 1; visibility: visible; will-change: max-height; transition: all var(--spoiler-animation-time, 0.3s);`;
	}

	closeSpoiler(spoiler) {
		const title = spoiler.querySelector(this.options.titleSelector ? this.options.titleSelector : '[data-spoiler-title]') || spoiler.children[0];
		const content = spoiler.querySelector(this.options.contentSelector ? this.options.contentSelector : '[data-spoiler-content]') || spoiler.children[1];

		spoiler.classList.remove(this.options.activeClass);
		title.setAttribute('aria-expanded', false);
		content.setAttribute('aria-hidden', true);
		content.style.cssText = `max-height: 0px; opacity: 0; visibility: hidden; will-change: max-height; transition: all var(--spoiler-animation-time, 0.3s);`;
	}

	clickHandler(spoiler) {
		if (this.options.onlyOneOpen) {
			this.allSpoilers.forEach((spoiler) => this.closeSpoiler(spoiler))
		}

		if (spoiler.classList.contains(this.options.activeClass)) {
			this.options.close(this)
			this.closeSpoiler(spoiler);
		} else {
			this.options.open(this)
			this.openSpoiler(spoiler)
		}
	}

	createSpoiler() {
		if (!this.isCreated) {
			this.options.create(this)
		}

		this.allSpoilers.forEach((spoiler) => {
			spoiler.classList.add(this.options.createdClass);

			// set css var
			spoiler.style.cssText += `--spoiler-animation-time: ${this.options.speed / 1000}s;`;

			if (this.options.createButton) {
				this.createButton(spoiler);
			}

			let isActive = spoiler.getAttribute('data-spoiler') === 'active' || spoiler.classList.contains(this.options.activeClass);

			if (isActive) {
				this.openSpoiler(spoiler);
			} else {
				this.closeSpoiler(spoiler);
			}

			// CLICK EVENT
			const title = spoiler.querySelector(this.options.titleSelector ? this.options.titleSelector : '[data-spoiler-title]') || spoiler.children[0];

			// если спойлер уже будет создан, то не будет повторно вешаться событие
			if (!this.isCreated) {
				title.addEventListener('click', () => this.clickHandler(spoiler))
			}
		})
	}

	removeSpoiler() {
		if (this.isCreated) {
			this.options.remove(this);
		}
		this.allSpoilers.forEach((spoiler) => {
			spoiler.classList.remove(this.options.createdClass);

			if (this.options.createButton) {
				this.removeButton(spoiler);
			}
			this.returnToInitial(spoiler);

			const title = spoiler.querySelector(this.options.titleSelector ? this.options.titleSelector : '[data-spoiler-title]') || spoiler.children[0];

			title.removeEventListener('click', () => this.clickHandler(spoiler))
		})
	}

	mediaHandler() {
		if (this.matchMedia.matches) {
			// create
			this.createSpoiler();
			this.isCreated = true; // спойлер создался и теперь нельзя будет вешать события
		} else {
			// remove
			this.removeSpoiler();
			this.isCreated = false;
		}
	}

	fixOpenSpoilerHeight() {
		this.allSpoilers.forEach((spoiler) => {
			if (spoiler.classList.contains(this.options.activeClass)) {
				const content = spoiler.querySelector(this.options.contentSelector ? this.options.contentSelector : '[data-spoiler-content]') || spoiler.children[1];
				const contentHeight = content.scrollHeight;

				content.style.cssText = `max-height: ${contentHeight}px; opacity: 1; visibility: visible; will-change: max-height; transition: all var(--spoiler-animation-time, 0.3s);`;
			}
		})

	}

	event() {
		if (this.allSpoilers.length) {
			if (this.options.fixSpoilerHeightOnResize) {
				window.addEventListener('load', () => this.fixOpenSpoilerHeight());
				window.addEventListener('resize', () => this.fixOpenSpoilerHeight());
			}

			if (this.options.resetButtonStyles) {
				this.resetButtonStyles()
			}

			if (this.options.media) {
				this.mediaHandler()
				window.addEventListener('resize', () => {
					if (this.options.media) {
						this.mediaHandler();
					}
				})
			} else {
				// create
				this.createSpoiler()
			}

		} else {
			console.warn(`${this.selector} is not found!`);
		}
	}
}