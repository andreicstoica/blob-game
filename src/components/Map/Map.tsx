// src/components/Map/Map.tsx
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
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
  const [nutrients, setNutrients] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [consumedNutrients, setConsumedNutrients] = useState<string[]>([]);

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

  // Memoize the callback to prevent infinite re-renders
  const handleNutrientPositions = useCallback((newNutrients: Array<{ id: string; x: number; y: number }>) => {
    console.log("Map: Received nutrients from PetriLayer:", newNutrients);
    setNutrients(newNutrients);
  }, []);

  const handleBlobClick = useCallback((blobId: string, clickPos: { x: number; y: number }) => {
    console.log(`Blob ${blobId} clicked at:`, clickPos);
    onBlobClick?.(blobId, clickPos);
  }, [onBlobClick]);

  const handleFoodEaten = useCallback((blobId: string, foodId: string) => {
    console.log(`Blob ${blobId} ate food ${foodId}`);
    setConsumedNutrients(prev => [...prev, foodId]);
  }, []);

  // Memoize blob position
  const blobPosition = useMemo(() => ({
    x: dimensions.width / 2,
    y: dimensions.height / 2
  }), [dimensions.width, dimensions.height]);

  // Memoize available nutrients
  const availableNutrients = useMemo(() => 
    nutrients.filter(n => !consumedNutrients.includes(n.id)),
    [nutrients, consumedNutrients]
  );

  // Memoize nearby food calculation
  const nearbyFood = useMemo(() => 
    availableNutrients.map(nutrient => {
      const distance = Math.sqrt(
        Math.pow(nutrient.x - blobPosition.x, 2) + 
        Math.pow(nutrient.y - blobPosition.y, 2)
      );
      return { ...nutrient, distance };
    }),
    [availableNutrients, blobPosition]
  );

  // Remove the constant debug log - only log when things actually change
  useEffect(() => {
    console.log("Map: Nutrients updated:", nutrients.length);
  }, [nutrients.length]); // Only log when count changes

  useEffect(() => {
    console.log("Map: nearbyFood updated:", nearbyFood.length);
  }, [nearbyFood.length]); // Only log when count changes

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {phase === "primordial" && (
        <PetriLayer 
          width={dimensions.width} 
          height={dimensions.height}
          onNutrientPositions={handleNutrientPositions}
          consumedNutrients={consumedNutrients}
        />
      )}
      {phase === "colonial" && <EarthLayer width={dimensions.width} height={dimensions.height} />}
      {phase === "cosmic" && <CosmicLayer width={dimensions.width} height={dimensions.height} />}
      
      <Blob 
        id="game-blob"
        size={120}
        position={blobPosition}
        onBlobClick={handleBlobClick}
        onFoodEaten={handleFoodEaten}
        nearbyFood={nearbyFood}
      />

      {/* Debug info */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        Nutrients: {availableNutrients.length}<br/>
        In range: {nearbyFood.filter(f => f.distance <= 50).length}<br/>
        Consumed: {consumedNutrients.length}
      </div>

      {/* Distance debug for nearest nutrients */}
      {nearbyFood.slice(0, 3).map(food => (
        <div key={food.id} style={{
          position: 'absolute',
          left: food.x,
          top: food.y - 20,
          background: 'black',
          color: 'white',
          padding: '2px 4px',
          fontSize: '10px',
          borderRadius: '2px'
        }}>
          {Math.round(food.distance)}px
        </div>
      ))}
    </div>
  );
}