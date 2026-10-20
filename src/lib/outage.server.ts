import type { DayView, PowerView, QueueLink, QueuePageData, SlotView } from "./outage.types";

const ORIGIN = "https://off.energy.mk.ua";
const KYIV = "Europe/Kyiv";

type CacheEntry = { value: unknown; expiresAt: number };
const cache = new Map<string, CacheEntry>();

type QueueRow = { id: number; name: string; deleted?: number | boolean | null };
type TimeSlot = { id: number; start: string; end: string };
type SeriesItem = { outage_queue_id?: number; time_series_id?: number; type?: string };
type ActiveBlock = { from?: string; series?: SeriesItem[] };
type NsRow = { nsId: number; nsName: string };
type StreetRow = { idstreet: number; nazstreet: string };
type DomRow = { iddom: number; nazdom: string };

function normalizeKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function queueNameToSlug(name: string) {
  return name.replace(/\./g, "-");
}

function slugToQueueName(slug: string) {
  return slug.replace(/-/g, ".");
}

async function fetchJson<T>(url: string, ttlMs: number): Promise<T> {
  const hit = cache.get(url);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 (compatible; SvitloMK/1.0)",
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) {
    throw new Error(`Джерело off.energy.mk.ua відповіло ${res.status}`);
  }
  const data = (await res.json()) as T;
  cache.set(url, { value: data, expiresAt: Date.now() + ttlMs });
  return data;
}

function kyivParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: KYIV,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const bag: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== "literal") bag[part.type] = part.value;
  }
  return bag;
}

function dateKeyKyiv(date: Date) {
  const p = kyivParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

function addDaysKey(key: string, days: number) {
  const [y, m, d] = key.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + days));
  const mm = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(utc.getUTCDate()).padStart(2, "0");
  return `${utc.getUTCFullYear()}-${mm}-${dd}`;
}

function kyivDateTimeToUnix(key: string, minutes: number) {
  const [y, m, d] = key.split("-").map(Number);
  const targetMin = minutes;
  let guess = Date.UTC(y, m - 1, d, Math.floor(minutes / 60) - 3, minutes % 60, 0);
  for (let i = 0; i < 4; i++) {
    const p = kyivParts(new Date(guess));
    const actualAbs =
      Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day)) / 60_000 +
      Number(p.hour) * 60 +
      Number(p.minute);
    const targetAbs = Date.UTC(y, m - 1, d) / 60_000 + targetMin;
    const delta = targetAbs - actualAbs;
    if (delta === 0) break;
    guess += delta * 60_000;
  }
  return Math.floor(guess / 1000);
}

function endUnix(key: string, endMin: number) {
  if (endMin >= 1440) return kyivDateTimeToUnix(addDaysKey(key, 1), 0);
  return kyivDateTimeToUnix(key, endMin);
}

function parseTimeToMinutes(hms: string) {
  const [hh, mm] = hms.split(":").map((v) => parseInt(v, 10));
  return hh * 60 + mm;
}

