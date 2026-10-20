//#region node_modules/.nitro/vite/services/ssr/assets/outage.server-Dn28-cO-.js
var ORIGIN = "https://off.energy.mk.ua";
var KYIV = "Europe/Kyiv";
var cache = /* @__PURE__ */ new Map();
function normalizeKey(value) {
	return value.trim().replace(/\s+/g, " ").toLowerCase();
}
function queueNameToSlug(name) {
	return name.replace(/\./g, "-");
}
function slugToQueueName(slug) {
	return slug.replace(/-/g, ".");
}
async function fetchJson(url, ttlMs) {
	const hit = cache.get(url);
	if (hit && hit.expiresAt > Date.now()) return hit.value;
	const res = await fetch(url, {
		headers: {
			accept: "application/json",
			"user-agent": "Mozilla/5.0 (compatible; SvitloMK/1.0)"
		},
		signal: AbortSignal.timeout(12e3)
	});
	if (!res.ok) throw new Error(`Джерело off.energy.mk.ua відповіло ${res.status}`);
	const data = await res.json();
	cache.set(url, {
		value: data,
		expiresAt: Date.now() + ttlMs
	});
	return data;
}
function kyivParts(date) {
	const fmt = new Intl.DateTimeFormat("en-GB", {
		timeZone: KYIV,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23"
	});
	const bag = {};
	for (const part of fmt.formatToParts(date)) if (part.type !== "literal") bag[part.type] = part.value;
	return bag;
}
function dateKeyKyiv(date) {
	const p = kyivParts(date);
	return `${p.year}-${p.month}-${p.day}`;
}
function addDaysKey(key, days) {
	const [y, m, d] = key.split("-").map(Number);
	const utc = new Date(Date.UTC(y, m - 1, d + days));
	const mm = String(utc.getUTCMonth() + 1).padStart(2, "0");
	const dd = String(utc.getUTCDate()).padStart(2, "0");
	return `${utc.getUTCFullYear()}-${mm}-${dd}`;
}
function kyivDateTimeToUnix(key, minutes) {
	const [y, m, d] = key.split("-").map(Number);
	const targetMin = minutes;
	let guess = Date.UTC(y, m - 1, d, Math.floor(minutes / 60) - 3, minutes % 60, 0);
	for (let i = 0; i < 4; i++) {
		const p = kyivParts(new Date(guess));
		const actualAbs = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day)) / 6e4 + Number(p.hour) * 60 + Number(p.minute);
		const delta = Date.UTC(y, m - 1, d) / 6e4 + targetMin - actualAbs;
		if (delta === 0) break;
		guess += delta * 6e4;
	}
	return Math.floor(guess / 1e3);
}
function endUnix(key, endMin) {
	if (endMin >= 1440) return kyivDateTimeToUnix(addDaysKey(key, 1), 0);
	return kyivDateTimeToUnix(key, endMin);
}
function parseTimeToMinutes(hms) {
	const [hh, mm] = hms.split(":").map((v) => parseInt(v, 10));
	return hh * 60 + mm;
}
function fmtHm(min) {
	if (min >= 1440) return "00:00";
	const hh = Math.floor(min / 60) % 24;
	const mm = min % 60;
	return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function fmtHours(min) {
	const hours = Math.round(min / 60 * 10) / 10;
	return `${Number.isInteger(hours) ? String(hours) : hours.toFixed(1)} год.`;
}
function buildDaySchedule(series, queueId, timeSeries) {
	const typeBySlotId = /* @__PURE__ */ new Map();
	for (const slot of timeSeries) typeBySlotId.set(slot.id, "ENABLE");
	for (const item of series) {
		if (item.outage_queue_id !== queueId || item.time_series_id == null) continue;
		if ((typeBySlotId.get(item.time_series_id) || "ENABLE") === "SURE_OFF") continue;
		typeBySlotId.set(item.time_series_id, item.type || "ENABLE");
	}
	const slots = timeSeries.slice().sort((a, b) => a.id - b.id).map((slot) => {
		const startMin = parseTimeToMinutes(slot.start);
		let endMin = parseTimeToMinutes(slot.end);
		if (String(slot.end).startsWith("00:00")) endMin = 1440;
		const type = typeBySlotId.get(slot.id) || "ENABLE";
		return {
			startMin,
			endMin,
			type,
			isOff: type !== "ENABLE"
		};
	});
	const offIntervals = [];
	let current = null;
	for (const slot of slots) if (slot.isOff) {
		if (!current) current = {
			startMin: slot.startMin,
			endMin: slot.endMin,
			type: slot.type
		};
		else if (current.endMin === slot.startMin) {
			current.endMin = slot.endMin;
			if (current.type !== "SURE_OFF" && slot.type === "SURE_OFF") current.type = "SURE_OFF";
		} else {
			offIntervals.push(current);
			current = {
				startMin: slot.startMin,
				endMin: slot.endMin,
				type: slot.type
			};
		}
	} else if (current) {
		offIntervals.push(current);
		current = null;
	}
	if (current) offIntervals.push(current);
	const offMinutes = offIntervals.reduce((sum, item) => sum + (item.endMin - item.startMin), 0);
	return {
		offIntervals,
		offMinutes,
		onMinutes: 1440 - offMinutes
	};
}
function toSlots(intervals, nowMin) {
	const upcoming = nowMin == null ? null : intervals.find((item) => nowMin < item.startMin) || null;
	return intervals.map((item) => ({
		from: fmtHm(item.startMin),
		to: fmtHm(item.endMin),
		duration: fmtHours(item.endMin - item.startMin),
		startMin: item.startMin,
		endMin: item.endMin,
		current: nowMin != null && item.startMin <= nowMin && nowMin < item.endMin,
		upcoming: upcoming != null && upcoming.startMin === item.startMin && upcoming.endMin === item.endMin
	}));
}
async function loadQueues() {
	return (await fetchJson(`${ORIGIN}/api/outage-queue/by-type/3`, 3e5) || []).filter((queue) => !queue.deleted && queue.name).map((queue) => ({
		name: queue.name,
		slug: queueNameToSlug(queue.name)
	}));
}
var nsIndexPromise = null;
async function getNsIndex() {
	if (!nsIndexPromise) nsIndexPromise = buildNsIndex().catch((error) => {
		nsIndexPromise = null;
		throw error;
	});
	return nsIndexPromise;
}
async function buildNsIndex() {
	const filii = await fetchJson(`${ORIGIN}/api/addr/filii`, 864e5);
	const byName = /* @__PURE__ */ new Map();
	const concurrency = 6;
	for (let i = 0; i < filii.length; i += concurrency) {
		const batch = filii.slice(i, i + concurrency);
		(await Promise.all(batch.map((filia) => fetchJson(`${ORIGIN}/api/addr/filii/${encodeURIComponent(filia.idfilial)}/ns`, 864e5).catch(() => [])))).forEach((rows) => {
			for (const row of rows || []) {
				const name = String(row.naznaspunkt || "").trim();
				if (!name) continue;
				const key = normalizeKey(name);
				const bucket = byName.get(key) || [];
				bucket.push({
					nsId: row.idnaspunkt,
					nsName: name
				});
				byName.set(key, bucket);
			}
		});
	}
	return { byName };
}
function uniqueNames(rows, term) {
	const seen = /* @__PURE__ */ new Set();
	const list = [];
	const needle = normalizeKey(term);
	for (const name of rows) {
		const key = normalizeKey(name);
		if (!key || seen.has(key)) continue;
		if (needle && !key.includes(needle)) continue;
		seen.add(key);
		list.push(name.trim());
	}
	list.sort((a, b) => a.localeCompare(b, "uk"));
	return list.slice(0, 20);
}
async function loadHome() {
	const queues = await loadQueues();
	getNsIndex().catch(() => void 0);
	return { queues };
}
async function findCities(term) {
	const { byName } = await getNsIndex();
	const names = [];
	for (const bucket of byName.values()) if (bucket[0]) names.push(bucket[0].nsName);
	return uniqueNames(names, term);
}
async function streetsForCity(city) {
	const { byName } = await getNsIndex();
	const picked = byName.get(normalizeKey(city))?.[0];
	if (!picked) return [];
	return fetchJson(`${ORIGIN}/api/addr/ns/${encodeURIComponent(picked.nsId)}/street`, 864e5);
}
async function findStreets(city, term) {
	return uniqueNames((await streetsForCity(city) || []).map((street) => street.nazstreet).filter(Boolean), term);
}
async function findHouses(city, street, term) {
	const match = (await streetsForCity(city) || []).find((row) => normalizeKey(row.nazstreet) === normalizeKey(street));
	if (!match) return [];
	return uniqueNames((await fetchJson(`${ORIGIN}/api/addr/street/${encodeURIComponent(match.idstreet)}/dom`, 864e5) || []).map((house) => house.nazdom).filter(Boolean), term);
}
async function resolveQueue(city, street, house) {
	const streetRow = (await streetsForCity(city) || []).find((row) => normalizeKey(row.nazstreet) === normalizeKey(street));
	if (!streetRow) return null;
	const houseRow = (await fetchJson(`${ORIGIN}/api/addr/street/${encodeURIComponent(streetRow.idstreet)}/dom`, 864e5) || []).find((row) => normalizeKey(row.nazdom) === normalizeKey(house));
	if (!houseRow) return null;
	const name = (await fetchJson(`${ORIGIN}/api/addr/dom/${encodeURIComponent(houseRow.iddom)}/outage-queue`, 6e4))?.[0]?.outage?.name;
	return name ? queueNameToSlug(name) : null;
}
function buildDay(dayKey, series, queueId, timeSeries, nowMin) {
	const built = buildDaySchedule(series, queueId, timeSeries);
	return {
		offLabel: fmtHours(built.offMinutes),
		onLabel: fmtHours(built.onMinutes),
		list: toSlots(built.offIntervals, nowMin)
	};
}
async function loadQueue(slug) {
	const queueName = slugToQueueName(slug);
	const queue = (await fetchJson(`${ORIGIN}/api/outage-queue/by-type/3`, 3e5) || []).find((item) => item.name === queueName && !item.deleted);
	if (!queue) return null;
	const [timeSeries, active] = await Promise.all([fetchJson(`${ORIGIN}/api/schedule/time-series`, 216e5), fetchJson(`${ORIGIN}/api/v2/schedule/active`, 3e4)]);
	const grouped = /* @__PURE__ */ new Map();
	for (const block of active || []) {
		if (!block.from) continue;
		const key = dateKeyKyiv(new Date(block.from));
		const bucket = grouped.get(key) || [];
		bucket.push(...block.series || []);
		grouped.set(key, bucket);
	}
	const now = /* @__PURE__ */ new Date();
	const todayKey = dateKeyKyiv(now);
	const tomorrowKey = addDaysKey(todayKey, 1);
	const nowParts = kyivParts(now);
	const nowMin = Number(nowParts.hour) * 60 + Number(nowParts.minute) + Number(nowParts.second) / 60;
	const today = buildDay(todayKey, grouped.get(todayKey) || [], queue.id, timeSeries, nowMin);
	const tomorrow = buildDay(tomorrowKey, grouped.get(tomorrowKey) || [], queue.id, timeSeries, null);
	const current = today.list.find((slot) => slot.current) || null;
	const next = today.list.find((slot) => slot.upcoming) || null;
	let power;
	if (today.list.length === 0) power = {
		mode: "clear",
		from: kyivDateTimeToUnix(todayKey, 0),
		to: endUnix(todayKey, 1440),
		label: "Світло весь день"
	};
	else if (current) power = {
		mode: "off",
		from: kyivDateTimeToUnix(todayKey, current.startMin),
		to: endUnix(todayKey, current.endMin),
		label: "Триває відключення"
	};
	else if (next) power = {
		mode: "on",
		from: kyivDateTimeToUnix(todayKey, today.list.filter((slot) => slot.endMin <= nowMin).at(-1)?.endMin ?? 0),
		to: kyivDateTimeToUnix(todayKey, next.startMin),
		label: "Світло є"
	};
	else power = {
		mode: "on",
		from: kyivDateTimeToUnix(todayKey, today.list.at(-1)?.endMin ?? 0),
		to: endUnix(todayKey, 1440),
		label: "Світло є до півночі"
	};
	return {
		queueName,
		queueSlug: slug,
		today,
		tomorrow,
		power
	};
}
//#endregion
export { findCities, findHouses, findStreets, loadHome, loadQueue, resolveQueue };
