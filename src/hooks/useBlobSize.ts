import { useMemo } from 'react';
import { getCurrentLevel, getNextLevel } from '../engine/core/game';
import type { GameState } from '../engine/core/game';

export const useBlobSize = (gameState: GameState) => {
  return useMemo(() => {
    const currentGameLevel = getCurrentLevel(gameState);
    const nextGameLevel = getNextLevel(gameState);
    
    let blobSize = 50; // Minimum size
    
    if (nextGameLevel) {
      // Calculate progress within current level
      const levelStartBiomass = currentGameLevel.biomassThreshold;
      const levelEndBiomass = nextGameLevel.biomassThreshold;
      const progressInLevel = Math.max(0, gameState.biomass - levelStartBiomass);
      const levelRange = levelEndBiomass - levelStartBiomass;
      
      if (levelRange > 0) {
        const progressRatio = Math.min(1, progressInLevel / levelRange);
        // Scale from 50 to 400 based on progress
        blobSize = 50 + (progressRatio * 350);
      }
    } else {
      // At max level, use simple scaling
      blobSize = Math.max(50, Math.min(400, gameState.biomass * 0.1));
    }
    
    return blobSize;
  }, [gameState.biomass]);
}; 