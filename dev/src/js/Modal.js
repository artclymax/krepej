export class Modal {
	constructor(params) {
		const defaultParams = {
			modal: "[data-modal]",
			btn: "[data-modal-btn]",
			btnAttr: "data-modal-btn",
			activeClass: "active-modal",
			closeBtn: "[data-modal-close]",
			modalBox: "[data-modal-box]",
		};

		this.params = { ...defaultParams, ...params };
		this.btns = document.querySelectorAll(this.params.btn);
		this.modals = document.querySelectorAll(this.params.modal);

		this.init();
	}

	init() {
		document.addEventListener("click", (e) => {
			// 1️⃣ Клик по кнопке с data-modal-btn
			const btn = e.target.closest(this.params.btn);
			if (btn) {
				e.preventDefault(); // Останавливаем переход по ссылке и скролл
				const id = btn.getAttribute(this.params.btnAttr);
				if (id) {
					// ✅ Меняем URL БЕЗ скролла
					history.replaceState(null, null, `#${id}`);
					this.openFromHash(); // Открываем модалку вручную
				}
				return;
			}

			// 2️⃣ Клик по ЛЮБОЙ ссылке с хэшем (#id), которая ведет на модалку
			const link = e.target.closest('a[href^="#"]');
			if (link) {
				const id = link.getAttribute("href").replace("#", "");
				if (!id) return;

				const modal = document.getElementById(id);
				if (modal && modal.hasAttribute("data-modal")) {
					e.preventDefault(); // Останавливаем скролл
					// ✅ Меняем URL БЕЗ скролла
					history.replaceState(null, null, `#${id}`);
					this.openFromHash();
					return;
				}
			}

			// 3️⃣ Закрытие по кнопке
			const closeBtn = e.target.closest(this.params.closeBtn);
			if (closeBtn) {
				e.preventDefault(); // Хорошая практика, чтобы предотвратить лишние срабатывания
				this.closeAll();
				// ✅ Очищаем хэш из URL без скролла
				history.replaceState(
					null,
					null,
					window.location.pathname + window.location.search,
				);
				return;
			}

			// 4️⃣ Закрытие по клику вне модалки (на затемненный фон)
			const modal = e.target.closest(this.params.modal);
			if (modal && !e.target.closest(this.params.modalBox)) {
				this.closeAll();
				history.replaceState(
					null,
					null,
					window.location.pathname + window.location.search,
				);
			}
		});

		// Отслеживание хэша (сработает при нажатии кнопок "Назад"/"Вперед" в браузере)
		window.addEventListener("hashchange", () => {
			this.openFromHash();
		});

		// Открытие при загрузке страницы (если в URL уже есть хэш)
		this.openFromHash();
	}

	openFromHash() {
		this.closeAll();

		const hash = location.hash.replace("#", "");
		if (!hash) return;

		const modal = document.getElementById(hash);
		if (!modal) return;
		if (!modal.hasAttribute("data-modal")) return;

		modal.classList.add(this.params.activeClass);
		document.documentElement.classList.add(this.params.activeClass);
	}

	closeAll() {
		this.modals.forEach((modal) => {
			modal.classList.remove(this.params.activeClass);
		});
		document.documentElement.classList.remove(this.params.activeClass);
	}
}
