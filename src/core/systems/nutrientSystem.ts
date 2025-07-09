import type { GameState } from '../../types';

/**
 * Get nearby nutrients for a blob position
 */
export function getNearbyNutrients(state: GameState, _blobPosition: { x: number; y: number }): Array<{ id: string; x: number; y: number; distance: number }> {
    return state.nutrients
        .filter(n => !n.consumed)
        .map(nutrient => {
            // Calculate distance from blob center (blob is at 0,0 in its coordinate system)
            const distance = Math.sqrt(
                Math.pow(nutrient.x - 0, 2) +
                Math.pow(nutrient.y - 0, 2)
            );
            return { ...nutrient, distance };
        });
}

/**
 * Spawn more nutrients when needed
 */
export function spawnMoreNutrients(state: GameState): GameState {
    const visibleNutrients = state.nutrients.filter(n => !n.consumed);

    // If we have fewer than 20 visible nutrients, spawn more
    if (visibleNutrients.length < 20) {
        const newNutrients = Array.from({ length: 10 }, (_, i) => {
            const gameAreaWidth = 2000;
            const gameAreaHeight = 1500;

            return {
                id: `nutrient-${Date.now()}-${i}`,
                // Store as offset from center, not absolute coordinates
                x: (Math.random() - 0.5) * gameAreaWidth,
                y: (Math.random() - 0.5) * gameAreaHeight,
                consumed: false
            };
        });

        return {
            ...state,
            nutrients: [...state.nutrients, ...newNutrients]
        };
    }

    return state;
} 