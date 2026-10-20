import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { lookupAddress, searchCities, searchHouses, searchStreets } from "@/lib/outage.functions";
import type { QueueLink } from "@/lib/outage.types";
import { Cobwebs } from "./shell";

type Tab = "queue" | "address";

function Combo({
  id,
  label,
  value,
  placeholder,
  disabled,
  hits,
  open,
  busy,
  onFocus,
  onChange,
  onPick,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  hits: string[];
  open: boolean;
  busy?: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  onPick: (value: string) => void;
}) {
  const listId = useId();
  return (
    <div className={`field ${disabled ? "is-locked" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="px-input"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
      />
      {open && !disabled ? (
        <div className="suggest" id={listId} role="listbox">
          {busy ? <p className="suggest-note">Шукаю…</p> : null}
          {!busy && hits.length === 0 ? <p className="suggest-note">Нічого не знайдено</p> : null}
          {hits.map((hit) => (
            <button key={hit} type="button" role="option" onMouseDown={() => onPick(hit)}>
              {hit}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SearchPanel({ queues }: { queues: QueueLink[] }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("queue");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [cityReady, setCityReady] = useState(false);
  const [streetReady, setStreetReady] = useState(false);
  const [houseReady, setHouseReady] = useState(false);
  const [cityHits, setCityHits] = useState<string[]>([]);
  const [streetHits, setStreetHits] = useState<string[]>([]);
  const [houseHits, setHouseHits] = useState<string[]>([]);
  const [open, setOpen] = useState<"city" | "street" | "house" | null>(null);
  const [busy, setBusy] = useState<"city" | "street" | "house" | null>(null);
  const [note, setNote] = useState("");
  const [searching, setSearching] = useState(false);
  const cityTimer = useRef<number>(0);
  const streetTimer = useRef<number>(0);
  const houseTimer = useRef<number>(0);

  useEffect(() => {
    function onPointer(event: PointerEvent) {
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

  function queueCities(term: string) {
    window.clearTimeout(cityTimer.current);
    cityTimer.current = window.setTimeout(async () => {
      setBusy("city");
      try {
        setCityHits(await searchCities({ data: { term } }));
      } catch {
        setCityHits([]);
        setNote("Не вдалося отримати населені пункти");
      } finally {
        setBusy((current) => (current === "city" ? null : current));
      }
    }, 220);
  }

  function queueStreets(nextCity: string, term: string) {
    window.clearTimeout(streetTimer.current);
    streetTimer.current = window.setTimeout(async () => {
      setBusy("street");
      try {
        setStreetHits(await searchStreets({ data: { city: nextCity, term } }));
      } catch {
        setStreetHits([]);
      } finally {
        setBusy((current) => (current === "street" ? null : current));
      }
    }, 220);
  }

  function queueHouses(nextCity: string, nextStreet: string, term: string) {
    window.clearTimeout(houseTimer.current);
    houseTimer.current = window.setTimeout(async () => {
      setBusy("house");
      try {
        setHouseHits(await searchHouses({ data: { city: nextCity, street: nextStreet, term } }));
      } catch {
        setHouseHits([]);
      } finally {
        setBusy((current) => (current === "house" ? null : current));
      }
    }, 220);
  }

  async function pickCity(name: string) {
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
      const list = await searchStreets({ data: { city: name, term: "" } });
      setStreetHits(list);
      if (list.length === 0) setNote("У довіднику немає вулиць для цього пункту.");
    } catch {
      setStreetHits([]);
      setNote("Не вдалося завантажити вулиці");
    } finally {
      setBusy(null);
    }
  }

  async function pickStreet(name: string) {
    setStreet(name);
    setStreetReady(true);
    setHouse("");
    setHouseReady(false);
    setOpen(null);
    setNote("");
    setBusy("house");
    try {
      const list = await searchHouses({ data: { city, street: name, term: "" } });
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
      const result = await lookupAddress({ data: { city, street, house } });
      if (!result.slug) {
        setNote("Чергу для цієї адреси не знайдено.");
        return;
      }
      await navigate({ to: "/queue/$slug", params: { slug: result.slug } });
    } catch {
      setNote("Пошук не вдався. Спробуйте ще раз.");
    } finally {
      setSearching(false);
    }
  }

  const tones = ["", "px-key-orange", "px-key-green"];

  return (
    <section className="px-panel">
      <Cobwebs />
      <div className="panel-head">
        <h2>Пошук</h2>
        <div className="tabs" role="tablist" aria-label="Пошук">
          <button
            type="button"
            className={`px-key px-key-slim ${tab === "queue" ? "is-down" : ""}`}
            onClick={() => setTab("queue")}
          >
            Черга
          </button>
          <button
            type="button"
            className={`px-key px-key-slim px-key-orange ${tab === "address" ? "is-down" : ""}`}
            onClick={() => setTab("address")}
          >
            Адреса
          </button>
        </div>
      </div>
      <div className="panel-body">
        {tab === "queue" ? (
          <div className="queue-grid">
            {queues.map((queue, index) => (
              <Link
                key={queue.slug}
                className={`px-key ${tones[index % tones.length]}`}
                to="/queue/$slug"
                params={{ slug: queue.slug }}
              >
                {queue.name}
              </Link>
            ))}
          </div>
        ) : (
          <form
            className="addr-form"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <Combo
              id="city"
              label="Населений пункт"
              value={city}
              placeholder="Напр. Миколаїв"
              hits={cityHits}
              open={open === "city"}
              busy={busy === "city"}
              onFocus={() => {
                setOpen("city");
                queueCities(city);
              }}
              onChange={(value) => {
                setCity(value);
                setCityReady(false);
                setStreet("");
                setStreetReady(false);
                setHouse("");
                setHouseReady(false);
                setOpen("city");
                queueCities(value);
              }}
              onPick={(value) => void pickCity(value)}
            />
            <Combo
              id="street"
              label="Вулиця"
              value={street}
              placeholder="Назва вулиці"
              disabled={!cityReady}
              hits={streetHits}
              open={open === "street"}
              busy={busy === "street"}
              onFocus={() => {
                if (!cityReady) return;
                setOpen("street");
                queueStreets(city, street);
              }}
              onChange={(value) => {
                setStreet(value);
                setStreetReady(false);
                setHouse("");
                setHouseReady(false);
                setOpen("street");
                queueStreets(city, value);
              }}
              onPick={(value) => void pickStreet(value)}
            />
            <Combo
              id="house"
              label="Будинок"
              value={house}
              placeholder="№"
              disabled={!streetReady}
              hits={houseHits}
              open={open === "house"}
              busy={busy === "house"}
              onFocus={() => {
                if (!streetReady) return;
                setOpen("house");
                queueHouses(city, street, house);
              }}
              onChange={(value) => {
                setHouse(value);
                setHouseReady(false);
                setOpen("house");
                queueHouses(city, street, value);
              }}
              onPick={(value) => {
                setHouse(value);
                setHouseReady(true);
                setOpen(null);
              }}
            />
            <div className="field field-action">
              <button
                className="px-key px-key-green px-key-wide"
                type="submit"
                disabled={!cityReady || !streetReady || !houseReady || searching}
              >
                {searching ? "Шукаю…" : "Показати графік"}
              </button>
            </div>
            {note ? <p className="form-note">{note}</p> : null}
          </form>
        )}
      </div>
    </section>
  );
}
