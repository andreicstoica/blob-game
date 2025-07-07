// src/components/Map/layers/PetriLayer.tsx
import { useEffect, useRef, useState } from "react";
import Nutrient from "../../Food/Nutrient";

interface PetriLayerProps {
  width: number;
  height: number;
  count?: number;
  onNutrientPositions?: (nutrients: Array<{ id: string; x: number; y: number }>) => void;
  consumedNutrients?: string[];
}

export default function PetriLayer({
  width,
  height,
  count = 20,
  onNutrientPositions,
  consumedNutrients = []
}: PetriLayerProps) {
  const initializedRef = useRef(false);
  const [nutrients, setNutrients] = useState<Array<{ id: string; x: number; y: number }>>([]);

  // Generate nutrients only once when component first mounts
  useEffect(() => {
    console.log("PetriLayer: Generating nutrients", { width, height, count });
    if (!initializedRef.current && width > 0 && height > 0) {
      const newNutrients = Array.from({ length: count }, (_, i) => ({
        id: `nutrient-${i}`,
        x: Math.random() * (width - 16) + 8,
        y: Math.random() * (height - 16) + 8,
      }));
      
      console.log("PetriLayer: Created nutrients:", newNutrients);
      setNutrients(newNutrients);
      initializedRef.current = true;
    }
  }, [width, height, count]);

  // Notify parent of nutrient positions
  useEffect(() => {
    if (onNutrientPositions && nutrients.length > 0) {
      console.log("PetriLayer: Sending nutrients to parent:", nutrients);
      onNutrientPositions(nutrients);
    }
  }, [nutrients, onNutrientPositions]);

  // Filter out consumed nutrients
  const visibleNutrients = nutrients.filter(n => !consumedNutrients.includes(n.id));

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

      {/* Nutrients */}
      {visibleNutrients.map((nutrient) => (
        <Nutrient key={nutrient.id} x={nutrient.x} y={nutrient.y} />
      ))}
    </div>
  );
}