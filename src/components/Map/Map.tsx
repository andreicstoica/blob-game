import { type RefObject, useRef } from "react";
import { useMapSelector } from "./engine/mapState";
import PetriLayer from "./layers/PetriLayer";
import EarthLayer from "./layers/EarthLayer";
import CosmicLayer from "./layers/CosmicLayer";
import usePanZoom from "./hooks"; // small helper

export default function Map({ className }: { className?: string }) {
  /** read-only phase */
  const phase = useMapSelector((s) => s.phase);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = usePanZoom(
    canvasRef as RefObject<HTMLCanvasElement>
  ); // returns view + sets CSS

  let Layer: React.FC<{ width: number; height: number }>;
  if (phase === "primordial") Layer = PetriLayer;
  else if (phase === "colonial") Layer = EarthLayer;
  else Layer = CosmicLayer;

  return (
    <div className={`relative ${className}`}>
      {/* Single canvas reused across layers for performance */}
      <canvas ref={canvasRef} width={width} height={height} />
      {/* Layer draws into the same canvas context */}
      <Layer width={width} height={height} />
    </div>
  );
}
