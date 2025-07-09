import { useMemo } from 'react';
import { getCurrentLevel, getNextLevel } from '../engine/game';
import type { GameState } from '../engine/game';

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

        // Use different size ranges for different levels
        let minSize = 50;
        let maxSize = 400;

        switch (currentGameLevel.name) {
          case 'intro':
            minSize = 50;
            maxSize = 200;
            break;
          case 'microscopic':
            minSize = 50;
            maxSize = 300;
            break;
          case 'petri-dish':
            minSize = 60;
            maxSize = 350;
            break;
          case 'lab':
            minSize = 70;
            maxSize = 400;
            break;
          case 'city':
            minSize = 80;
            maxSize = 450;
            break;
          case 'earth':
            minSize = 90;
            maxSize = 500;
            break;
          case 'solar-system':
            minSize = 100;
            maxSize = 550;
            break;
        }

        // Use square root for more gradual growth
        const sizeCurve = Math.sqrt(progressRatio);
        blobSize = minSize + (sizeCurve * (maxSize - minSize));
      }
    } else {
      // At max level, use simple scaling with a cap
      const baseSize = Math.max(100, Math.min(600, gameState.biomass * 0.000001));
      blobSize = Math.min(600, baseSize);
    }

    return blobSize;
  }, [gameState.biomass]);
}; 