import type { GeneratorState, UpgradeState } from './game';

export const GENERATORS: Record<string, Omit<GeneratorState, 'level'>> = {
  // Intro Level
  'basic-generator': {
    id: 'basic-generator',
    name: '⚪ Basic Generator',
    baseCost: 1,
    description: 'Generates 0 biomass per second',
    baseEffect: 0,
    costMultiplier: 1.15,
    unlockedAtLevel: 'intro'
  },
  // Microscopic Level
  'microscope-cloner': {
    id: 'microscope-cloner',
    name: '🦠 Microscope Cloner',
    baseCost: 15,
    description: 'Clones basic cells for exponential growth',
    baseEffect: 0.1,
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
    description: 'Replicates nuclei for advanced growth',
    baseEffect: 10,
    costMultiplier: 1.15,
    unlockedAtLevel: 'microscopic'
  },
  // Petri Dish Level
  'colony-expander': {
    id: 'colony-expander',
    name: '🔍 Colony Expansion',
    baseCost: 15000,
    description: 'Expands colonies for more biomass',
    baseEffect: 50,
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

export const UPGRADES: Record<string, Omit<UpgradeState, 'purchased'>> = {
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
    description: '1.5x Microscope Cloner',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'microscopic'
  },
  'sterile-technique-mastery': {
    id: 'sterile-technique-mastery',
    name: '🦠 Sterile Technique Mastery',
    cost: 1500,
    description: '2x Cell Divider',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'microscopic'
  },
  'rapid-binary-fission': {
    id: 'rapid-binary-fission',
    name: '🦠 Rapid Binary Fission',
    cost: 5000,
    description: '3x Nucleus Replicator',
    effect: 3,
    type: 'growth',
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
    unlockedAtLevel: 'petri-dish'
  },
  'nutrient-enriched-agar': {
    id: 'nutrient-enriched-agar',
    name: '🔍 Nutrient-Enriched Agar',
    cost: 250000,
    description: '3x All Petri Gens',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'petri-dish'
  },
  'antibiotic-resistance': {
    id: 'antibiotic-resistance',
    name: '🔍 Antibiotic Resistance',
    cost: 1800000,
    description: '2x All Petri Gens',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'petri-dish'
  },
  // Lab Level
  'lab-assistant-automation': {
    id: 'lab-assistant-automation',
    name: '🧪 Lab Assistant Automation',
    cost: 13000000,
    description: '5x All Petri Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'lab'
  },
  'sterile-workflow': {
    id: 'sterile-workflow',
    name: '🧪 Sterile Workflow',
    cost: 90000000,
    description: '5x All Lab Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'lab'
  },
  'precision-pipetting': {
    id: 'precision-pipetting',
    name: '🧪 Precision Pipetting',
    cost: 650000000,
    description: '3x All Lab Gens',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'lab'
  },
  // City Level
  'mimicry-training': {
    id: 'mimicry-training',
    name: '🏙️ Mimicry Training',
    cost: 4500000000,
    description: '5x All Lab Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'city'
  },
  'urban-camouflage': {
    id: 'urban-camouflage',
    name: '🏙️ Urban Camouflage',
    cost: 32000000000,
    description: '5x All City Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'city'
  },
  'subway-expansion-plan': {
    id: 'subway-expansion-plan',
    name: '🏙️ Subway Expansion Plan',
    cost: 230000000000,
    description: '3x All City Gens',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'city'
  },
  // Earth Level
  'intercontinental-mutation': {
    id: 'intercontinental-mutation',
    name: '🌍 Intercontinental Mutation',
    cost: 1600000000000,
    description: '10x All City Gens',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'earth'
  },
  'planetary-stealth-mode': {
    id: 'planetary-stealth-mode',
    name: '🌍 Planetary Stealth Mode',
    cost: 11000000000000,
    description: '10x All Earth Gens',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'earth'
  },
  'accelerated-core-evolution': {
    id: 'accelerated-core-evolution',
    name: '🌍 Accelerated Core Evolution',
    cost: 80000000000000,
    description: '5x All Earth Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'earth'
  },
  // Solar System Level
  'cosmic-radiation-tolerance': {
    id: 'cosmic-radiation-tolerance',
    name: '🚀 Cosmic Radiation Tolerance',
    cost: 600000000000000,
    description: '10x All Earth Gens',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'solar-system'
  },
  'faster-than-light-spread': {
    id: 'faster-than-light-spread',
    name: '🚀 Faster-Than-Light Spread',
    cost: 4000000000000000,
    description: '10x All Solar Gens',
    effect: 10,
    type: 'growth',
    unlockedAtLevel: 'solar-system'
  },
  'self-replicating-probes': {
    id: 'self-replicating-probes',
    name: '🚀 Self-Replicating Probes',
    cost: 28000000000000000,
    description: '5x All Solar Gens',
    effect: 5,
    type: 'growth',
    unlockedAtLevel: 'solar-system'
  }
};

export const GAME_CONFIG = {
  startingBiomass: 1,
  startingClickPower: 1,
  tickRate: 100, // milliseconds
  maxBlobSize: 400,
  minBlobSize: 50,
  blobSizeMultiplier: 10
}; 