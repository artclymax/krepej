import { Swiper } from "swiper/bundle";
import "swiper/swiper-bundle.css";

export class MXSwiper {
	constructor(selector, paramsAttr) {
		this.swipers = document.querySelectorAll(selector || '[data-swiper]');
		this.paramsAttr = paramsAttr || 'data-swiper';

		this.init();
	}

	init() {
		if (!this.swipers.length) { return };

		this.swipers.forEach(swiper => {
			let params = {};
			params = JSON.parse(swiper.getAttribute(this.paramsAttr).replace(/'/g, '"'));

			const btnPrev = swiper.querySelector('[data-swiper-btn-prev]');
			const btnNext = swiper.querySelector('[data-swiper-btn-next]');
			const pagination = swiper.querySelector('[data-swiper-pagination]');

			if (btnPrev) {
				params.navigation = { prevEl: btnPrev };
			}
			if (btnNext) {
				params.navigation = { ...params.navigation, nextEl: btnNext };
			}
			if (pagination) {
				params.pagination = {
					el: pagination,
					clickable: true,
				};
			}

			new Swiper(swiper, params);
		})
	}
}