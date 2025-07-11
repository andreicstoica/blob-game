import { GAME_CONFIG } from '../content/config';
import { GENERATORS } from '../content/generators';
import { UPGRADES } from '../content/upgrades';
import { TUTORIAL_GENERATOR, TUTORIAL_UPGRADE } from '../content/tutorialContent';
import type { GameState, GeneratorState, UpgradeState } from '../types';


export const initializeGenerators = (): Record<string, GeneratorState> => {
    const generators: Record<string, GeneratorState> = {};

    Object.entries(GENERATORS).forEach(([id, generator]) => {
        generators[id] = {
            ...generator,
            level: 0
        };
    });

    // Add tutorial generator
    generators[TUTORIAL_GENERATOR.id] = {
        ...TUTORIAL_GENERATOR,
        level: 0
    };

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

    // Add tutorial upgrade
    upgrades[TUTORIAL_UPGRADE.id] = {
        ...TUTORIAL_UPGRADE,
        purchased: false
    };

    return upgrades;
};

export const INITIAL_STATE: GameState = {
    blobs: [],
    biomass: GAME_CONFIG.startingBiomass,
    growth: 0,
    clickPower: GAME_CONFIG.startingClickPower,
    generators: initializeGenerators(),
    upgrades: initializeUpgrades(),
    currentLevelId: 0, // Start at intro level
    highestLevelReached: 0,
    gameMode: 'tutorial',
    notifications: {
        shownMilestones: new Set<string>(),
        totalClicks: 0,
    },
}; 