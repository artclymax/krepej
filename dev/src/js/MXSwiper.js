import { Swiper } from "swiper/bundle";
import "swiper/swiper-bundle.css";

export class MXSwiper {
	constructor(selector, paramsAttr) {
		this.swipers = document.querySelectorAll(selector || '[data-swiper]');
		this.paramsAttr = paramsAttr || 'data-swiper';

		this.init();
	}

	init() {
		if (!this.swipers.length) return;

		this.swipers.forEach((swiper, index) => {
			// Безопасный парсинг параметров с обработкой ошибок
			let params = {};
			const attrValue = swiper.getAttribute(this.paramsAttr);
			if (attrValue) {
				try {
					params = JSON.parse(attrValue.replace(/'/g, '"'));
				} catch (e) {
					console.error('Ошибка парсинга JSON в атрибуте data-swiper:', e, attrValue);
				}
			}

			// 1. Находим ВСЕ подходящие кнопки "Назад" (используем filter вместо find)
			const btnsPrev = [...document.querySelectorAll('[data-swiper-btn-prev]')].filter(btn => {
				const selector = btn.dataset.swiperBtnPrev;
				return selector && swiper.matches(selector);
			});

			// 2. Находим ВСЕ подходящие кнопки "Вперед"
			const btnsNext = [...document.querySelectorAll('[data-swiper-btn-next]')].filter(btn => {
				const selector = btn.dataset.swiperBtnNext;
				return selector && swiper.matches(selector);
			});

			// 3. Находим ВСЕ подходящие элементы пагинации
			const paginations = [...document.querySelectorAll('[data-swiper-pagination]')].filter(el => {
				const selector = el.dataset.swiperPagination;
				return selector && swiper.matches(selector);
			});

			// 4. Находим ВСЕ подходящие элементы скроллбара
			const scrollbars = [...document.querySelectorAll('[data-swiper-scrollbar]')].filter(el => {
				const selector = el.dataset.swiperScrollbar;
				return selector && swiper.matches(selector);
			});

			// --- Настройка Navigation ---
			if (btnsPrev.length > 0 || btnsNext.length > 0) {
				params.navigation = params.navigation || {};
				// Swiper поддерживает как одиночный элемент, так и массив элементов
				if (btnsPrev.length > 0) {
					params.navigation.prevEl = btnsPrev.length === 1 ? btnsPrev[0] : btnsPrev;
				}
				if (btnsNext.length > 0) {
					params.navigation.nextEl = btnsNext.length === 1 ? btnsNext[0] : btnsNext;
				}
			}

			// --- Настройка Pagination ---
			if (paginations.length > 0) {
				params.pagination = params.pagination || {};
				params.pagination.clickable = true;

				if (paginations.length === 1) {
					params.pagination.el = paginations[0];
				} else {
					// Если элементов несколько, создаем уникальный класс и вешаем его на все найденные элементы.
					// Это самый надежный способ заставить Swiper работать с множественной пагинацией.
					const uniqueClass = `mx-swiper-pag-${index}-${Date.now()}`;
					paginations.forEach(el => el.classList.add(uniqueClass));
					params.pagination.el = `.${uniqueClass}`;
				}
			}

			// --- Настройка Scrollbar ---
			if (scrollbars.length > 0) {
				params.scrollbar = params.scrollbar || {};
				params.scrollbar.draggable = true;

				if (scrollbars.length === 1) {
					params.scrollbar.el = scrollbars[0];
				} else {
					const uniqueClass = `mx-swiper-sb-${index}-${Date.now()}`;
					scrollbars.forEach(el => el.classList.add(uniqueClass));
					params.scrollbar.el = `.${uniqueClass}`;
				}
			}

			// Инициализируем Swiper
			new Swiper(swiper, params);
		});
	}
}