import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Bat, Ghost, Pumpkin, Spider } from "./sprites";

function NowClock() {
  const [text, setText] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      setText(
        new Intl.DateTimeFormat("uk-UA", {
          timeZone: "Europe/Kyiv",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h23",
        }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className="clock" dateTime={text}>
      {text}
    </time>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      <div className="scene" aria-hidden="true">
        <span className="floater floater-a">
          <Bat />
        </span>
        <span className="floater floater-b">
          <Bat className="flip" />
        </span>
        <span className="floater floater-c">
          <Ghost />
        </span>
        <span className="floater floater-d">
          <Ghost />
        </span>
        <span className="floater floater-e">
          <Pumpkin />
        </span>
        <span className="floater floater-f">
          <Bat />
        </span>
      </div>
      <header className="hud">
        <div className="container topbar">
          <Link to="/" className="brand">
            <Pumpkin />
            <span>
              <b className="wordmark">СВІТЛО.МК</b>
              <span className="brand-sub">МИКОЛАЇВ</span>
            </span>
          </Link>
          <div className="hud-side">
            <span className="chip chip-on">
              <span className="led" />
              КИЇВ
            </span>
            <NowClock />
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="foot">
        <div className="container foot-row">
          <span>
            Дані:{" "}
            <a href="https://off.energy.mk.ua" target="_blank" rel="noreferrer">
              off.energy.mk.ua
            </a>
          </span>
          <Link to="/about">Контакти</Link>
        </div>
      </footer>
    </div>
  );
}

export function Cobwebs() {
  return (
    <>
      <span className="web web-tl" aria-hidden="true">
        <Spider className="web-spider" />
      </span>
      <span className="web web-tr" aria-hidden="true" />
      <span className="web web-bl" aria-hidden="true" />
      <span className="web web-br" aria-hidden="true" />
    </>
  );
}
