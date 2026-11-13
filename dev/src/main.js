//import "jarallax/dist/jarallax.min.css";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
//import "aos/dist/aos.css";
import "./scss/style.scss";
//!
import { Swiper } from "swiper/bundle";

//import { jarallax } from "jarallax";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
//import AOS from "AOS";

import { AutoCalc } from "./js/AutoCalc.js";
import { Menu } from "./js/Menu.js";
//import { RunningLine } from './js/RunningLine.js';
//import { BackdropList } from './js/BackdropList.js';
import { Modal } from "./js/Modal.js";
//import { cookies } from "./js/Cookies.js";
//import { AnimationCounter } from "./js/AnimationCounter.js";
//import HiddenDescr from "./js/HiddenDescr.js";
//import HiddenList from "./js/HiddenList.js";
import { imask } from "./js/imask.js";
import { fileBtn } from "./js/FileBtn.js";
//import { CustomFieldSelect } from "./js/CustomFieldSelect.js";
import { Spoiler } from "./js/Spoiler.js";
import { ScrollToTop } from "./js/ScrollToTop.js";
import { MXSwiper } from "./js/MXSwiper.js";
import { CustomSelect } from "./js/CustomSelect.js";
import { Tabs } from "./js/Tabs.js";
//import { MapScrollLock } from './js/MapScrollLock.js';
//import { cf7CustomValidation } from './js/cf7-validation.js';
//import { SelectFromAcf } from './js/SelectFromAcf.js';
//import { loadMore } from './js/loadMore.js';
//import AirDatepicker from 'air-datepicker';
//import 'air-datepicker/air-datepicker.css';
//document.querySelectorAll('input.form-input-date')?.forEach(input => {
//	new AirDatepicker(input, {
//		selectedDates: [new Date()],
//		isMobile: true,
//		autoClose: true,
//		minDate: new Date(),
//	});
//})
// time
//document.querySelectorAll('input.form-input-time')?.forEach(input => {
//	new AirDatepicker(input, {
//		isMobile: true,
//		autoClose: true,
//		timepicker: true,
//		onlyTimepicker: true
//	});
//})
//cf7CustomValidation();

// FOR CONTACTS FORM 7
//import "./js/redirect-to-thanks-page.js";

new AutoCalc();
//new CustomFieldSelect({
//	input: '.form-wrapper .cf-select',
//	lastEdit: false
//});
new Menu({
	btn: ".burger-btn", //.burger-btn-icon
	menu: ".header-menu",
	activeClass: "open-header-menu",
	closeBtns: ["a", ".cart-btn"],
});
//new Menu({
//	btn: '.filter-mobile-btn',
//	menu: '.filter',
//	activeClass: 'open-filter-menu',
//	closeBtns: ['.filter-close-btn']
//})
new Menu({
	btn: ".phone-btn", //.burger-btn-icon
	menu: ".header-phone-box",
	activeClass: "open-phone-box",
	closeBtns: [".burger-btn"],
});

//new BackdropList();

new Modal();

//jarallax(document.querySelectorAll(".jarallax"), {
//	speed: 0.2,
//});

//cookies();
imask();

Fancybox.bind("[data-fancybox]", {
	placeFocusBack: false,
});

//new RunningLine();
new ScrollToTop();

new Spoiler();

//new Spoiler('[data-spoiler]', {
//	onlyOneOpen: true,
//	activeClass: 'is-open',
//});

//new Spoiler('[data-spoiler]', { media: 'max-width: 768px' });

new MXSwiper();

new CustomSelect({
	selector: "select",
	forceSend: true,
});

//new MapScrollLock();
/*
window.addEventListener('scroll', function () {
	const header = document.querySelector('.header');

	if (window.scrollY > 50) {
		header.classList.add('scrolled');
	} else {
		header.classList.remove('scrolled');
		const valueUnits = header.offsetHeight;
		document.querySelector(':root').style.setProperty(`--header-height`, valueUnits + 'px');
	}
});
*/

fileBtn(); //

//new Tabs();

//document.querySelectorAll('video.wp-video-shortcode').forEach(video => {
//	if (!video.src) {
//		const link = video.querySelector('a');
//		if (link) video.src = link.href;
//	}
//});

//document?.querySelectorAll('.wpcf7-acceptance input[type="checkbox"]')?.forEach(el => {
//	el.checked = true;
//})

