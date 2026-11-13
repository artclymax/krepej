export function fileBtn(placeholderText = 'Файл не выбран') {
	document.querySelectorAll('.form-file').forEach(input => {
		//let fileLabel = input.parentElement.querySelector('.file-label');
		let fileText = input.parentElement.querySelector('.file-label__text');
		//if (!fileLabel) {
		//	fileLabel = document.createElement('label');
		//	fileLabel.className = 'file-label';
		//	fileLabel.innerHTML = '<span class="file-label-btn">Прикрепить файл</span>';
		//	input.parentElement.appendChild(fileLabel);
		//	fileLabel.appendChild(input);
		//}
		if (!fileText) {
			fileText = document.createElement('div');
			fileText.className = 'file-text';
			fileText.innerHTML = input.closest('.file-label').querySelector('.file-label__text')?.innerHTML || placeholderText;
			input.parentElement.appendChild(fileText);
		}


		// событие change
		input.addEventListener('change', (e) => {
			const fileName = e.target.files[0]?.name || placeholderText ||  'Файл не выбран';
			fileText.innerHTML = fileName;
		});
	});
}