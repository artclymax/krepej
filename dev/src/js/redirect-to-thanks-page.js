document.addEventListener('wpcf7mailsent', function (event) {
	const form = event.target;

	// Получаем значения полей
	let name = form.querySelector('input[name="your-name"]').value;
	let phone = form.querySelector('input[name="your-phone"]').value;

	// Делаем редирект на страницу «спасибо»
	window.location.href = "/thank-you/?name=" + encodeURIComponent(name) + "&phone=" + encodeURIComponent(phone);
});
