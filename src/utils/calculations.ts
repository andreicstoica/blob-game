import type { GameState, GeneratorState } from '../types';

import { LEVELS } from '../core/content/levels';

/**
 * Calculate the total growth rate from all active generators and upgrades
 */
export function getTotalGrowth(state: GameState): number {
  let totalGrowth = 0;

  // Add generator contributions
  Object.values(state.generators).forEach(generator => {
    const level = LEVELS.find(l => l.name === generator.unlockedAtLevel);
    if (level && state.currentLevelId >= level.id) {
      totalGrowth += generator.baseEffect * generator.level;
    }
  });

  // Apply upgrade multipliers
  Object.values(state.upgrades).forEach(upgrade => {
    if (upgrade.purchased && upgrade.type === 'growth') {
      totalGrowth *= upgrade.effect;
    }
  });

  return totalGrowth;
}

/**
 * Calculate the cost of a generator at its current level
 */
export function getGeneratorCost(generator: GeneratorState): number {
  return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, generator.level));
}

/**
 * Calculate blob size based on biomass
 */
export function calculateBlobSize(biomass: number): number {
  return Math.max(50, Math.min(400, 50 + Math.log10(biomass + 1) * 50));
}

/**
 * Calculate camera zoom based on biomass and current level
 */
export function calculateCameraZoom(biomass: number, currentLevelId: number): number {
  const currentLevel = LEVELS.find(level => level.id === currentLevelId);
  if (!currentLevel) return 1.0;

  const nextLevelIndex = LEVELS.findIndex(level => level.id === currentLevelId) + 1;
  const nextLevel = nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex] : null;

  if (!nextLevel) return 0.02; // Max zoom out

  const progressInLevel = Math.max(0, biomass - currentLevel.biomassThreshold);
  const levelRange = nextLevel.biomassThreshold - currentLevel.biomassThreshold;
  const progressRatio = Math.min(1, progressInLevel / levelRange);

  // Zoom from 1.0 at level start to 0.02 at level end
  return 1.0 - (progressRatio * 0.98);
}

/**
 * Get the current level based on biomass
 */
export function getCurrentLevel(biomass: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (biomass >= LEVELS[i].biomassThreshold) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

/**
 * Get the next level after the current one
 */
export function getNextLevel(currentLevel: typeof LEVELS[0]) {
  const nextIndex = LEVELS.findIndex(level => level.id === currentLevel.id) + 1;
  return nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;
}

/**
 * Check if player can evolve to the next level
 */
export function canEvolveToNextLevel(state: GameState): boolean {
  const currentLevel = LEVELS.find(level => level.id === state.currentLevelId);
  if (!currentLevel) return false;

  const nextLevel = getNextLevel(currentLevel);
  return !!(nextLevel && state.biomass >= nextLevel.biomassThreshold);
}

/**
 * Calculate level progress as a ratio (0-1)
 */
export function calculateLevelProgress(biomass: number, currentLevelId: number): number {
  const currentLevel = LEVELS.find(level => level.id === currentLevelId);
  if (!currentLevel) return 0;

  const nextLevel = getNextLevel(currentLevel);
  if (!nextLevel) return 1; // Max level reached

  const progressInLevel = Math.max(0, biomass - currentLevel.biomassThreshold);
  const levelRange = nextLevel.biomassThreshold - currentLevel.biomassThreshold;
  
  return Math.min(1, progressInLevel / levelRange);
} 