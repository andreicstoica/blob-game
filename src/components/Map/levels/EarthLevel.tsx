import { useMemo } from "react";
import People from "../../Food/People";

export default function EarthLevel({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  // Generate random positions for people
  const people = useMemo(
    () =>
      Array.from({ length: 50 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
      })),
    [width, height]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
      }}
    >
      <img
        src="/src/assets/world-map.jpg"
        alt="World Map"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.75, // Make it more transparent
        }}
      />

      {/* People */}
      {people.map((pos, i) => (
        <People key={i} x={pos.x} y={pos.y} />
      ))}
    </div>
  );
}
