import { useRef, useEffect, useState } from "react";
import { useMapSelector } from "../../core/systems/mapState";
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
  const currentLevel = useMapSelector((s) => s.currentLevel);
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

  const renderLevel = () => {
    const props = { width: dimensions.width, height: dimensions.height };

    switch (currentLevel.name) {
      case "intro":
        return <IntroLevel {...props} />;
      case "microscopic":
        return <MicroscopeLevel {...props} />;
      case "petri-dish":
        return <PetriLevel {...props} />;
      case "lab":
        return <LabLevel {...props} />;
      case "city":
        return <CityLevel {...props} />;
      case "earth":
        return <EarthLevel {...props} />;
      case "solar-system":
        return <SunSolarSystemLevel {...props} />;
      default:
        return <IntroLevel {...props} />;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {renderLevel()}
    </div>
  );
}
