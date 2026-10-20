import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, t as Cobwebs } from "./shell-Chda9vCy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-Dq_fwG_b.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "kicker",
			children: "КОНТАКТИ"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "h-display",
			children: "Звідки графік"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "px-panel about-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cobwebs, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Розклад відключень береться з відкритих даних",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://off.energy.mk.ua",
							target: "_blank",
							rel: "noreferrer",
							children: "off.energy.mk.ua"
						}),
						". Сайт лише показує черги Миколаївської області у зручнішому вигляді."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Адреса шукається за населеним пунктом, вулицею і будинком. Якщо черги немає в довіднику — графік не вигадається." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "px-key px-key-green",
						children: "До графіка"
					})
				]
			})]
		})
	] });
}
//#endregion
export { About as component };
