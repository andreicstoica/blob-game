import type { GameState } from '../types';
import { getNextLevel, getCurrentLevel } from '../content/levels';

export interface ParticleSystemConfig {
    spawnRate: number; // particles per second
    speed: number; // pixels per second  
    size: number; // base size in pixels
    sizeVariation: number; // size multiplier based on progress (2.5 at start -> 0.3 at end)
    visualType: 'bacteria' | 'energy' | 'matter' | 'cosmic';
    color: string;
}

// Base configurations for each level
const BASE_PARTICLE_CONFIGS = {
    intro: {
        spawnRate: 2,
        speed: 100,
        size: 8,
        visualType: 'energy' as const,
        color: '#4ade80',
    },
    microscopic: {
        spawnRate: 3,
        speed: 80,
        size: 60,
        visualType: 'bacteria' as const,
        color: '#22c55e',
    },
    'petri-dish': {
        spawnRate: 6,
        speed: 120,
        size: 10,
        visualType: 'energy' as const,
        color: '#eab308',
    },
    lab: {
        spawnRate: 8,
        speed: 140,
        size: 12,
        visualType: 'matter' as const,
        color: '#3b82f6',
    },
    neighborhood: {
        spawnRate: 10,
        speed: 160,
        size: 14,
        visualType: 'matter' as const,
        color: '#06b6d4',
    },
    city: {
        spawnRate: 12,
        speed: 180,
        size: 16,
        visualType: 'matter' as const,
        color: '#8b5cf6',
    },
    continent: {
        spawnRate: 15,
        speed: 200,
        size: 18,
        visualType: 'cosmic' as const,
        color: '#a855f7',
    },
    earth: {
        spawnRate: 18,
        speed: 220,
        size: 20,
        visualType: 'cosmic' as const,
        color: '#ec4899',
    },
    'solar-system': {
        spawnRate: 25,
        speed: 250,
        size: 24,
        visualType: 'cosmic' as const,
        color: '#f59e0b',
    },
};

export function calculateParticleConfig(gameState: GameState): ParticleSystemConfig {
    const currentLevel = getCurrentLevel(gameState.biomass);
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
        visualType: baseConfig.visualType,
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