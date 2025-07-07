// src/components/Map/Map.tsx
import { useRef, useEffect, useState } from "react";
import { useMapSelector } from "../../engine/mapState";
import PetriLayer from "./layers/PetriLayer";
import EarthLayer from "./layers/EarthLayer";
import CosmicLayer from "./layers/CosmicLayer";

interface MapProps {
  className?: string;
}

export default function Map({ className }: MapProps) {
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

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {phase === "primordial" && (
        <PetriLayer
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
      {phase === "colonial" && <EarthLayer width={dimensions.width} height={dimensions.height} />}
      {phase === "cosmic" && <CosmicLayer width={dimensions.width} height={dimensions.height} />}
    </div>
  );
}