import type { GeneratorState, UpgradeState } from '../types';

// Tutorial-specific dummy generator
export const TUTORIAL_GENERATOR: Omit<GeneratorState, 'level'> = {
  id: 'tutorial-generator',
  name: '⚡ Tutorial Generator',
  description: 'A simple generator to learn the basics',
  growthPerTick: 0, // No effect on main game
  baseCost: 0, // FREE for tutorial
  costMultiplier: 1.15,
  unlockedAtLevel: 'intro'
};

// Tutorial-specific dummy upgrade
export const TUTORIAL_UPGRADE: Omit<UpgradeState, 'purchased'> = {
  id: 'tutorial-upgrade',
  name: '🔧 Tutorial Upgrade',
  description: 'Learn how upgrades work',
  cost: 0, // FREE for tutorial
  effect: 1, // No effect on main game
  type: 'growth',
  unlockedAtLevel: 'intro',
  targetLevel: 'tutorial-generator'
};

// Check if content should be shown in tutorial
export const isTutorialContent = (id: string): boolean => {
  return id === 'tutorial-generator' || id === 'tutorial-upgrade';
}; 