import type { GeneratorState } from '../types';

export const GENERATORS: Record<string, Omit<GeneratorState, 'level'>> = {
  // Microscopic Level
  'microscopic-cloner': {
    id: 'microscopic-cloner',
    name: '🦠 Microscopic Cloner',
    baseCost: 10,
    description: 'Clones basic slime cells',
    growthPerTick: 1,
    costMultiplier: 1.15,
    unlockedAtLevel: 'microscopic'
  },

  // Petri Dish Level
  'colony-expander': {
    id: 'colony-expander',
    name: '🔍 Colony Expansion',
    baseCost: 100,
    description: 'Expands colonies for more biomass',
    growthPerTick: 10,
    costMultiplier: 1.15,
    unlockedAtLevel: 'petri-dish'
  },

  // Lab Level
  'centrifuge-sorter': {
    id: 'centrifuge-sorter',
    name: '🧪 Centrifuge Sorter',
    baseCost: 1000,
    description: 'Sorts cells for maximum efficiency',
    growthPerTick: 50,
    costMultiplier: 1.15,
    unlockedAtLevel: 'lab'
  },
  'bioreactor-tank': {
    id: 'bioreactor-tank',
    name: '🧪 Bioreactor Tank',
    baseCost: 12000,
    description: 'Massive bioreactor for rapid growth',
    growthPerTick: 260,
    costMultiplier: 1.15,
    unlockedAtLevel: 'lab'
  },

  // Neighborhood Level
  'backyard-colonizer': {
    id: 'backyard-colonizer',
    name: '🏘️ Backyard Colonizer',
    baseCost: 130000,
    description: 'Colonizes suburban backyards',
    growthPerTick: 1400,
    costMultiplier: 1.15,
    unlockedAtLevel: 'neighborhood'
  },
  'garden-infester': {
    id: 'garden-infester',
    name: '🏘️ Garden Infester',
    baseCost: 1400000,
    description: 'Infests neighborhood gardens',
    growthPerTick: 7800,
    costMultiplier: 1.15,
    unlockedAtLevel: 'neighborhood'
  },

  // City Level
  'humanoid-slimes': {
    id: 'humanoid-slimes',
    name: '🏙️ Humanoid Slimes',
    baseCost: 20000000,
    description: 'Slimes disguised as humans',
    growthPerTick: 44000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'city'
  },
  'sewer-colonies': {
    id: 'sewer-colonies',
    name: '🏙️ Sewer Colonies',
    baseCost: 260000000,
    description: 'Colonies thriving in the sewers',
    growthPerTick: 260000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'city'
  },

  // Continent Level
  'national-highway-system': {
    id: 'national-highway-system',
    name: '🗺️ National Highway System',
    baseCost: 7100000000,
    description: 'Uses highway systems for rapid spread',
    growthPerTick: 1500000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'continent'
  },
  'railway-network': {
    id: 'railway-network',
    name: '🗺️ Railway Network',
    baseCost: 83000000000,
    description: 'Hijacks railway networks',
    growthPerTick: 8300000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'continent'
  },

  // Earth Level
  'cargo-ship-infestors': {
    id: 'cargo-ship-infestors',
    name: '🌍 Cargo Ship Infestors',
    baseCost: 1000000000000,
    description: 'Infest cargo ships for global spread',
    growthPerTick: 47000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'earth'
  },
  'airplane-spore-units': {
    id: 'airplane-spore-units',
    name: '🌍 Airplane Spore Units',
    baseCost: 6500000000000,
    description: 'Spread spores via airplanes',
    growthPerTick: 260000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'earth'
  },

  // Solar System Level
  'terraforming-ooze': {
    id: 'terraforming-ooze',
    name: '🚀 Terraforming Ooze',
    baseCost: 71000000000000,
    description: 'Ooze that terraforms planets',
    growthPerTick: 1500000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'solar-system'
  },
  'asteroid-seeder': {
    id: 'asteroid-seeder',
    name: '🚀 Asteroid Seeder', 
    baseCost: 550000000000000,
    description: 'Seeds asteroids with life',
    growthPerTick: 7800000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'solar-system'
  },
  'starship-incubator': {
    id: 'starship-incubator',
    name: '🚀 Starship Incubator',
    baseCost: 4800000000000000,
    description: 'Incubates life on starships',
    growthPerTick: 39000000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'solar-system'
  }
}; 