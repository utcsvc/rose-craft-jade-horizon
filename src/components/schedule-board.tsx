import { useEffect, useState } from "react";
import type { DayView, PowerView, SlotView } from "@/lib/outage.types";
import { Cobwebs } from "./shell";

function fmtClock(unix: number) {
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(unix * 1000));
}

function fmtLeft(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function PowerProgress({ power }: { power: PowerView }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Math.floor(Date.now() / 1000));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const span = Math.max(1, power.to - power.from);
  const pct = now == null ? 0 : Math.min(100, Math.max(0, ((now - power.from) / span) * 100));
  const left = now == null ? "—" : fmtLeft(power.to - now);
  const fillClass = power.mode === "off" ? "is-off" : "is-on";

  return (
    <div className={`progress ${fillClass}`}>
      <div className="progress-top">
        <span className="progress-title">{power.label}</span>
        <span className={`chip ${power.mode === "off" ? "chip-off" : "chip-on"}`}>{left}</span>
      </div>
      <div className={`bar ${fillClass}`} aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-bottom">
        <span>{power.mode === "off" ? `Початок ${fmtClock(power.from)}` : `Зараз ${now ? fmtClock(now) : "—"}`}</span>
        <span>
          {power.mode === "clear"
            ? "Відключень немає"
            : power.mode === "off"
              ? `Увімкнення ${fmtClock(power.to)}`
              : `Далі ${fmtClock(power.to)}`}
        </span>
      </div>
    </div>
  );
}

function DayStrip({ slots }: { slots: SlotView[] }) {
  const cells = Array.from({ length: 48 }, (_, index) => {
    const minute = index * 30;
    return slots.some((slot) => minute >= slot.startMin && minute < slot.endMin);
  });
  return (
    <div className="strip-wrap">
      <div className="day-strip" role="img" aria-label="Смуга доби: зелене світло, помаранчеве відключення">
        {cells.map((off, index) => (
          <span key={index} className={off ? "cell cell-off" : "cell cell-on"} />
        ))}
      </div>
      <div className="strip-scale">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
      </div>
    </div>
  );
}

function SlotList({ slots }: { slots: SlotView[] }) {
  if (slots.length === 0) {
    return (
      <div className="msg msg-ok">
        <strong>Світло весь день.</strong> Відключень у графіку немає.
      </div>
    );
  }
  return (
    <div className="timeline">
      {slots.map((slot) => (
        <article
          key={`${slot.startMin}-${slot.endMin}`}
          className={`slot ${slot.current ? "is-current" : ""} ${slot.upcoming ? "is-next" : ""}`}
        >
          <div className="slot-main">
            <span className={`chip ${slot.current ? "chip-off" : "chip-mid"}`}>
              {slot.current ? "ЗАРАЗ" : slot.upcoming ? "ДАЛІ" : "ВІДКЛ"}
            </span>
            <b>
              {slot.from} — {slot.to}
            </b>
            {slot.from === "00:00" || slot.to === "00:00" ? <span className="chip chip-mid">опівніч</span> : null}
          </div>
          <span className="chip">{slot.duration}</span>
        </article>
      ))}
    </div>
  );
}

export function ScheduleBoard({
  today,
  tomorrow,
  power,
}: {
  today: DayView;
  tomorrow: DayView;
  power: PowerView;
}) {
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const view = day === "today" ? today : tomorrow;

  return (
    <section className="px-panel">
      <Cobwebs />
      <div className="panel-head">
        <h2>Графік</h2>
        <div className="tabs" role="tablist" aria-label="День">
          <button
            type="button"
            className={`px-key px-key-slim ${day === "today" ? "is-down" : ""}`}
            onClick={() => setDay("today")}
          >
            Сьогодні
          </button>
          <button
            type="button"
            className={`px-key px-key-slim px-key-orange ${day === "tomorrow" ? "is-down" : ""}`}
            onClick={() => setDay("tomorrow")}
          >
            Завтра
          </button>
        </div>
      </div>
      <div className="panel-body">
        {day === "today" ? <PowerProgress power={power} /> : null}
        <DayStrip slots={view.list} />
        <SlotList slots={view.list} />
      </div>
    </section>
  );
}
