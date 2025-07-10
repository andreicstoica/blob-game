import type { GameState, GeneratorState } from '../types';
import type { GeneratorVisualization, FloatingNumberData } from '../types/ui';
import { GENERATORS } from '../content/generators';
import { GAME_CONFIG } from '../content/config';
import { getTotalGrowth } from './calculations';

// Re-export types for convenience
export type { GeneratorVisualization, FloatingNumberData };

/**
 * Calculate which generators should be stacked vs individual
 */
export function calculateGeneratorGroups(gameState: GameState, currentLevelId: string): {
  currentLevel: GeneratorState[];
  previousLevels: Record<string, GeneratorState[]>;
} {
  const currentLevelGenerators: GeneratorState[] = [];
  const previousLevels: Record<string, GeneratorState[]> = {};

  Object.values(gameState.generators).forEach((generator) => {
    if (generator.level > 0) {
      if (generator.unlockedAtLevel === currentLevelId) {
        currentLevelGenerators.push(generator);
      } else {
        // Previous level generator
        if (!previousLevels[generator.unlockedAtLevel]) {
          previousLevels[generator.unlockedAtLevel] = [];
        }
        previousLevels[generator.unlockedAtLevel].push(generator);
      }
    }
  });

  return { currentLevel: currentLevelGenerators, previousLevels };
}

/**
 * Initialize movement for generators
 */
export function initializeGeneratorMovement(
  generators: GeneratorState[],
  blobSize: number
): GeneratorVisualization[] {
  const visualizations: GeneratorVisualization[] = [];
  const blobRadius = blobSize * 0.35;
  const padding = GAME_CONFIG.generatorVisualization.movement.padding;
  const availableRadius = blobRadius - padding;

  generators.forEach((generator) => {
    const generatorData = GENERATORS[generator.id];
    if (!generatorData) return;

    const emoji = generatorData.name.split(" ")[0] || "⚪";
    
    // Random position within available area
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * availableRadius;
    
    const position = {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };

    // Random velocity (5px/second)
    const velocityAngle = Math.random() * 2 * Math.PI;
    const velocity = {
      x: Math.cos(velocityAngle) * GAME_CONFIG.generatorVisualization.movement.speed,
      y: Math.sin(velocityAngle) * GAME_CONFIG.generatorVisualization.movement.speed
    };

    visualizations.push({
      id: generator.id,
      type: 'individual',
      emoji,
      position,
      velocity,
      count: generator.level,
      totalEffect: generator.baseEffect * generator.level,
      levelId: generator.unlockedAtLevel,
      lastFloatingNumber: 0
    });
  });

  return visualizations;
}

/**
 * Initialize movement for stacked generators (previous levels)
 */
export function initializeStackedGeneratorMovement(
  previousLevels: Record<string, GeneratorState[]>,
  blobSize: number
): GeneratorVisualization[] {
  const visualizations: GeneratorVisualization[] = [];
  const blobRadius = blobSize * 0.35;
  const padding = GAME_CONFIG.generatorVisualization.movement.padding;
  const availableRadius = blobRadius - padding;

  Object.entries(previousLevels).forEach(([levelId, levelGenerators]) => {
    if (levelGenerators.length === 0) return;

    // Calculate total count and effect for this level
    const totalCount = levelGenerators.reduce((sum, gen) => sum + gen.level, 0);
    const totalEffect = levelGenerators.reduce((sum, gen) => sum + gen.baseEffect * gen.level, 0);
    
    // Get emoji from first generator in the level
    const firstGenerator = GENERATORS[levelGenerators[0].id];
    const emoji = firstGenerator?.name.split(" ")[0] || "⚪";
    
    // Random position within available area
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * availableRadius;
    
    const position = {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };

    // Random velocity (5px/second)
    const velocityAngle = Math.random() * 2 * Math.PI;
    const velocity = {
      x: Math.cos(velocityAngle) * GAME_CONFIG.generatorVisualization.movement.speed,
      y: Math.sin(velocityAngle) * GAME_CONFIG.generatorVisualization.movement.speed
    };

    visualizations.push({
      id: `stacked-${levelId}`,
      type: 'stacked',
      emoji,
      position,
      velocity,
      count: totalCount,
      totalEffect,
      levelId,
      lastFloatingNumber: 0
    });
  });

  return visualizations;
}

/**
 * Update generator positions with boundary collision
 */
export function updateGeneratorPositions(
  generators: GeneratorVisualization[],
  blobSize: number,
  deltaTime: number
): GeneratorVisualization[] {
  const blobRadius = blobSize * 0.35;
  const padding = GAME_CONFIG.generatorVisualization.movement.padding;
  const maxDistance = blobRadius - padding;

  return generators.map((generator) => {
    // Calculate new position
    const newX = generator.position.x + generator.velocity.x * deltaTime;
    const newY = generator.position.y + generator.velocity.y * deltaTime;
    
    // Check boundary collision
    const distance = Math.sqrt(newX * newX + newY * newY);
    
    if (distance > maxDistance) {
      // Bounce: reverse velocity and normalize
      const angle = Math.atan2(newY, newX);
      const velocity = {
        x: -Math.cos(angle) * GAME_CONFIG.generatorVisualization.movement.speed,
        y: -Math.sin(angle) * GAME_CONFIG.generatorVisualization.movement.speed
      };
      
      // Clamp position to boundary
      const position = {
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      };

      return { ...generator, position, velocity };
    } else {
      const position = { x: newX, y: newY };
      return { ...generator, position };
    }
  });
}

/**
 * Calculate floating number data for generators
 */
export function calculateFloatingNumbers(
  generators: GeneratorVisualization[],
  currentTime: number,
  gameState: GameState,
  blobPosition: { x: number; y: number }
): FloatingNumberData[] {
  const floatingNumbers: FloatingNumberData[] = [];
  const { contributionThresholds, colors } = GAME_CONFIG.generatorVisualization;
  const totalGrowth = getTotalGrowth(gameState);

  generators.forEach((generator) => {
    // Check if it's time for a floating number (every 3 seconds)
    if (currentTime - generator.lastFloatingNumber >= 3000) {
      const contributionRatio = generator.totalEffect / totalGrowth;
      
      let color = colors.highContribution; // Default green
      if (contributionRatio < contributionThresholds.low) {
        color = colors.lowContribution; // Red for low contribution
      } else if (contributionRatio < contributionThresholds.medium) {
        color = colors.mediumContribution; // Yellow for medium contribution
      }

      // Calculate screen position
      const x = blobPosition.x + generator.position.x;
      const y = blobPosition.y + generator.position.y;

      floatingNumbers.push({
        x,
        y,
        value: generator.totalEffect,
        color
      });

      // Update last floating number time
      generator.lastFloatingNumber = currentTime;
    }
  });

  return floatingNumbers;
} 