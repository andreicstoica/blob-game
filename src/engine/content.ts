import type { GeneratorState, UpgradeState } from './game';

export const GENERATORS: Record<string, Omit<GeneratorState, 'level'>> = {
  // Intro Level (1 generator)
  'basic-generator': {
    id: 'basic-generator',
    name: '⚪ Basic Generator',
    baseCost: 15,
    description: 'Generates 0.1 biomass per second',
    baseEffect: 0.1,
    costMultiplier: 1.15,
    unlockedAtLevel: 'intro'
  },

  // Microscopic Level (3 generators)
  'microscope-cloner': {
    id: 'microscopic-cloner',
    name: '🦠 Microscopic Cloner',
    baseCost: 12000,
    description: 'Uses lab-grade optics to split slime particles',
    baseEffect: 47,
    costMultiplier: 1.15,
    unlockedAtLevel: 'microscopic'
  },
  'cell-divider': {
    id: 'cell-divider',
    name: '🦠 Cell Divider',
    baseCost: 130000,
    description: 'Forces rapid cellular division through chemical stimulation',
    baseEffect: 260,
    costMultiplier: 1.15,
    unlockedAtLevel: 'microscopic'
  },
  'nucleus-replicator': {
    id: 'nucleus-replicator',
    name: '🦠 Nucleus Replicator',
    baseCost: 1400000,
    description: 'Duplicates genetic material for exponential growth',
    baseEffect: 1400,
    costMultiplier: 1.15,
    unlockedAtLevel: 'microscopic'
  },

  // Petri Dish Level (3 generators)
  'colony-expander': {
    id: 'colony-expander',
    name: '🔍 Colony Expansion',
    baseCost: 20000000,
    description: 'Increases surface area for growth',
    baseEffect: 7800,
    costMultiplier: 1.15,
    unlockedAtLevel: 'petri-dish'
  },
  'spore-launcher': {
    id: 'spore-launcher',
    name: '🔍 Spore Launcher',
    baseCost: 330000000,
    description: 'Shoots spores to seed new growth areas',
    baseEffect: 44000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'petri-dish'
  },
  'contaminant-converter': {
    id: 'contaminant-converter',
    name: '🔍 Contaminant Converter',
    baseCost: 5100000000,
    description: 'Converts waste into growth fuel',
    baseEffect: 260000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'petri-dish'
  },

  // Lab Level (3 generators)
  'centrifuge-sorter': {
    id: 'centrifuge-sorter',
    name: '🧪 Centrifuge Sorter',
    baseCost: 75000000000,
    description: 'Isolates the most efficient growth cells',
    baseEffect: 1600000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'lab'
  },
  'bioreactor-tank': {
    id: 'bioreactor-tank',
    name: '🧪 Bioreactor Tank',
    baseCost: 1000000000000,
    description: 'Massive controlled growth environment',
    baseEffect: 10000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'lab'
  },
  'autoclave-recycler': {
    id: 'autoclave-recycler',
    name: '🧪 Autoclave Recycler',
    baseCost: 14000000000000,
    description: 'Recycles lab waste into growth fuel',
    baseEffect: 65000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'lab'
  },

  // City Level (3 generators)
  'humanoid-slimes': {
    id: 'humanoid-slimes',
    name: '🏙️ Humanoid Slimes',
    baseCost: 170000000000000,
    description: 'Shape-shifting growth infiltrators',
    baseEffect: 430000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'city'
  },
  'sewer-colonies': {
    id: 'sewer-colonies',
    name: '🏙️ Sewer Colonies',
    baseCost: 2100000000000000,
    description: 'Hidden mass production underground',
    baseEffect: 2900000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'city'
  },
  'subway-spreaders': {
    id: 'subway-spreaders',
    name: '🏙️ Subway Spreaders',
    baseCost: 26000000000000000,
    description: 'Rapid underground transportation for city-wide growth',
    baseEffect: 21000000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'city'
  },

  // Earth Level (3 generators)
  'cargo-ship-infestors': {
    id: 'cargo-ship-infestors',
    name: '🌍 Cargo Ship Infestors',
    baseCost: 710000000000000000,
    description: 'Global shipping routes expand potential for growth',
    baseEffect: 150000000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'earth'
  },
  'airplane-spore-units': {
    id: 'airplane-spore-units',
    name: '🌍 Airplane Spore Units',
    baseCost: 11000000000000000000,
    description: 'Airborne routes expand potential for growth',
    baseEffect: 1100000000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'earth'
  },
  'forest-hive-colonies': {
    id: 'forest-hive-colonies',
    name: '🌍 Forest Hive Colonies',
    baseCost: 83000000000000000000,
    description: 'Rural mass production',
    baseEffect: 8300000000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'earth'
  },

  // Solar System Level (3 generators)
  'terraforming-ooze': {
    id: 'terraforming-ooze',
    name: '🌌 Terraforming Ooze',
    baseCost: 640000000000000000000,
    description: 'Manufactures new planets for growth colonization',
    baseEffect: 51000000000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'solar-system'
  },
  'asteroid-seeder': {
    id: 'asteroid-seeder',
    name: '🌌 Asteroid Seeder',
    baseCost: 5100000000000000000000,
    description: 'Fires growth pods across space',
    baseEffect: 410000000000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'solar-system'
  },
  'starship-incubator': {
    id: 'starship-incubator',
    name: '🌌 Starship Incubator',
    baseCost: 71000000000000000000000,
    description: 'Grows biomass on interstellar ships',
    baseEffect: 2900000000000000,
    costMultiplier: 1.15,
    unlockedAtLevel: 'solar-system'
  }
};

