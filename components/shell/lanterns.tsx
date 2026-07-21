// Two lanterns in the glade — one per keeper. A lantern is lit once that
// keeper has logged today; dim, its flame low, until they show up. You can see
// whether your partner has arrived without opening a thing. Server component.

function Lantern({ name, lit }: { name: string; lit: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={lit ? "lantern-pool rounded-full" : undefined}>
        <svg
          width="26"
          height="36"
          viewBox="0 0 26 36"
          fill="none"
          aria-hidden="true"
        >
          {/* hanger + cap */}
          <path
            d="M13 2 v3"
            stroke="var(--color-ink)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M8 6 h10 l-1.5 -1.5 h-7 z"
            fill="var(--glade-fauna)"
          />
          {/* cage body */}
          <rect
            x="6.5"
            y="6.5"
            width="13"
            height="20"
            rx="5"
            fill={lit ? "var(--color-gold-soft)" : "color-mix(in srgb, var(--color-cream) 70%, transparent)"}
            stroke="var(--glade-fauna)"
            strokeWidth="1.6"
          />
          {/* flame */}
          <path
            d="M13 12 c-2.4 3 -2.4 6.5 0 8 c2.4 -1.5 2.4 -5 0 -8 z"
            fill={lit ? "var(--color-gold)" : "color-mix(in srgb, var(--color-ink) 22%, transparent)"}
            className={lit ? "lantern-breathe" : undefined}
          />
          {/* base + foot */}
          <path
            d="M8 26.5 h10 M13 27 v6"
            stroke="var(--glade-fauna)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="font-display text-[9px] uppercase tracking-widest text-ink-soft">
        {name}
      </span>
      <span className="text-[9px] text-ink-soft/70">
        {lit ? "here today" : "not yet"}
      </span>
    </div>
  );
}

export function Lanterns({
  keepers,
}: {
  keepers: { name: string; lit: boolean }[];
}) {
  return (
    <div className="flex items-end justify-center gap-16">
      {keepers.map((k) => (
        <Lantern key={k.name} name={k.name} lit={k.lit} />
      ))}
    </div>
  );
}
