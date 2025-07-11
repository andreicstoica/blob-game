import type { UpgradeState } from '../types';

export const UPGRADES: Record<string, Omit<UpgradeState, 'purchased'>> = {
  // Microscopic Level
  'enhanced-microscope-optics': {
    id: 'enhanced-microscope-optics',
    name: '🦠 Enhanced Microscope Optics',
    cost: 100,
    description: '2x Microscopic Cloner',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'microscopic',
    targetLevel: 'microscopic'
  },

  // Petri Dish Level
  'temperature-control-module': {
    id: 'temperature-control-module',
    name: '🔍 Temperature Control Module',
    cost: 1500,
    description: '3x All Microscopic Generators',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'petri-dish',
    targetLevel: 'microscopic'
  },
  'nutrient-enriched-agar': {
    id: 'nutrient-enriched-agar',
    name: '🔍 Nutrient-Enriched Agar',
    cost: 2000,
    description: '3x All Petri Generators',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'petri-dish',
    targetLevel: 'petri-dish'
  },

  // Lab Level
  'lab-assistant-automation': {
    id: 'lab-assistant-automation',
    name: '🧪 Lab Assistant Automation',
    cost: 15000,
    description: '4x All Petri Generators',
    effect: 4,
    type: 'growth',
    unlockedAtLevel: 'lab',
    targetLevel: 'petri-dish'
  },
  'sterile-workflow': {
    id: 'sterile-workflow',
    name: '🧪 Sterile Workflow',
    cost: 120000,
    description: '4x All Lab Generators',
    effect: 4,
    type: 'growth',
    unlockedAtLevel: 'lab',
    targetLevel: 'lab'
  },

  // Neighborhood Level
  'neighborhood-awareness': {
    id: 'neighborhood-awareness',
    name: '🏘️ Neighborhood Awareness',
    cost: 1500000,
    description: '5x All Lab Generators',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'neighborhood',
    targetLevel: 'lab'
  },
  'suburban-stealth': {
    id: 'suburban-stealth',
    name: '🏘️ Suburban Stealth',
    cost: 15000000,
    description: '5x All Neighborhood Generators',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'neighborhood',
    targetLevel: 'neighborhood'
  },

  // City Level
  'mimicry-training': {
    id: 'mimicry-training',
    name: '🏙️ Mimicry Training',
    cost: 200000000,
    description: '6x All Lab Generators',
    effect: 6,
    type: 'growth',
    unlockedAtLevel: 'city',
    targetLevel: 'lab'
  },
  'urban-camouflage': {
    id: 'urban-camouflage',
    name: '🏙️ Urban Camouflage',
    cost: 2600000000,
    description: '6x All City Generators',
    effect: 6,
    type: 'growth',
    unlockedAtLevel: 'city',
    targetLevel: 'city'
  },

  // Continent Level
  'intercontinental-railway': {
    id: 'intercontinental-railway',
    name: '🗺️ Intercontinental Railway',
    cost: 71000000000,
    description: '8x All Neighborhood Generators',
    effect: 8,
    type: 'growth',
    unlockedAtLevel: 'continent',
    targetLevel: 'neighborhood'
  },
  'continental-infrastructure': {
    id: 'continental-infrastructure',
    name: '🗺️ Continental Infrastructure',
    cost: 830000000000,
    description: '8x All Continent Generators',
    effect: 8,
    type: 'growth',
    unlockedAtLevel: 'continent',
    targetLevel: 'continent'
  },

  // Earth Level
  'global-shipping-network': {
    id: 'global-shipping-network',
    name: '🌍 Global Shipping Network',
    cost: 10000000000000,
    description: '10x All Continent Generators',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'earth',
    targetLevel: 'continent'
  },
  'planetary-dominance': {
    id: 'planetary-dominance',
    name: '🌍 Planetary Dominance',
    cost: 650000000000000,
    description: '10x All Earth Generators',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'earth',
    targetLevel: 'earth'
  },

  // Solar System Level
  'interplanetary-transport': {
    id: 'interplanetary-transport',
    name: '🚀 Interplanetary Transport',
    cost: 7100000000000000,
    description: '12x All Earth Generators',
    effect: 12,
    type: 'growth',
    unlockedAtLevel: 'solar-system',
    targetLevel: 'earth'
  },
  'stellar-expansion': {
    id: 'stellar-expansion',
    name: '🚀 Stellar Expansion',
    cost: 55000000000000000,
    description: '12x All Solar System Generators',
    effect: 12,
    type: 'growth',
    unlockedAtLevel: 'solar-system',
    targetLevel: 'solar-system'
  }
}; 