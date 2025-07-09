import type { UpgradeConfig } from '../../types';

export const UPGRADES: Record<string, UpgradeConfig> = {
  // Intro Level
  'click-power-upgrade': {
    id: 'click-power-upgrade',
    name: '⚪ Click Power Upgrade',
    cost: 0,
    description: '2x Click Power',
    effect: 2,
    type: 'click',
    unlockedAtLevel: 'intro'
  },
  // Microscopic Level
  'enhanced-microscope-optics': {
    id: 'enhanced-microscope-optics',
    name: '🦠 Enhanced Microscope Optics',
    cost: 0,
    description: '1.5x Microscopic Cloner',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'microscopic'
  },
  'cell-division-optimizer': {
    id: 'cell-division-optimizer',
    name: '🦠 Cell Division Optimizer',
    cost: 0,
    description: '2x Cell Divider',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'microscopic'
  },
  // Petri Dish Level
  'colony-expansion-theory': {
    id: 'colony-expansion-theory',
    name: '🔍 Colony Expansion Theory',
    cost: 0,
    description: '1.5x Colony Expander',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'petri-dish'
  },
  'spore-propulsion-system': {
    id: 'spore-propulsion-system',
    name: '🔍 Spore Propulsion System',
    cost: 0,
    description: '2x Spore Launcher',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'petri-dish'
  },
  // Lab Level
  'centrifuge-optimization': {
    id: 'centrifuge-optimization',
    name: '🧪 Centrifuge Optimization',
    cost: 0,
    description: '1.5x Centrifuge Sorter',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'lab'
  },
  'bioreactor-efficiency': {
    id: 'bioreactor-efficiency',
    name: '🧪 Bioreactor Efficiency',
    cost: 0,
    description: '2x Bioreactor Tank',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'lab'
  },
  // City Level
  'human-disguise-mastery': {
    id: 'human-disguise-mastery',
    name: '🏙️ Human Disguise Mastery',
    cost: 0,
    description: '1.5x Humanoid Slimes',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'city'
  },
  'sewer-infrastructure': {
    id: 'sewer-infrastructure',
    name: '🏙️ Sewer Infrastructure',
    cost: 0,
    description: '2x Sewer Colonies',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'city'
  },
  // Earth Level
  'global-shipping-network': {
    id: 'global-shipping-network',
    name: '🌍 Global Shipping Network',
    cost: 0,
    description: '1.5x Cargo Ship Infestors',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'earth'
  },
  'air-travel-optimization': {
    id: 'air-travel-optimization',
    name: '🌍 Air Travel Optimization',
    cost: 0,
    description: '2x Airplane Spore Units',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'earth'
  },
  // Solar System Level
  'terraforming-expertise': {
    id: 'terraforming-expertise',
    name: '🚀 Terraforming Expertise',
    cost: 0,
    description: '1.5x Terraforming Ooze',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'solar-system'
  },
  'asteroid-seeding-mastery': {
    id: 'asteroid-seeding-mastery',
    name: '🚀 Asteroid Seeding Mastery',
    cost: 0,
    description: '2x Asteroid Seeder',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'solar-system'
  }
}; 