export const UPGRADES: Record<string, Omit<UpgradeState, 'purchased'>> = {
  // Intro Level (1 upgrade)
  'click-power': {
    id: 'click-power',
    name: '⚪ Click Power',
    cost: 50,
    description: 'Doubles your click power',
    effect: 1,
    type: 'click',
    unlockedAtLevel: 'intro'
  },

  // Microscopic Level (3 upgrades)
  'enhanced-microscope-optics': {
    id: 'enhanced-microscope-optics',
    name: '🦠 Enhanced Microscope Optics',
    cost: 50000,
    description: 'Boost generator yield',
    effect: 0.5,
    type: 'growth',
    unlockedAtLevel: 'microscopic'
  },
  'sterile-technique-mastery': {
    id: 'sterile-technique-mastery',
    name: '🦠 Sterile Technique Mastery',
    cost: 500000,
    description: 'Improves all growth rates',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'microscopic'
  },
  'rapid-binary-fission': {
    id: 'rapid-binary-fission',
    name: '🦠 Rapid Binary Fission',
    cost: 5000000,
    description: 'Doubles overall growth rate',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'microscopic'
  },

  // Petri Dish Level (3 upgrades)
  'temperature-control-module': {
    id: 'temperature-control-module',
    name: '🔍 Temperature Control Module',
    cost: 50000000,
    description: 'Optimal growth rates',
    effect: 1.5,
    type: 'growth',
    unlockedAtLevel: 'petri-dish'
  },
  'nutrient-enriched-agar': {
    id: 'nutrient-enriched-agar',
    name: '🔍 Nutrient-Enriched Agar',
    cost: 500000000,
    description: 'Doubles growth output',
    effect: 2,
    type: 'growth',
    unlockedAtLevel: 'petri-dish'
  },
  'antibiotic-resistance': {
    id: 'antibiotic-resistance',
    name: '🔍 Antibiotic Resistance',
    cost: 5000000000,
    description: 'Improves resistance to parasitic microbes, increasing growth',
    effect: 1.3,
    type: 'growth',
    unlockedAtLevel: 'petri-dish'
  },

  // Lab Level (3 upgrades)
  'lab-assistant-automation': {
    id: 'lab-assistant-automation',
    name: '🧪 Lab Assistant Automation',
    cost: 50000000000,
    description: 'Brainwash lab workers to improve generator efficiency',
    effect: 1.4,
    type: 'growth',
    unlockedAtLevel: 'lab'
  },
  'sterile-workflow': {
    id: 'sterile-workflow',
    name: '🧪 Sterile Workflow',
    cost: 500000000000,
    description: 'Improves all production by 25%',
    effect: 1.25,
    type: 'growth',
    unlockedAtLevel: 'lab'
  },
  'precision-pipetting': {
    id: 'precision-pipetting',
    name: '🧪 Precision Pipetting',
    cost: 5000000000000,
    description: 'Higher yield per batch',
    effect: 1.6,
    type: 'growth',
    unlockedAtLevel: 'lab'
  },

  // City Level (3 upgrades)
  'mimicry-training': {
    id: 'mimicry-training',
    name: '🏙️ Mimicry Training',
    cost: 50000000000000,
    description: 'Humanoid slimes blend in better, becoming more powerful',
    effect: 1.7,
    type: 'growth',
    unlockedAtLevel: 'city'
  },
  'urban-camouflage': {
    id: 'urban-camouflage',
    name: '🏙️ Urban Camouflage',
    cost: 500000000000000,
    description: 'Improves growth efficiency',
    effect: 1.35,
    type: 'growth',
    unlockedAtLevel: 'city'
  },
  'subway-expansion-plan': {
    id: 'subway-expansion-plan',
    name: '🏙️ Subway Expansion Plan',
    cost: 5000000000000000,
    description: 'Even faster city-wide growth',
    effect: 1.8,
    type: 'growth',
    unlockedAtLevel: 'city'
  },

  // Earth Level (3 upgrades)
  'intercontinental-mutation': {
    id: 'intercontinental-mutation',
    name: '🌍 Intercontinental Mutation',
    cost: 50000000000000000,
    description: 'Adapts to all climates for better growth',
    effect: 1.9,
    type: 'growth',
    unlockedAtLevel: 'earth'
  },
  'planetary-stealth-mode': {
    id: 'planetary-stealth-mode',
    name: '🌍 Planetary Stealth Mode',
    cost: 500000000000000000,
    description: 'Slip behind Mother Nature\'s back to improve growth',
    effect: 1.45,
    type: 'growth',
    unlockedAtLevel: 'earth'
  },
  'accelerated-core-evolution': {
    id: 'accelerated-core-evolution',
    name: '🌍 Accelerated Core Evolution',
    cost: 5000000000000000000,
    description: 'Planetary-level output boost',
    effect: 2.5,
    type: 'growth',
    unlockedAtLevel: 'earth'
  },

  // Solar System Level (3 upgrades)
  'cosmic-radiation-tolerance': {
    id: 'cosmic-radiation-tolerance',
    name: '🌌 Cosmic Radiation Tolerance',
    cost: 50000000000000000000,
    description: 'Survive and multiplies anywhere in the galaxy',
    effect: 2.1,
    type: 'growth',
    unlockedAtLevel: 'solar-system'
  },
  'faster-than-light-spread': {
    id: 'faster-than-light-spread',
    name: '🌌 Faster-Than-Light Spread',
    cost: 500000000000000000000,
    description: 'Instant intergalaxial slime spread',
    effect: 3,
    type: 'growth',
    unlockedAtLevel: 'solar-system'
  },
  'self-replicating-probes': {
    id: 'self-replicating-probes',
    name: '🌌 Self-Replicating Probes',
    cost: 5000000000000000000000,
    description: 'Automated seeding of new established worlds',
    effect: 2.8,
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