import type { GameState, GeneratorState } from '../types';
import type { GeneratorValue } from '../types';
import { getUnlockedGenerators } from './actions';
import { Colors } from '../../styles/colors';

// Calculate the value of purchasing the next level of a generator: Value = (cost of next generator) / (increase in growth)
// Lower values are better (cheaper per unit of growth)
export function calculateGeneratorValue(generator: GeneratorState): number {
    const growthIncrease = generator.growthPerTick; // Each level adds growthPerTick growth
    const cost = generator.baseCost * Math.pow(generator.costMultiplier, generator.level);
    
    // Value is growth per biomass spent
    return growthIncrease / cost;
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
  
  // Don't sort - keep generators in their original order
  // values.sort((a, b) => a.value - b.value);
  
  // Assign colors and ranks based on value ranges
  values.forEach((item, index) => {
    item.rank = index + 1;
    
    if (values.length === 1) {
      // Only one generator, make it green
      item.color = Colors.biomass.primary;
    } else {
      // Find min and max values for color assignment
      const allValues = values.map(v => v.value).filter(v => v !== Infinity);
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const valueRange = maxValue - minValue;
      
      if (valueRange === 0) {
        // All values are the same
        item.color = Colors.biomass.primary;
      } else {
        // Normalize value to 0-1 range
        const normalizedValue = (item.value - minValue) / valueRange;
        
        if (normalizedValue <= 0.33) {
          // Lowest third: red (worst value - highest cost/growth)
          item.color = Colors.headlines.primary;
        } else if (normalizedValue <= 0.66) {
          // Middle third: yellow
          item.color = Colors.evolution.primary;
        } else {
          // Highest third: green (best value - lowest cost/growth)
          item.color = Colors.biomass.primary;
        }
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
  // Get all unlocked generators through current level
  const unlockedGenerators = getUnlockedGenerators(gameState);
  
  const values: GeneratorValue[] = [];
  
  unlockedGenerators.forEach(generator => {
    const value = calculateGeneratorValue(generator);
    values.push({
      generatorId: generator.id,
      value,
      color: '', // Will be set after sorting
      rank: 0 // Will be set after sorting
    });
  });
  
  // Don't sort - keep generators in their original order
  // values.sort((a, b) => a.value - b.value);
  
  // Assign colors and ranks based on value ranges
  values.forEach((item, index) => {
    item.rank = index + 1;
    
    if (values.length === 1) {
      // Only one generator, make it green
      item.color = Colors.biomass.primary;
    } else {
      // Find min and max values for color assignment
      const allValues = values.map(v => v.value).filter(v => v !== Infinity);
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const valueRange = maxValue - minValue;
      
      if (valueRange === 0) {
        // All values are the same
        item.color = Colors.biomass.primary;
      } else {
        // Normalize value to 0-1 range
        const normalizedValue = (item.value - minValue) / valueRange;
        
        if (normalizedValue <= 0.33) {
          // Lowest third: green (best value - lowest cost/growth)
          item.color = Colors.biomass.primary;
        } else if (normalizedValue <= 0.66) {
          // Middle third: yellow
          item.color = Colors.evolution.primary;
        } else {
          // Highest third: red (worst value - highest cost/growth)
          item.color = Colors.headlines.primary;
        }
      }
    }
  });
  
  return values.find(v => v.generatorId === generatorId) || null;
} 