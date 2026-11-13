export class CustomSelect {
	constructor(options) {
		const defaultOptions = {
			selector: '[data-custom-select]',
			forceSend: false,
			className: {
				wrapper: 'custom-select',
				list: 'custom-select__list',
				selectField: 'custom-select__select-field',
				item: 'custom-select__item',
				btn: 'custom-select__btn',
				hidden: 'custom-select-hidden',
				active: 'custom-select-active',
				listUp: 'list--up'
			}
		};
		this.options = Object.assign(defaultOptions, options);
		this.selects = document.querySelectorAll(this.options.selector);
		this.init();
	}

	changeMarkup(select) {
		const parent = select.parentElement;
		const sibling = select.nextElementSibling;
		const children = Array.from(select.children);
		const wrapper = document.createElement('div');
		const list = document.createElement('ul');

		wrapper.classList.add(this.options.className.wrapper);
		list.classList.add(this.options.className.list);
		wrapper.appendChild(list);

		children.forEach((option, i) => {
			const text = option.innerHTML;
			const isSelected = option.hasAttribute('selected');

			//!!! ======== тип submit / button будет автоматом обновлять
			if (isSelected || (!isSelected && !Array.from(children).some(c => c.hasAttribute('selected')) && i === 0)) {
				wrapper.insertAdjacentHTML(
					'afterbegin',
					`<button class="${this.options.className.selectField}" data-select-option="${i}" type="button">${text}</button>`
				);
			}

			list.insertAdjacentHTML(
				'beforeend',
				`<li class="${this.options.className.item}">
					<button class="${this.options.className.btn} ${isSelected ? 'active' : ''}" type="button" data-select-option="${i}">${text}</button>
				</li>`
			);
		});

		if (sibling) {
			sibling.insertAdjacentElement('beforebegin', wrapper);
		} else {
			parent.insertAdjacentElement('beforeend', wrapper);
		}

		select.classList.add(this.options.className.hidden);
	}

	customSelectHandler() {
		document.addEventListener('click', (e) => {
			const { className } = this.options;

			// выбор элемента
			if (e.target.closest(`.${className.btn}`)) {
				const btn = e.target.closest(`.${className.btn}`);
				const index = Number(btn.dataset.selectOption);
				const parentWrapper = btn.closest(`.${className.wrapper}`);
				const select = parentWrapper.previousElementSibling;
				const selectField = parentWrapper.querySelector(`.${className.selectField}`);
				const customOptions = parentWrapper.querySelectorAll(`.${className.btn}`);

				// обновляем оригинальный select
				Array.from(select.children).forEach(opt => (opt.selected = false));
				select.children[index].selected = true;

				// обновляем кастомный
				customOptions.forEach(b => b.classList.remove(className.active));
				customOptions[index].classList.add(className.active);
				selectField.innerHTML = customOptions[index].innerHTML;

				parentWrapper.classList.remove(className.active);

				if(this.options.forceSend) {
					select.dispatchEvent(new Event('change', { bubbles: true }));
				}
			}

			// открытие/закрытие списка
			if (e.target.closest(`.${className.selectField}`)) {
				e.preventDefault();
				const parentWrapper = e.target.closest(`.${className.wrapper}`);
				parentWrapper.classList.toggle(className.active);
				/*
				// === Проверка расстояния до низа экрана ===
				const list = parentWrapper.querySelector(`.${className.list}`);
				const rect = list.getBoundingClientRect();
				const spaceBelow = window.innerHeight - rect.bottom;

				if (spaceBelow < 100) {
					list.classList.add(className.listUp);
				} else {
					list.classList.remove(className.listUp);
				}
					*/
			}

			if (!e.target.closest(`.${className.wrapper}`)) {
				document.querySelector(`.${className.wrapper}`).classList.remove(className.active);
			}
		});
	}

	init() {
		if (!this.selects.length) return;

		this.selects.forEach(select => {
			this.changeMarkup(select);
		});

		this.customSelectHandler();
	}
}
