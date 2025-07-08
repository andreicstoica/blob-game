// src/components/Map/levels/PetriLayer.tsx
import { useEffect, useRef } from "react";

interface PetriLayerProps {
  width: number;
  height: number;
}

export default function PetriLevel({ width, height }: PetriLayerProps) {
  const initializedRef = useRef(false);

  // Initialize only once when component first mounts
  useEffect(() => {
    if (!initializedRef.current && width > 0 && height > 0) {
      console.log("PetriLayer: Initialized with dimensions", { width, height });
      initializedRef.current = true;
    }
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
      {/* Petri dish border */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: Math.min(width, height) - 20,
          height: Math.min(width, height) - 20,
          border: "2px solid rgba(255, 255, 255, 0.27)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
