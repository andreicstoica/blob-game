import type { GameState, GeneratorState } from '../../../engine/core/game';

export interface GeneratorValue {
  generatorId: string;
  value: number; // growth per biomass
  color: string; // hex color for the indicator
  rank: number; // 1 = best value, n = worst value
}

// Calculate the value of purchasing the next level of a generator: Value = (increase in growth) / (cost of next generator)
export function calculateGeneratorValue(
  generator: GeneratorState
): number {
  const nextCost = generator.baseCost * Math.pow(generator.costMultiplier, generator.level);
  const growthIncrease = generator.baseEffect; // Each level adds baseEffect growth
  
  if (nextCost <= 0) return 0;
  
  return growthIncrease / nextCost;
}

/**
 * Calculate values for all generators and return them sorted by value
 */
export function calculateAllGeneratorValues(gameState: GameState): GeneratorValue[] {
  const values: GeneratorValue[] = [];
  
  Object.values(gameState.generators).forEach(generator => {
    const value = calculateGeneratorValue(generator);
    values.push({
      generatorId: generator.id,
      value,
      color: '', // Will be set after sorting
      rank: 0 // Will be set after sorting
    });
  });
  
  // Sort by value (highest first)
  values.sort((a, b) => b.value - a.value);
  
  // Assign colors and ranks
  values.forEach((item, index) => {
    item.rank = index + 1;
    
    if (values.length === 1) {
      // Only one generator, make it green
      item.color = '#22c55e';
    } else {
      // Use simple green/yellow/red based on thirds
      const ratio = index / (values.length - 1);
      
      if (ratio <= 0.33) {
        // Top third: green
        item.color = '#22c55e';
      } else if (ratio <= 0.66) {
        // Middle third: yellow
        item.color = '#f59e0b';
      } else {
        // Bottom third: red
        item.color = '#ef4444';
      }
    }
  });
  
  return values;
}

/**
 * Get the value info for a specific generator
 */
export function getGeneratorValueInfo(
  generatorId: string, 
  gameState: GameState
): GeneratorValue | null {
  const allValues = calculateAllGeneratorValues(gameState);
  return allValues.find(v => v.generatorId === generatorId) || null;
} 