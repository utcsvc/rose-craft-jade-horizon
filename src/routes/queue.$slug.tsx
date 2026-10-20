import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ScheduleBoard } from "@/components/schedule-board";
import { Shell } from "@/components/shell";
import { getQueue } from "@/lib/outage.functions";

export const Route = createFileRoute("/queue/$slug")({
  loader: async ({ params }) => {
    const data = await getQueue({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  component: QueuePage,
  notFoundComponent: MissingQueue,
  pendingComponent: PendingQueue,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `Черга ${loaderData.queueName} — відключення світла` : "Черга",
      },
    ],
  }),
});

function PendingQueue() {
  return (
    <Shell>
      <p className="kicker">ЧЕРГА</p>
      <h1 className="h-display">Читаю розклад…</h1>
    </Shell>
  );
}

function MissingQueue() {
  return (
    <Shell>
      <p className="kicker">404</p>
      <h1 className="h-display">Такої черги немає</h1>
      <p className="lede">Поверніться на головну і оберіть чергу зі списку.</p>
      <Link to="/" className="px-key px-key-orange">
        На головну
      </Link>
    </Shell>
  );
}

function QueuePage() {
  const data = Route.useLoaderData();

  return (
    <Shell>
      <div className="qhead">
        <div>
          <p className="kicker">ЧЕРГА {data.queueName}</p>
          <h1 className="h-display">Миколаївська область</h1>
        </div>
        <Link to="/" className="px-key px-key-slim">
          ← Назад
        </Link>
      </div>
      <div className="kpi">
        <span className="chip chip-on">Світло {data.today.onLabel}</span>
        <span className="chip chip-off">Без світла {data.today.offLabel}</span>
      </div>
      <ScheduleBoard today={data.today} tomorrow={data.tomorrow} power={data.power} />
    </Shell>
  );
}
