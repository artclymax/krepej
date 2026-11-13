export class Menu {
	constructor(params) {
		const defaultParams = {
			btn: '[data-menu-btn]',
			menu: '[data-menu]',
			activeClass: 'open-menu',
			btnActiveClass: 'active',
			closeBtns: ['a'],
			scrollTo: '', // если нужно прокрутить контейнер до submenu
			btnIsLabel: false,  // если кнопка label то срабатывает дважды
		};

		this.params = { ...defaultParams, ...params };
		this.menuEl = document.querySelector(this.params.menu);
		this.btnEl = document.querySelectorAll(this.params.btn);

		this.init();
	}

	closeMenu(menu) {
		menu.classList.remove(this.params.activeClass);
		document.documentElement.classList.remove(this.params.activeClass);
		this.btnEl.forEach(btn => btn.classList.remove(this.params.btnActiveClass));
	}

	init() {
		const eventTarget = this.params.btnIsLabel ? 'pointerdown' : 'click'
		document.addEventListener(eventTarget, (e) => {
			const menu = this.menuEl;
			const isBtn = e.target.closest(this.params.btn);
			const isInsideMenu = e.target.closest(this.params.menu);
			if (isBtn) {
				const btn = isBtn;
				if (btn.tagName === 'A') e.preventDefault();

				menu.classList.toggle(this.params.activeClass);
				document.documentElement.classList.toggle(this.params.activeClass);
				this.btnEl.forEach(b => b.classList.toggle(this.params.btnActiveClass));

				// если нужно автоскроллить к подменю
				if (this.params.scrollTo) {
					const megaMenu = menu.closest(this.params.scrollTo);
					if (megaMenu) {
						const menuRect = megaMenu.getBoundingClientRect();
						const subRect = menu.getBoundingClientRect();
						const scrollTop = megaMenu.scrollTop + (subRect.top - menuRect.top);
						megaMenu.scrollTo({ top: scrollTop, behavior: 'smooth' });
					}
				}
				return; // не продолжаем, если это клик по кнопке
			}
			if (!menu) return;
			if (this.params.closeBtns.length && menu.classList.contains(this.params.activeClass)) {
				const allBtns = this.params.closeBtns.join(',');
				if (e.target.closest(allBtns)) {
					this.closeMenu(menu);
					return;
				}
			}

			if (!isInsideMenu && !isBtn && menu.classList.contains(this.params.activeClass)) {
				this.closeMenu(menu);
			}
		});
	}
}
