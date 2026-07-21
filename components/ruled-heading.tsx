// The book's engraved section rule: a small-caps title held between two
// hairlines. One shared voice for every surface's headings.

export function RuledHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-px flex-1 bg-ink/20" />
      <h2 className="font-display text-[11px] tracking-widest text-ink-soft">
        {title}
      </h2>
      <span className="h-px flex-1 bg-ink/20" />
    </div>
  );
}
