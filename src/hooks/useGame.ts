import { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_STATE,
  tick,
  manualClick,
  buyGenerator,
  buyUpgrade,
  consumeNutrient,
  getNearbyNutrients,
  evolveToNextLevel,
  type GameState
} from '../engine/game';
import { GAME_CONFIG } from '../engine/content';
import { useMap } from '../engine/mapState';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const mapEvolveToNextLevel = useMap(state => state.evolveToNextLevel);

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => tick(prevState));
    }, GAME_CONFIG.tickRate);

    return () => clearInterval(interval);
  }, []);

  const handleBlobClick = useCallback(() => {
    setGameState(prevState => manualClick(prevState));
  }, []);

  const handleBuyGenerator = useCallback((generatorId: string) => {
    setGameState(prevState => buyGenerator(prevState, generatorId));
  }, []);

  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    setGameState(prevState => buyUpgrade(prevState, upgradeId));
  }, []);

  const handleNutrientEaten = useCallback((_blobId: string, nutrientId: string) => {
    setGameState(prevState => consumeNutrient(prevState, nutrientId));
  }, []);

  const handleEvolve = useCallback(() => {
    setGameState(prevState => {
      const newState = evolveToNextLevel(prevState);
      // Also evolve the map level
      mapEvolveToNextLevel(newState.biomass);
      return newState;
    });
  }, [mapEvolveToNextLevel]);

  const getNearbyNutrientsForBlob = useCallback((blobPosition: { x: number; y: number }) => {
    return getNearbyNutrients(gameState, blobPosition);
  }, [gameState]);

  return {
    gameState,
    handleBlobClick,
    handleBuyGenerator,
    handleBuyUpgrade,
    handleNutrientEaten,
    handleEvolve,
    getNearbyNutrientsForBlob
  };
}; 