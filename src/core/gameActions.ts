import type { GameState } from '../types';
import { getTotalGrowth } from '../utils/calculations';

/**
 * Handle manual click action
 */
export function manualClick(state: GameState): GameState {
    return {
        ...state,
        biomass: state.biomass + state.clickPower,
    }
}

/**
 * Purchase a generator
 */
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

/**
 * Purchase an upgrade
 */
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

/**
 * Consume a nutrient
 */
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