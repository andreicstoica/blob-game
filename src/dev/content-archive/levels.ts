import type { Level } from '../../game/types';

export type { Level };

export const LEVELS: Level[] = [
  {
    id: 0,
    name: 'intro',
    displayName: '⚪ Intro',
    biomassThreshold: 0,
    biomassDisplayFormat: 'decimal',
    background: 'intro-bg',
    foodTypes: [],
    description: 'Welcome to the beginning of your journey',
    blobSizeStart: 50,
    blobSizeEnd: 120
  },
  {
    id: 1,
    name: 'microscopic',
    displayName: '🦠 Microscopic',
    biomassThreshold: 1,
    biomassDisplayFormat: 'decimal',
    background: 'microscopic-bg',
    foodTypes: [],
    description: 'Begin as a single cell in a drop of water.',
    blobSizeStart: 80,
    blobSizeEnd: 1200
  },
  {
    id: 2,
    name: 'petri-dish',
    displayName: '🔍 Petri Dish',
    biomassThreshold: 2500,
    biomassDisplayFormat: 'whole',
    background: 'petri-bg',
    foodTypes: [],
    description: 'Grow into visible colonies in a petri dish.',
    blobSizeStart: 120,
    blobSizeEnd: 1200
  },
  {
    id: 3,
    name: 'lab',
    displayName: '🧪 Lab',
    biomassThreshold: 2250000,
    biomassDisplayFormat: 'whole',
    background: 'lab-bg',
    foodTypes: [],
    description: 'Expand your experiments in a high-tech lab.',
    blobSizeStart: 120,
    blobSizeEnd: 1200
  },
  {
    id: 4,
    name: 'neighborhood',
    displayName: '🏘️ Neighborhood',
    biomassThreshold: 50000000,
    biomassDisplayFormat: 'whole',
    background: 'neighborhood-bg',
    foodTypes: [],
    description: 'Spread through suburban neighborhoods.',
    blobSizeStart: 180,
    blobSizeEnd: 1200
  },
  {
    id: 5,
    name: 'city',
    displayName: '🏙️ City',
    biomassThreshold: 800000000,
    biomassDisplayFormat: 'whole',
    background: 'city-bg',
    foodTypes: [],
    description: 'Infiltrate and spread through a bustling city.',
    blobSizeStart: 240,
    blobSizeEnd: 1200
  },
  {
    id: 6,
    name: 'continent',
    displayName: '🗺️ Continent',
    biomassThreshold: 15000000000,
    biomassDisplayFormat: 'whole',
    background: 'continent-bg',
    foodTypes: [],
    description: 'Expand across entire continents.',
    blobSizeStart: 260,
    blobSizeEnd: 1200
  },
  {
    id: 7,
    name: 'earth',
    displayName: '🌍 Earth',
    biomassThreshold: 300000000000,
    biomassDisplayFormat: 'whole',
    background: 'earth-bg',
    foodTypes: [],
    description: 'Spread your biomass across the planet.',
    blobSizeStart: 260,
    blobSizeEnd: 1200
  },
  {
    id: 8,
    name: 'solar-system',
    displayName: '🚀 Solar System',
    biomassThreshold: 100000000000000,
    biomassDisplayFormat: 'scientific',
    background: 'solar-system-bg',
    foodTypes: [],
    description: 'Expand your reach to the entire solar system.',
    blobSizeStart: 260,
    blobSizeEnd: 1200
  }
];

export function getNextLevel(currentLevel: Level): Level | null {
  const currentIndex = LEVELS.findIndex(level => level.id === currentLevel.id);
  if (currentIndex >= LEVELS.length - 1) {
    return null; // Already at max level
  }
  return LEVELS[currentIndex + 1];
}

export function canEvolve(): boolean {
  // This function should be removed or updated to take gameState instead
  // For now, we'll keep it but it should use evolution-based logic
  // The UI should use canEvolveToNextLevel(gameState) instead
  return false; // Disable biomass-based evolution
}


