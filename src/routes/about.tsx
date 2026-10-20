import { createFileRoute, Link } from "@tanstack/react-router";
import { Cobwebs, Shell } from "@/components/shell";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [{ title: "Контакти — СВІТЛО.МК" }],
  }),
});

function About() {
  return (
    <Shell>
      <p className="kicker">КОНТАКТИ</p>
      <h1 className="h-display">Звідки графік</h1>
      <section className="px-panel about-card">
        <Cobwebs />
        <div className="panel-body">
          <p>
            Розклад відключень береться з відкритих даних{" "}
            <a href="https://off.energy.mk.ua" target="_blank" rel="noreferrer">
              off.energy.mk.ua
            </a>
            . Сайт лише показує черги Миколаївської області у зручнішому вигляді.
          </p>
          <p>Адреса шукається за населеним пунктом, вулицею і будинком. Якщо черги немає в довіднику — графік не вигадається.</p>
          <Link to="/" className="px-key px-key-green">
            До графіка
          </Link>
        </div>
      </section>
    </Shell>
  );
}
