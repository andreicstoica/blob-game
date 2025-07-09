import { GAME_CONFIG } from './config/game';
import type { GameState } from '../types';
import { getTotalGrowth } from '../utils/calculations';
import { spawnMoreNutrients } from './systems/nutrientSystem';

/**
 * Main game tick function - called every frame
 */
export function tick(state: GameState): GameState {
    const currentGrowth = getTotalGrowth(state);
    const growthPerTick = currentGrowth * (GAME_CONFIG.tickRate / 1000);
    
    const newState = {
        ...state,
        biomass: state.biomass + growthPerTick,
        growth: currentGrowth, // Keep the growth field updated for UI consistency
    };

    // Spawn more nutrients if needed
    return spawnMoreNutrients(newState);
} 