/** Editorial chapter heading: index, divider, masked headline. */
export function StoryHeading({ index, kicker, lines, id, size = "text-giant", accent = "coral" }) {
  const dot = { coral: "bg-coral", blue: "bg-blue", yellow: "bg-yellow" }[accent];
  return (
    <div>
      <div className="mb-10 flex items-center gap-4 text-text-3">
        <span className="font-display text-lg tabular-nums">{index}</span>
        <span className="hairline w-16" />
        <span className="eyebrow flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {kicker}
        </span>
      </div>
      <h2 id={id} className={`font-display font-medium ${size}`}>
        {lines.map((l, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <span data-line className={`block ${i % 2 ? "text-text-3" : ""}`}>{l}</span>
          </span>
        ))}
      </h2>
    </div>
  );
}
