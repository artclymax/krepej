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

		this.swipers.forEach(swiper => {
			const params = JSON.parse(
				swiper.getAttribute(this.paramsAttr).replace(/'/g, '"')
			);

			const btnPrev = [...document.querySelectorAll('[data-swiper-btn-prev]')]
				.find(btn => {
					const selector = btn.dataset.swiperBtnPrev;
					return selector && swiper.matches(selector);
				});

			const btnNext = [...document.querySelectorAll('[data-swiper-btn-next]')]
				.find(btn => {
					const selector = btn.dataset.swiperBtnNext;
					return selector && swiper.matches(selector);
				});

			const pagination = [...document.querySelectorAll('[data-swiper-pagination]')]
				.find(el => {
					const selector = el.dataset.swiperPagination;
					return selector && swiper.matches(selector);
				});

			const scrollbar = [...document.querySelectorAll('[data-swiper-scrollbar]')]
				.find(el => {
					const selector = el.dataset.swiperScrollbar;
					return selector && swiper.matches(selector);
				});

			if (btnPrev || btnNext) {
				params.navigation = {};
				if (btnPrev) params.navigation.prevEl = btnPrev;
				if (btnNext) params.navigation.nextEl = btnNext;
			}

			if (pagination) {
				params.pagination = {
					el: pagination,
					clickable: true,
				};
			}

			if (scrollbar) {
				params.scrollbar = {
					el: scrollbar,
					draggable: true,
				};
			}

			new Swiper(swiper, params);
		});
	}
}