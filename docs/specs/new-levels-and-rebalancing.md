# New Levels and Rebalancing Specification

## Overview

This spec outlines the addition of two new levels (Neighborhood and Continent), corresponding upgrades and generators, and fixes to the upgrade system to ensure upgrades work as intended. The goal is to create smoother progression and make upgrades meaningful.

## Current Issues Identified

### 1. Upgrade System Problems

- Upgrades are not properly targeting specific generators
- Upgrade effects are applied globally instead of to specific generator tiers
- No clear targeting system for which generators are affected by which upgrades

### 2. Tutorial System Problems

- `basic-generator` and `click-power-upgrade` are dummy components that don't follow normal game rules
- These components appear in GeneratorVisualization and value calculations when they shouldn't
- Special logic needed to exclude them from various systems
- Better to remove them entirely and create a proper tutorial sequence

### 3. Level Progression Gaps

- Large jumps between Lab (2.25M) → City (800M) → Earth (300B)
- Missing intermediate progression points
- Need for smoother scaling

### 4. Generator Balance Issues

- Some generators are too weak compared to others
- Cost scaling doesn't feel balanced
- Growth rates need adjustment

### 5. Click Power Scaling Issues

- No way to upgrade click power after the initial tutorial upgrade
- Click power becomes irrelevant as generators dominate
- Need a system to keep clicking meaningful throughout the game

## Tutorial System Replacement

### Current Tutorial Components (To Remove):

- `basic-generator`: Generates 0 biomass, costs 1 biomass
- `click-power-upgrade`: 2x click power, costs 0 biomass

### Problems with Current System:

