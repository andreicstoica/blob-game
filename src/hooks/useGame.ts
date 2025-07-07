import { useState, useEffect } from 'react';
import { 
  initialGameState, 
  manualClick, 
  tick, 
  buyGenerator, 
  buyUpgrade,
  type GameState 
} from '../engine/game';
import { GAME_CONFIG } from '../engine/content';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Game loop for passive income
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => tick(prevState));
    }, GAME_CONFIG.tickRate);

    return () => clearInterval(interval);
  }, []);

  const handleBlobClick = () => {
    setGameState(prevState => manualClick(prevState));
  };

  const handleBuyGenerator = (generatorId: string) => {
    setGameState(prevState => buyGenerator(prevState, generatorId));
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    setGameState(prevState => buyUpgrade(prevState, upgradeId));
  };

  return {
    gameState,
    handleBlobClick,
    handleBuyGenerator,
    handleBuyUpgrade
  };
}; 