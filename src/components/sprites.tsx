type Ink = "orange" | "green" | "purple" | "ink" | "void";

const FILL: Record<Ink, string> = {
  orange: "var(--color-orange)",
  green: "var(--color-green)",
  purple: "var(--color-purple)",
  ink: "var(--color-ink)",
  void: "var(--color-void)",
};

function cells(rows: string[], ink: Record<string, Ink>) {
  const out: { x: number; y: number; c: Ink }[] = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const c = ink[ch];
      if (c) out.push({ x, y, c });
    });
  });
  return out;
}

function Sprite({
  rows,
  ink,
  className,
}: {
  rows: string[];
  ink: Record<string, Ink>;
  className: string;
}) {
  const w = Math.max(...rows.map((row) => row.length));
  const h = rows.length;
  const dots = cells(rows, ink);
  return (
    <svg className={`sprite ${className}`} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {dots.map((dot) => (
        <rect key={`${dot.x}-${dot.y}`} x={dot.x} y={dot.y} width="1" height="1" fill={FILL[dot.c]} />
      ))}
    </svg>
  );
}

const PUMPKIN = [
  "......gg......",
  "......gg......",
  "...oooooooo...",
  "..oooooooooo..",
  ".oooooooooooo.",
  ".ookooooookoo.",
  ".ookooooookoo.",
  ".oooooooooooo.",
  ".ooookkkkoooo.",
  "..ookkkkkkoo..",
  "..oooooooooo..",
  "...oooooooo...",
  "....oooooo....",
];

const BAT = [
  "..pp......pp..",
  ".pppp....pppp.",
  "pppppppppppppp",
  ".ppikkkkkippp.",
  "..pppppppppp..",
  "...pppppppp...",
  "....pp..pp....",
];

const GHOST = [
  "...iiiiii...",
  "..iiiiiiii..",
  ".iiiiiiiiii.",
  ".iippiippii.",
  ".ikkiiiikki.",
  ".iiiiiiiiii.",
  ".iiiiiiiiii.",
  ".iiiiiiiiii.",
  ".i.ii.ii.ii.",
  "..i..i..i...",
];

const SPIDER = ["..k.k..", ".kkkkk.", "kkkkkkk", ".k.k.k.", "..kkk..", ".k...k.", "k.....k"];

const paint = { o: "orange", g: "green", p: "purple", i: "ink", k: "void" } as const;

export function Pumpkin({ className = "" }: { className?: string }) {
  return <Sprite className={`sprite-pumpkin ${className}`} rows={PUMPKIN} ink={paint} />;
}

export function Bat({ className = "" }: { className?: string }) {
  return <Sprite className={`sprite-bat ${className}`} rows={BAT} ink={paint} />;
}

export function Ghost({ className = "" }: { className?: string }) {
  return <Sprite className={`sprite-ghost ${className}`} rows={GHOST} ink={paint} />;
}

export function Spider({ className = "" }: { className?: string }) {
  return <Sprite className={`sprite-spider ${className}`} rows={SPIDER} ink={paint} />;
}
