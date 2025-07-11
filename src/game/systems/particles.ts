import type { GameState } from '../types';
import { getNextLevel } from '../content/levels';
import { getCurrentLevel } from './actions';

export interface ParticleSystemConfig {
    spawnRate: number; // particles per second
    speed: number; // pixels per second  
    size: number; // base size in pixels
    sizeVariation: number; // size multiplier based on progress (2.5 at start -> 0.3 at end)
    color: string;
}

// Base configurations for each level
const BASE_PARTICLE_CONFIGS = {
    intro: {
        spawnRate: 3,
        speed: 80,
        size: 14,
        color: '#4ade80',
    },
    microscopic: {
        spawnRate: 1,
        speed: 100,
        size: 60,
        color: '#22c55e',
    },
    'petri-dish': {
        spawnRate: 1,
        speed: 120,
        size: 10,
        color: '#eab308',
    },
    lab: {
        spawnRate: .5,
        speed: 80,
        size: 100,
        color: '#3b82f6',
    },
    neighborhood: {
        spawnRate: .25,
        speed: 60,
        size: 100,
        color: '#06b6d4',
    },
    city: {
        spawnRate: .25,
        speed: 50,
        size: 80,
        color: '#8b5cf6',
    },
    continent: {
        spawnRate: .5,
        speed: 90,
        size: 64,
        color: '#a855f7',
    },
    earth: {
        spawnRate: .1,
        speed: 90,
        size: 20,
        color: '#ec4899',
    },
    'solar-system': {
        spawnRate: .1,
        speed: 100,
        size: 24,
        color: '#f59e0b',
    },
};

export function calculateParticleConfig(gameState: GameState): ParticleSystemConfig {
    const currentLevel = getCurrentLevel(gameState);
    const nextLevel = getNextLevel(currentLevel);

    // Get base config for current level
    const baseConfig = BASE_PARTICLE_CONFIGS[currentLevel.name as keyof typeof BASE_PARTICLE_CONFIGS]
        || BASE_PARTICLE_CONFIGS.intro;

    // Calculate progress within current level (0.0 to 1.0)
    let progressRatio = 0;
    if (nextLevel) {
        const progressInLevel = Math.max(0, gameState.biomass - currentLevel.biomassThreshold);
        const levelRange = nextLevel.biomassThreshold - currentLevel.biomassThreshold;
        progressRatio = Math.min(1, progressInLevel / levelRange);
    }

    // Calculate spawn rate progression (starts low, ramps up)
    const spawnMultiplier = 0.3 + progressRatio * 1.7; // 0.3x at start -> 2.0x at end
    const finalSpawnRate = baseConfig.spawnRate * spawnMultiplier;

    // Calculate size variation (starts big, gets smaller)
    const sizeVariation = Math.max(0.4, 2.0 - progressRatio * 1.6); // 2.0x at start -> 0.4x at end

    return {
        spawnRate: finalSpawnRate,
        speed: baseConfig.speed,
        size: baseConfig.size,
        sizeVariation,
        color: baseConfig.color,
    };
}

// Check if particle collides with blob
export function checkParticleCollision(
    particlePosition: { x: number; y: number },
    particleSize: number,
    blobPosition: { x: number; y: number },
    blobSize: number
): boolean {
    const dx = particlePosition.x - blobPosition.x;
    const dy = particlePosition.y - blobPosition.y;
    const distanceSquared = dx * dx + dy * dy;
    const collisionDistanceSquared = Math.pow(blobSize / 2 + particleSize / 2, 2);

    return distanceSquared <= collisionDistanceSquared;
} 