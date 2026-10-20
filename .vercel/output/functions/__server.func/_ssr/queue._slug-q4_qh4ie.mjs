import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell } from "./shell-Chda9vCy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queue._slug-q4_qh4ie.js
var import_jsx_runtime = require_jsx_runtime();
function MissingQueue() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "kicker",
			children: "404"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "h-display",
			children: "Такої черги немає"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "lede",
			children: "Поверніться на головну і оберіть чергу зі списку."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "px-key px-key-orange",
			children: "На головну"
		})
	] });
}
//#endregion
export { MissingQueue as notFoundComponent };
