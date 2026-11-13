export class Tabs {
	constructor(params) {
		const defaultParams = {
			tab: "[data-tab]",
			link: "[data-tab-link]",
			activeClass: "active-tab",
			onActivate: null,
		};

		this.params = { ...defaultParams, ...params };
		this.links = document.querySelectorAll(this.params.link);
		this.tabs = document.querySelectorAll(this.params.tab);

		this.init();
	}

	init() {
		if (!this.links.length || !this.tabs.length) return;

		const hash = window.location.hash;
		let targetTab = null;
		let targetLink = null;

		if (hash) {
			const targetId = hash.replace("#", "");

			// 1. Ищем точное совпадение ID таба
			targetTab = document.querySelector(
				`${this.params.tab}[id="${targetId}"]`,
			);

			if (targetTab) {
				targetLink = this.findLinkByTabId(targetId);
			} else {
				// 2. Ищем "родительский" таб (если хэш указывает на вложенный элемент)
				for (let i = 0; i < this.tabs.length; i++) {
					const tabId = this.tabs[i].id;
					if (tabId && targetId.startsWith(tabId + "-")) {
						targetTab = this.tabs[i];
						targetLink = this.findLinkByTabId(tabId);
						break;
					}
				}
			}
		}

		const initialLink = targetLink || this.links[0];
		const initialTab = targetTab || this.tabs[0];

		// ВАЖНО: сначала убираем классы со всех, потом добавляем только к нужным
		this.links.forEach((l) => l.classList.remove(this.params.activeClass));
		this.tabs.forEach((t) => t.classList.remove(this.params.activeClass));

		if (initialLink) initialLink.classList.add(this.params.activeClass);
		if (initialTab) initialTab.classList.add(this.params.activeClass);

		// Вызываем колбэк после первоначальной активации
		if (this.params.onActivate && initialLink && initialTab) {
			this.params.onActivate(initialLink, initialTab);
		}

		document.addEventListener("click", (e) => {
			const link = e.target.closest(this.params.link);
			if (!link) return;

			e.preventDefault();
			this.activateTab(link);
		});
	}

	// Надёжный поиск ссылки по ID таба (работает даже если href содержит полный URL)
	findLinkByTabId(tabId) {
		return Array.from(this.links).find((l) => {
			const href = l.getAttribute("href") || "";
			return href === `#${tabId}` || href.endsWith(`#${tabId}`);
		});
	}

	activateTab(link) {
		const targetId = (link.getAttribute("href") || "").replace("#", "");
		const tab = document.querySelector(`${this.params.tab}[id="${targetId}"]`);

		if (!tab) {
			console.warn(`[Tabs] Контент с id="${targetId}" не найден`);
			return;
		}

		this.links.forEach((l) => l.classList.remove(this.params.activeClass));
		link.classList.add(this.params.activeClass);

		this.tabs.forEach((t) => t.classList.remove(this.params.activeClass));
		tab.classList.add(this.params.activeClass);

		if (this.params.onActivate) {
			this.params.onActivate(link, tab);
		}
	}
}
