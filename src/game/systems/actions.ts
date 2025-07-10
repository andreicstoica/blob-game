import { LEVELS } from '../content/levels';
import type { GameState } from '../types';
import { getTotalGrowth } from './calculations';
import { spawnMoreNutrients, getNearbyNutrients, consumeNutrient } from './nutrients';
import { INITIAL_STATE } from './initialization';
import { updateTutorial, completeTutorialStep } from './tutorial';

// Re-export commonly used functions and types
export { INITIAL_STATE };
export { getNearbyNutrients, consumeNutrient };
export type { GameState };

// Tick function - runs every game loop iteration
export function tick(state: GameState): GameState {
    const growth = getTotalGrowth(state);
    const newBiomass = state.biomass + growth;
    
    const newState = {
        ...state,
        biomass: newBiomass,
        growth,
    };

    // Spawn more nutrients if needed
    const stateWithNutrients = spawnMoreNutrients(newState);

    // Update tutorial system  
    const finalState = {
        ...stateWithNutrients,
        tutorial: updateTutorial(stateWithNutrients)
    };

    return finalState;
}

// Manual click function
export function manualClick(state: GameState): GameState {
    const newBiomass = state.biomass + state.clickPower;
    
    const newState = {
        ...state,
        biomass: newBiomass
    };

    // Complete blob click tutorial step if active
    if (newState.tutorial.currentStep?.type === 'click-blob') {
        return {
            ...newState,
            tutorial: completeTutorialStep(newState.tutorial, 'click-blob')
        };
    }

    return newState;
}

export function buyGenerator(state: GameState, generatorId: string): GameState {
    const generator = state.generators[generatorId];
    if (!generator) return state;
    
    const cost = generator.baseCost * Math.pow(generator.costMultiplier, generator.level);
    
    if (state.biomass >= cost) {
        const newState = {
            ...state,
            biomass: state.biomass - cost,
            generators: {
                ...state.generators,
                [generatorId]: {
                    ...generator,
                    level: generator.level + 1
                }
            }
        };

        // Complete generator purchase tutorial step if active
        if (newState.tutorial.currentStep?.type === 'buy-generator') {
            return {
                ...newState,
                tutorial: completeTutorialStep(newState.tutorial, 'buy-first-generator')
            };
        }

        return newState;
    }
    
    return state;
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
    const upgrade = state.upgrades[upgradeId];
    if (!upgrade) return state;
    
    if (!upgrade.purchased && state.biomass >= upgrade.cost) {
        return {
            ...state,
            biomass: state.biomass - upgrade.cost,
            upgrades: {
                ...state.upgrades,
                [upgradeId]: {
                    ...upgrade,
                    purchased: true
                }
            }
        };
    }
    
    return state;
}

// Helper function to get level by ID
function getLevelById(levelId: number) {
    return LEVELS.find(level => level.id === levelId) || LEVELS[0];
}

// Get current level from game state
export function getCurrentLevel(gameState: GameState) {
    return getLevelById(gameState.currentLevelId);
}

// Get the next level if it exists
export function getNextLevel(state: GameState) {
    const currentLevel = getCurrentLevel(state);
    return LEVELS.find(level => level.id === currentLevel.id + 1) || null;
}

// Check if can evolve to next level
export function canEvolveToNextLevel(state: GameState): boolean {
    const nextLevel = getNextLevel(state);
    return nextLevel ? state.biomass >= nextLevel.biomassThreshold : false;
}

export function evolveToNextLevel(state: GameState): GameState {
    const nextLevel = getNextLevel(state);
    
    // Check if evolution is possible
    if (!nextLevel || state.biomass < nextLevel.biomassThreshold) {
        return state;
    }

    // Create new state with evolution
    const newState = {
        ...state,
        currentLevelId: nextLevel.id,
        highestLevelReached: nextLevel.id
        // Biomass carries over, generators and upgrades are preserved
        // Zoom reset is handled by useCameraZoom hook when currentLevelId changes
    };

    // Complete evolution tutorial step if active
    if (newState.tutorial.currentStep?.type === 'evolve') {
        return {
            ...newState,
            tutorial: completeTutorialStep(newState.tutorial, 'first-evolution')
        };
    }

    return newState;
} 