1. **Special Logic Required**: These components need exclusion from:
   - GeneratorVisualization (they shouldn't show as emojis)
   - Value calculations (they shouldn't affect red/green/yellow dots)
   - Normal game progression (they're just tutorial placeholders)
2. **Confusing for Players**: Players see "0 biomass per second" generators
3. **Code Complexity**: Special cases throughout the codebase
4. **Not Scalable**: Adding more tutorial elements requires more special logic

### Solution:

Remove the dummy components entirely. This eliminates the need for special logic throughout the codebase and creates a cleaner, more maintainable system.

#### Benefits:

1. **No Special Logic**: All generators and upgrades follow normal rules
2. **Clean Code**: No exceptions or special cases needed
3. **Simpler Architecture**: No dummy components to maintain
4. **Better Player Experience**: Players start with real game mechanics

## New Level Structure

### Current Levels:

```
0. Intro (0 biomass)
1. Microscopic (1 biomass)
2. Petri Dish (2,500 biomass)
3. Lab (2,250,000 biomass)
4. City (800,000,000 biomass)
5. Earth (300,000,000,000 biomass)
6. Solar System (100,000,000,000,000 biomass)
```

### Proposed New Structure:

```
0. Intro (0 biomass)
1. Microscopic (1 biomass)
2. Petri Dish (2,500 biomass)
3. Lab (2,250,000 biomass)
4. Neighborhood (50,000,000 biomass) ← NEW
5. City (800,000,000 biomass)
6. Continent (15,000,000,000 biomass) ← NEW
7. Earth (300,000,000,000 biomass)
8. Solar System (100,000,000,000,000 biomass)
```

## Level Thresholds and Scaling

### Biomass Thresholds (Rebalanced):

| Level        | Old Threshold       | New Threshold       | Scaling Factor |
| ------------ | ------------------- | ------------------- | -------------- |
| Intro        | 0                   | 0                   | -              |
| Microscopic  | 1                   | 1                   | -              |
| Petri Dish   | 2,500               | 2,500               | -              |
| Lab          | 2,250,000           | 2,250,000           | -              |
| Neighborhood | -                   | 50,000,000          | 22.2x          |
| City         | 800,000,000         | 800,000,000         | 16x            |
| Continent    | -                   | 15,000,000,000      | 18.75x         |
| Earth        | 300,000,000,000     | 300,000,000,000     | 20x            |
| Solar System | 100,000,000,000,000 | 100,000,000,000,000 | 333.3x         |

## New Generators

### Neighborhood Level Generators:

```typescript
'backyard-colonizer': {
  id: 'backyard-colonizer',
  name: '🏘️ Backyard Colonizer',
  baseCost: 1500000000, // 2.3x from Lab's highest
  description: 'Colonizes suburban backyards',
  baseEffect: 8000, // 6.7x from Lab's highest
  costMultiplier: 1.15,
  unlockedAtLevel: 'neighborhood'
},
'garden-infester': {
  id: 'garden-infester',
  name: '🏘️ Garden Infester',
  baseCost: 10000000000, // 6.7x from previous
  description: 'Infests neighborhood gardens',
  baseEffect: 40000, // 5x from previous
  costMultiplier: 1.15,
  unlockedAtLevel: 'neighborhood'
},
'street-spreader': {
  id: 'street-spreader',
  name: '🏘️ Street Spreader',
  baseCost: 65000000000, // 6.5x from previous
  description: 'Spreads through neighborhood streets',
  baseEffect: 200000, // 5x from previous
  costMultiplier: 1.15,
  unlockedAtLevel: 'neighborhood'
}
```

### Continent Level Generators:

```typescript
'national-highway-system': {
  id: 'national-highway-system',
  name: '🗺️ National Highway System',
  baseCost: 1200000000000, // 18.5x from Neighborhood's highest
  description: 'Uses highway systems for rapid spread',
  baseEffect: 1000000, // 5x from Neighborhood's highest
  costMultiplier: 1.15,
  unlockedAtLevel: 'continent'
},
'railway-network': {
  id: 'railway-network',
  name: '🗺️ Railway Network',
  baseCost: 8000000000000, // 6.7x from previous
  description: 'Hijacks railway networks',
  baseEffect: 5000000, // 5x from previous
  costMultiplier: 1.15,
  unlockedAtLevel: 'continent'
},
'airport-hub': {
  id: 'airport-hub',
  name: '🗺️ Airport Hub',
  baseCost: 52000000000000, // 6.5x from previous
  description: 'Establishes airport hubs',
  baseEffect: 25000000, // 5x from previous
  costMultiplier: 1.15,
  unlockedAtLevel: 'continent'
}
```

## New Upgrades

### Neighborhood Level Upgrades:

```typescript
'neighborhood-awareness': {
  id: 'neighborhood-awareness',
  name: '🏘️ Neighborhood Awareness',
  cost: 1500000000,
  description: '5x All Lab Generators',
  effect: 5,
  type: 'growth',
  unlockedAtLevel: 'neighborhood',
  targetLevel: 'lab' // NEW: Target specific level
},
'suburban-stealth': {
  id: 'suburban-stealth',
  name: '🏘️ Suburban Stealth',
  cost: 10000000000,
  description: '5x All Neighborhood Generators',
  effect: 5,
  type: 'growth',
  unlockedAtLevel: 'neighborhood',
  targetLevel: 'neighborhood' // NEW: Target specific level
},
'community-integration': {
  id: 'community-integration',
  name: '🏘️ Community Integration',
  cost: 65000000000,
  description: '3x All Neighborhood Generators',
  effect: 3,
  type: 'growth',
  unlockedAtLevel: 'neighborhood',
  targetLevel: 'neighborhood' // NEW: Target specific level
}
```

### Continent Level Upgrades:

```typescript
'intercontinental-railway': {
  id: 'intercontinental-railway',
  name: '🗺️ Intercontinental Railway',
  cost: 1200000000000,
  description: '10x All Neighborhood Generators',
  effect: 10,
  type: 'growth',
  unlockedAtLevel: 'continent',
  targetLevel: 'neighborhood' // NEW: Target specific level
},
'continental-dominance': {
  id: 'continental-dominance',
  name: '🗺️ Continental Dominance',
  cost: 8000000000000,
  description: '10x All Continent Generators',
  effect: 10,
  type: 'growth',
  unlockedAtLevel: 'continent',
  targetLevel: 'continent' // NEW: Target specific level
}
```

## Click Power Scaling System

### Current Problem:

- Click power starts at 1 and never increases
- Clicking becomes irrelevant as generators dominate
- No strategic value to clicking in mid/late game

### Proposed Solution:

Click power scales with current growth rate and can be upgraded through evolution and specific upgrades.

#### Click Power Formula:

```typescript
function calculateClickPower(gameState: GameState): number {
  const baseClickPower = 1;
  const growthMultiplier = 0.1; // Click power = 10% of current growth rate
  const evolutionBonus = gameState.highestLevelReached * 0.5; // +0.5 per level reached

  return baseClickPower + gameState.growth * growthMultiplier + evolutionBonus;
}
```

#### Evolution Click Power Bonus:

When evolving to a new level, click power gets a permanent bonus:

- Microscopic: +0.5 click power
- Petri Dish: +1.0 click power
- Lab: +1.5 click power
- Neighborhood: +2.0 click power
- City: +2.5 click power
- Continent: +3.0 click power
- Earth: +3.5 click power
- Solar System: +4.0 click power

#### Click Power Upgrades:

Add click power upgrades to various levels:

```typescript
// Microscopic Level
'click-mastery': {
  id: 'click-mastery',
  name: '🦠 Click Mastery',
  cost: 500,
  description: 'Click power = 15% of growth rate (instead of 10%)',
  effect: 1.5, // Multiplier for growth percentage
  type: 'click',
  unlockedAtLevel: 'microscopic'
},

// Lab Level
'precision-clicking': {
  id: 'precision-clicking',
  name: '🧪 Precision Clicking',
  cost: 50000000,
  description: 'Click power = 20% of growth rate',
  effect: 2.0,
  type: 'click',
  unlockedAtLevel: 'lab'
},
'geographic-expansion': {
  id: 'geographic-expansion',
  name: '🗺️ Geographic Expansion',
  cost: 52000000000000,
  description: '5x All Continent Generators',
  effect: 5,
  type: 'growth',
  unlockedAtLevel: 'continent',
  targetLevel: 'continent' // NEW: Target specific level
},
'rapid-clicking': {
  id: 'rapid-clicking',
  name: '🏙️ Rapid Clicking',
  cost: 5000000000,
  description: 'Click power = 25% of growth rate',
  effect: 2.5,
  type: 'click',
  unlockedAtLevel: 'city'
}
```

## Upgrade System Fix

### Current Problem:

The upgrade system applies effects globally to all generators, but the descriptions suggest they should target specific generator tiers.

### Solution:

Add a `targetLevel` field to upgrades and modify the growth calculation to only apply upgrades to generators from the specified level.

### Updated Upgrade Interface:

```typescript
export interface UpgradeState {
  id: string;
  name: string;
  cost: number;
  description: string;
  effect: number;
  type: "growth" | "split" | "click" | "blob";
  purchased: boolean;
  unlockedAtLevel: string;
  targetLevel?: string; // NEW: Which level's generators this affects
}
```

### Updated Growth Calculation:

```typescript
export function getTotalGrowth(state: GameState): number {
  let totalGrowth = 0;

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
```

## Level UI Components

### New Level Components to Create:

1. `src/components/Map/levels/NeighborhoodLevel.tsx`
2. `src/components/Map/levels/ContinentLevel.tsx`

### Level Component Structure:

```typescript
// NeighborhoodLevel.tsx
export const NeighborhoodLevel: React.FC = () => {
  return (
    <div className="neighborhood-level">
      <div className="background">
        {/* Neighborhood background with houses, gardens, streets */}
      </div>
      <div className="foreground">
        {/* Neighborhood-specific visual elements */}
      </div>
    </div>
  );
};

// ContinentLevel.tsx
export const ContinentLevel: React.FC = () => {
  return (
    <div className="continent-level">
      <div className="background">
        {/* Continent background with highways, railways, airports */}
      </div>
      <div className="foreground">
        {/* Continent-specific visual elements */}
      </div>
    </div>
  );
};
```

## Files to Modify

### 1. Tutorial System Removal

**File:** `src/engine/content.ts`

- Remove `basic-generator` from GENERATORS
- Remove `click-power-upgrade` from UPGRADES
- Update all existing generators to start from Microscopic level

### 3. Level Definitions

**File:** `src/engine/levels.ts`

- Add Neighborhood and Continent level definitions
- Update level IDs (City becomes 5, Earth becomes 7, Solar System becomes 8)
- Update biomass thresholds

### 4. Generator Definitions

**File:** `src/engine/content.ts`

- Add 6 new generators (3 for Neighborhood, 3 for Continent)
- Update existing generator costs and effects for better balance
- Ensure proper cost scaling between levels

### 5. Upgrade Definitions

**File:** `src/engine/content.ts`

- Add 6 new upgrades (3 for Neighborhood, 3 for Continent)
- Add `targetLevel` field to all existing upgrades
- Update upgrade costs and effects for better balance

### 6. Game Logic

**File:** `src/engine/game.ts`

- Update `UpgradeState` interface to include `targetLevel`
- Modify `getTotalGrowth()` function to apply upgrades to specific levels
- Add `calculateClickPower()` function for dynamic click power scaling
- Update level progression logic to include click power bonuses
- Modify `buyUpgrade()` to handle click power upgrades

### 7. Level Components

**Files:**

- `src/components/Map/levels/NeighborhoodLevel.tsx` (new)
- `src/components/Map/levels/ContinentLevel.tsx` (new)
- `src/components/Map/Map.tsx` (update to include new levels)

### 8. Type Definitions

**File:** `src/engine/game.ts`

- Update `UpgradeState` interface
- Ensure all new generators and upgrades are properly typed

## Implementation Steps

### Phase 1: Tutorial System Removal

1. Remove `basic-generator` and `click-power-upgrade` from content.ts
2. Update all existing generators to start from Microscopic level
3. Remove tutorial-related tests from game.test.ts
4. Verify no special logic is needed in GeneratorVisualization and value calculations

### Phase 2: Core Changes

1. Update level definitions in `levels.ts`
2. Add new generators and upgrades to `content.ts`
3. Update `UpgradeState` interface with `targetLevel`
4. Modify `getTotalGrowth()` function for targeted upgrades
5. Implement click power scaling system
6. Add click power upgrades to various levels

### Phase 3: UI Components

1. Create NeighborhoodLevel component
2. Create ContinentLevel component
3. Update Map component to handle new levels

### Phase 4: Testing and Balance

1. Test progression through all levels including new ones
2. Verify upgrade effects work correctly with targeting
3. Balance generator costs and effects

### Phase 5: Polish

1. Add appropriate emojis and descriptions
2. Test visual progression
3. Ensure smooth transitions between levels

## Balance Considerations

### Generator Scaling:

- Each new generator should be ~5x more powerful than the previous
- Cost scaling should be ~6-8x between generator types
- Maintain 1.15x cost multiplier per purchase

### Upgrade Scaling:

- Early upgrades: 1.5x-3x effects
- Mid-game upgrades: 3x-5x effects
- Late-game upgrades: 5x-10x effects
- Target specific generator tiers for strategic depth

### Progression Timing:

- Each level should take roughly 2-3 minutes to complete
- Total game time should remain around 20 minutes
- Smooth progression without major bottlenecks

## Testing Checklist

### Tutorial System

- [ ] Tutorial components removed from all systems
- [ ] No special logic needed in GeneratorVisualization
- [ ] No special logic needed in value calculations
- [ ] Game starts properly from Intro level
- [ ] Evolution to Microscopic level works correctly

### New Levels and Generators

- [ ] New levels unlock at correct biomass thresholds
- [ ] New generators appear in shop at correct levels
- [ ] New upgrades appear in evolution panel at correct levels
- [ ] Generator costs scale properly
- [ ] Growth rates feel balanced and fun

### Upgrade System Fix

- [ ] Upgrade effects only apply to targeted generator levels
- [ ] No global upgrade effects on all generators
- [ ] Upgrade targeting works correctly for all levels
- [ ] Upgrade descriptions match their actual effects

### Click Power System

- [ ] Click power scales with growth rate correctly
- [ ] Evolution provides click power bonuses
- [ ] Click power upgrades work properly
- [ ] Clicking remains relevant throughout the game
- [ ] Click power formula calculates correctly

### General Gameplay

- [ ] Progression through all levels is smooth
- [ ] No major bottlenecks or too-fast progression
- [ ] Visual components render correctly
- [ ] All existing functionality still works

## Future Considerations

1. **Visual Assets**: May need new background images for Neighborhood and Continent levels
2. **Sound Effects**: Consider level-specific audio cues
3. **Animations**: Level-specific visual effects
4. **Achievements**: New achievements for completing new levels
5. **Tutorial**: Update tutorial to include new levels

This spec provides a comprehensive plan for adding the two new levels while fixing the upgrade system to make it more strategic and meaningful.
