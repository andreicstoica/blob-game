// src/components/Map/Map.tsx
import { useRef, useEffect, useState } from "react";
import { useMapSelector } from "../../engine/mapState";
import IntroLevel from "./levels/IntroLevel";
import MicroscopeLevel from "./levels/MicroscopeLevel";
import PetriLevel from "./levels/PetriLevel";
import LabLevel from "./levels/LabLevel";
import CityLevel from "./levels/CityLevel";
import EarthLevel from "./levels/EarthLevel";
import SunSolarSystemLevel from "./levels/SunSolarSystemLevel";

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
      {phase === "intro" && (
        <IntroLevel width={dimensions.width} height={dimensions.height} />
      )}
      {phase === "microscope" && (
        <MicroscopeLevel width={dimensions.width} height={dimensions.height} />
      )}
      {phase === "petri" && (
        <PetriLevel width={dimensions.width} height={dimensions.height} />
      )}
      {phase === "lab" && (
        <LabLevel width={dimensions.width} height={dimensions.height} />
      )}
      {phase === "city" && (
        <CityLevel width={dimensions.width} height={dimensions.height} />
      )}
      {phase === "earth" && (
        <EarthLevel width={dimensions.width} height={dimensions.height} />
      )}
      {phase === "sunSolarSystem" && (
        <SunSolarSystemLevel
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </div>
  );
}
