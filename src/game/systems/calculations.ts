import type { GameState, GeneratorState } from '../types';
import { GAME_CONFIG } from '../content/config';

export function getGeneratorCost(generator: GeneratorState): number {
    return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, generator.level));
}

export function getTotalGrowth(state: GameState): number {
    // Group generators by level
    const generatorsByLevel: Record<string, GeneratorState[]> = {};
    Object.values(state.generators).forEach((gen) => {
        // Skip tutorial content
        if (gen.id === 'tutorial-generator') {
            return;
        }

        if (!generatorsByLevel[gen.unlockedAtLevel]) {
            generatorsByLevel[gen.unlockedAtLevel] = [];
        }
        generatorsByLevel[gen.unlockedAtLevel].push(gen);
    });

    // Calculate base growth for each level
    const baseGrowthByLevel: Record<string, number> = {};
    Object.entries(generatorsByLevel).forEach(([level, generators]) => {
        baseGrowthByLevel[level] = generators.reduce((sum, gen) => {
            return sum + gen.growthPerTick * gen.level;
        }, 0);
    });

    // Apply upgrades to specific levels
    let finalGrowth = 0;
    Object.entries(baseGrowthByLevel).forEach(([level, baseGrowth]) => {
        let levelGrowth = baseGrowth;

        // Apply upgrades that target this level
        Object.values(state.upgrades).forEach((upgrade) => {
            // Skip tutorial content
            if (upgrade.id === 'tutorial-upgrade') {
                return;
            }

            if (
                upgrade.purchased &&
                upgrade.type === "growth" &&
                upgrade.targetLevel === level
            ) {
                levelGrowth *= upgrade.effect;
            }
        });

        finalGrowth += levelGrowth;
    });

    return finalGrowth;
}

export function calculateClickPower(state: GameState): number {
    // Click power is 25% of growth per second
    const growthPercentage = 0.25;
    const ticksPerSecond = 1000 / GAME_CONFIG.tickRate; // Convert tick rate to ticks per second
    const growthPerSecond = state.growth * ticksPerSecond; // Convert from per-tick to per-second
    return Math.max(GAME_CONFIG.startingClickPower, Math.floor(growthPerSecond * growthPercentage));
}

export function calculateBlobPosition(): { x: number; y: number } {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const hudWidth = 300; // Shop panel width
    const rightHudWidth = 300; // Evolution panel width (matches evolutionWidth in GameHUD)

    const playableWidth = screenWidth - hudWidth - rightHudWidth;
    const centerX = hudWidth + playableWidth / 2;
    const centerY = screenHeight / 2;

    return { x: centerX, y: centerY };
}

export function calculateZoomRates(currentZoom: number) {
    return {
        background: currentZoom,
        particles: 1 + (currentZoom - 1) * 0.8,
        blob: 1 + (currentZoom - 1) * 0.3,
        nutrients: 1 + (currentZoom - 1) * 0.9,
        generators: 1 + (currentZoom - 1) * 0.7,
    };
} 