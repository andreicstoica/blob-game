import type { GameState, GeneratorState } from '../../types';
import { getGeneratorCost } from '../../utils/calculations';

import { LEVELS } from '../content/levels';

/**
 * Check if a generator is available for purchase
 */
export function isGeneratorAvailable(generator: GeneratorState, state: GameState): boolean {
    const currentLevel = LEVELS.find(level => level.id === state.currentLevelId);
    if (!currentLevel) return false;
    
    // Check if player has reached the required level
    return currentLevel.name === generator.unlockedAtLevel || 
           LEVELS.findIndex(level => level.name === generator.unlockedAtLevel) <= state.currentLevelId;
}

/**
 * Get the current cost of a generator
 */
export function getCurrentGeneratorCost(generator: GeneratorState): number {
    return getGeneratorCost(generator);
}

/**
 * Get the total effect of a generator (base effect * level)
 */
export function getGeneratorTotalEffect(generator: GeneratorState): number {
    return generator.baseEffect * generator.level;
}

/**
 * Check if player can afford a generator
 */
export function canAffordGenerator(generator: GeneratorState, state: GameState): boolean {
    const cost = getCurrentGeneratorCost(generator);
    return state.biomass >= cost;
} 