function fmtHm(min: number) {
  if (min >= 1440) return "00:00";
  const hh = Math.floor(min / 60) % 24;
  const mm = min % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function fmtHours(min: number) {
  const hours = Math.round((min / 60) * 10) / 10;
  const text = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
  return `${text} год.`;
}

type OffInterval = { startMin: number; endMin: number; type: string };

function buildDaySchedule(series: SeriesItem[], queueId: number, timeSeries: TimeSlot[]) {
  const typeBySlotId = new Map<number, string>();
  for (const slot of timeSeries) typeBySlotId.set(slot.id, "ENABLE");

  for (const item of series) {
    if (item.outage_queue_id !== queueId || item.time_series_id == null) continue;
    const prev = typeBySlotId.get(item.time_series_id) || "ENABLE";
    if (prev === "SURE_OFF") continue;
    typeBySlotId.set(item.time_series_id, item.type || "ENABLE");
  }

  const slots = timeSeries
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((slot) => {
      const startMin = parseTimeToMinutes(slot.start);
      let endMin = parseTimeToMinutes(slot.end);
      if (String(slot.end).startsWith("00:00")) endMin = 1440;
      const type = typeBySlotId.get(slot.id) || "ENABLE";
      return { startMin, endMin, type, isOff: type !== "ENABLE" };
    });

  const offIntervals: OffInterval[] = [];
  let current: OffInterval | null = null;
  for (const slot of slots) {
    if (slot.isOff) {
      if (!current) {
        current = { startMin: slot.startMin, endMin: slot.endMin, type: slot.type };
      } else if (current.endMin === slot.startMin) {
        current.endMin = slot.endMin;
        if (current.type !== "SURE_OFF" && slot.type === "SURE_OFF") current.type = "SURE_OFF";
      } else {
        offIntervals.push(current);
        current = { startMin: slot.startMin, endMin: slot.endMin, type: slot.type };
      }
    } else if (current) {
      offIntervals.push(current);
      current = null;
    }
  }
  if (current) offIntervals.push(current);

  const offMinutes = offIntervals.reduce((sum, item) => sum + (item.endMin - item.startMin), 0);
  return { offIntervals, offMinutes, onMinutes: 1440 - offMinutes };
}

function toSlots(intervals: OffInterval[], nowMin: number | null): SlotView[] {
  const upcoming = nowMin == null ? null : intervals.find((item) => nowMin < item.startMin) || null;
  return intervals.map((item) => ({
    from: fmtHm(item.startMin),
    to: fmtHm(item.endMin),
    duration: fmtHours(item.endMin - item.startMin),
    startMin: item.startMin,
    endMin: item.endMin,
    current: nowMin != null && item.startMin <= nowMin && nowMin < item.endMin,
    upcoming: upcoming != null && upcoming.startMin === item.startMin && upcoming.endMin === item.endMin,
  }));
}

export async function loadQueues(): Promise<QueueLink[]> {
  const queues = await fetchJson<QueueRow[]>(`${ORIGIN}/api/outage-queue/by-type/3`, 5 * 60_000);
  return (queues || [])
    .filter((queue) => !queue.deleted && queue.name)
    .map((queue) => ({ name: queue.name, slug: queueNameToSlug(queue.name) }));
}

let nsIndexPromise: Promise<{ byName: Map<string, NsRow[]> }> | null = null;

async function getNsIndex() {
  if (!nsIndexPromise) {
    nsIndexPromise = buildNsIndex().catch((error) => {
      nsIndexPromise = null;
      throw error;
    });
  }
  return nsIndexPromise;
}

async function buildNsIndex() {
  const filii = await fetchJson<{ idfilial: number; fullname: string }[]>(
    `${ORIGIN}/api/addr/filii`,
    24 * 3600_000,
  );
  const byName = new Map<string, NsRow[]>();
  const concurrency = 6;
  for (let i = 0; i < filii.length; i += concurrency) {
    const batch = filii.slice(i, i + concurrency);
    const lists = await Promise.all(
      batch.map((filia) =>
        fetchJson<{ idnaspunkt: number; naznaspunkt: string }[]>(
          `${ORIGIN}/api/addr/filii/${encodeURIComponent(filia.idfilial)}/ns`,
          24 * 3600_000,
        ).catch(() => []),
      ),
    );
    lists.forEach((rows) => {
      for (const row of rows || []) {
        const name = String(row.naznaspunkt || "").trim();
        if (!name) continue;
        const key = normalizeKey(name);
        const bucket = byName.get(key) || [];
        bucket.push({ nsId: row.idnaspunkt, nsName: name });
        byName.set(key, bucket);
      }
    });
  }
  return { byName };
}

function uniqueNames(rows: Iterable<string>, term: string) {
  const seen = new Set<string>();
  const list: string[] = [];
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

export async function loadHome() {
  const queues = await loadQueues();
  void getNsIndex().catch(() => undefined);
  return { queues };
}

export async function findCities(term: string) {
  const { byName } = await getNsIndex();
  const names: string[] = [];
  for (const bucket of byName.values()) {
    if (bucket[0]) names.push(bucket[0].nsName);
  }
  return uniqueNames(names, term);
}

async function streetsForCity(city: string) {
  const { byName } = await getNsIndex();
  const picked = byName.get(normalizeKey(city))?.[0];
  if (!picked) return [];
  return fetchJson<StreetRow[]>(`${ORIGIN}/api/addr/ns/${encodeURIComponent(picked.nsId)}/street`, 24 * 3600_000);
}

export async function findStreets(city: string, term: string) {
  const streets = await streetsForCity(city);
  return uniqueNames(
    (streets || []).map((street) => street.nazstreet).filter(Boolean),
    term,
  );
}

export async function findHouses(city: string, street: string, term: string) {
  const streets = await streetsForCity(city);
  const match = (streets || []).find((row) => normalizeKey(row.nazstreet) === normalizeKey(street));
  if (!match) return [];
  const houses = await fetchJson<DomRow[]>(
    `${ORIGIN}/api/addr/street/${encodeURIComponent(match.idstreet)}/dom`,
    24 * 3600_000,
  );
  return uniqueNames(
    (houses || []).map((house) => house.nazdom).filter(Boolean),
    term,
  );
}

export async function resolveQueue(city: string, street: string, house: string): Promise<string | null> {
  const streets = await streetsForCity(city);
  const streetRow = (streets || []).find((row) => normalizeKey(row.nazstreet) === normalizeKey(street));
  if (!streetRow) return null;
  const houses = await fetchJson<DomRow[]>(
    `${ORIGIN}/api/addr/street/${encodeURIComponent(streetRow.idstreet)}/dom`,
    24 * 3600_000,
  );
  const houseRow = (houses || []).find((row) => normalizeKey(row.nazdom) === normalizeKey(house));
  if (!houseRow) return null;
  const outage = await fetchJson<{ outage?: { name?: string } }[]>(
    `${ORIGIN}/api/addr/dom/${encodeURIComponent(houseRow.iddom)}/outage-queue`,
    60_000,
  );
  const name = outage?.[0]?.outage?.name;
  return name ? queueNameToSlug(name) : null;
}

function buildDay(dayKey: string, series: SeriesItem[], queueId: number, timeSeries: TimeSlot[], nowMin: number | null): DayView {
  const built = buildDaySchedule(series, queueId, timeSeries);
  return {
    offLabel: fmtHours(built.offMinutes),
    onLabel: fmtHours(built.onMinutes),
    list: toSlots(built.offIntervals, nowMin),
  };
}

export async function loadQueue(slug: string): Promise<QueuePageData | null> {
  const queueName = slugToQueueName(slug);
  const queues = await fetchJson<QueueRow[]>(`${ORIGIN}/api/outage-queue/by-type/3`, 5 * 60_000);
  const queue = (queues || []).find((item) => item.name === queueName && !item.deleted);
  if (!queue) return null;

  const [timeSeries, active] = await Promise.all([
    fetchJson<TimeSlot[]>(`${ORIGIN}/api/schedule/time-series`, 6 * 3600_000),
    fetchJson<ActiveBlock[]>(`${ORIGIN}/api/v2/schedule/active`, 30_000),
  ]);

  const grouped = new Map<string, SeriesItem[]>();
  for (const block of active || []) {
    if (!block.from) continue;
    const key = dateKeyKyiv(new Date(block.from));
    const bucket = grouped.get(key) || [];
    bucket.push(...(block.series || []));
    grouped.set(key, bucket);
  }

  const now = new Date();
  const todayKey = dateKeyKyiv(now);
  const tomorrowKey = addDaysKey(todayKey, 1);
  const nowParts = kyivParts(now);
  const nowMin = Number(nowParts.hour) * 60 + Number(nowParts.minute) + Number(nowParts.second) / 60;

  const today = buildDay(todayKey, grouped.get(todayKey) || [], queue.id, timeSeries, nowMin);
  const tomorrow = buildDay(tomorrowKey, grouped.get(tomorrowKey) || [], queue.id, timeSeries, null);

  const current = today.list.find((slot) => slot.current) || null;
  const next = today.list.find((slot) => slot.upcoming) || null;
  let power: PowerView;
  if (today.list.length === 0) {
    power = {
      mode: "clear",
      from: kyivDateTimeToUnix(todayKey, 0),
      to: endUnix(todayKey, 1440),
      label: "Світло весь день",
    };
  } else if (current) {
    power = {
      mode: "off",
      from: kyivDateTimeToUnix(todayKey, current.startMin),
      to: endUnix(todayKey, current.endMin),
      label: "Триває відключення",
    };
  } else if (next) {
    const prevEnd = today.list.filter((slot) => slot.endMin <= nowMin).at(-1)?.endMin ?? 0;
    power = {
      mode: "on",
      from: kyivDateTimeToUnix(todayKey, prevEnd),
      to: kyivDateTimeToUnix(todayKey, next.startMin),
      label: "Світло є",
    };
  } else {
    const prevEnd = today.list.at(-1)?.endMin ?? 0;
    power = {
      mode: "on",
      from: kyivDateTimeToUnix(todayKey, prevEnd),
      to: endUnix(todayKey, 1440),
      label: "Світло є до півночі",
    };
  }

  return { queueName, queueSlug: slug, today, tomorrow, power };
}
