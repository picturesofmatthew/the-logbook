type SpriteMap = readonly string[];
type Palette = Record<string, string>;

export function PixelSprite({
  map,
  palette,
  className,
  title,
}: {
  map: SpriteMap;
  palette: Palette;
  className?: string;
  title?: string;
}) {
  const h = map.length;
  const w = map[0]?.length ?? 0;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {map.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const fill = palette[ch];
          if (!fill) return null;
          return (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          );
        }),
      )}
    </svg>
  );
}
