import type { UpgradeState } from '../core/game';

export const UPGRADES: Record<string, Omit<UpgradeState, 'purchased'>> = {
  // Microscopic Level
  'enhanced-microscope-optics': {
    id: 'enhanced-microscope-optics',
    name: '🦠 Enhanced Microscope Optics',
    cost: 0,
    description: '1.5x Microscopic Cloner',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'microscopic',
    targetLevel: 'microscopic'
  },
  'sterile-technique-mastery': {
    id: 'sterile-technique-mastery',
    name: '🦠 Sterile Technique Mastery',
    cost: 1500,
    description: '2x Cell Divider',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'microscopic',
    targetLevel: 'microscopic'
  },
  'rapid-binary-fission': {
    id: 'rapid-binary-fission',
    name: '🦠 Rapid Binary Fission',
    cost: 5000,
    description: '3x Nucleus Replicator',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'microscopic',
    targetLevel: 'microscopic'
  },
  'click-mastery': {
    id: 'click-mastery',
    name: '🦠 Click Mastery',
    cost: 500,
    description: 'Click power = 15% of growth rate (instead of 10%)',
    effect: 1.5,
    type: 'click',
    unlockedAtLevel: 'microscopic'
  },
  // Petri Dish Level
  'temperature-control-module': {
    id: 'temperature-control-module',
    name: '🔍 Temperature Control Module',
    cost: 35000,
    description: '3x All Microscopic Gens',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'petri-dish',
    targetLevel: 'microscopic'
  },
  'nutrient-enriched-agar': {
    id: 'nutrient-enriched-agar',
    name: '🔍 Nutrient-Enriched Agar',
    cost: 250000,
    description: '3x All Petri Gens',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'petri-dish',
    targetLevel: 'petri-dish'
  },
  'antibiotic-resistance': {
    id: 'antibiotic-resistance',
    name: '🔍 Antibiotic Resistance',
    cost: 1800000,
    description: '2x All Petri Gens',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'petri-dish',
    targetLevel: 'petri-dish'
  },
  // Lab Level
  'lab-assistant-automation': {
    id: 'lab-assistant-automation',
    name: '🧪 Lab Assistant Automation',
    cost: 13000000,
    description: '5x All Petri Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'lab',
    targetLevel: 'petri-dish'
  },
  'sterile-workflow': {
    id: 'sterile-workflow',
    name: '🧪 Sterile Workflow',
    cost: 90000000,
    description: '5x All Lab Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'lab',
    targetLevel: 'lab'
  },
  'precision-pipetting': {
    id: 'precision-pipetting',
    name: '🧪 Precision Pipetting',
    cost: 650000000,
    description: '3x All Lab Gens',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'lab',
    targetLevel: 'lab'
  },
  'precision-clicking': {
    id: 'precision-clicking',
    name: '🧪 Precision Clicking',
    cost: 50000000,
    description: 'Click power = 20% of growth rate',
    effect: 2.0,
    type: 'click',
    unlockedAtLevel: 'lab'
  },
  // Neighborhood Level
  'neighborhood-awareness': {
    id: 'neighborhood-awareness',
    name: '🏘️ Neighborhood Awareness',
    cost: 1500000000,
    description: '5x All Lab Generators',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'neighborhood',
    targetLevel: 'lab'
  },
  'suburban-stealth': {
    id: 'suburban-stealth',
    name: '🏘️ Suburban Stealth',
    cost: 10000000000,
    description: '5x All Neighborhood Generators',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'neighborhood',
    targetLevel: 'neighborhood'
  },
  'community-integration': {
    id: 'community-integration',
    name: '🏘️ Community Integration',
    cost: 65000000000,
    description: '3x All Neighborhood Generators',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'neighborhood',
    targetLevel: 'neighborhood'
  },
  // City Level
  'mimicry-training': {
    id: 'mimicry-training',
    name: '🏙️ Mimicry Training',
    cost: 4500000000,
    description: '5x All Lab Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'city',
    targetLevel: 'lab'
  },
  'urban-camouflage': {
    id: 'urban-camouflage',
    name: '🏙️ Urban Camouflage',
    cost: 32000000000,
    description: '5x All City Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'city',
    targetLevel: 'city'
  },
  'subway-expansion-plan': {
    id: 'subway-expansion-plan',
    name: '🏙️ Subway Expansion Plan',
    cost: 230000000000,
    description: '3x All City Gens',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'city',
    targetLevel: 'city'
  },
  'rapid-clicking': {
    id: 'rapid-clicking',
    name: '🏙️ Rapid Clicking',
    cost: 5000000000,
    description: 'Click power = 25% of growth rate',
    effect: 2.5,
    type: 'click',
    unlockedAtLevel: 'city'
  },
  // Continent Level
  'intercontinental-railway': {
    id: 'intercontinental-railway',
    name: '🗺️ Intercontinental Railway',
    cost: 1200000000000,
    description: '10x All Neighborhood Generators',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'continent',
    targetLevel: 'neighborhood'
  },
  'continental-dominance': {
    id: 'continental-dominance',
    name: '🗺️ Continental Dominance',
    cost: 8000000000000,
    description: '10x All Continent Generators',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'continent',
    targetLevel: 'continent'
  },
  'geographic-expansion': {
    id: 'geographic-expansion',
    name: '🗺️ Geographic Expansion',
    cost: 52000000000000,
    description: '5x All Continent Generators',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'continent',
    targetLevel: 'continent'
  },
  // Earth Level
  'intercontinental-mutation': {
    id: 'intercontinental-mutation',
    name: '🌍 Intercontinental Mutation',
    cost: 1600000000000,
    description: '10x All City Gens',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'earth',
    targetLevel: 'city'
  },
  'planetary-stealth-mode': {
    id: 'planetary-stealth-mode',
    name: '🌍 Planetary Stealth Mode',
    cost: 11000000000000,
    description: '10x All Earth Gens',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'earth',
    targetLevel: 'earth'
  },
  'accelerated-core-evolution': {
    id: 'accelerated-core-evolution',
    name: '🌍 Accelerated Core Evolution',
    cost: 80000000000000,
    description: '5x All Earth Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'earth',
    targetLevel: 'earth'
  },
  // Solar System Level
  'cosmic-radiation-tolerance': {
    id: 'cosmic-radiation-tolerance',
    name: '🚀 Cosmic Radiation Tolerance',
    cost: 600000000000000,
    description: '10x All Earth Gens',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'solar-system',
    targetLevel: 'earth'
  },
  'faster-than-light-spread': {
    id: 'faster-than-light-spread',
    name: '🚀 Faster-Than-Light Spread',
    cost: 4000000000000000,
    description: '10x All Solar Gens',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'solar-system',
    targetLevel: 'solar-system'
  },
  'self-replicating-probes': {
    id: 'self-replicating-probes',
    name: '🚀 Self-Replicating Probes',
    cost: 28000000000000000,
    description: '5x All Solar Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'solar-system',
    targetLevel: 'solar-system'
  }
}; 