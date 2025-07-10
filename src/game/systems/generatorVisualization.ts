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
      lastFloatingNumber: Date.now(), // Initialize to current time to prevent immediate floating numbers
      // Wave movement properties
      waveOffset: Math.random() * Math.PI * 2, // Random offset for wave timing
      waveFrequency: 1 + Math.random() * 2, // 1 to 3 Hz
      waveAmplitude: 50 + Math.random() * 150, // 50 to 150 pixels
      speedMultiplier: 0.5 + Math.random() * 1.5 // 0.5x to 2.5x speed
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
      lastFloatingNumber: Date.now(), // Initialize to current time to prevent immediate floating numbers
      // Wave movement properties
      waveOffset: Math.random() * Math.PI * 2, // Random offset for wave timing
      waveFrequency: 1 + Math.random() * 2, // 1 to 3 Hz
      waveAmplitude: 50 + Math.random() * 150, // 50 to 150 pixels
      speedMultiplier: 0.5 + Math.random() * 1.5 // 0.5x to 2.5x speed
    });
  });

  return visualizations;
}

/**
 * Update generator positions with boundary collision and sinusoidal wave movement
 */
export function updateGeneratorPositions(
  generators: GeneratorVisualization[],
  blobSize: number,
  deltaTime: number
): GeneratorVisualization[] {
  const blobRadius = blobSize * 0.35;
  const padding = GAME_CONFIG.generatorVisualization.movement.padding;
  const maxDistance = blobRadius - padding;
  const currentTime = Date.now() * 0.001; // Convert to seconds

  return generators.map((generator) => {
    // Apply speed multiplier to base velocity
    const adjustedSpeed = GAME_CONFIG.generatorVisualization.movement.speed * generator.speedMultiplier;
    
    // Calculate sinusoidal wave offset
    const waveTime = currentTime * generator.waveFrequency + generator.waveOffset;
    const waveX = Math.sin(waveTime) * generator.waveAmplitude;
    const waveY = Math.cos(waveTime * 0.7) * generator.waveAmplitude * 0.8; // Different frequency for Y
    
    // Calculate new position with wave movement
    const newX = generator.position.x + generator.velocity.x * deltaTime + waveX * deltaTime;
    const newY = generator.position.y + generator.velocity.y * deltaTime + waveY * deltaTime;
    
    // Check boundary collision
    const distance = Math.sqrt(newX * newX + newY * newY);
    
    if (distance > maxDistance) {
      // Bounce: reverse velocity and normalize
      const angle = Math.atan2(newY, newX);
      
      // Add some randomness to the bounce to prevent getting stuck
      const bounceAngle = angle + (Math.random() - 0.5) * 0.5; // ±0.25 radians
      
      const velocity = {
        x: -Math.cos(bounceAngle) * adjustedSpeed,
        y: -Math.sin(bounceAngle) * adjustedSpeed
      };
      
      // Clamp position to boundary with a small safety margin
      const safeDistance = maxDistance * 0.95; // 95% of max distance for safety
      const position = {
        x: Math.cos(angle) * safeDistance,
        y: Math.sin(angle) * safeDistance
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
    // Check if it's time for a floating number (every 0.5 seconds)
    if (currentTime - generator.lastFloatingNumber >= 250) {
      const contributionRatio = generator.totalEffect / totalGrowth;
      
      let color = colors.lowContribution; // Default green (least)
      if (contributionRatio >= contributionThresholds.veryHigh) {
        color = colors.maxContribution; // Purple for max contribution
      } else if (contributionRatio >= contributionThresholds.high) {
        color = colors.veryHighContribution; // Red for very high contribution
      } else if (contributionRatio >= contributionThresholds.medium) {
        color = colors.highContribution; // Orange for high contribution
      } else if (contributionRatio >= contributionThresholds.low) {
        color = colors.mediumContribution; // Yellow for medium contribution
      }

      // Calculate screen position
      const x = blobPosition.x + generator.position.x;
      const y = blobPosition.y + generator.position.y;

      // Show per-animation value
      const perAnimationValue = generator.totalEffect / 4;

      floatingNumbers.push({
        x,
        y,
        value: perAnimationValue,
        color
      });
    }
  });

  return floatingNumbers;
}

/**
 * Update floating number timestamps for generators
 */
export function updateFloatingNumberTimestamps(
  generators: GeneratorVisualization[],
  currentTime: number
): GeneratorVisualization[] {
  return generators.map((generator) => {
    // Update timestamp if it's time for a floating number (every 0.25 seconds)
    if (currentTime - generator.lastFloatingNumber >= 250) {
      return { ...generator, lastFloatingNumber: currentTime };
    }
    return generator;
  });
} 