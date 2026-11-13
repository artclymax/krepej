/**
 * Кастомная валидация CF7 форм
 * 
 * - Добавляет класс .cf7-error к input'ам с ошибками
 * - Создаёт span.cf7-error-hint с текстом "Обязательно для заполнения"
 * - Подсказка появляется только после неудачной попытки отправки
 */

export function cf7CustomValidation() {

	function init() {
		const forms = document.querySelectorAll('.wpcf7-form');

		forms.forEach(form => {
			if (form.dataset.cf7Validated) return;
			form.dataset.cf7Validated = 'true';

			// Отключаем браузерную валидацию
			form.noValidate = true;

			// Удаляем существующие подсказки при каждой загрузке
			form.querySelectorAll('.cf7-error-hint').forEach(el => el.remove());

			form.addEventListener('submit', (e) => {
				e.preventDefault();

				// Очищаем предыдущие ошибки
				clearErrors(form);

				// Собираем ошибки
				const invalidInputs = getInvalidInputs(form);

				if (invalidInputs.length > 0) {
					// Показываем ошибки
					invalidInputs.forEach(input => {
						showError(input);
					});

					// Скроллим к первой ошибке
					const firstError = form.querySelector('.cf7-error');
					if (firstError) {
						firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
						firstError.focus();
					}
					return;
				}

				// Всё валидно — отправляем через CF7
				if (typeof wpcf7 !== 'undefined') {
					wpcf7.submit(form);
				} else {
					form.submit();
				}
			});

			// Убираем ошибку при вводе
			form.addEventListener('input', (e) => {
				if (e.target.classList.contains('cf7-error')) {
					hideError(e.target);
				}
			});

			// Убираем ошибку при изменении (чекбоксы)
			form.addEventListener('change', (e) => {
				if (e.target.classList.contains('cf7-error')) {
					hideError(e.target);
				}
			});
		});
	}

	/**
	 * Получить все невалидные input'ы
	 */
	function getInvalidInputs(form) {
		const invalid = [];

		form.querySelectorAll('input[required], textarea[required], select[required]').forEach(input => {
			if (!isInputValid(input)) {
				invalid.push(input);
			}
		});

		// Чекбоксы required
		form.querySelectorAll('input[type="checkbox"][required]').forEach(input => {
			if (!input.checked) {
				invalid.push(input);
			}
		});

		return invalid;
	}

	/**
	 * Проверить валидность одного поля
	 */
	function isInputValid(input) {
		const value = input.value.trim();

		if (!value) return false;

		// Email
		if (input.type === 'email') {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
		}

		// Телефон — минимум 7 цифр
		if (input.type === 'tel') {
			return value.replace(/\D/g, '').length >= 7;
		}

		return true;
	}

	/**
	 * Показать ошибку для поля
	 */
	function showError(input) {
		input.classList.add('cf7-error');

		// Создаём подсказку если нет
		if (!input.nextElementSibling?.classList.contains('cf7-error-hint')) {
			const hint = document.createElement('span');
			hint.className = 'cf7-error-hint';
			hint.textContent = 'Обязательно для заполнения';

			// Вставляем после input (или после обёртки CF7)
			const wrap = input.closest('.wpcf7-form-control-wrap');
			if (wrap) {
				wrap.appendChild(hint);
			} else {
				input.after(hint);
			}
		}
	}

	/**
	 * Скрыть ошибку для поля
	 */
	function hideError(input) {
		input.classList.remove('cf7-error');

		const hint = input.nextElementSibling;
		if (hint?.classList.contains('cf7-error-hint')) {
			hint.remove();
		}

		// Или ищем внутри обёртки
		const wrap = input.closest('.wpcf7-form-control-wrap');
		if (wrap) {
			const wrapHint = wrap.querySelector('.cf7-error-hint');
			if (wrapHint) wrapHint.remove();
		}
	}

	/**
	 * Очистить все ошибки формы
	 */
	function clearErrors(form) {
		form.querySelectorAll('.cf7-error').forEach(el => el.classList.remove('cf7-error'));
		form.querySelectorAll('.cf7-error-hint').forEach(el => el.remove());
	}

	// Init
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Глобальная переинициализация
	window.cf7Revalidate = init;
}
