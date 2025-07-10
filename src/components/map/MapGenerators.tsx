import React, { useMemo, useEffect, useRef, useState } from "react";
import type { GameState } from "../../game/types";
import { GAME_CONFIG } from "../../game/content/config";
import { useMapSelector } from "../../game/systems/mapState";
import {
  calculateGeneratorGroups,
  initializeGeneratorMovement,
  updateGeneratorPositions,
  calculateFloatingNumbers,
  type GeneratorVisualization,
} from "../../game/systems/generatorVisualization";
import { calculateBlobPosition } from "../../game/systems/calculations";

interface GeneratorVisualizationProps {
  gameState: GameState;
  blobSize: number;
  addFloatingNumber: (position: { x: number; y: number }, value: number, color?: string) => void;
}

export const MapGenerators: React.FC<GeneratorVisualizationProps> = ({
  gameState,
  blobSize,
  addFloatingNumber,
}) => {
  const currentLevel = useMapSelector((s) => s.currentLevel);
  const [generators, setGenerators] = useState<GeneratorVisualization[]>([]);
  const lastUpdateRef = useRef<number>(Date.now());

  // Initialize generators when game state changes
  const generatorGroups = useMemo(() => {
    return calculateGeneratorGroups(gameState, currentLevel.name);
  }, [gameState, currentLevel.name]);

  // Initialize movement for current level generators
  useEffect(() => {
    const { currentLevel: currentLevelGenerators } = generatorGroups;
    const newGenerators = initializeGeneratorMovement(
      currentLevelGenerators,
      blobSize
    );
    setGenerators(newGenerators);
  }, [generatorGroups.currentLevel, blobSize]);

  // Animation loop for movement and floating numbers
  useEffect(() => {
    if (generators.length === 0) return;

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000; // Convert to seconds
      lastUpdateRef.current = now;

      // Update generator positions
      const updatedGenerators = updateGeneratorPositions(
        generators,
        blobSize,
        deltaTime
      );

      // Calculate floating numbers
      const blobPosition = calculateBlobPosition();
      const floatingNumbers = calculateFloatingNumbers(
        updatedGenerators,
        now,
        gameState,
        blobPosition
      );

      // Trigger floating number animations
      floatingNumbers.forEach((data) => {
        addFloatingNumber({ x: data.x, y: data.y }, data.value, data.color);
      });

      // Update generator state
      setGenerators(updatedGenerators);
    };

    const interval = setInterval(animate, 16); // ~60 FPS
    return () => clearInterval(interval);
  }, [generators, gameState, blobSize, addFloatingNumber]);

  if (generators.length === 0) {
    return null;
  }

  const { display } = GAME_CONFIG.generatorVisualization;
  const blobPosition = calculateBlobPosition();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {generators.map((generator) => {
        const x = blobPosition.x + generator.position.x;
        const y = blobPosition.y + generator.position.y;

        return (
          <div
            key={generator.id}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              fontSize: `${display.currentLevelSize}px`,
              lineHeight: 1,
              pointerEvents: "auto",
              userSelect: "none",
              color: "#000",
              textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
              zIndex: 60,
              cursor: "help",
            }}
            title={`${generator.emoji} (${generator.count} owned)`}
          >
            {generator.emoji}
          </div>
        );
      })}
    </div>
  );
};
