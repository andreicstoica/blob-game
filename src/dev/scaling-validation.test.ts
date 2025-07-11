import { GENERATORS } from '../game/content/generators';
import { UPGRADES } from '../game/content/upgrades';
import { LEVELS } from '../game/content/levels';

// Test rules for game scaling validation
const SCALING_RULES = {
  // Evolution/Level Progression Rules
  EVOLUTION: {
    // Rule 1: Level thresholds should be higher than the most expensive generator in the previous level
    THRESHOLD_VS_GENERATORS: 'Level thresholds must be higher than the most expensive generator in the previous level',
    
    // Rule 2: Level thresholds should be achievable within reasonable time
    THRESHOLD_ACHIEVABLE: 'Level thresholds should be achievable within reasonable time (not too high)',
    
    // Rule 3: Each level should provide meaningful progression
    MEANINGFUL_PROGRESSION: 'Each level should provide meaningful progression (not too close together)'
  },

  // Generator Scaling Rules
  GENERATORS: {
    // Rule 4: Generators within a level should have reasonable cost ratios
    COST_RATIOS: 'Generators within a level should have reasonable cost ratios (not too extreme)',
    
    // Rule 5: Generator effects should scale reasonably with cost
    EFFECT_COST_SCALING: 'Generator effects should scale reasonably with cost (better generators should be more expensive)',
    
    // Rule 6: First generator in a level should be affordable at level start
    FIRST_GENERATOR_AFFORDABLE: 'First generator in a level should be affordable when reaching that level',
    
    // Rule 7: Most expensive generator in a level should be cheaper than next level threshold
    MOST_EXPENSIVE_VS_NEXT_LEVEL: 'Most expensive generator in a level should be cheaper than next level threshold'
  },

  // Upgrade Scaling Rules
  UPGRADES: {
    // Rule 8: Upgrade costs should be reasonable relative to generator costs
    COST_VS_GENERATORS: 'Upgrade costs should be reasonable relative to generator costs in the same level',
    
    // Rule 9: Upgrade effects should provide meaningful value
    EFFECT_VALUE: 'Upgrade effects should provide meaningful value for their cost',
    
    // Rule 10: Upgrades should be purchasable before next level
    PURCHASABLE_BEFORE_NEXT_LEVEL: 'Upgrades should be purchasable before reaching the next level'
  },

  // Cross-System Rules
  CROSS_SYSTEM: {
    // Rule 11: Overall progression should be smooth
    SMOOTH_PROGRESSION: 'Overall progression should be smooth without major bottlenecks',
    
    // Rule 12: Cookie Clicker style exponential growth
    EXPONENTIAL_GROWTH: 'Should follow Cookie Clicker style exponential growth patterns'
  }
};

// Helper functions
function getGeneratorsForLevel(levelName: string) {
  return Object.values(GENERATORS).filter(g => g.unlockedAtLevel === levelName);
}

function getUpgradesForLevel(levelName: string) {
  return Object.values(UPGRADES).filter(u => u.unlockedAtLevel === levelName);
}

function calculateGeneratorCost(generator: any, level: number = 1) {
  return generator.baseCost * Math.pow(generator.costMultiplier, level - 1);
}

function calculateGeneratorEffect(generator: any, level: number = 1) {
  return generator.baseEffect * level;
}

// Test functions
function testEvolutionThresholds() {
  console.log('\n=== EVOLUTION THRESHOLD TESTS ===');
  
  for (let i = 1; i < LEVELS.length; i++) {
    const currentLevel = LEVELS[i];
    const previousLevel = LEVELS[i - 1];
    const previousGenerators = getGeneratorsForLevel(previousLevel.name);
    
    if (previousGenerators.length === 0) continue;
    
    const mostExpensivePrevious = Math.max(...previousGenerators.map(g => g.baseCost));
    
    console.log(`\n${currentLevel.name}:`);
    console.log(`  Threshold: ${currentLevel.biomassThreshold.toLocaleString()}`);
    console.log(`  Most expensive previous generator: ${mostExpensivePrevious.toLocaleString()}`);
    
    if (currentLevel.biomassThreshold <= mostExpensivePrevious) {
      console.log(`  ❌ FAIL: Threshold too low!`);
    } else {
      console.log(`  ✅ PASS: Threshold is higher than most expensive generator`);
    }
  }
}

