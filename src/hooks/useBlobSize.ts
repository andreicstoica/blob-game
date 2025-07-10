import { useMemo } from 'react';
import { getNextLevel, LEVELS } from '../game/content/levels';
import type { GameState } from '../game/types';

// Get level by ID
const getLevelById = (levelId: number) => {
    return LEVELS.find(level => level.id === levelId) || LEVELS[0];
};

// Calculate blob size based on progress within current level
const calculateLevelSize = (
    biomass: number,
    gameState: GameState
) => {
    const currentLevel = getLevelById(gameState.currentLevelId);
    const nextLevel = getNextLevel(currentLevel);

    if (!nextLevel) {
        // At max level, use simple logarithmic size
        const minSize = currentLevel.blobSizeStart;
        const maxSize = currentLevel.blobSizeEnd;
        const progress = Math.min(1, Math.log10(biomass + 1) / 10);
        return minSize + progress * (maxSize - minSize);
    }

    const progressInLevel = Math.max(0, biomass - currentLevel.biomassThreshold);
    const levelRange = nextLevel.biomassThreshold - currentLevel.biomassThreshold;
    const progressRatio = Math.min(1, progressInLevel / levelRange);

    const { blobSizeStart, blobSizeEnd } = currentLevel;

    // Use power curve for slow start, fast finish (inverse of camera zoom)
    // x^3 creates gentle growth at start, aggressive growth at end
    const easedProgress = Math.pow(progressRatio, 3);

    const calculatedSize = blobSizeStart + easedProgress * (blobSizeEnd - blobSizeStart);

    return calculatedSize;
};

export const useBlobSize = (gameState: GameState) => {
    return useMemo(() => {
        const calculatedSize = calculateLevelSize(gameState.biomass, gameState);
        return calculatedSize;
    }, [gameState.biomass, gameState.currentLevelId]);
}; 