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
} from '../game/systems/actions';
import { GAME_CONFIG } from '../game/content/config';
import { useMap } from '../game/systems/mapState';
import { createTutorialState, progressTutorial, updateTutorial } from '../game/systems/tutorial';
import type { TutorialState } from '../game/types/ui';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [tutorialState, setTutorialState] = useState<TutorialState>(() => {
    // Force tutorial reset for testing (remove this later)
    console.log('Forcing tutorial reset for debugging');
    return createTutorialState();
  });
  const mapEvolveToNextLevel = useMap(state => state.evolveToNextLevel);

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => tick(prevState));
      setTutorialState((prevTutorialState: TutorialState) => {
        const newTutorialState = updateTutorial(prevTutorialState, gameState);
        
        // Debug tutorial state changes
        if (newTutorialState !== prevTutorialState) {
          console.log('Tutorial state changed:', {
            from: prevTutorialState,
            to: newTutorialState,
            gameState: {
              currentLevelId: gameState.currentLevelId,
              gameMode: gameState.gameMode
            }
          });
        }
        
        return newTutorialState;
      });
    }, GAME_CONFIG.tickRate);

    return () => clearInterval(interval);
  }, [gameState]);

  const handleBlobClick = useCallback(() => {
    setGameState(prevState => manualClick(prevState));
    setTutorialState((prevTutorialState: TutorialState) => progressTutorial(prevTutorialState, 'manualClick'));
  }, [gameState]);

  const handleBuyGenerator = useCallback((generatorId: string) => {
    setGameState(prevState => buyGenerator(prevState, generatorId));
    setTutorialState((prevTutorialState: TutorialState) => progressTutorial(prevTutorialState, 'buyGenerator'));
  }, [gameState]);

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
    setTutorialState((prevTutorialState: TutorialState) => progressTutorial(prevTutorialState, 'evolve'));
  }, [mapEvolveToNextLevel, gameState]);

  const getNearbyNutrientsForBlob = useCallback((blobPosition: { x: number; y: number }) => {
    return getNearbyNutrients(gameState, blobPosition);
  }, [gameState]);

  return {
    gameState,
    tutorialState,
    handleBlobClick,
    handleBuyGenerator,
    handleBuyUpgrade,
    handleNutrientEaten,
    handleEvolve,
    getNearbyNutrientsForBlob
  };
}; 