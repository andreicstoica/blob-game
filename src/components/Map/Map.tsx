// src/components/Map/Map.tsx

import { useEffect, useState } from "react";
import { useMapSelector } from "../../engine/mapState";
import { getNextLevel } from "../../engine/levels";
import type { GameState } from "../../engine/game";

interface MapProps {
  className?: string;
  gameState?: GameState;
}

export default function Map({ className, gameState }: MapProps) {
  const currentLevel = useMapSelector((s) => s.currentLevel);
  const [viewport, setViewport] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const update = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Calculate zoom factor
  const getBackgroundZoom = () => {
    if (!gameState || !currentLevel) return 1;
    const nextLevel = getNextLevel(currentLevel);
    if (!nextLevel) return 1;
    const progressInLevel = Math.max(
      0,
      gameState.biomass - currentLevel.biomassThreshold
    );
    const levelRange =
      nextLevel.biomassThreshold - currentLevel.biomassThreshold;
    const progressRatio = Math.min(1, progressInLevel / levelRange);
    const zoomStart = 20.0;
    const zoomEnd = 1.0;
    return zoomStart - progressRatio * (zoomStart - zoomEnd);
  };

  const zoom = getBackgroundZoom();

  // Calculate image size in px
  const imgWidth = viewport.width * zoom;
  const imgHeight = viewport.height * zoom;

  return (
    <div
      className={`absolute inset-0 w-full h-full ${className} overflow-hidden`}
    >
      <img
        src={`/assets/backgrounds/${currentLevel.background}.png`}
        alt=""
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: `${imgWidth}px`,
          height: `${imgHeight}px`,
          objectFit: "fill", // fill so it stretches, or "cover" if you want to preserve aspect
          transform: "translate(-50%, -50%)",
          transition: "width 0.5s, height 0.5s",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
        draggable={false}
      />
    </div>
  );
}
