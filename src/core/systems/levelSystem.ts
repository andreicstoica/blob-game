import { LEVELS } from '../content/levels';
import type { GameState } from '../../types';

/**
 * Check if player can evolve to the next level
 */
export function canEvolveToNextLevel(state: GameState): boolean {
    const currentLevel = LEVELS.find(level => level.id === state.currentLevelId);
    if (!currentLevel) return false;

    const nextLevel = getNextLevel(currentLevel);
    return !!(nextLevel && state.biomass >= nextLevel.biomassThreshold);
}

/**
 * Get the current level based on game state
 */
export function getCurrentLevel(state: GameState) {
    return LEVELS.find(level => level.id === state.currentLevelId) || LEVELS[0];
}

/**
 * Get the next level after the current one
 */
export function getNextLevel(currentLevel: typeof LEVELS[0]) {
    const nextIndex = LEVELS.findIndex(level => level.id === currentLevel.id) + 1;
    return nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;
}

/**
 * Get the next level based on game state
 */
export function getNextLevelFromState(state: GameState) {
    const currentLevel = getCurrentLevel(state);
    return getNextLevel(currentLevel);
}

/**
 * Evolve to the next level
 */
export function evolveToNextLevel(state: GameState): GameState {
    const currentLevel = LEVELS.find(level => level.id === state.currentLevelId);
    if (!currentLevel) return state;

    const nextLevel = getNextLevel(currentLevel);
    if (!nextLevel || state.biomass < nextLevel.biomassThreshold) {
        return state;
    }

    return {
        ...state,
        currentLevelId: nextLevel.id,
        highestLevelReached: Math.max(state.highestLevelReached, nextLevel.id)
    };
} 