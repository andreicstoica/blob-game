import { GENERATORS, UPGRADES, GAME_CONFIG } from './content';

export interface SlimeState {
    size: number
    type: string
}

export interface GeneratorState {
    id: string
    name: string
    baseCost: number
    description: string
    baseEffect: number
    level: number
    costMultiplier: number
}

export interface UpgradeState {
    id: string
    name: string
    cost: number
    description: string
    effect: number
    type: 'income' | 'split' | 'click' | 'slime'
    purchased: boolean
}

export interface GameState {
    slimes: SlimeState[]
    biomass: number
    income: number
    clickPower: number
    generators: Record<string, GeneratorState>
    upgrades: Record<string, UpgradeState>
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

export const initialGameState: GameState = {
    slimes: [],
    biomass: GAME_CONFIG.startingBiomass,
    income: 0,
    clickPower: GAME_CONFIG.startingClickPower,
    generators: initializeGenerators(),
    upgrades: initializeUpgrades()
}

export function tick(state: GameState): GameState {
    return {
        ...state,
        biomass: state.biomass + state.income,
    }
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
    
    // Calculate total income from all generators
    let totalIncome = 0;
    Object.values(newGenerators).forEach(gen => {
        totalIncome += gen.baseEffect * gen.level;
    });
    
    // Apply upgrade effects
    if (state.upgrades['efficient-generators'].purchased) {
        totalIncome += newGenerators['basic-slime'].level * state.upgrades['efficient-generators'].effect;
    }
    
    return {
        ...state,
        biomass: state.biomass - currentCost,
        income: totalIncome,
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
    let newIncome = state.income;
    
    // Apply upgrade effects
    if (upgrade.type === 'click') {
        newClickPower += upgrade.effect;
    } else if (upgrade.type === 'income') {
        // Recalculate income with new upgrade effect
        let totalIncome = 0;
        Object.values(state.generators).forEach(gen => {
            totalIncome += gen.baseEffect * gen.level;
        });
        
        if (upgradeId === 'efficient-generators') {
            totalIncome += state.generators['basic-slime'].level * upgrade.effect;
        }
        
        newIncome = totalIncome;
    }
    
    return {
        ...state,
        biomass: state.biomass - upgrade.cost,
        clickPower: newClickPower,
        income: newIncome,
        upgrades: newUpgrades
    };
}

export function getGeneratorCost(generator: GeneratorState): number {
    return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, generator.level));
}

export function getTotalIncome(state: GameState): number {
    let totalIncome = 0;
    Object.values(state.generators).forEach(gen => {
        totalIncome += gen.baseEffect * gen.level;
    });
    
    // Apply upgrade effects
    if (state.upgrades['efficient-generators'].purchased) {
        totalIncome += state.generators['basic-slime'].level * state.upgrades['efficient-generators'].effect;
    }
    
    return totalIncome;
}