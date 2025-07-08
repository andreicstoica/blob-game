export interface Level {
  id: string;
  name: string;
  biomassThreshold: number;
  biomassDisplayFormat: 'standard' | 'scientific' | 'decimal' | 'whole';
  background: string;
  availableGenerators: string[];
  availableUpgrades: string[];
  foodTypes: string[];
  description: string;
}

export const LEVELS: Level[] = [
  {
    id: 'intro',
    name: 'Intro',
    biomassThreshold: 1,
    biomassDisplayFormat: 'standard',
    background: 'intro-bg',
    availableGenerators: ['basic-generator'],
    availableUpgrades: ['click-power'],
    foodTypes: ['nutrients'],
    description: 'Welcome to the beginning of your journey'
  },
  {
    id: 'microscopic',
    name: 'Microscopic',
    biomassThreshold: 1e-6, // 0.000001
    biomassDisplayFormat: 'scientific',
    background: 'microscopic-bg',
    availableGenerators: ['basic-generator', 'farm'],
    availableUpgrades: ['click-power', 'efficient-generators'],
    foodTypes: ['amoeba', 'bacteria'],
    description: 'You are being observed under a microscope'
  },
  {
    id: 'petri-dish',
    name: 'Petri Dish',
    biomassThreshold: 10,
    biomassDisplayFormat: 'decimal',
    background: 'petri-bg',
    availableGenerators: ['basic-generator', 'farm', 'factory'],
    availableUpgrades: ['click-power', 'efficient-generators'],
    foodTypes: ['nutrients', 'organic-matter'],
    description: 'Growing in a petri dish environment'
  },
  {
    id: 'lab',
    name: 'Laboratory',
    biomassThreshold: 10000000, // 10 million
    biomassDisplayFormat: 'whole',
    background: 'lab-bg',
    availableGenerators: ['basic-generator', 'farm', 'factory', 'mine'],
    availableUpgrades: ['click-power', 'efficient-generators'],
    foodTypes: ['chemicals', 'compounds'],
    description: 'The laboratory where experiments are conducted'
  },
  {
    id: 'city',
    name: 'City',
    biomassThreshold: 500000000000, // 500 billion
    biomassDisplayFormat: 'whole',
    background: 'city-bg',
    availableGenerators: ['basic-generator', 'farm', 'factory', 'mine', 'shipment'],
    availableUpgrades: ['click-power', 'efficient-generators'],
    foodTypes: ['people', 'vehicles'],
    description: 'A bustling cityscape'
  },
  {
    id: 'earth',
    name: 'Earth',
    biomassThreshold: 1.758e15, // 1.758 quadrillion
    biomassDisplayFormat: 'scientific',
    background: 'earth-bg',
    availableGenerators: ['basic-generator', 'farm', 'factory', 'mine', 'shipment'],
    availableUpgrades: ['click-power', 'efficient-generators'],
    foodTypes: ['buildings', 'landmarks'],
    description: 'The entire planet Earth'
  },
  {
    id: 'solar-system',
    name: 'Solar System',
    biomassThreshold: 1e18, // 1 quintillion
    biomassDisplayFormat: 'scientific',
    background: 'solar-system-bg',
    availableGenerators: ['basic-generator', 'farm', 'factory', 'mine', 'shipment'],
    availableUpgrades: ['click-power', 'efficient-generators'],
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