import { GENERATORS, UPGRADES, GAME_CONFIG } from './content';
import { getNextLevel as getNextLevelByCurrent, LEVELS } from './levels';

export interface BlobState {
    size: number
}

export interface NutrientState {
    id: string
    x: number
    y: number
    consumed: boolean
}

export interface GeneratorState {
    id: string
    name: string
    baseCost: number
    description: string
    baseEffect: number
    level: number
    costMultiplier: number
    unlockedAtLevel: string
}

export interface UpgradeState {
    id: string
    name: string
    cost: number
    description: string
    effect: number
    type: 'growth' | 'split' | 'click' | 'blob'
    purchased: boolean
    unlockedAtLevel: string
}

export interface GameState {
    blobs: BlobState[]
    biomass: number
    growth: number
    clickPower: number
    generators: Record<string, GeneratorState>
    upgrades: Record<string, UpgradeState>
    nutrients: NutrientState[]
    currentLevelId: number
    highestLevelReached: number
}

const initializeGenerators = () => {
    const generators: Record<string, GeneratorState> = {};
    Object.entries(GENERATORS).forEach(([id, generator]) => {
        generators[id] = { ...generator, level: 0 };
    });
    return generators;
};

const initializeUpgrades = () => {
    const upgrades: Record<string, UpgradeState> = {};
    Object.entries(UPGRADES).forEach(([id, upgrade]) => {
        upgrades[id] = { ...upgrade, purchased: false };
    });
    return upgrades;
};

const initializeNutrients = (): NutrientState[] => {
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
    highestLevelReached: 0
};

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

export function getGeneratorCost(generator: GeneratorState): number {
    return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, generator.level));
}

export function getTotalGrowth(state: GameState): number {
    let totalGrowth = 0;
    Object.values(state.generators).forEach(gen => {
        totalGrowth += gen.baseEffect * gen.level;
    });

    // Apply upgrade effects
    Object.values(state.upgrades).forEach(upgrade => {
        if (upgrade.purchased) {
            if (upgrade.type === 'growth') {
                // Growth upgrades multiply the total growth
                totalGrowth *= upgrade.effect;
            }
        }
    });

    return totalGrowth;
}

export function consumeNutrient(state: GameState, nutrientId: string): GameState {
    const nutrient = state.nutrients.find(n => n.id === nutrientId);
    if (!nutrient || nutrient.consumed) return state;

    return {
        ...state,
        biomass: state.biomass + 1, // Each nutrient gives 1 biomass
        nutrients: state.nutrients.map(n =>
            n.id === nutrientId ? { ...n, consumed: true } : n
        )
    };
}

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

// Add function to spawn more nutrients when needed
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