import type { GeneratorState } from '../types';

export const GENERATORS: Record<string, Omit<GeneratorState, 'level'>> = {
  // Microscopic Level
  'microscopic-cloner': {
    id: 'microscopic-cloner',
    name: '🦠 Microscopic Cloner',
    baseCost: 15,
    description: 'Clones basic slime cells',
    baseEffect: 100, // 0.1
    costMultiplier: 1.15,
    unlockedAtLevel: 'microscopic'
  },
  'cell-divider': {
    id: 'cell-divider',
    name: '🦠 Cell Divider',
    baseCost: 100,
    description: 'Divides cells rapidly',
    baseEffect: 1,
    costMultiplier: 1.15,
    unlockedAtLevel: 'microscopic'
  },
  'nucleus-replicator': {
    id: 'nucleus-replicator',
    name: '🦠 Nucleus Replicator',
    baseCost: 1500,
    description: 'Splits nuclei for advanced growth',
    baseEffect: 10,
    costMultiplier: 1.15,
    unlockedAtLevel: 'microscopic'
  },
  // Petri Dish Level
  'colony-expander': {
    id: 'colony-expander',
    name: '🔍 Colony Expansion',
    baseCost: 15, // 15000
    description: 'Expands colonies for more biomass',
    baseEffect: 500000, // 50
    costMultiplier: 1.15,
    unlockedAtLevel: 'petri-dish'
  },
  'spore-launcher': {
    id: 'spore-launcher',
    name: '🔍 Spore Launcher',
    baseCost: 150000,
    description: 'Launches spores to new environments',
    baseEffect: 250,
    costMultiplier: 1.15,
    unlockedAtLevel: 'petri-dish'
  },
  'contaminant-converter': {
    id: 'contaminant-converter',
    name: '🔍 Contaminant Converter',
    baseCost: 1500000,
    description: 'Converts contaminants into biomass',
    baseEffect: 1500,
    costMultiplier: 1.15,
    unlockedAtLevel: 'petri-dish'
  },
  // Lab Level
  'centrifuge-sorter': {
    id: 'centrifuge-sorter',
    name: '🧪 Centrifuge Sorter',
    baseCost: 20000000,
    description: 'Sorts cells for maximum efficiency',
    baseEffect: 8000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'lab'
  },
  'bioreactor-tank': {
    id: 'bioreactor-tank',
    name: '🧪 Bioreactor Tank',
    baseCost: 150000000,
    description: 'Massive bioreactor for rapid growth',
    baseEffect: 40000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'lab'
  },
  'autoclave-recycler': {
    id: 'autoclave-recycler',
    name: '🧪 Autoclave Recycler',
    baseCost: 650000000,
    description: 'Recycles waste into biomass',
    baseEffect: 120000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'lab'
  },
  // Neighborhood Level
  'backyard-colonizer': {
    id: 'backyard-colonizer',
    name: '🏘️ Backyard Colonizer',
    baseCost: 1500000000,
    description: 'Colonizes suburban backyards',
    baseEffect: 800000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'neighborhood'
  },
  'garden-infester': {
    id: 'garden-infester',
    name: '🏘️ Garden Infester',
    baseCost: 10000000000,
    description: 'Infests neighborhood gardens',
    baseEffect: 4000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'neighborhood'
  },
  'street-spreader': {
    id: 'street-spreader',
    name: '🏘️ Street Spreader',
    baseCost: 65000000000,
    description: 'Spreads through neighborhood streets',
    baseEffect: 20000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'neighborhood'
  },
  // City Level
  'humanoid-slimes': {
    id: 'humanoid-slimes',
    name: '🏙️ Humanoid Slimes',
    baseCost: 4500000000,
    description: 'Slimes disguised as humans',
    baseEffect: 600000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'city'
  },
  'sewer-colonies': {
    id: 'sewer-colonies',
    name: '🏙️ Sewer Colonies',
    baseCost: 32000000000,
    description: 'Colonies thriving in the sewers',
    baseEffect: 1200000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'city'
  },
  'subway-spreaders': {
    id: 'subway-spreaders',
    name: '🏙️ Subway Spreaders',
    baseCost: 230000000000,
    description: 'Spread through the subway system',
    baseEffect: 2440000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'city'
  },
  // Earth Level
  'cargo-ship-infestors': {
    id: 'cargo-ship-infestors',
    name: '🌍 Cargo Ship Infestors',
    baseCost: 1600000000000,
    description: 'Infest cargo ships for global spread',
    baseEffect: 12200000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'earth'
  },
  'airplane-spore-units': {
    id: 'airplane-spore-units',
    name: '🌍 Airplane Spore Units',
    baseCost: 11000000000000,
    description: 'Spread spores via airplanes',
    baseEffect: 61000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'earth'
  },
  'forest-hive-colonies': {
    id: 'forest-hive-colonies',
    name: '🌍 Forest Hive Colonies',
    baseCost: 80000000000000,
    description: 'Massive hives in forests',
    baseEffect: 305000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'earth'
  },
  // Continent Level
  'national-highway-system': {
    id: 'national-highway-system',
    name: '🗺️ National Highway System',
    baseCost: 1200000000000,
    description: 'Uses highway systems for rapid spread',
    baseEffect: 100000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'continent'
  },
  'railway-network': {
    id: 'railway-network',
    name: '🗺️ Railway Network',
    baseCost: 8000000000000,
    description: 'Hijacks railway networks',
    baseEffect: 500000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'continent'
  },
  'airport-hub': {
    id: 'airport-hub',
    name: '🗺️ Airport Hub',
    baseCost: 52000000000000,
    description: 'Establishes airport hubs',
    baseEffect: 2500000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'continent'
  },
  // Solar System Level
  'terraforming-ooze': {
    id: 'terraforming-ooze',
    name: '🚀 Terraforming Ooze',
    baseCost: 600000000000000,
    description: 'Ooze that terraforms planets',
    baseEffect: 1530000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'solar-system'
  },
  'asteroid-seeder': {
    id: 'asteroid-seeder',
    name: '🚀 Asteroid Seeder', 
    baseCost: 4000000000000000,
    description: 'Seeds asteroids with life',
    baseEffect: 7630000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'solar-system'
  },
  'starship-incubator': {
    id: 'starship-incubator',
    name: '🚀 Starship Incubator',
    baseCost: 28000000000000000,
    description: 'Incubates life on starships',
    baseEffect: 38100000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'solar-system'
  }
}; 