import type { ParticleConfig } from '../../types';
import brownBacteria from "/assets/images/bacteria/brown-bacteria.png";
import greenBacteria from "/assets/images/bacteria/green-bacteria.png";
import purpleBacteria from "/assets/images/bacteria/purple-bacteria.png";

// Particle configuration for each level
export const PARTICLE_CONFIGS: Record<string, ParticleConfig> = {
  intro: {
    type: "nutrient",
    spawnRate: 2,
    speed: 100,
    size: 4,
    color: "#4ade80",
    level: 1,
    useImage: false,
  },
  microscopic: {
    type: "nutrient",
    spawnRate: 5,
    speed: 120,
    size: 40,
    color: "#22c55e",
    level: 2,
    useImage: true,
    images: [brownBacteria, greenBacteria, purpleBacteria],
  },
  "petri-dish": {
    type: "energy",
    spawnRate: 8,
    speed: 150,
    size: 6,
    color: "#eab308",
    level: 3,
    useImage: false,
  },
  lab: {
    type: "matter",
    spawnRate: 12,
    speed: 180,
    size: 7,
    color: "#3b82f6",
    level: 4,
    useImage: false,
  },
  city: {
    type: "matter",
    spawnRate: 18,
    speed: 200,
    size: 8,
    color: "#8b5cf6",
    level: 5,
    useImage: false,
  },
  earth: {
    type: "cosmic",
    spawnRate: 25,
    speed: 250,
    size: 10,
    color: "#ec4899",
    level: 6,
    useImage: false,
  },
  "solar-system": {
    type: "cosmic",
    spawnRate: 35,
    speed: 300,
    size: 12,
    color: "#f59e0b",
    level: 7,
    useImage: false,
  },
};

// Helper function to get particle config for a level
export const getParticleConfig = (levelName: string): ParticleConfig => {
  return PARTICLE_CONFIGS[levelName] || PARTICLE_CONFIGS.intro;
}; 