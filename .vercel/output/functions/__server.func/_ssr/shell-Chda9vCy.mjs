import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-Chda9vCy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILL = {
	orange: "var(--color-orange)",
	green: "var(--color-green)",
	purple: "var(--color-purple)",
	ink: "var(--color-ink)",
	void: "var(--color-void)"
};
function cells(rows, ink) {
	const out = [];
	rows.forEach((row, y) => {
		[...row].forEach((ch, x) => {
			const c = ink[ch];
			if (c) out.push({
				x,
				y,
				c
			});
		});
	});
	return out;
}
function Sprite({ rows, ink, className }) {
	const w = Math.max(...rows.map((row) => row.length));
	const h = rows.length;
	const dots = cells(rows, ink);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: `sprite ${className}`,
		viewBox: `0 0 ${w} ${h}`,
		"aria-hidden": "true",
		children: dots.map((dot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: dot.x,
			y: dot.y,
			width: "1",
			height: "1",
			fill: FILL[dot.c]
		}, `${dot.x}-${dot.y}`))
	});
}
var PUMPKIN = [
	"......gg......",
	"......gg......",
	"...oooooooo...",
	"..oooooooooo..",
	".oooooooooooo.",
	".ookooooookoo.",
	".ookooooookoo.",
	".oooooooooooo.",
	".ooookkkkoooo.",
	"..ookkkkkkoo..",
	"..oooooooooo..",
	"...oooooooo...",
	"....oooooo...."
];
var BAT = [
	"..pp......pp..",
	".pppp....pppp.",
	"pppppppppppppp",
	".ppikkkkkippp.",
	"..pppppppppp..",
	"...pppppppp...",
	"....pp..pp...."
];
var GHOST = [
	"...iiiiii...",
	"..iiiiiiii..",
	".iiiiiiiiii.",
	".iippiippii.",
	".ikkiiiikki.",
	".iiiiiiiiii.",
	".iiiiiiiiii.",
	".iiiiiiiiii.",
	".i.ii.ii.ii.",
	"..i..i..i..."
];
var SPIDER = [
	"..k.k..",
	".kkkkk.",
	"kkkkkkk",
	".k.k.k.",
	"..kkk..",
	".k...k.",
	"k.....k"
];
var paint = {
	o: "orange",
	g: "green",
	p: "purple",
	i: "ink",
	k: "void"
};
function Pumpkin({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprite, {
		className: `sprite-pumpkin ${className}`,
		rows: PUMPKIN,
		ink: paint
	});
}
function Bat({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprite, {
		className: `sprite-bat ${className}`,
		rows: BAT,
		ink: paint
	});
}
function Ghost({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprite, {
		className: `sprite-ghost ${className}`,
		rows: GHOST,
		ink: paint
	});
}
function Spider({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprite, {
		className: `sprite-spider ${className}`,
		rows: SPIDER,
		ink: paint
	});
}
function NowClock() {
	const [text, setText] = (0, import_react.useState)("--:--:--");
	(0, import_react.useEffect)(() => {
		const tick = () => {
			setText(new Intl.DateTimeFormat("uk-UA", {
				timeZone: "Europe/Kyiv",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hourCycle: "h23"
			}).format(/* @__PURE__ */ new Date()));
		};
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
		className: "clock",
		dateTime: text,
		children: text
	});
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scene",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "floater floater-a",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bat, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "floater floater-b",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bat, { className: "flip" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "floater floater-c",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ghost, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "floater floater-d",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ghost, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "floater floater-e",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pumpkin, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "floater floater-f",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bat, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "hud",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container topbar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pumpkin, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "wordmark",
							children: "СВІТЛО.МК"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "brand-sub",
							children: "МИКОЛАЇВ"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-side",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "chip chip-on",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "led" }), "КИЇВ"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NowClock, {})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "main",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "foot",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container foot-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Дані:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://off.energy.mk.ua",
							target: "_blank",
							rel: "noreferrer",
							children: "off.energy.mk.ua"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						children: "Контакти"
					})]
				})
			})
		]
	});
}
function Cobwebs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "web web-tl",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spider, { className: "web-spider" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "web web-tr",
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "web web-bl",
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "web web-br",
			"aria-hidden": "true"
		})
	] });
}
//#endregion
export { Shell as n, Cobwebs as t };
