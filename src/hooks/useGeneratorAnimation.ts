import { useMemo, useEffect, useRef, useState } from "react";
import type { GameState } from "../game/types";
import { useMapSelector } from "../game/systems/mapState";
import {
  calculateGeneratorGroups,
  initializeGeneratorMovement,
  initializeStackedGeneratorMovement,
  updateGeneratorPositions,
  calculateFloatingNumbers,
  type GeneratorVisualization,
} from "../game/systems/generatorVisualization";
import { calculateBlobPosition } from "../game/systems/calculations";

export const useGeneratorAnimation = (
  gameState: GameState,
  blobSize: number,
  addFloatingNumber: (position: { x: number; y: number }, value: number, color?: string) => void
) => {
  const currentLevel = useMapSelector((s) => s.currentLevel);
  const [generators, setGenerators] = useState<GeneratorVisualization[]>([]);
  const [stackedGenerators, setStackedGenerators] = useState<GeneratorVisualization[]>([]);
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

  // Initialize movement for stacked generators
  useEffect(() => {
    const { previousLevels } = generatorGroups;
    const newStackedGenerators = initializeStackedGeneratorMovement(
      previousLevels,
      blobSize
    );
    setStackedGenerators(newStackedGenerators);
  }, [generatorGroups.previousLevels, blobSize]);

  // Animation loop for movement and floating numbers
  useEffect(() => {
    if (generators.length === 0 && stackedGenerators.length === 0) return;

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

      // Update stacked generator positions
      const updatedStackedGenerators = updateGeneratorPositions(
        stackedGenerators,
        blobSize,
        deltaTime
      );

      // Calculate floating numbers for both types
      const blobPosition = calculateBlobPosition();
      const allGenerators = [...updatedGenerators, ...updatedStackedGenerators];
      const floatingNumbers = calculateFloatingNumbers(
        allGenerators,
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
      setStackedGenerators(updatedStackedGenerators);
    };

    const interval = setInterval(animate, 16); // ~60 FPS
    return () => clearInterval(interval);
  }, [generators, stackedGenerators, gameState, blobSize, addFloatingNumber]);

  return {
    generators,
    stackedGenerators,
    hasGenerators: generators.length > 0 || stackedGenerators.length > 0
  };
}; 