function testGeneratorScaling() {
  console.log('\n=== GENERATOR SCALING TESTS ===');
  
  for (const level of LEVELS) {
    const generators = getGeneratorsForLevel(level.name);
    if (generators.length === 0) continue;
    
    console.log(`\n${level.name}:`);
    
    // Test cost ratios within level
    const costs = generators.map(g => g.baseCost).sort((a, b) => a - b);
    const costRatio = costs[costs.length - 1] / costs[0];
    console.log(`  Cost ratio (max/min): ${costRatio.toFixed(2)}x`);
    
    if (costRatio > 100) {
      console.log(`  ⚠️  WARNING: High cost ratio within level`);
    } else {
      console.log(`  ✅ PASS: Reasonable cost ratio`);
    }
    
    // Test effect/cost scaling
    const effects = generators.map(g => g.baseEffect);
    const effectCostRatios = generators.map(g => g.baseEffect / g.baseCost);
    const avgEffectCostRatio = effectCostRatios.reduce((a, b) => a + b, 0) / effectCostRatios.length;
    
    console.log(`  Average effect/cost ratio: ${avgEffectCostRatio.toFixed(6)}`);
    
    // Check if more expensive generators have better effects
    const sortedByCost = generators.sort((a, b) => a.baseCost - b.baseCost);
    let effectsIncrease = true;
    for (let i = 1; i < sortedByCost.length; i++) {
      if (sortedByCost[i].baseEffect <= sortedByCost[i-1].baseEffect) {
        effectsIncrease = false;
        break;
      }
    }
    
    if (effectsIncrease) {
      console.log(`  ✅ PASS: Effects increase with cost`);
    } else {
      console.log(`  ❌ FAIL: Effects don't consistently increase with cost`);
    }
  }
}

function testUpgradeScaling() {
  console.log('\n=== UPGRADE SCALING TESTS ===');
  
  for (const level of LEVELS) {
    const upgrades = getUpgradesForLevel(level.name);
    const generators = getGeneratorsForLevel(level.name);
    
    if (upgrades.length === 0) continue;
    
    console.log(`\n${level.name}:`);
    
    // Test upgrade costs vs generator costs
    const avgGeneratorCost = generators.reduce((sum, g) => sum + g.baseCost, 0) / generators.length;
    const avgUpgradeCost = upgrades.reduce((sum, u) => sum + u.cost, 0) / upgrades.length;
    const costRatio = avgUpgradeCost / avgGeneratorCost;
    
    console.log(`  Average generator cost: ${avgGeneratorCost.toLocaleString()}`);
    console.log(`  Average upgrade cost: ${avgUpgradeCost.toLocaleString()}`);
    console.log(`  Upgrade/Generator cost ratio: ${costRatio.toFixed(2)}x`);
    
    if (costRatio > 50) {
      console.log(`  ⚠️  WARNING: Upgrades might be too expensive`);
    } else if (costRatio < 0.1) {
      console.log(`  ⚠️  WARNING: Upgrades might be too cheap`);
    } else {
      console.log(`  ✅ PASS: Reasonable upgrade costs`);
    }
    
    // Test upgrade effects
    for (const upgrade of upgrades) {
      const effectValue = upgrade.effect;
      console.log(`  ${upgrade.name}: ${effectValue}x multiplier`);
      
      if (effectValue < 2) {
        console.log(`    ⚠️  WARNING: Low effect multiplier`);
      } else if (effectValue > 20) {
        console.log(`    ⚠️  WARNING: Very high effect multiplier`);
      } else {
        console.log(`    ✅ PASS: Reasonable effect`);
      }
    }
  }
}

