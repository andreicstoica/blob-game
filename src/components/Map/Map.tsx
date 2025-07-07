import { useRef, useEffect, useState } from "react";
import { useMapSelector } from "../../engine/mapState";
import PetriLayer from "./layers/PetriLayer";
import EarthLayer from "./layers/EarthLayer";
import CosmicLayer from "./layers/CosmicLayer";

export default function Map({ className }: { className?: string }) {
  /** read-only phase */
  const phase = useMapSelector((s) => s.phase);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  let Layer: React.FC<{ width: number; height: number }>;
  if (phase === "primordial") Layer = PetriLayer;
  else if (phase === "colonial") Layer = EarthLayer;
  else Layer = CosmicLayer;

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <Layer width={dimensions.width} height={dimensions.height} />
    </div>
  );
}
