import { GAME_CONFIG } from '../content/content';
import { getNextLevel as getNextLevelByCurrent, LEVELS } from '../content/levels';
import type { GameState } from './types';
import { getTotalGrowth } from './calculations';
import { spawnMoreNutrients } from './nutrients';

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

export function manualClick(state: GameState): GameState {
    return {
        ...state,
        biomass: state.biomass + state.clickPower,
    }
}

export function buyGenerator(state: GameState, generatorId: string): GameState {
    const generator = state.generators[generatorId];
    if (!generator) return state;

    const currentCost = Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, generator.level));

    if (state.biomass < currentCost) return state;

    const newGenerators = { ...state.generators };
    newGenerators[generatorId] = {
        ...generator,
        level: generator.level + 1
    };

    // Calculate total growth with new generator and all upgrades
    const newGrowth = getTotalGrowth({
        ...state,
        generators: newGenerators
    });

    return {
        ...state,
        biomass: state.biomass - currentCost,
        growth: newGrowth,
        generators: newGenerators
    };
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
    const upgrade = state.upgrades[upgradeId];
    if (!upgrade || upgrade.purchased || state.biomass < upgrade.cost) {
        return state;
    }

    const newUpgrades = { ...state.upgrades };
    newUpgrades[upgradeId] = {
        ...upgrade,
        purchased: true
    };

    let newClickPower = state.clickPower;

    // Apply upgrade effects
    if (upgrade.type === 'click') {
        newClickPower *= upgrade.effect;
    }

    // Recalculate total growth with all upgrades
    const newGrowth = getTotalGrowth({
        ...state,
        upgrades: newUpgrades
    });

    return {
        ...state,
        biomass: state.biomass - upgrade.cost,
        clickPower: newClickPower,
        growth: newGrowth,
        upgrades: newUpgrades
    };
}

// Helper function to get level by ID
function getLevelById(levelId: number) {
    return LEVELS.find(level => level.id === levelId) || LEVELS[0];
}

// Evolution system functions
export function canEvolveToNextLevel(state: GameState): boolean {
    // Check if player has enough biomass for the next level
    const currentLevel = getLevelById(state.highestLevelReached);
    const nextLevel = getNextLevelByCurrent(currentLevel);
    return nextLevel !== null && state.biomass >= nextLevel.biomassThreshold;
}

export function getCurrentLevel(state: GameState) {
    // Use the highest level reached, not current biomass
    return getLevelById(state.highestLevelReached);
}

export function getNextLevel(state: GameState) {
    const currentLevel = getLevelById(state.highestLevelReached);
    return getNextLevelByCurrent(currentLevel);
}

export function evolveToNextLevel(state: GameState): GameState {
    const nextLevel = getNextLevel(state);
    if (!nextLevel) return state; // Already at max level

    return {
        ...state,
        currentLevelId: nextLevel.id,
        highestLevelReached: nextLevel.id
        // Biomass carries over, generators and upgrades are preserved
        // Zoom reset is handled by useCameraZoom hook when currentLevelId changes
    };
} 