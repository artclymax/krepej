export class BackdropList {
	constructor(params) {
		const defaultParams = {
			btn: '.menu-item-has-children',
			sublist: '.sub-menu',
			activeClass: 'active'
		}

		this.params = { ...defaultParams, ...params };
		this.btns = document.querySelectorAll(this.params.btn);
		this.init();
	}

	init() {
		if (!this.btns.length) return;

		document.addEventListener('click', (e) => {
			if (e.target.closest(this.params.btn)) {
				const btn = e.target;
				const list = btn.querySelector(this.params.sublist);
				btn.classList.toggle(this.params.activeClass);
				list.classList.toggle(this.params.activeClass);
			} else {
				this.btns.forEach(btn => {
					const list = btn.querySelector(this.params.sublist);
					btn.classList.remove(this.params.activeClass);
					list.classList.remove(this.params.activeClass);

				})
			}

		})
	}
}