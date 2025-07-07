import { useMemo } from "react";
import Star from "../../Food/Star";

interface CosmicLayerProps {
  width: number;
  height: number;
}

export default function CosmicLayer({ width, height }: CosmicLayerProps) {
  // Generate stars using similar noise logic but as components
  const stars = useMemo(() => {
    const starCount = Math.floor((width * height) / 1000); // Density-based
    return Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      opacity: 0.3 + Math.random() * 0.7, // 0.3 to 1.0
    }));
  }, [width, height]);

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
      {/* Stars */}
      {stars.map((star, i) => (
        <Star key={i} x={star.x} y={star.y} opacity={star.opacity} />
      ))}
    </div>
  );
}
