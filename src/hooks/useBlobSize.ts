import { useMemo } from 'react';
import type { GameState } from '../engine/core/game';

export const useBlobSize = (gameState: GameState) => {
    return useMemo(() => {
        // Calculate blob size based on biomass, but keep it reasonable
        const BLOB_BASE_SIZE = 100; // Start larger
        const BLOB_MAX_SIZE = 300; // Larger max size

        // Calculate size based on biomass with logarithmic scaling
        const biomassFactor = Math.log10(gameState.biomass + 1) / 8; // Faster growth
        const calculatedSize = BLOB_BASE_SIZE + (BLOB_MAX_SIZE - BLOB_BASE_SIZE) * Math.min(1, biomassFactor);

        // Ensure blob doesn't exceed screen bounds
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const hudWidth = 350;
        const padding = 50;

        const maxWidth = (screenWidth - hudWidth - padding) / 4; // Max 1/4 of playable area
        const maxHeight = (screenHeight - padding) / 4;
        const maxSize = Math.min(maxWidth, maxHeight, BLOB_MAX_SIZE);

        return Math.min(calculatedSize, maxSize);
    }, [gameState.biomass]);
}; 