//AOS.init({
//	disable: 'mobile',
//	duration: 600,
//	offset: 100
//});

//new SelectFromAcf('.custom-select-product', {
//	data: '.select-products-data'
//})

//loadMore();

//AnimationCounter();

//HiddenDescr();

//HiddenList();

/**
 * Обновление счётчика корзины WooCommerce
 * Обновляется при добавлении/удалении товара
 */
document.addEventListener("DOMContentLoaded", () => {
	const cartCounter = document.querySelector("[data-cart-counter]");
	const cartBtn = document.querySelector(".header__cart");

	if (!cartBtn) return;

	// Функция обновления счётчика
	const updateCartCounter = () => {
		// Запрашиваем актуальное количество через AJAX
		fetch("/?wc-ajax=get_refreshed_fragments", {
			method: "GET",
			headers: {
				"X-Requested-With": "XMLHttpRequest",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data && data.cart_hash && data.fragments) {
					// Получаем новое количество из фрагментов
					const cartCount = parseInt(data.cart_hash.split("-")[1]) || 0;

					if (cartCount > 0) {
						if (!cartCounter) {
							// Создаём счётчик, если его нет
							const counter = document.createElement("span");
							counter.className = "cart-btn__counter";
							counter.setAttribute("data-cart-counter", "");
							counter.textContent = cartCount;
							cartBtn.appendChild(counter);
						} else {
							cartCounter.textContent = cartCount;
						}
					} else if (cartCounter) {
						// Удаляем счётчик, если корзина пуста
						cartCounter.remove();
					}
				}
			})
			.catch((error) => console.error("Cart counter error:", error));
	};

	// Слушаем события WooCommerce
	document.body.addEventListener("added_to_cart", updateCartCounter);
	document.body.addEventListener("removed_from_cart", updateCartCounter);
	document.body.addEventListener("wc_fragments_refreshed", updateCartCounter);

	// Также обновляем при изменении количества в мини-корзине
	document.body.addEventListener("change", (e) => {
		if (e.target.classList.contains("qty")) {
			setTimeout(updateCartCounter, 500);
		}
	});
});

