import { useMemo } from 'react';
import type { GameState } from '../engine/core/game';

export const useBlobSize = (gameState: GameState) => {
    return useMemo(() => {
        // Keep consistent blob size - growth will be shown through off-screen particle absorption
        // and camera zoom changes rather than direct blob scaling
        const BLOB_BASE_SIZE = 100;

        return BLOB_BASE_SIZE;
    }, [gameState]);
}; 