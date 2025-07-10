import type { GameState, GeneratorState } from '../types';

export function getGeneratorCost(generator: GeneratorState): number {
    return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, generator.level));
}

export function getTotalGrowth(state: GameState): number {
    // Group generators by level
    const generatorsByLevel: Record<string, GeneratorState[]> = {};
    Object.values(state.generators).forEach((gen) => {
        if (!generatorsByLevel[gen.unlockedAtLevel]) {
            generatorsByLevel[gen.unlockedAtLevel] = [];
        }
        generatorsByLevel[gen.unlockedAtLevel].push(gen);
    });

    // Calculate base growth for each level
    const baseGrowthByLevel: Record<string, number> = {};
    Object.entries(generatorsByLevel).forEach(([level, generators]) => {
        baseGrowthByLevel[level] = generators.reduce((sum, gen) => {
            return sum + gen.baseEffect * gen.level;
        }, 0);
    });

    // Apply upgrades to specific levels
    let finalGrowth = 0;
    Object.entries(baseGrowthByLevel).forEach(([level, baseGrowth]) => {
        let levelGrowth = baseGrowth;

        // Apply upgrades that target this level
        Object.values(state.upgrades).forEach((upgrade) => {
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

export function calculateBlobPosition(): { x: number; y: number } {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const hudWidth = 350;
    const rightHudWidth = 350;

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