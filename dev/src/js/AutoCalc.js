export class AutoCalc {
	constructor(selector, options) {
		const defaultOptions = {
			selector: '[data-auto-calc]',
			units: 'rem',
		}

		this.options = Object.assign(defaultOptions, options);
		this.selector = selector || this.options.selector;
		this.elements = document.querySelectorAll(this.selector);

		this.init()
	}

	setValue(name, property, value) {
		const { units } = this.options;
		const valueUnits = units === 'rem' ? value / 16 + 'rem' : units === 'em' ? value / 16 + 'em' : value + 'px';

		document.querySelector(':root').style.setProperty(`--${name}-${property}`, valueUnits);
	}

	calcValue(element, props) {
		const [name, property] = props;

		if (property === 'width') {
			const value = element.offsetWidth;
			this.setValue(name, property, value);
			return;
		}

		if (property === 'height') {
			const value = element.offsetHeight;
			this.setValue(name, property, value);
			return;
		}

		const values = [element.offsetWidth, element.offsetHeight];
		const properties = ['width', 'height'];

		values.forEach((value, index) => this.setValue(name, properties[index], value))
	}

	init() {
		if (!this.elements.length) return;

		// Функция для пересчёта всех элементов
		const recalcAll = () => {
			this.elements.forEach((element) => {
				const props = element.getAttribute('data-auto-calc').toLowerCase().replaceAll(' ', '').split(',');
				this.calcValue(element, props);
			});
		};

		// Считаем сразу при инициализации (если DOM уже готов)
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			recalcAll();
		} else {
			// Ждём загрузки страницы
			window.addEventListener('DOMContentLoaded', recalcAll);
		}

		// Пересчитываем при изменении размера окна
		window.addEventListener('resize', recalcAll);
	}
}