/*
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import ttf2woff from 'ttf2woff'
import ttf2woff2 from 'ttf2woff2'

// ===============================
// ESM-аналог __dirname
// ===============================
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// scripts/
const SCRIPTS_DIR = __dirname

// dev/
const FRONT_DIR = path.resolve(SCRIPTS_DIR, '..')

// theme/
const THEME_DIR = path.resolve(FRONT_DIR, '..')

// dev/public/fonts — источник
const publicFontsDir = path.resolve(FRONT_DIR, 'public/fonts')

// theme/assets/fonts — результат
const outputFontsDir = path.resolve(THEME_DIR, 'assets/fonts')

// ===============================
// safety checks
// ===============================
if (!fs.existsSync(publicFontsDir)) {
	throw new Error(`Public fonts dir not found: ${publicFontsDir}`)
}

fs.mkdirSync(outputFontsDir, { recursive: true })

// ===============================
// convert
// ===============================
fs.readdirSync(publicFontsDir).forEach(file => {
	if (!file.endsWith('.ttf')) return

	const input = fs.readFileSync(path.join(publicFontsDir, file))
	const name = file.replace('.ttf', '')

	fs.writeFileSync(
		path.join(outputFontsDir, `${name}.woff`),
		Buffer.from(ttf2woff(input).buffer)
	)

	fs.writeFileSync(
		path.join(outputFontsDir, `${name}.woff2`),
		ttf2woff2(input)
	)
})

console.log('✔ Fonts converted successfully')
*/
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import ttf2woff from 'ttf2woff'
import ttf2woff2 from 'ttf2woff2'

// ===============================
// ESM dirname
// ===============================
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// директории
const SCRIPTS_DIR = __dirname
const FRONT_DIR = path.resolve(SCRIPTS_DIR, '..')
const THEME_DIR = path.resolve(FRONT_DIR, '..')

// пути
const publicFontsDir = path.resolve(FRONT_DIR, 'public/fonts')
const outputFontsDir = path.resolve(THEME_DIR, 'assets/fonts')
const fontsCssPath = path.resolve(THEME_DIR, 'assets/fonts.css')

// ===============================
// подготовка
// ===============================
if (!fs.existsSync(publicFontsDir)) {
	throw new Error(`Public fonts dir not found: ${publicFontsDir}`)
}

fs.mkdirSync(outputFontsDir, { recursive: true })

let css = ``;

// ===============================
// карта веса
// ===============================
const weightMap = {
	thin: 100,
	extralight: 200,
	ultralight: 200,
	light: 300,
	regular: 400,
	normal: 400,
	medium: 500,
	semibold: 600,
	demibold: 600,
	bold: 700,
	extrabold: 800,
	ultrabold: 800,
	black: 900,
	heavy: 900,
}

// ===============================
// структура для фильтрации дубликатов
const generatedFonts = new Set()

// ===============================
// конвертация и генерация CSS
// ===============================
fs.readdirSync(publicFontsDir).forEach(file => {
	const ext = path.extname(file).toLowerCase()
	if (ext !== '.ttf' && ext !== '.otf') return // игнорируем все остальные

	const name = file.replace(ext, '')
	const input = fs.readFileSync(path.join(publicFontsDir, file))

	// ===============================
	// копируем оригинал в assets/fonts
	// ===============================
	fs.copyFileSync(path.join(publicFontsDir, file), path.join(outputFontsDir, file))

	// ===============================
	// проверка VariableFont
	// ===============================
	const isVariable = /variable|vf/i.test(name)
	const outputName = name // файлы оставляем с оригинальным именем

	// ===============================
	// конвертация в woff/woff2
	// ===============================
	fs.writeFileSync(
		path.join(outputFontsDir, `${outputName}.woff`),
		Buffer.from(ttf2woff(input).buffer)
	)
	fs.writeFileSync(
		path.join(outputFontsDir, `${outputName}.woff2`),
		ttf2woff2(input)
	)

	// ===============================
	// определяем font-family, weight, style
	// ===============================
	const parts = name.split('-')
	let family = parts[0]
	const stylePart = parts.slice(1).join('-').toLowerCase()

	let weight = 400
	for (const [key, val] of Object.entries(weightMap)) {
		if (stylePart.includes(key)) {
			weight = val
			break
		}
	}

	const fontStyle = stylePart.includes('italic') ? 'italic' : 'normal'

	// ===============================
	// добавляем -VF для CSS если Variable
	// ===============================
	if (isVariable) {
		family += '-VF'
	}

	// ===============================
	// проверка на дубликат
	// ===============================
	const fontKey = `${family}-${weight}-${fontStyle}`
	if (generatedFonts.has(fontKey)) return
	generatedFonts.add(fontKey)

	// ===============================
	// генерация CSS (только woff/woff2)
	// ===============================
	let fontWeightCss = weight
	if (isVariable) {
		// для Variable Fonts ставим диапазон
		fontWeightCss = '100 900'
	}

	css += `
@font-face {
\tfont-family: '${family}';
\tsrc:
\t\turl('./fonts/${outputName}.woff2') format('${isVariable ? 'woff2-variations' : 'woff2'}'),
\t\turl('./fonts/${outputName}.woff') format('woff');
\tfont-weight: ${fontWeightCss};
\tfont-style: ${fontStyle};
\tfont-display: swap;
}
`

})

// ===============================
// записываем CSS
// ===============================
fs.writeFileSync(fontsCssPath, css.trim() + '\n')

console.log('✔ Fonts copied, converted & fonts.css generated (duplicates filtered, VF in CSS)')
