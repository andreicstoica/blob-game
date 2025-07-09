export interface Level {
  id: number;
  name: string;
  displayName: string;
  biomassThreshold: number;
  biomassDisplayFormat: 'standard' | 'scientific' | 'decimal' | 'whole';
  background: string;
  foodTypes: string[];
  description: string;
}

export const LEVELS: Level[] = [
  {
    id: 0,
    name: 'intro',
    displayName: '⚪ Intro',
    biomassThreshold: 0,
    biomassDisplayFormat: 'decimal',
    background: 'intro-bg',
    foodTypes: [],
    description: 'Welcome to the beginning of your journey'
  },
  {
    id: 1,
    name: 'microscopic',
    displayName: '🦠 Microscopic',
    biomassThreshold: 1,
    biomassDisplayFormat: 'decimal',
    background: 'microscopic-bg',
    foodTypes: [],
    description: 'Begin as a single cell in a drop of water.'
  },
  {
    id: 2,
    name: 'petri-dish',
    displayName: '🔍 Petri Dish',
    biomassThreshold: 2500,
    biomassDisplayFormat: 'decimal',
    background: 'petri-bg',
    foodTypes: [],
    description: 'Grow into visible colonies in a petri dish.'
  },
  {
    id: 3,
    name: 'lab',
    displayName: '🧪 Lab',
    biomassThreshold: 2250000,
    biomassDisplayFormat: 'whole',
    background: 'lab-bg',
    foodTypes: [],
    description: 'Expand your experiments in a high-tech lab.'
  },
  {
    id: 4,
    name: 'city',
    displayName: '🏙️ City',
    biomassThreshold: 800000000,
    biomassDisplayFormat: 'whole',
    background: 'city-bg',
    foodTypes: [],
    description: 'Infiltrate and spread through a bustling city.'
  },
  {
    id: 5,
    name: 'earth',
    displayName: '🌍 Earth',
    biomassThreshold: 300000000000,
    biomassDisplayFormat: 'whole',
    background: 'earth-bg',
    foodTypes: [],
    description: 'Spread your biomass across the planet.'
  },
  {
    id: 6,
    name: 'solar-system',
    displayName: '🚀 Solar System',
    biomassThreshold: 100000000000000,
    biomassDisplayFormat: 'scientific',
    background: 'solar-system-bg',
    foodTypes: [],
    description: 'Expand your reach to the entire solar system.'
  }
];

export function getCurrentLevel(biomass: number): Level {
  // Find the highest level where biomass >= threshold
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (biomass >= LEVELS[i].biomassThreshold) {
      return LEVELS[i];
    }
  }
  return LEVELS[0]; // Default to intro level
}

export function getNextLevel(currentLevel: Level): Level | null {
  const currentIndex = LEVELS.findIndex(level => level.id === currentLevel.id);
  if (currentIndex >= LEVELS.length - 1) {
    return null; // Already at max level
  }
  return LEVELS[currentIndex + 1];
}

export function canEvolve(biomass: number): boolean {
  const currentLevel = getCurrentLevel(biomass);
  const nextLevel = getNextLevel(currentLevel);
  return nextLevel !== null && biomass >= nextLevel.biomassThreshold;
}

export function formatBiomass(biomass: number, format: 'standard' | 'scientific' | 'decimal' | 'whole'): string {
  switch (format) {
    case 'scientific':
      return biomass.toExponential(3);
    case 'decimal':
    case 'whole':
    case 'standard':
    default:
      return Math.floor(biomass).toLocaleString();
  }
}

export function getDecimalPrecisionForLevel(level: Level): number {
  switch (level.id) {
    case 0: // intro
      return 3;
    case 1: // microscopic
      return 2;
    case 2: // petri-dish
      return 1;
    case 3: // lab
    case 4: // city
    case 5: // earth
      return 0;
    case 6: // solar-system
      return 3; // scientific notation
    default:
      return 1;
  }
} 