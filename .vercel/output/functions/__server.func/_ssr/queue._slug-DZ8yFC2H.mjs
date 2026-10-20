import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, t as Cobwebs } from "./shell-Chda9vCy.mjs";
import { n as Route } from "./router-DbnsA1Wz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queue._slug-DZ8yFC2H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmtClock(unix) {
	return new Intl.DateTimeFormat("uk-UA", {
		timeZone: "Europe/Kyiv",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).format(/* @__PURE__ */ new Date(unix * 1e3));
}
function fmtLeft(seconds) {
	const safe = Math.max(0, Math.floor(seconds));
	const h = Math.floor(safe / 3600);
	const m = Math.floor(safe % 3600 / 60);
	const s = safe % 60;
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function PowerProgress({ power }) {
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const tick = () => setNow(Math.floor(Date.now() / 1e3));
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, []);
	const span = Math.max(1, power.to - power.from);
	const pct = now == null ? 0 : Math.min(100, Math.max(0, (now - power.from) / span * 100));
	const left = now == null ? "—" : fmtLeft(power.to - now);
	const fillClass = power.mode === "off" ? "is-off" : "is-on";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `progress ${fillClass}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "progress-top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "progress-title",
					children: power.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `chip ${power.mode === "off" ? "chip-off" : "chip-on"}`,
					children: left
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `bar ${fillClass}`,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${pct}%` } })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "progress-bottom",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: power.mode === "off" ? `Початок ${fmtClock(power.from)}` : `Зараз ${now ? fmtClock(now) : "—"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: power.mode === "clear" ? "Відключень немає" : power.mode === "off" ? `Увімкнення ${fmtClock(power.to)}` : `Далі ${fmtClock(power.to)}` })]
			})
		]
	});
}
function DayStrip({ slots }) {
	const cells = Array.from({ length: 48 }, (_, index) => {
		const minute = index * 30;
		return slots.some((slot) => minute >= slot.startMin && minute < slot.endMin);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "strip-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "day-strip",
			role: "img",
			"aria-label": "Смуга доби: зелене світло, помаранчеве відключення",
			children: cells.map((off, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: off ? "cell cell-off" : "cell cell-on" }, index))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "strip-scale",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "00" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "06" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "18" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "24" })
			]
		})]
	});
}
function SlotList({ slots }) {
	if (slots.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "msg msg-ok",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Світло весь день." }), " Відключень у графіку немає."]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "timeline",
		children: slots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: `slot ${slot.current ? "is-current" : ""} ${slot.upcoming ? "is-next" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "slot-main",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `chip ${slot.current ? "chip-off" : "chip-mid"}`,
						children: slot.current ? "ЗАРАЗ" : slot.upcoming ? "ДАЛІ" : "ВІДКЛ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
						slot.from,
						" — ",
						slot.to
					] }),
					slot.from === "00:00" || slot.to === "00:00" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "chip chip-mid",
						children: "опівніч"
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "chip",
				children: slot.duration
			})]
		}, `${slot.startMin}-${slot.endMin}`))
	});
}
function ScheduleBoard({ today, tomorrow, power }) {
	const [day, setDay] = (0, import_react.useState)("today");
	const view = day === "today" ? today : tomorrow;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "px-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cobwebs, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Графік" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tabs",
					role: "tablist",
					"aria-label": "День",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `px-key px-key-slim ${day === "today" ? "is-down" : ""}`,
						onClick: () => setDay("today"),
						children: "Сьогодні"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `px-key px-key-slim px-key-orange ${day === "tomorrow" ? "is-down" : ""}`,
						onClick: () => setDay("tomorrow"),
						children: "Завтра"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-body",
				children: [
					day === "today" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerProgress, { power }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayStrip, { slots: view.list }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotList, { slots: view.list })
				]
			})
		]
	});
}
function QueuePage() {
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "qhead",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "kicker",
				children: ["ЧЕРГА ", data.queueName]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "h-display",
				children: "Миколаївська область"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "px-key px-key-slim",
				children: "← Назад"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kpi",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "chip chip-on",
				children: ["Світло ", data.today.onLabel]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "chip chip-off",
				children: ["Без світла ", data.today.offLabel]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleBoard, {
			today: data.today,
			tomorrow: data.tomorrow,
			power: data.power
		})
	] });
}
//#endregion
export { QueuePage as component };
