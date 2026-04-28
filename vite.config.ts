import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	server: {
		fs: {
			strict: false,
		},
	},
	preview: {
		allowedHosts: [".onrender.com"],
	},
	plugins: [
		{
			name: "fix-external-ip-assets",
			configureServer(server) {
				server.middlewares.use((req, _res, next) => {
					// If sec-fetch-dest is missing (e.g. from external IP in Chrome)
					// and the request is for an asset, pretend it's a script/style so Nitro doesn't intercept it.
					if (!req.headers["sec-fetch-dest"] && req.url) {
						const ext = req.url.match(/\.([a-z0-9]+)(?:[?#]|$)/i)?.[1];
						if (ext) {
							if (["js", "mjs", "ts", "tsx", "jsx"].includes(ext)) {
								req.headers["sec-fetch-dest"] = "script";
							} else if (["css"].includes(ext)) {
								req.headers["sec-fetch-dest"] = "style";
							} else if (
								["png", "jpg", "jpeg", "svg", "gif", "webp"].includes(ext)
							) {
								req.headers["sec-fetch-dest"] = "image";
							}
						}
					}
					next();
				});
			},
		},
		devtools(),
		nitro({
			experimental: { websocket: true },
			rollupConfig: { external: [/^@sentry\//] },
			handlers: [
				{ route: "/api/ws", handler: "./src/routes/api/-ws.ts" },
				{ route: "/api/bot", handler: "./src/routes/api/-bot.ts" },
			],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
