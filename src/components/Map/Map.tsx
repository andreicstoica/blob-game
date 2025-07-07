import { useRef, useEffect, useState } from "react";
import { useMapSelector } from "../../engine/mapState";
import PetriLayer from "./layers/PetriLayer";
import EarthLayer from "./layers/EarthLayer";
import CosmicLayer from "./layers/CosmicLayer";
import Blob from "../Blob/Blob";

interface MapProps {
  className?: string;
  onBlobClick?: (blobId: string, clickPos: { x: number; y: number }) => void;
}

export default function Map({ className, onBlobClick }: MapProps) {
  const phase = useMapSelector((s) => s.phase);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Show blob in the map scene
  const showBlob = true; // Always show for now

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

  const handleBlobClick = (blobId: string, clickPos: { x: number; y: number }) => {
    console.log(`Blob ${blobId} clicked at:`, clickPos);
    onBlobClick?.(blobId, clickPos); // Pass to game system
  };

  let Layer: React.FC<{ width: number; height: number }>;
  if (phase === "primordial") Layer = PetriLayer;
  else if (phase === "colonial") Layer = EarthLayer;
  else Layer = CosmicLayer;

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <Layer width={dimensions.width} height={dimensions.height} />
      
      {/* Blob renders in the same scene as food particles */}
      {showBlob && (
        <Blob 
          id="game-blob"
          size={120}
          position={{ x: dimensions.width / 2, y: dimensions.height / 2 }}
          onBlobClick={handleBlobClick}
        />
      )}
    </div>
  );
}