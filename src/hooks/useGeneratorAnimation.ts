import { useMemo, useEffect, useRef, useState } from "react";
import type { GameState } from "../game/types";
import { useMapSelector } from "../game/systems/mapState";
import {
  calculateGeneratorGroups,
  initializeGeneratorMovement,
  initializeStackedGeneratorMovement,
  updateGeneratorPositions,
  calculateFloatingNumbers,
  updateFloatingNumberTimestamps,
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
  const initializedRef = useRef<boolean>(false);
  
  // Use refs to track current state for animation loop
  const generatorsRef = useRef<GeneratorVisualization[]>([]);
  const stackedGeneratorsRef = useRef<GeneratorVisualization[]>([]);
  const gameStateRef = useRef<GameState>(gameState);
  const blobSizeRef = useRef<number>(blobSize);

  // Update refs when state changes
  useEffect(() => {
    generatorsRef.current = generators;
  }, [generators]);

  useEffect(() => {
    stackedGeneratorsRef.current = stackedGenerators;
  }, [stackedGenerators]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    blobSizeRef.current = blobSize;
  }, [blobSize]);

  // Calculate generator groups with stable dependencies
  const generatorGroups = useMemo(() => {
    return calculateGeneratorGroups(gameState, currentLevel.name);
  }, [gameState.generators, currentLevel.name]);

  // Create stable keys for dependency tracking
  const currentLevelKey = useMemo(() => {
    return generatorGroups.currentLevel.map(g => `${g.id}-${g.level}`).join(',');
  }, [generatorGroups.currentLevel]);

  const previousLevelsKey = useMemo(() => {
    return Object.entries(generatorGroups.previousLevels)
      .map(([levelId, gens]) => `${levelId}:${gens.map(g => `${g.id}-${g.level}`).join(',')}`)
      .join('|');
  }, [generatorGroups.previousLevels]);

  // Initialize movement for current level generators (only when data changes)
  useEffect(() => {
    if (!initializedRef.current || currentLevelKey !== '') {
      const { currentLevel: currentLevelGenerators } = generatorGroups;
      const newGenerators = initializeGeneratorMovement(
        currentLevelGenerators,
        blobSize
      );
      setGenerators(newGenerators);
      initializedRef.current = true;
    }
  }, [currentLevelKey, blobSize]);

  // Initialize movement for stacked generators (only when data changes)
  useEffect(() => {
    if (!initializedRef.current || previousLevelsKey !== '') {
      const { previousLevels } = generatorGroups;
      const newStackedGenerators = initializeStackedGeneratorMovement(
        previousLevels,
        blobSize
      );
      setStackedGenerators(newStackedGenerators);
      initializedRef.current = true;
    }
  }, [previousLevelsKey, blobSize]);

  // Animation loop for movement and floating numbers
  useEffect(() => {
    const animate = () => {
      const currentGenerators = generatorsRef.current;
      const currentStackedGenerators = stackedGeneratorsRef.current;
      const currentGameState = gameStateRef.current;

      if (currentGenerators.length === 0 && currentStackedGenerators.length === 0) return;

      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000; // Convert to seconds
      lastUpdateRef.current = now;

      // Update generator positions
      const updatedGenerators = updateGeneratorPositions(
        currentGenerators,
        deltaTime
      );

      // Update stacked generator positions
      const updatedStackedGenerators = updateGeneratorPositions(
        currentStackedGenerators,
        deltaTime
      );

      // Calculate floating numbers for both types
      const blobPosition = calculateBlobPosition();
      const allGenerators = [...updatedGenerators, ...updatedStackedGenerators];
      const floatingNumbers = calculateFloatingNumbers(
        allGenerators,
        now,
        currentGameState,
        blobPosition
      );

      // Trigger floating number animations
      floatingNumbers.forEach((data) => {
        addFloatingNumber({ x: data.x, y: data.y }, data.value, data.color);
      });

      // Update floating number timestamps
      const finalGenerators = updateFloatingNumberTimestamps(updatedGenerators, now);
      const finalStackedGenerators = updateFloatingNumberTimestamps(updatedStackedGenerators, now);

      // Update generator state
      setGenerators(finalGenerators);
      setStackedGenerators(finalStackedGenerators);
    };

    const interval = setInterval(animate, 16); // ~60 FPS
    return () => clearInterval(interval);
  }, [addFloatingNumber]); // Only depend on addFloatingNumber function

  return {
    generators,
    stackedGenerators,
    hasGenerators: generators.length > 0 || stackedGenerators.length > 0
  };
}; 