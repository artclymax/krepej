export function cookies() {
	const banner = document.getElementById('cookie-banner');
	if (!banner) return;

	const acceptBtn = document.getElementById('cookie-accept');
	const declineBtn = document.getElementById('cookie-decline');
	const settingsBtn = document.getElementById('cookie-settings');

	const cookieName = 'cookie_consent';
	const cookieExpireDays = 365;

	// 🔍 Ключевые слова для автоматического поиска аналитических скриптов
	const analyticsKeywords = [
		'googletagmanager.com',
		'google-analytics.com',
		'gtag/js',
		'mc.yandex.ru',
		'metrika',
		'facebook.com/tr',
		'googleadservices.com',
		'hotjar.com'
	];

	// --- Функции работы с cookie ---
	function setCookie(name, value, days) {
		const expires = new Date();
		expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
		document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
	}

	function getCookie(name) {
		const nameEQ = name + '=';
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i].trim();
			if (cookie.indexOf(nameEQ) === 0) {
				return decodeURIComponent(cookie.substring(nameEQ.length));
			}
		}
		return null;
	}

	// --- Управление баннером ---
	function hideBanner() {
		banner.classList.add('hide');
		banner.setAttribute('aria-hidden', 'true');
		const handleTransitionEnd = () => {
			if (banner.classList.contains('hide')) banner.style.display = 'none';
			banner.removeEventListener('transitionend', handleTransitionEnd);
		};
		banner.addEventListener('transitionend', handleTransitionEnd);
	}

	function showBanner() {
		banner.style.display = '';
		setTimeout(() => {
			banner.classList.remove('hide');
			banner.setAttribute('aria-hidden', 'false');
		}, 10);
	}

	// --- 🤖 АВТОМАТИЧЕСКИЙ СКАНЕР И БЛОКИРОВЩИК СКРИПТОВ ---
	function processAnalyticsScripts(action) {
		const scripts = document.querySelectorAll('script');

		scripts.forEach(script => {
			const src = script.src || '';
			const content = script.textContent || '';

			// Проверяем, является ли скрипт аналитическим
			const isAnalytics = analyticsKeywords.some(keyword =>
				src.toLowerCase().includes(keyword) || content.toLowerCase().includes(keyword)
			);

			// Игнорируем скрипты, которые мы сами управляем, чтобы не зациклить
			if (script.id === 'cookie-script' || script.hasAttribute('data-cookie-map')) return;

			if (isAnalytics) {
				if (action === 'block') {
					// Если еще не заблокирован, блокируем
					if (!script.hasAttribute('data-blocked-src') && !script.hasAttribute('data-blocked-content')) {
						if (src) {
							script.setAttribute('data-blocked-src', src);
							script.removeAttribute('src');
						}
						if (content) {
							script.setAttribute('data-blocked-content', content);
							script.textContent = '';
						}
						script.type = 'application/json'; // Браузер игнорирует этот тип и не выполняет
						console.log(`🛑 [Cookies] Авто-блокировка скрипта:`, src || 'inline-скрипт');
					}
				} else if (action === 'enable') {
					// Если заблокирован, восстанавливаем и выполняем
					const originalSrc = script.getAttribute('data-blocked-src');
					const originalContent = script.getAttribute('data-blocked-content');

					if (originalSrc || originalContent) {
						// Создаем новый тег script, чтобы браузер гарантированно его выполнил
						const newScript = document.createElement('script');
						if (originalSrc) newScript.src = originalSrc;
						if (originalContent) newScript.textContent = originalContent;
						newScript.type = 'text/javascript';

						// Копируем оригинальные атрибуты (async, defer, id, class)
						Array.from(script.attributes).forEach(attr => {
							if (attr.name !== 'data-blocked-src' && attr.name !== 'data-blocked-content') {
								newScript.setAttribute(attr.name, attr.value);
							}
						});

						// Заменяем старый (заблокированный) скрипт на новый (активный)
						script.parentNode.replaceChild(newScript, script);
						console.log(`✅ [Cookies] Авто-разблокировка и запуск:`, originalSrc || 'inline-скрипт');
					}
				}
			}
		});
	}

	// --- Управление картой ---
	function handleMaps() {
		const mapContainers = document.querySelectorAll('div[data-cookie-map]');

		mapContainers.forEach(container => {
			const mapSrc = container.getAttribute('data-map-src');
			if (!mapSrc) return;

			const consent = getCookie(cookieName);

			if (consent === 'accepted') {
				container.innerHTML = `<iframe src="${mapSrc}" allowfullscreen="" loading="lazy" style="width:100%; height:100%; border:0; display:block;"></iframe>`;
			} else {
				container.innerHTML = `
					<div class="cookie-map-placeholder" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; background:#f5f5f5; border: 2px dashed #ccc; border-radius: 8px; text-align:center; padding:20px; box-sizing: border-box;">
						<p style="margin: 0 0 15px 0; color: #555; font-size: 14px;">Для просмотра карты необходимо согласие на использование файлов cookie</p>
						<button class="cookie-map-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">Показать карту</button>
					</div>
				`;

				const placeholderBtn = container.querySelector('.cookie-map-btn');
				if (placeholderBtn) {
					placeholderBtn.addEventListener('click', () => {
						if (settingsBtn) {
							showBanner(); // Открываем настройки, чтобы пользователь дал согласие
						} else {
							setCookie(cookieName, 'accepted', cookieExpireDays);
							handleMaps();
							processAnalyticsScripts('enable');
							hideBanner();
						}
					});
				}
			}
		});
	}

	// --- Инициализация при загрузке ---
	function init() {
		const existingConsent = getCookie(cookieName);

		if (existingConsent === 'accepted') {
			banner.style.display = 'none';
			processAnalyticsScripts('enable');
		} else if (existingConsent === 'declined') {
			banner.style.display = 'none';
			processAnalyticsScripts('block');
		} else {
			showBanner();
			processAnalyticsScripts('block'); // Блокируем всё до принятия решения
		}

		handleMaps(); // Всегда проверяем состояние карт
	}

	// --- Обработчики кнопок ---
	if (acceptBtn) {
		acceptBtn.addEventListener('click', function () {
			setCookie(cookieName, 'accepted', cookieExpireDays);
			hideBanner();
			processAnalyticsScripts('enable');
			handleMaps();
			document.dispatchEvent(new CustomEvent('cookieConsentAccepted'));
		});
	}

	if (declineBtn) {
		declineBtn.addEventListener('click', function () {
			setCookie(cookieName, 'declined', cookieExpireDays);
			hideBanner();
			processAnalyticsScripts('block');
			handleMaps();
			document.dispatchEvent(new CustomEvent('cookieConsentDeclined'));

			// Опционально: перезагрузка страницы для гарантированной очистки сессий трекеров
			// setTimeout(() => location.reload(), 500); 
		});
	}

	if (settingsBtn) {
		settingsBtn.addEventListener('click', function () {
			showBanner();
		});
	}

	// Запускаем
	init();
}