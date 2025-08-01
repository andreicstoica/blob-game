import { LEVELS } from '../content/levels';
import type { GameState } from '../types';
import { getTotalGrowth, calculateClickPower } from './calculations';
import { INITIAL_STATE } from './initialization';
import { playSound } from '../../utils/sound';
import {
    checkSizeMilestones,
    checkFirstGenerator,
    checkFirstUpgrade,
    checkClickMilestones,
    incrementClickCount,
    displayNotification
} from './notifications';

// Re-export commonly used functions and types
export { INITIAL_STATE };
export type { GameState };

// Tick function - runs every game loop iteration
export function tick(state: GameState): GameState {
    const growth = getTotalGrowth(state);
    const newBiomass = state.biomass + growth;
    const clickPower = calculateClickPower({ ...state, biomass: newBiomass });

    const newState = {
        ...state,
        biomass: newBiomass,
        growth,
        clickPower,
    };

    return newState;
}

// Manual click function
export function manualClick(state: GameState): GameState {
    const newBiomass = state.biomass + state.clickPower;
    const clickPower = calculateClickPower({ ...state, biomass: newBiomass });

    // Play blob click sound
    playSound('blobClick');

    const updatedState = {
        ...state,
        biomass: newBiomass,
        clickPower,
    };

    // Increment click count first, then check relevant notifications
    const stateWithClickCount = incrementClickCount(updatedState);

    // Check click milestones
    const clickResult = checkClickMilestones(stateWithClickCount);
    if (clickResult.notification) {
        displayNotification(clickResult.notification.message, clickResult.notification.id);
    }

    // Check size milestones
    const sizeResult = checkSizeMilestones(clickResult.state);
    if (sizeResult.notification) {
        displayNotification(sizeResult.notification.message, sizeResult.notification.id);
    }

    return sizeResult.state;
}

export function buyGenerator(state: GameState, generatorId: string): GameState {
    const generator = state.generators[generatorId];
    if (!generator) return state;

    // Tutorial generator is always free and purchasable
    if (generatorId === 'tutorial-generator') {
        // Play UI click sound for generator purchase
        playSound('uiClick');

        return {
            ...state,
            generators: {
                ...state.generators,
                [generatorId]: {
                    ...generator,
                    level: generator.level + 1
                }
            }
        };
    }

    const cost = generator.baseCost * Math.pow(generator.costMultiplier, generator.level);

    if (state.biomass >= cost) {
        // Play UI click sound for generator purchase
        playSound('uiClick');

        const newBiomass = state.biomass - cost;
        const clickPower = calculateClickPower({ ...state, biomass: newBiomass });

        const updatedState = {
            ...state,
            biomass: newBiomass,
            clickPower,
            generators: {
                ...state.generators,
                [generatorId]: {
                    ...generator,
                    level: generator.level + 1
                }
            }
        };

        const result = checkFirstGenerator(updatedState);
        if (result.notification) {
            displayNotification(result.notification.message, result.notification.id);
        }

        return result.state;
    }

    return state;
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
    const upgrade = state.upgrades[upgradeId];
    if (!upgrade) return state;

    // Tutorial upgrade is always free and purchasable
    if (upgradeId === 'tutorial-upgrade') {
        if (!upgrade.purchased) {
            // Play UI click sound for upgrade purchase
            playSound('uiClick');

            return {
                ...state,
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

    if (!upgrade.purchased && state.biomass >= upgrade.cost) {
        // Play UI click sound for upgrade purchase
        playSound('uiClick');

        const newBiomass = state.biomass - upgrade.cost;
        const clickPower = calculateClickPower({ ...state, biomass: newBiomass });

        const updatedState = {
            ...state,
            biomass: newBiomass,
            clickPower,
            upgrades: {
                ...state.upgrades,
                [upgradeId]: {
                    ...upgrade,
                    purchased: true
                }
            }
        };

        const result = checkFirstUpgrade(updatedState);
        if (result.notification) {
            displayNotification(result.notification.message, result.notification.id);
        }

        return result.state;
    }

    return state;
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

    // Play evolve sound for all levels except intro (intro sound is handled in UI)
    if (state.currentLevelId > 0) {
        playSound('evolve');
    }

    // Create new state with evolution
    return {
        ...state,
        currentLevelId: nextLevel.id,
        highestLevelReached: nextLevel.id
        // Biomass carries over, generators and upgrades are preserved
        // Zoom reset is handled by useCameraZoom hook when currentLevelId changes
    };
}

// Helper function to get level by ID (keep existing for compatibility)
function getLevelById(levelId: number) {
    return LEVELS.find(level => level.id === levelId) || LEVELS[0];
}

// Get current level from game state (original version for our tutorial system)
export function getCurrentLevel(gameState: GameState) {
    return getLevelById(gameState.currentLevelId);
}

// Alternative level selector using highest reached (from incoming branch)
export function getCurrentLevelByProgress(state: GameState) {
    const level = LEVELS.find(l => l.id === state.highestLevelReached) || LEVELS[0];
    return level;
}

// Check if content is available based on current level (from incoming branch)
export function isContentAvailable(unlockedAtLevel: string, currentLevelName: string): boolean {
    const levelIndex = LEVELS.findIndex(level => level.name === unlockedAtLevel);
    const currentLevelIndex = LEVELS.findIndex(level => level.name === currentLevelName);
    return levelIndex <= currentLevelIndex;
}

// Calculate total cost for buying multiple generators (from incoming branch)
export function calculateTotalCost(generator: { baseCost: number; costMultiplier: number; level: number }, count: number): number {
    let totalCost = 0;
    for (let i = 0; i < count; i++) {
        const currentLevel = generator.level + i;
        const cost = generator.baseCost * Math.pow(generator.costMultiplier, currentLevel);
        totalCost += cost;
    }
    return totalCost;
}

// Get all generators unlocked through the current level
export function getUnlockedGenerators(gameState: GameState): any[] {
    const currentLevel = getCurrentLevel(gameState);
    return Object.values(gameState.generators).filter(generator =>
        isContentAvailable(generator.unlockedAtLevel, currentLevel.name)
    );
} 