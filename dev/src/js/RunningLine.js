export class RunningLine {
	constructor(selector, options) {
		const defaultOptions = {
			listSelector: '[data-running-line-list]',
			quantity: false,
		}

		this.selector = selector || '[data-running-line]';
		this.options = Object.assign(defaultOptions, options);
		this.elements = document.querySelectorAll(this.selector);
		this.init();
	}

	copyItem(item, parent) {
		const copiedItem = item.cloneNode(true);
		copiedItem.setAttribute('aria-hidden', true);
		parent.insertAdjacentElement("beforeend", copiedItem);
	}

	init() {
		if (!this.elements.length) {
			console.warn(`[RunningLine]: Selector '${this.selector}' is not found!`);
			return;
		}
		const { listSelector, quantity } = this.options;

		this.elements.forEach(element => {
			const list = element.querySelector(listSelector) || element.children[0];
			const children = Array.from(list.children);

			if (quantity) {
				for (let i = 0; i < quantity; i++) {
					this.copyItem(children[0], list)
				}
			} else {
				children.forEach((item) => {
					this.copyItem(item, list)
				})
			}

		})
	}
}