export class SelectFromAcf {
	static _listenerAttached = false;

	constructor(selector, options) {
		const defaultOptions = {
			data: '[data-select-from-acf]',
			firstValue: 'Выберите значение',
			placeholderFirstValue: true,
			activeClass: 'custom-select-active',
		};
		this.selector = selector;
		this.options = { ...defaultOptions, ...options };
		this.init();
	}

	getOptions() {
		const el = document.querySelector(this.options.data);
		if (!el) return [];
		try {
			return JSON.parse(el.dataset.selectFromAcf || '[]');
		} catch {
			return [];
		}
	}


	createListElement(content, parent, activeBtn = false) {
		const li = document.createElement('li');
		li.classList.add('custom-acf-select__item');
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.classList.add('custom-acf-select__btn');
		if (activeBtn) btn.classList.add('active');
		btn.textContent = content;
		li.appendChild(btn);
		parent.appendChild(li);
	}

	addSelect(item) {
		const select = document.createElement('div');
		select.classList.add('custom-acf-select');
		select.dataset.activeClass = this.options.activeClass; // Сохраняем класс для глобального обработчика
		select._originalInput = item; // Прямая ссылка на скрытый инпут

		const currentValue = this.options.placeholderFirstValue
			? (item.getAttribute('placeholder') || this.options.firstValue)
			: this.options.firstValue;

		// Поле отображения
		const displayInput = document.createElement('input');
		displayInput.type = 'text';
		displayInput.value = currentValue;
		displayInput.name = 'custom-acf-select-input-' + item.name;
		displayInput.readOnly = true;
		displayInput.classList.add('custom-acf-select__select-field');

		// Список опций
		const selectList = document.createElement('ul');
		selectList.classList.add('custom-acf-select__list');

		if (this.options.firstValue || this.options.placeholderFirstValue) {
			this.createListElement(item.getAttribute('placeholder') || this.options.firstValue, selectList, true);

		}

		const options = this.getOptions();
		options.forEach((option) => {
			this.createListElement(option.title, selectList);
		});

		select.appendChild(displayInput);
		select.appendChild(selectList);

		// Скрываем оригинал и вставляем обёртку
		item.style.display = 'none';
		item.value = currentValue;
		item.parentNode.insertBefore(select, item);
	}

	init() {
		document.querySelectorAll(this.selector).forEach(item => this.addSelect(item));

		// Глобальный слушатель вешается только один раз на всё приложение
		if (!SelectFromAcf._listenerAttached) {
			document.addEventListener('click', SelectFromAcf._handleClick);
			SelectFromAcf._listenerAttached = true;
		}
	}

	// Статический обработчик (не зависит от this инстанса)
	static _handleClick(e) {
		const btn = e.target.closest('.custom-acf-select__btn');
		const field = e.target.closest('.custom-acf-select__select-field');
		const select = btn?.closest('.custom-acf-select') || field?.closest('.custom-acf-select');
		const activeClass = select?.dataset.activeClass || 'custom-select-active';

		// 1. Клик по кнопке выбора
		if (btn && select) {
			const original = select._originalInput || select.parentElement.querySelector('[style*="display: none"]');
			if (original) {
				document.querySelectorAll('.custom-acf-select__btn').forEach(b => b.classList.remove('active'));
				original.value = btn.textContent;
				select.querySelector('.custom-acf-select__select-field').value = btn.textContent;
				btn.classList.add('active')
			}
			select.classList.toggle(activeClass);
			return;
		}

		// 2. Клик по полю открытия/закрытия
		if (field && select) {
			document.querySelectorAll('.custom-acf-select').forEach(s => {
				if (s !== select && s.classList.contains(s.dataset.activeClass || 'custom-select-active')) {
					s.classList.remove(s.dataset.activeClass || 'custom-select-active');
				}
			});
			select.classList.toggle(activeClass);
			return;
		}

		// 3. Клик вне любого селекта → закрыть все
		document.querySelectorAll('.custom-acf-select').forEach(s => {
			s.classList.remove(s.dataset.activeClass || 'custom-select-active');
		});
	}
}