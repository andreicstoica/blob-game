import { GENERATORS } from '../content/generators';
import { UPGRADES } from '../content/upgrades';
import { GAME_CONFIG } from '../content/config';
import type { GameState, GeneratorState, UpgradeState, NutrientState } from '../types';


export const initializeGenerators = () => {
    const generators: Record<string, GeneratorState> = {};
    Object.entries(GENERATORS).forEach(([id, generator]) => {
        generators[id] = { 
            id,
            name: generator.name,
            baseCost: generator.baseCost,
            description: generator.description,
            baseEffect: generator.baseEffect,
            level: 0,
            costMultiplier: generator.costMultiplier,
            unlockedAtLevel: generator.unlockedAtLevel
        };
    });
    return generators;
};

export const initializeUpgrades = () => {
    const upgrades: Record<string, UpgradeState> = {};
    Object.entries(UPGRADES).forEach(([id, upgrade]) => {
        upgrades[id] = { 
            id,
            name: upgrade.name,
            cost: upgrade.cost,
            description: upgrade.description,
            effect: upgrade.effect,
            type: upgrade.type,
            purchased: false,
            unlockedAtLevel: upgrade.unlockedAtLevel,
            targetLevel: upgrade.targetLevel
        };
    });
    return upgrades;
};

export const initializeNutrients = (): NutrientState[] => {
    console.log('Initializing nutrients...');

    // Generate nutrients in a large area around center (stored as offsets from center)
    const gameAreaWidth = 2000;
    const gameAreaHeight = 1500;

    const nutrients = Array.from({ length: 50 }, (_, i) => ({
        id: `nutrient-${i}`,
        // Store as offset from center, not absolute coordinates
        x: (Math.random() - 0.5) * gameAreaWidth,
        y: (Math.random() - 0.5) * gameAreaHeight,
        consumed: false
    }));

    console.log('Created nutrients:', nutrients.slice(0, 3));
    return nutrients;
};

export const INITIAL_STATE: GameState = {
    blobs: [],
    biomass: GAME_CONFIG.startingBiomass,
    growth: 0,
    clickPower: GAME_CONFIG.startingClickPower,
    generators: initializeGenerators(),
    upgrades: initializeUpgrades(),
    nutrients: initializeNutrients(),
    currentLevelId: 0, // Start at intro level
    highestLevelReached: 0,
    gameMode: 'tutorial',
}; 