function testCrossLevelProgression() {
  console.log('\n=== CROSS-LEVEL PROGRESSION TESTS ===');
  
  for (let i = 0; i < LEVELS.length - 1; i++) {
    const currentLevel = LEVELS[i];
    const nextLevel = LEVELS[i + 1];
    const currentGenerators = getGeneratorsForLevel(currentLevel.name);
    
    if (currentGenerators.length === 0) continue;
    
    const mostExpensiveCurrent = Math.max(...currentGenerators.map(g => g.baseCost));
    const thresholdRatio = nextLevel.biomassThreshold / mostExpensiveCurrent;
    
    console.log(`\n${currentLevel.name} → ${nextLevel.name}:`);
    console.log(`  Most expensive generator: ${mostExpensiveCurrent.toLocaleString()}`);
    console.log(`  Next level threshold: ${nextLevel.biomassThreshold.toLocaleString()}`);
    console.log(`  Threshold/Generator ratio: ${thresholdRatio.toFixed(2)}x`);
    
    if (thresholdRatio < 1) {
      console.log(`  ❌ FAIL: Threshold is lower than most expensive generator!`);
    } else if (thresholdRatio > 1000) {
      console.log(`  ⚠️  WARNING: Very large gap between levels`);
    } else if (thresholdRatio < 2) {
      console.log(`  ⚠️  WARNING: Very small gap between levels`);
    } else {
      console.log(`  ✅ PASS: Reasonable progression gap`);
    }
  }
}

function testExponentialGrowthPattern() {
  console.log('\n=== EXPONENTIAL GROWTH PATTERN TESTS ===');
  
  // Test generator cost progression across levels
  const firstGenerators = LEVELS.map(level => {
    const generators = getGeneratorsForLevel(level.name);
    return generators.length > 0 ? generators[0] : null;
  }).filter(Boolean);
  
  console.log('\nFirst generator cost progression:');
  for (let i = 1; i < firstGenerators.length; i++) {
    const current = firstGenerators[i];
    const previous = firstGenerators[i-1];
    
    if (!current || !previous) continue;
    
    const costRatio = current.baseCost / previous.baseCost;
    console.log(`  ${previous.unlockedAtLevel} → ${current.unlockedAtLevel}: ${costRatio.toFixed(1)}x`);
    
    if (costRatio < 5) {
      console.log(`    ⚠️  WARNING: Small cost increase`);
    } else if (costRatio > 100) {
      console.log(`    ⚠️  WARNING: Very large cost increase`);
    } else {
      console.log(`    ✅ PASS: Reasonable cost increase`);
    }
  }
  
  // Test effect progression
  console.log('\nFirst generator effect progression:');
  for (let i = 1; i < firstGenerators.length; i++) {
    const current = firstGenerators[i];
    const previous = firstGenerators[i-1];
    
    if (!current || !previous) continue;
    
    const effectRatio = current.baseEffect / previous.baseEffect;
    console.log(`  ${previous.unlockedAtLevel} → ${current.unlockedAtLevel}: ${effectRatio.toFixed(1)}x`);
    
    if (effectRatio < 2) {
      console.log(`    ⚠️  WARNING: Small effect increase`);
    } else if (effectRatio > 50) {
      console.log(`    ⚠️  WARNING: Very large effect increase`);
    } else {
      console.log(`    ✅ PASS: Reasonable effect increase`);
    }
  }
}

// Main test runner
export function runScalingValidationTests() {
  console.log('🧪 RUNNING GAME SCALING VALIDATION TESTS');
  console.log('==========================================');
  
  testEvolutionThresholds();
  testGeneratorScaling();
  testUpgradeScaling();
  testCrossLevelProgression();
  testExponentialGrowthPattern();
  
  console.log('\n==========================================');
  console.log('✅ SCALING VALIDATION TESTS COMPLETE');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runScalingValidationTests();
} 