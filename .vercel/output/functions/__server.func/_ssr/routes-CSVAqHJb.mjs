import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, X as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, t as Cobwebs } from "./shell-Chda9vCy.mjs";
import { a as searchCities, i as lookupAddress, o as searchHouses, r as Route$2, s as searchStreets } from "./router-DbnsA1Wz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSVAqHJb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Combo({ id, label, value, placeholder, disabled, hits, open, busy, onFocus, onChange, onPick }) {
	const listId = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `field ${disabled ? "is-locked" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				className: "px-input",
				value,
				placeholder,
				disabled,
				autoComplete: "off",
				role: "combobox",
				"aria-expanded": open,
				"aria-controls": listId,
				onFocus,
				onChange: (event) => onChange(event.target.value)
			}),
			open && !disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "suggest",
				id: listId,
				role: "listbox",
				children: [
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "suggest-note",
						children: "Шукаю…"
					}) : null,
					!busy && hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "suggest-note",
						children: "Нічого не знайдено"
					}) : null,
					hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "option",
						onMouseDown: () => onPick(hit),
						children: hit
					}, hit))
				]
			}) : null
		]
	});
}
function SearchPanel({ queues }) {
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("queue");
	const [city, setCity] = (0, import_react.useState)("");
	const [street, setStreet] = (0, import_react.useState)("");
	const [house, setHouse] = (0, import_react.useState)("");
	const [cityReady, setCityReady] = (0, import_react.useState)(false);
	const [streetReady, setStreetReady] = (0, import_react.useState)(false);
	const [houseReady, setHouseReady] = (0, import_react.useState)(false);
	const [cityHits, setCityHits] = (0, import_react.useState)([]);
	const [streetHits, setStreetHits] = (0, import_react.useState)([]);
	const [houseHits, setHouseHits] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [searching, setSearching] = (0, import_react.useState)(false);
	const cityTimer = (0, import_react.useRef)(0);
	const streetTimer = (0, import_react.useRef)(0);
	const houseTimer = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		function onPointer(event) {
			const target = event.target;
			if (!(target instanceof Element) || !target.closest(".field")) setOpen(null);
		}
		document.addEventListener("pointerdown", onPointer);
		return () => {
			document.removeEventListener("pointerdown", onPointer);
			window.clearTimeout(cityTimer.current);
			window.clearTimeout(streetTimer.current);
			window.clearTimeout(houseTimer.current);
		};
	}, []);
	function queueCities(term) {
		window.clearTimeout(cityTimer.current);
		cityTimer.current = window.setTimeout(async () => {
			setBusy("city");
			try {
				setCityHits(await searchCities({ data: { term } }));
			} catch {
				setCityHits([]);
				setNote("Не вдалося отримати населені пункти");
			} finally {
				setBusy((current) => current === "city" ? null : current);
			}
		}, 220);
	}
	function queueStreets(nextCity, term) {
		window.clearTimeout(streetTimer.current);
		streetTimer.current = window.setTimeout(async () => {
			setBusy("street");
			try {
				setStreetHits(await searchStreets({ data: {
					city: nextCity,
					term
				} }));
			} catch {
				setStreetHits([]);
			} finally {
				setBusy((current) => current === "street" ? null : current);
			}
		}, 220);
	}
	function queueHouses(nextCity, nextStreet, term) {
		window.clearTimeout(houseTimer.current);
		houseTimer.current = window.setTimeout(async () => {
			setBusy("house");
			try {
				setHouseHits(await searchHouses({ data: {
					city: nextCity,
					street: nextStreet,
					term
				} }));
			} catch {
				setHouseHits([]);
			} finally {
				setBusy((current) => current === "house" ? null : current);
			}
		}, 220);
	}
	async function pickCity(name) {
		setCity(name);
		setCityReady(true);
		setStreet("");
		setStreetReady(false);
		setHouse("");
		setHouseReady(false);
		setOpen(null);
		setNote("");
		setBusy("street");
		try {
			const list = await searchStreets({ data: {
				city: name,
				term: ""
			} });
			setStreetHits(list);
			if (list.length === 0) setNote("У довіднику немає вулиць для цього пункту.");
		} catch {
			setStreetHits([]);
			setNote("Не вдалося завантажити вулиці");
		} finally {
			setBusy(null);
		}
	}
	async function pickStreet(name) {
		setStreet(name);
		setStreetReady(true);
		setHouse("");
		setHouseReady(false);
		setOpen(null);
		setNote("");
		setBusy("house");
		try {
			const list = await searchHouses({ data: {
				city,
				street: name,
				term: ""
			} });
			setHouseHits(list);
			if (list.length === 0) setNote("У довіднику немає будинків на цій вулиці.");
		} catch {
			setHouseHits([]);
			setNote("Не вдалося завантажити будинки");
		} finally {
			setBusy(null);
		}
	}
	async function submit() {
		if (!cityReady || !streetReady || !houseReady || searching) return;
		setSearching(true);
		setNote("");
		try {
			const result = await lookupAddress({ data: {
				city,
				street,
				house
			} });
			if (!result.slug) {
				setNote("Чергу для цієї адреси не знайдено.");
				return;
			}
			await navigate({
				to: "/queue/$slug",
				params: { slug: result.slug }
			});
		} catch {
			setNote("Пошук не вдався. Спробуйте ще раз.");
		} finally {
			setSearching(false);
		}
	}
	const tones = [
		"",
		"px-key-orange",
		"px-key-green"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "px-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cobwebs, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Пошук" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tabs",
					role: "tablist",
					"aria-label": "Пошук",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `px-key px-key-slim ${tab === "queue" ? "is-down" : ""}`,
						onClick: () => setTab("queue"),
						children: "Черга"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `px-key px-key-slim px-key-orange ${tab === "address" ? "is-down" : ""}`,
						onClick: () => setTab("address"),
						children: "Адреса"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel-body",
				children: tab === "queue" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "queue-grid",
					children: queues.map((queue, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: `px-key ${tones[index % tones.length]}`,
						to: "/queue/$slug",
						params: { slug: queue.slug },
						children: queue.name
					}, queue.slug))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "addr-form",
					onSubmit: (event) => {
						event.preventDefault();
						submit();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Combo, {
							id: "city",
							label: "Населений пункт",
							value: city,
							placeholder: "Напр. Миколаїв",
							hits: cityHits,
							open: open === "city",
							busy: busy === "city",
							onFocus: () => {
								setOpen("city");
								queueCities(city);
							},
							onChange: (value) => {
								setCity(value);
								setCityReady(false);
								setStreet("");
								setStreetReady(false);
								setHouse("");
								setHouseReady(false);
								setOpen("city");
								queueCities(value);
							},
							onPick: (value) => void pickCity(value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Combo, {
							id: "street",
							label: "Вулиця",
							value: street,
							placeholder: "Назва вулиці",
							disabled: !cityReady,
							hits: streetHits,
							open: open === "street",
							busy: busy === "street",
							onFocus: () => {
								if (!cityReady) return;
								setOpen("street");
								queueStreets(city, street);
							},
							onChange: (value) => {
								setStreet(value);
								setStreetReady(false);
								setHouse("");
								setHouseReady(false);
								setOpen("street");
								queueStreets(city, value);
							},
							onPick: (value) => void pickStreet(value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Combo, {
							id: "house",
							label: "Будинок",
							value: house,
							placeholder: "№",
							disabled: !streetReady,
							hits: houseHits,
							open: open === "house",
							busy: busy === "house",
							onFocus: () => {
								if (!streetReady) return;
								setOpen("house");
								queueHouses(city, street, house);
							},
							onChange: (value) => {
								setHouse(value);
								setHouseReady(false);
								setOpen("house");
								queueHouses(city, street, value);
							},
							onPick: (value) => {
								setHouse(value);
								setHouseReady(true);
								setOpen(null);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "field field-action",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-key px-key-green px-key-wide",
								type: "submit",
								disabled: !cityReady || !streetReady || !houseReady || searching,
								children: searching ? "Шукаю…" : "Показати графік"
							})
						}),
						note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "form-note",
							children: note
						}) : null
					]
				})
			})
		]
	});
}
function Home() {
	const { queues } = Route$2.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "hero",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "ГРАФІК · МИКОЛАЇВЩИНА"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "h-display",
				children: "Відключення світла"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "lede",
				children: [
					"Оберіть чергу або знайдіть будинок. Розклад іде з",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://off.energy.mk.ua",
						target: "_blank",
						rel: "noreferrer",
						children: "off.energy.mk.ua"
					}),
					"."
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "layout",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchPanel, { queues }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "px-panel side",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cobwebs, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Як це працює" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Черга — це група адрес, які вимикають разом. Знайдіть свою і подивіться, коли згасне і коли повернеться." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "legend",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "chip chip-on",
								children: "світло"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "chip chip-off",
								children: "відключення"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "chip chip-mid",
								children: "наступне"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "side-note",
						children: "Регіон: Миколаївська область. Клавіші світяться, коли на них навести."
					})
				]
			})]
		})]
	})] });
}
//#endregion
export { Home as component };
