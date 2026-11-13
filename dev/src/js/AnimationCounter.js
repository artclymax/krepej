export const AnimationCounter = () => {
	document.addEventListener("DOMContentLoaded", () => {
		// Находим все элементы с нужным атрибутом
		const counters = document.querySelectorAll('[data-animation-counter]');

		// Функция анимации одного элемента
		const animateCounter = (el) => {
			// Получаем целевое число (убираем пробелы, если они есть, например "1 000")
			const target = parseInt(el.innerText.replace(/\s+/g, ''), 10);

			// Длительность анимации из атрибута или по умолчанию 2000 мс (2 секунды)
			const duration = parseInt(el.getAttribute('data-duration'), 10) || 2000;

			const start = 0;
			const startTime = performance.now();

			// Функция плавности (ease-out quad), чтобы анимация замедлялась к концу
			const easeOutQuad = (t) => t * (2 - t);

			const update = (currentTime) => {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1); // от 0 до 1

				// Применяем функцию плавности
				const easeProgress = easeOutQuad(progress);

				// Вычисляем текущее значение
				const current = Math.floor(start + (target - start) * easeProgress);

				// Обновляем текст (можно добавить форматирование, например, пробелы для тысяч)
				el.innerText = current.toLocaleString('ru-RU');

				// Если анимация не закончилась, запрашиваем следующий кадр
				if (progress < 1) {
					requestAnimationFrame(update);
				} else {
					// Гарантируем, что в конце будет точно целевое число
					el.innerText = target.toLocaleString('ru-RU');
				}
			};

			// Запускаем анимацию
			requestAnimationFrame(update);
		};

		// Настраиваем Intersection Observer, чтобы анимация срабатывала при появлении на экране
		const observerOptions = {
			threshold: 0.5 // Сработает, когда 50% элемента будет видно
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					animateCounter(entry.target);
					// Перестаем следить за элементом после запуска, чтобы анимация была одноразовой
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		// Начинаем следить за каждым счетчиком
		counters.forEach(counter => {
			observer.observe(counter);
		});
	});
}