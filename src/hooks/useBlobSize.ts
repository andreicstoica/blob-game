import { useMemo } from 'react';
import type { GameState } from '../game/types';

export const useBlobSize = (gameState: GameState) => {
    return useMemo(() => {
        const BLOB_BASE_SIZE = 100;
        const BLOB_MAX_SIZE = 300;

        // Pure game logic - no UI constraints
        const biomassFactor = Math.log10(gameState.biomass + 1) / 8;
        const calculatedSize = BLOB_BASE_SIZE + (BLOB_MAX_SIZE - BLOB_BASE_SIZE) * Math.min(1, biomassFactor);

        return calculatedSize;
    }, [gameState.biomass]);
}; 