document.addEventListener("DOMContentLoaded", () => {
	const catalogBtn = document.querySelector(".header__catalog-btn");
	const catalogMenu = document.querySelector(".header-catalog");
	const overlay = document.querySelector(".catalog-overlay") || createOverlay();
	const backBtn = catalogMenu?.querySelector(".catalog-back-btn");
	const levelsContainer = catalogMenu?.querySelector(".header-catalog__levels");

	let currentLevel = 0;

	if (!catalogBtn || !catalogMenu) return;

	function createOverlay() {
		const el = document.createElement("div");
		el.className = "catalog-overlay";
		document.body.appendChild(el);
		return el;
	}

	const toggleCatalog = (isOpen) => {
		if (isOpen) {
			catalogMenu.classList.add("is-active");
			overlay.classList.add("is-active");
			document.body.style.overflow = "hidden";
			catalogBtn.setAttribute("aria-expanded", "true");
			resetToMainLevel();
		} else {
			catalogMenu.classList.remove("is-active");
			overlay.classList.remove("is-active");
			document.body.style.overflow = "";
			catalogBtn.setAttribute("aria-expanded", "false");
		}
	};

	catalogBtn.addEventListener("click", () => {
		const isOpen = catalogMenu.classList.contains("is-active");
		toggleCatalog(!isOpen);
	});

	overlay.addEventListener("click", () => toggleCatalog(false));
	if (backBtn) backBtn.addEventListener("click", goBack);

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && catalogMenu.classList.contains("is-active")) {
			if (currentLevel > 0) goBack();
			else toggleCatalog(false);
		}
	});

	function resetToMainLevel() {
		document
			.querySelectorAll(".header-catalog__level")
			.forEach((level, index) => {
				if (index === 0) {
					level.classList.add("is-active");
					level.classList.remove("is-prev");
				} else {
					level.classList.remove("is-active", "is-prev");
					level.remove();
				}
			});
		currentLevel = 0;
		updateHeader();
	}

	function updateHeader() {
		if (currentLevel > 0) {
			backBtn.style.display = "inline-flex";
		} else {
			backBtn.style.display = "none";
		}
	}

	function goBack() {
		if (currentLevel === 0) return;

		const currentLevelEl = document.querySelector(
			`.header-catalog__level--${currentLevel}`,
		);
		const prevLevelEl = document.querySelector(
			`.header-catalog__level--${currentLevel - 1}`,
		);

		if (currentLevelEl) {
			currentLevelEl.classList.remove("is-active");
			currentLevelEl.classList.add("is-prev");
			setTimeout(() => currentLevelEl.remove(), 300);
		}

		if (prevLevelEl) {
			prevLevelEl.classList.remove("is-prev");
			prevLevelEl.classList.add("is-active");
		}

		currentLevel--;
		updateHeader();
	}

	// === ГЛАВНОЕ ИСПРАВЛЕНИЕ ===
	function addArrowAndListener(item) {
		const link = item.querySelector("a");
		if (!link) return;

		// Если стрелка уже есть, выходим (защита от дублей)
		if (link.querySelector(".header-catalog__arrow")) return;

		// Создаём именно кнопку, а не span, для правильной семантики
		const arrow = document.createElement("button");
		arrow.className = "header-catalog__arrow";
		arrow.type = "button"; // Важно: чтобы не отправлял формы, если меню вдруг внутри формы
		arrow.setAttribute("aria-label", "Открыть подкатегорию");
		arrow.innerHTML = `
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		`;

		// Добавляем стрелку внутрь ссылки (чтобы она была справа благодаря flexbox в CSS)
		link.appendChild(arrow);

		// Вешаем обработчик ТОЛЬКО на стрелку
		arrow.addEventListener("click", (e) => {
			e.preventDefault(); // Отменяем переход по ссылке <a>
			e.stopPropagation(); // Останавливаем всплытие, чтобы не сработали другие клики

			const levelEl = item.closest(".header-catalog__level");

			if (levelEl && levelEl.classList.contains("header-catalog__level--0")) {
				openSubMenu(item);
			} else if (levelEl) {
				openSubMenuFromLevel(item, levelEl);
			}
		});
	}

	function initMenu() {
		const mainList = catalogMenu.querySelector(".header-catalog__list");
		if (!mainList) return;
		const itemsWithChildren = mainList.querySelectorAll(
			".menu-item-has-children",
		);
		itemsWithChildren.forEach((item) => addArrowAndListener(item));
	}

	function initSubMenuLevel(levelEl) {
		const itemsWithChildren = levelEl.querySelectorAll(
			".menu-item-has-children",
		);
		itemsWithChildren.forEach((item) => addArrowAndListener(item));
	}

	function openSubMenu(parentItem) {
		const subMenu = parentItem.querySelector(".sub-menu");
		if (!subMenu) return;

		const newLevel = document.createElement("div");
		newLevel.className =
			"header-catalog__level header-catalog__level--" + (currentLevel + 1);

		const newList = subMenu.cloneNode(true);
		newList.classList.remove("sub-menu");
		newList.classList.add("header-catalog__list");

		// Удаляем старые стрелки из клонированного HTML, чтобы добавить их заново с новыми обработчиками
		const oldArrows = newList.querySelectorAll(".header-catalog__arrow");
		oldArrows.forEach((arrow) => arrow.remove());

		newLevel.appendChild(newList);
		levelsContainer.appendChild(newLevel);

		const currentLevelEl = document.querySelector(
			`.header-catalog__level--${currentLevel}`,
		);
		if (currentLevelEl) {
			currentLevelEl.classList.remove("is-active");
			currentLevelEl.classList.add("is-prev");
		}

		setTimeout(() => newLevel.classList.add("is-active"), 50);

		currentLevel++;
		updateHeader();
		initSubMenuLevel(newLevel);
	}

	function openSubMenuFromLevel(parentItem, currentLevelEl) {
		const subMenu = parentItem.querySelector(".sub-menu");
		if (!subMenu) return;

		const newLevel = document.createElement("div");
		newLevel.className =
			"header-catalog__level header-catalog__level--" + (currentLevel + 1);

		const newList = subMenu.cloneNode(true);
		newList.classList.remove("sub-menu");
		newList.classList.add("header-catalog__list");

		// Удаляем старые стрелки из клонированного HTML
		const oldArrows = newList.querySelectorAll(".header-catalog__arrow");
		oldArrows.forEach((arrow) => arrow.remove());

		newLevel.appendChild(newList);
		levelsContainer.appendChild(newLevel);

		currentLevelEl.classList.remove("is-active");
		currentLevelEl.classList.add("is-prev");

		setTimeout(() => newLevel.classList.add("is-active"), 50);

		currentLevel++;
		updateHeader();
		initSubMenuLevel(newLevel);
	}

	// Запуск
	initMenu();
});
document.addEventListener("DOMContentLoaded", () => {
	// 1. Инициализация Swiper (основной + миниатюры)
	if (document.querySelector(".product-main-swiper")) {
		const thumbsSwiper = new Swiper(".product-thumbs-swiper", {
			spaceBetween: 12,
			slidesPerView: 4,
			freeMode: true,
			watchSlidesProgress: true,

			breakpoints: {
				769: {
					slidesPerView: 6,
				},
			},
		});

		const mainSwiper = new Swiper(".product-main-swiper", {
			spaceBetween: 12,
			rewind: true,
			thumbs: {
				swiper: thumbsSwiper,
			},
		});
	}

	// 2. Генерация кнопок вариаций
	const variationsForm = document.querySelector(".variations_form");

	if (variationsForm) {
		const selects = variationsForm.querySelectorAll(".variations select");
		const singleVariationWrap =
			variationsForm.querySelector(".single_variation");
		const addToCartWrap = variationsForm.querySelector(
			".woocommerce-variation-add-to-cart",
		);
		const addToCartBtn = variationsForm.querySelector(
			".single_add_to_cart_button",
		);
		const variationIdInput = variationsForm.querySelector("input.variation_id");
		let isUpdatingDOM = false;

		// Очистка пустых <div role="alert"></div>, которые плодит WooCommerce
		const cleanEmptyAlerts = () => {
			variationsForm
				.querySelectorAll('div[role="alert"]:not(.single_variation)')
				.forEach((el) => {
					el.remove();
				});
		};

		// Разблокировка кнопки "В корзину" и её родительского контейнера
		const unlockAddToCartButton = () => {
			if (addToCartWrap) {
				addToCartWrap.classList.remove(
					"woocommerce-variation-add-to-cart-disabled",
				);
				addToCartWrap.classList.add(
					"woocommerce-variation-add-to-cart-enabled",
				);
			}
			if (addToCartBtn) {
				addToCartBtn.classList.remove(
					"disabled",
					"wc-variation-selection-needed",
					"wc-variation-is-unavailable",
				);
				addToCartBtn.disabled = false;
			}
		};

		// Принудительный показ «Уточнить наличие и цену»
		const enableFallbackVariation = () => {
			cleanEmptyAlerts();

			if (singleVariationWrap) {
				if (window.jQuery) {
					window.jQuery(singleVariationWrap).stop(true, true).show();
				}
				singleVariationWrap.style.display = "block";

				// Обновляем HTML только если там еще нет нашей надписи (чтобы не дергать DOM лишний раз)
				if (!singleVariationWrap.querySelector(".price-on-request")) {
					singleVariationWrap.innerHTML =
						'<div class="woocommerce-variation-price"><span class="price"><span class="price-on-request">Уточнить наличие и цену</span></span></div>';
				}
			}

			unlockAddToCartButton();
		};

		// Синхронизация состояния кнопок
		const updateButtonsState = () => {
			if (isUpdatingDOM) return;
			isUpdatingDOM = true;

			selects.forEach((select) => {
				const container = select.nextElementSibling;
				if (
					!container ||
					!container.classList.contains("custom-variation-buttons")
				)
					return;

				Array.from(select.options).forEach((opt) => {
					if (opt.disabled) opt.disabled = false;
				});

				container.querySelectorAll(".variation-btn").forEach((btn) => {
					const val = btn.getAttribute("data-value");
					btn.classList.remove("disabled");

					if (select.value === val) {
						btn.classList.add("active");
					} else {
						btn.classList.remove("active");
					}
				});
			});

			cleanEmptyAlerts();
			isUpdatingDOM = false;
		};

		selects.forEach((select) => {
			const buttonsContainer = document.createElement("div");
			buttonsContainer.className = "custom-variation-buttons";

			const initialOptions = Array.from(select.options)
				.filter((opt) => opt.value !== "")
				.map((opt) => ({ value: opt.value, text: opt.textContent }));

			if (!select.value && initialOptions.length > 0) {
				select.value = initialOptions[0].value;
			}

			initialOptions.forEach((optData) => {
				const btn = document.createElement("button");
				btn.type = "button";
				btn.className = "variation-btn";
				btn.textContent = optData.text;
				btn.setAttribute("data-value", optData.value);

				if (select.value === optData.value) {
					btn.classList.add("active");
				}

				btn.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopImmediatePropagation(); // Блокируем всплытие сторонних обработчиков WooCommerce

					isUpdatingDOM = true;

					// Жестко ставим active именно на эту кнопку и убираем с остальных
					buttonsContainer
						.querySelectorAll(".variation-btn")
						.forEach((b) => b.classList.remove("active"));
					btn.classList.add("active");

					if (variationIdInput) {
						variationIdInput.value = "";
					}

					let targetOption = Array.from(select.options).find(
						(o) => o.value === optData.value,
					);
					if (!targetOption) {
						targetOption = new Option(optData.text, optData.value, true, true);
						select.add(targetOption);
					}
					targetOption.disabled = false;
					select.value = optData.value;

					isUpdatingDOM = false;

					// Уведомляем WooCommerce об изменении
					if (window.jQuery) {
						window.jQuery(select).trigger("change");
						window.jQuery(variationsForm).trigger("check_variations");
					} else {
						select.dispatchEvent(new Event("change", { bubbles: true }));
					}

					// Спустя мгновемя проверяем результат и включаем fallback, если вариации нет
					setTimeout(() => {
						cleanEmptyAlerts();

						// ДУБЛИРУЕМ защиту класса active на случай, если WC попытался его сбросить
						buttonsContainer
							.querySelectorAll(".variation-btn")
							.forEach((b) => b.classList.remove("active"));
						btn.classList.add("active");

						if (
							!variationIdInput ||
							!variationIdInput.value ||
							variationIdInput.value === "0"
						) {
							enableFallbackVariation();
						} else {
							unlockAddToCartButton();
						}
					}, 30);
				});

				buttonsContainer.appendChild(btn);
			});

			select.after(buttonsContainer);

			const observer = new MutationObserver(updateButtonsState);
			observer.observe(select, { childList: true });
		});

		// События WooCommerce
		if (window.jQuery) {
			window.jQuery(variationsForm).on("hide_variation reset_data", () => {
				enableFallbackVariation();
			});

			window
				.jQuery(variationsForm)
				.on(
					"found_variation.wc-variation-form show_variation",
					(event, variation) => {
						cleanEmptyAlerts();
						if (
							!variation ||
							!variation.price_html ||
							variation.display_price === 0 ||
							variation.display_price === ""
						) {
							enableFallbackVariation();
						} else {
							unlockAddToCartButton();
						}
					},
				);
		}

		// Перехват клика по кнопке "В корзину" (обход встроенной блокировки WooCommerce)
		if (addToCartBtn) {
			addToCartBtn.addEventListener(
				"click",
				(e) => {
					unlockAddToCartButton();

					// Если variation_id пустой, блокируем стандартный обработчик WC (который выдает alert и отменяет отправку)
					// и отправляем форму напрямую
					if (
						!variationIdInput ||
						!variationIdInput.value ||
						variationIdInput.value === "0"
					) {
						e.stopImmediatePropagation();
					}
				},
				true,
			); // true = фаза перехвата (срабатывает раньше jQuery-скрипта WooCommerce)
		}

		// Первичная инициализация при загрузке
		setTimeout(() => {
			if (window.jQuery) {
				window.jQuery(variationsForm).trigger("check_variations");
			}
			setTimeout(() => {
				cleanEmptyAlerts();
				if (
					!variationIdInput ||
					!variationIdInput.value ||
					variationIdInput.value === "0"
				) {
					enableFallbackVariation();
				} else {
					unlockAddToCartButton();
				}
			}, 50);
		}, 100);
	}
});

const allModalBtnsJob = document.querySelectorAll("[data-modal-title]");

if (allModalBtnsJob.length) {
	allModalBtnsJob.forEach((btn) => {
		btn.addEventListener("click", () => {
			const title = btn.getAttribute("data-modal-title");
			const modal = document.querySelector(".modal-job");
			const input = modal.querySelector("#user_job");

			input.value = title;
		});
	});
}
