import { createFileRoute } from "@tanstack/react-router";
import { SearchPanel } from "@/components/search-panel";
import { Cobwebs, Shell } from "@/components/shell";
import { getHome } from "@/lib/outage.functions";

export const Route = createFileRoute("/")({
  loader: () => getHome(),
  component: Home,
  pendingComponent: Pending,
  head: () => ({
    meta: [
      { title: "Відключення світла — Миколаївська область" },
      {
        name: "description",
        content: "Черги та пошук адреси: графік відключень електроенергії на Миколаївщині.",
      },
    ],
  }),
});

function Pending() {
  return (
    <Shell>
      <p className="kicker">ЗАВАНТАЖЕННЯ</p>
      <h1 className="h-display">Знімаю графік…</h1>
    </Shell>
  );
}

function Home() {
  const { queues } = Route.useLoaderData();

  return (
    <Shell>
      <section className="hero">
        <p className="kicker">ГРАФІК · МИКОЛАЇВЩИНА</p>
        <h1 className="h-display">Відключення світла</h1>
        <p className="lede">
          Оберіть чергу або знайдіть будинок. Розклад іде з{" "}
          <a href="https://off.energy.mk.ua" target="_blank" rel="noreferrer">
            off.energy.mk.ua
          </a>
          .
        </p>
      </section>
      <div className="layout">
        <SearchPanel queues={queues} />
        <aside className="px-panel side">
          <Cobwebs />
          <div className="panel-body">
            <h2>Як це працює</h2>
            <p>Черга — це група адрес, які вимикають разом. Знайдіть свою і подивіться, коли згасне і коли повернеться.</p>
            <div className="legend">
              <span className="chip chip-on">світло</span>
              <span className="chip chip-off">відключення</span>
              <span className="chip chip-mid">наступне</span>
            </div>
            <p className="side-note">Регіон: Миколаївська область. Клавіші світяться, коли на них навести.</p>
          </div>
        </aside>
      </div>
    </Shell>
  );
}
