
export class CustomFieldSelect {
	static handlersBound = false;
	constructor(params) {
		const defaultParams = {
			input: '.cf-select',
			data: '.cf-data',
			dataAttr: 'data-cf-data',
			lastEdit: true,
			lastEditText: 'Написать',
			activeClass: 'active',
			hasPlaceholder: true,
		}

		this.params = { ...defaultParams, ...params };
		this.inputs = document.querySelectorAll(this.params.input);
		this.init();
	}

	init() {
		document.addEventListener('DOMContentLoaded', () => {
			if (!this.inputs.length) return;
			this.inputs.forEach(input => {
				const dataEl = document.querySelector(input.getAttribute('data-cf-data')) || document.querySelector(this.params.data);
				if (!dataEl) return;

				const nextElement = input.nextElementSibling;
				const parent = input.parentElement;
				const data = JSON.parse(dataEl.getAttribute(this.params.dataAttr) || '[]');

				const wrapper = document.createElement('div');
				wrapper.classList.add('cf-select-custom');

				// field
				const field = document.createElement('input');
				field.classList.add('cf-select-custom__field');
				field.setAttribute('readonly', true);
				wrapper.appendChild(field);

				if (this.params.hasPlaceholder) {
					if (input.hasAttribute('placeholder')) {
						input.value = input.getAttribute('placeholder');
						field.value = input.getAttribute('placeholder');
					} else {
						input.value = data[0].name;
						field.value = data[0].name;
					}
				}

				// list
				const list = document.createElement('ul')
				list.classList.add('cf-select-custom__list');
				wrapper.appendChild(list);
				//item
				data.forEach(({ name }, i) => {
					list.innerHTML += `<li><button class="cf-select-custom__btn${!i ? ' active' : ''}" type="button">${name}</button></li>`;
				})

				if (this.params.lastEdit) {
					list.innerHTML += `<li><button class="cf-select-custom__btn cf-select-custom__btn--edit" type="button">${this.params.lastEditText}</button></li>`
				}

				if (nextElement) {
					nextElement.insertAdjacentElement('beforebegin', wrapper);
				} else {
					parent.appendChild(wrapper);
				}
				// Handlers

				field.addEventListener('input', () => {
					input.value = field.value;
				})

				input.style.display = 'none';
			})

			// handlers
			//document.addEventListener('click', (e) => {
			//	if (e.target.closest('.cf-select-custom__btn--edit')) {
			//		const btn = e.target.closest('.cf-select-custom__btn--edit');
			//		const wrapper = btn.closest('.cf-select-custom');
			//		const field = wrapper.querySelector('.cf-select-custom__field');
			//		const input = wrapper.parentElement.querySelector(this.params.input);

			//		document.querySelectorAll('.cf-select-custom__btn').forEach(btn => btn.classList.remove('active'));
			//		btn.classList.add('active');

			//		field.removeAttribute('readonly');
			//		field.value = '';
			//		input.value = field.value;
			//		field.placeholder = btn.textContent;
			//		field.focus();

			//		wrapper.classList.remove('active');

			//	} else if (e.target.closest('.cf-select-custom__btn')) {
			//		const btn = e.target.closest('.cf-select-custom__btn');

			//		const wrapper = btn.closest('.cf-select-custom');
			//		const input = wrapper.parentElement.querySelector(this.params.input);
			//		document.querySelectorAll('.cf-select-custom__btn').forEach(btn => btn.classList.remove('active'));
			//		btn.classList.add('active');
			//		wrapper.querySelector('.cf-select-custom__field').setAttribute('readonly', true);
			//		wrapper.querySelector('.cf-select-custom__field').value = btn.textContent;
			//		input.value = btn.textContent;
			//		wrapper.classList.remove('active');
			//	}

			//	if (e.target.closest('.cf-select-custom__field')) {
			//		const field = e.target.closest('.cf-select-custom__field');
			//		const wrapper = field.closest('.cf-select-custom');
			//		wrapper.classList.toggle('active');
			//	}
			//	if (!e.target.closest('.cf-select-custom')) {
			//		document.querySelectorAll('.cf-select-custom').forEach(select => {
			//			select.classList.remove('active')
			//		})
			//	}

			//})
			// handlers
			if (!CustomFieldSelect.handlersBound) {
				CustomFieldSelect.handlersBound = true;

				document.addEventListener('click', (e) => {

					// поле
					const field = e.target.closest('.cf-select-custom__field');
					if (field) {
						e.stopPropagation();
						const wrapper = field.closest('.cf-select-custom');
						wrapper.classList.toggle('active');
						return;
					}

					// кнопка
					const btn = e.target.closest('.cf-select-custom__btn');
					if (btn) {
						e.stopPropagation();

						const wrapper = btn.closest('.cf-select-custom');
						const field = wrapper.querySelector('.cf-select-custom__field');
						const input = wrapper.parentElement.querySelector('.cf-select');

						wrapper.querySelectorAll('.cf-select-custom__btn')
							.forEach(b => b.classList.remove('active'));

						btn.classList.add('active');

						// edit
						if (btn.classList.contains('cf-select-custom__btn--edit')) {
							field.removeAttribute('readonly');
							field.value = '';
							field.placeholder = btn.textContent;
							input.value = '';
							field.focus();
							wrapper.classList.remove('active');
							return;
						}

						// select
						field.setAttribute('readonly', true);
						field.value = btn.textContent;
						input.value = btn.textContent;
						wrapper.classList.remove('active');
						return;
					}

					// клик вне
					if (!e.target.closest('.cf-select-custom')) {
						document.querySelectorAll('.cf-select-custom')
							.forEach(select => select.classList.remove('active'));
					}
				});
			}
		})
	}
}
