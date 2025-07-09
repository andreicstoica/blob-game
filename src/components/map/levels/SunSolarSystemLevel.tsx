import { useMemo } from "react";

const planetEmojis = ["🪐", "🌍", "🌑", "🌕", "🛰️", "☄️", "🌟"];

export default function SunSolarSystemLevel({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  // Generate planet positions
  const planets = useMemo(() => {
    const count = 7;
    return Array.from({ length: count }, (_, i) => ({
      x: width * (0.15 + 0.1 * i),
      y: height * (0.5 + 0.2 * Math.sin(i)),
      emoji: planetEmojis[i % planetEmojis.length],
    }));
  }, [width, height]);

  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full"
    >
      <image
        href="/assets/images/backgrounds/solar-system.webp"
        x="0"
        y="0"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid slice"
      />
      <rect width="100%" height="100%" fill="#fceabb" opacity="0.2" />
      {planets.map((planet, i) => (
        <text
          key={i}
          x={planet.x}
          y={planet.y}
          fontSize={Math.max(width, height) * 0.06}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {planet.emoji}
        </text>
      ))}
    </svg>
  );
}
