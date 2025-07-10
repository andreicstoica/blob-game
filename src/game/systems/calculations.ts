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