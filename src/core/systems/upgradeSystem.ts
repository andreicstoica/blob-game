import type { GameState, UpgradeState } from '../../types';
import { LEVELS } from '../content/levels';

/**
 * Check if an upgrade is available for purchase
 */
export function isUpgradeAvailable(upgrade: UpgradeState, state: GameState): boolean {
    const currentLevel = LEVELS.find(level => level.id === state.currentLevelId);
    if (!currentLevel) return false;
    
    // Check if player has reached the required level
    return currentLevel.name === upgrade.unlockedAtLevel || 
           LEVELS.findIndex(level => level.name === upgrade.unlockedAtLevel) <= state.currentLevelId;
}

/**
 * Check if player can afford an upgrade
 */
export function canAffordUpgrade(upgrade: UpgradeState, state: GameState): boolean {
    return state.biomass >= upgrade.cost && !upgrade.purchased;
}

/**
 * Get the effective click power after applying upgrades
 */
export function getEffectiveClickPower(state: GameState): number {
    let clickPower = state.clickPower;
    
    // Apply click power upgrades
    Object.values(state.upgrades).forEach(upgrade => {
        if (upgrade.purchased && upgrade.type === 'click') {
            clickPower *= upgrade.effect;
        }
    });
    
    return clickPower;
}

/**
 * Get the effective growth rate after applying upgrades
 */
export function getEffectiveGrowthRate(state: GameState): number {
    let growthRate = 0;
    
    // Add generator contributions
    Object.values(state.generators).forEach(generator => {
        const level = LEVELS.find(l => l.name === generator.unlockedAtLevel);
        if (level && state.currentLevelId >= level.id) {
            growthRate += generator.baseEffect * generator.level;
        }
    });
    
    // Apply growth upgrades
    Object.values(state.upgrades).forEach(upgrade => {
        if (upgrade.purchased && upgrade.type === 'growth') {
            growthRate *= upgrade.effect;
        }
    });
    
    return growthRate;
} 