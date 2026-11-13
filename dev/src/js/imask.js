import IMask from 'imask';

export const imask = () => {
	document.addEventListener('DOMContentLoaded', () => {
		document.querySelectorAll('input[type="tel"]').forEach(input => {
			const mask = IMask(input, {
				//mask: /^\+?\d{0,15}$/,
				mask: '+{375} (00) 000-00-00', //{ mask: '+000 (00) 000-00-00' }
				lazy: true, // изначально скрыта
				placeholderChar: '_'
			});

			// показываем маску при фокусе
			input.addEventListener('focus', () => {
				mask.updateOptions({ lazy: false });
				mask.value = mask.value; // принудительно обновляем отображение
			});

			// скрываем маску при blur, если поле пустое
			input.addEventListener('blur', () => {
				if (!mask.unmaskedValue) { // если поле пустое
					mask.updateOptions({ lazy: true });
					mask.value = ''; // очищаем видимое значение
				}
			});
		})
	});
} 