export interface Level {
  id: number;
  name: string;
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
    biomassThreshold: 0,
    biomassDisplayFormat: 'standard',
    background: 'intro-bg',
    foodTypes: ['nutrients'],
    description: 'Welcome to the beginning of your journey'
  },
  {
    id: 1,
    name: 'microscopic',
    biomassThreshold: 1e-6, // 0.000001
    biomassDisplayFormat: 'scientific',
    background: 'microscopic-bg',
    foodTypes: ['amoeba', 'bacteria'],
    description: 'You are being observed under a microscope'
  },
  {
    id: 2,
    name: 'petri-dish',
    biomassThreshold: 10,
    biomassDisplayFormat: 'decimal',
    background: 'petri-bg',
    foodTypes: ['nutrients', 'organic-matter'],
    description: 'Growing in a petri dish environment'
  },
  {
    id: 3,
    name: 'lab',
    biomassThreshold: 10000000, // 10 million
    biomassDisplayFormat: 'whole',
    background: 'lab-bg',
    foodTypes: ['chemicals', 'compounds'],
    description: 'The laboratory where experiments are conducted'
  },
  {
    id: 4,
    name: 'city',
    biomassThreshold: 500000000000, // 500 billion
    biomassDisplayFormat: 'whole',
    background: 'city-bg',
    foodTypes: ['people', 'vehicles'],
    description: 'A bustling cityscape'
  },
  {
    id: 5,
    name: 'earth',
    biomassThreshold: 1.758e15, // 1.758 quadrillion
    biomassDisplayFormat: 'scientific',
    background: 'earth-bg',
    foodTypes: ['buildings', 'landmarks'],
    description: 'The entire planet Earth'
  },
  {
    id: 6,
    name: 'solar-system',
    biomassThreshold: 1e18, // 1 quintillion
    biomassDisplayFormat: 'scientific',
    background: 'solar-system-bg',
    foodTypes: ['planets', 'asteroids'],
    description: 'The vast solar system'
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
      return biomass.toFixed(3);
    case 'whole':
      return biomass.toLocaleString();
    case 'standard':
    default:
      return biomass.toString();
  }
} 