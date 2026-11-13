import { defineConfig } from "vite";
import path from "path";
import FullReload from "vite-plugin-full-reload";

const FRONT_DIR = path.resolve(__dirname);
const SRC_DIR = path.resolve(FRONT_DIR, "src");
const THEME_DIR = path.resolve(FRONT_DIR, "..");

// ВОЗВРАЩАЕМ ШИРОКИЙ GLOB (как было изначально)
// Отслеживаем ВСЕ php-файлы в теме
const PHP_GLOB = path.resolve(THEME_DIR, "**", "*.php").replace(/\\/g, "/");

export default defineConfig(({ mode }) => {
	const isDev = mode === "development";
	const isUnminified = mode === "unminified";

	const shouldMinify = !isDev && !isUnminified;

	return {
		root: SRC_DIR,
		publicDir: path.resolve(__dirname, "public"),

		css: {
			minify: !shouldMinify,
		},

		server: {
			host: "localhost",
			port: 5173,
			strictPort: true,
			cors: true,
			fs: {
				allow: [FRONT_DIR, THEME_DIR],
			},
		},

		build: {
			minify: shouldMinify ? "esbuild" : false,
			cssMinify: shouldMinify ? "esbuild" : false,
			sourcemap: isDev || isUnminified,
			outDir: path.resolve(THEME_DIR, "assets"),
			emptyOutDir: true,
			manifest: false,

			rollupOptions: {
				input: path.resolve(SRC_DIR, "main.js"),
				output: {
					entryFileNames: "main.js",
					chunkFileNames: "chunks/[name].js",
					assetFileNames: (assetInfo) => {
						const name = assetInfo.name || "";
						if (name.endsWith(".css")) return "style.css";
						return "assets/[name][extname]";
					},
					inlineDynamicImports: true,
				},
			},
		},

		plugins: [
			// FullReload теперь следит за ВСЕМИ php-файлами в теме
			isDev && FullReload(PHP_GLOB),
		].filter(Boolean),

		resolve: {
			alias: {
				"@": SRC_DIR,
			},
		},
	};
});
