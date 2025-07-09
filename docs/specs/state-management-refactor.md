# State Management Refactor

**Status**: Planning Phase

## Problem Statement

The current state management is fragmented with:

- Multiple particle type definitions scattered across files
- Level information duplicated in multiple places
- State synchronization issues between GameState and MapState
- Redundant calculations in multiple components
- Mixed responsibilities in components like ParticleSystem

## Goals

1. **Centralize State**: Single source of truth for all game state
2. **Eliminate Redundancy**: Remove duplicate type definitions and calculations
3. **Separate Concerns**: Clear boundaries between data, logic, and presentation
4. **Improve Performance**: Reduce unnecessary re-renders and calculations
5. **Enhance Maintainability**: Clear, documented state structure

## Proposed Architecture

### 1. Unified State Structure

```typescript
// src/engine/types/game.ts
export interface GameState {
  // Core game data
  biomass: number;
  growth: number;
  clickPower: number;
  currentLevelId: number;
  highestLevelReached: number;

  // Game entities
  generators: Record<string, GeneratorState>;
  upgrades: Record<string, UpgradeState>;
  nutrients: NutrientState[];

  // Visual state (for animations/effects)
  visual: VisualState;

  // Map state (integrated)
  map: MapState;
}

export interface VisualState {
  particles: ParticleState[];
  floatingNumbers: FloatingNumberState[];
  blobSize: number;
  cameraZoom: number;
  levelProgress: number;
}

export interface ParticleState {
  id: string;
  type: ParticleType;
  position: Position;
  velocity: Velocity;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  config: ParticleConfig;
}

export interface FloatingNumberState {
  id: string;
  position: Position;
  value: number;
  color: string;
  startTime: number;
  duration: number;
}

export interface MapState {
  currentLevel: Level;
  cells: Cell[];
  size: number;
}
```

### 2. Centralized Type Definitions

```typescript
// src/engine/types/index.ts
export * from "./game";
export * from "./particles";
export * from "./levels";
export * from "./generators";
export * from "./upgrades";

// src/engine/types/particles.ts
export type ParticleType = "nutrient" | "energy" | "matter" | "cosmic";

export interface ParticleConfig {
  type: ParticleType;
  spawnRate: number;
  speed: number;
  size: number;
  color: string;
  useImage: boolean;
  images?: string[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}
```

### 3. Centralized Level System

```typescript
// src/engine/content/levels.ts
export interface Level {
  id: number;
  name: string;
  displayName: string;
  biomassThreshold: number;
  biomassDisplayFormat: "standard" | "scientific" | "decimal" | "whole";
  background: string;
  description: string;

  // Visual configuration
  particleConfig: ParticleConfig;
  scaleLevel: ScaleLevel;

  // Gameplay configuration
  generators: string[]; // Available generator IDs
  upgrades: string[]; // Available upgrade IDs
}

export interface ScaleLevel {
  name: string;
  description: string;
  unit: string;
  color: string;
  icon: string;
  biomassRange: [number, number];
}
```

### 4. State Management with Zustand

```typescript
// src/engine/store/gameStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { GameState } from "../types";

interface GameStore extends GameState {
  // Actions
  tick: () => void;
  click: () => void;
  buyGenerator: (generatorId: string) => void;
  buyUpgrade: (upgradeId: string) => void;
  evolve: () => void;

  // Visual actions
  addParticle: (particle: Omit<ParticleState, "id">) => void;
  removeParticle: (particleId: string) => void;
  addFloatingNumber: (floatingNumber: Omit<FloatingNumberState, "id">) => void;
  removeFloatingNumber: (floatingNumberId: string) => void;

  // Computed values
  getCurrentLevel: () => Level;
  getNextLevel: () => Level | null;
  canEvolve: () => boolean;
  getTotalGrowth: () => number;
  getBlobSize: () => number;
  getCameraZoom: () => number;
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    // Initial state
    ...INITIAL_STATE,

    // Actions
    tick: () =>
      set((state) => {
        const newState = tick(state);
        Object.assign(state, newState);
      }),

    click: () =>
      set((state) => {
        state.biomass += state.clickPower;
      }),

    buyGenerator: (generatorId: string) =>
      set((state) => {
        const generator = state.generators[generatorId];
        if (!generator) return;

        const cost = getGeneratorCost(generator);
        if (state.biomass < cost) return;

        state.biomass -= cost;
        state.generators[generatorId].level += 1;
        state.growth = getTotalGrowth(state);
      }),

    buyUpgrade: (upgradeId: string) =>
      set((state) => {
        const upgrade = state.upgrades[upgradeId];
        if (!upgrade || upgrade.purchased || state.biomass < upgrade.cost)
          return;

        state.biomass -= upgrade.cost;
        state.upgrades[upgradeId].purchased = true;

        if (upgrade.type === "click") {
          state.clickPower *= upgrade.effect;
        }

        state.growth = getTotalGrowth(state);
      }),

    evolve: () =>
      set((state) => {
        const nextLevel = get().getNextLevel();
        if (!nextLevel || !get().canEvolve()) return;

        state.currentLevelId = nextLevel.id;
        state.highestLevelReached = Math.max(
          state.highestLevelReached,
          nextLevel.id
        );
        state.map.currentLevel = nextLevel;

        // Reset visual state for new level
        state.visual.particles = [];
        state.visual.floatingNumbers = [];
        state.visual.cameraZoom = 1.0;
      }),

    // Visual actions
    addParticle: (particle) =>
      set((state) => {
        state.visual.particles.push({
          ...particle,
          id: generateId(),
        });
      }),

    removeParticle: (particleId) =>
      set((state) => {
        state.visual.particles = state.visual.particles.filter(
          (p) => p.id !== particleId
        );
      }),

    addFloatingNumber: (floatingNumber) =>
      set((state) => {
        state.visual.floatingNumbers.push({
          ...floatingNumber,
          id: generateId(),
        });
      }),

    removeFloatingNumber: (floatingNumberId) =>
      set((state) => {
        state.visual.floatingNumbers = state.visual.floatingNumbers.filter(
          (f) => f.id !== floatingNumberId
        );
      }),

    // Computed values
    getCurrentLevel: () => {
      const state = get();
      return (
        LEVELS.find((level) => level.id === state.currentLevelId) || LEVELS[0]
      );
    },

    getNextLevel: () => {
      const state = get();
      const currentLevel = state.getCurrentLevel();
      const nextLevelIndex =
        LEVELS.findIndex((level) => level.id === currentLevel.id) + 1;
      return nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex] : null;
    },

    canEvolve: () => {
      const state = get();
      const nextLevel = state.getNextLevel();
      return nextLevel && state.biomass >= nextLevel.biomassThreshold;
    },

    getTotalGrowth: () => {
      const state = get();
      return calculateTotalGrowth(state);
    },

    getBlobSize: () => {
      const state = get();
      return calculateBlobSize(state.biomass);
    },

    getCameraZoom: () => {
      const state = get();
      return calculateCameraZoom(state.biomass, state.getCurrentLevel());
    },
  }))
);
```

### 5. Simplified Component Architecture

```typescript
// src/game/Game.tsx (main game component)
export const Game: React.FC = () => {
  const {
    biomass,
    growth,
    clickPower,
    visual,
    getCurrentLevel,
    canEvolve,
    click,
    buyGenerator,
    buyUpgrade,
    evolve,
  } = useGameStore();

  const currentLevel = getCurrentLevel();

  return (
    <div className="game">
      <Map level={currentLevel} />
      <Blob
        biomass={biomass}
        size={visual.blobSize}
        zoom={visual.cameraZoom}
        onClick={click}
      />
      <ParticleSystem particles={visual.particles} />
      <FloatingNumbers floatingNumbers={visual.floatingNumbers} />
      <GameHUD
        biomass={biomass}
        growth={growth}
        clickPower={clickPower}
        currentLevel={currentLevel}
        canEvolve={canEvolve()}
        onBuyGenerator={buyGenerator}
        onBuyUpgrade={buyUpgrade}
        onEvolve={evolve}
      />
    </div>
  );
};

// src/animations/ParticleSystem.tsx (simplified)
export const ParticleSystem: React.FC<{ particles: ParticleState[] }> = ({
  particles,
}) => {
  return (
    <div className="particle-system">
      {particles.map((particle) => (
        <Particle key={particle.id} particle={particle} />
      ))}
    </div>
  );
};

// src/animations/Particle.tsx (simplified)
export const Particle: React.FC<{ particle: ParticleState }> = ({
  particle,
}) => {
  const { position, size, color, config } = particle;

  return (
    <div
      className="particle"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        backgroundColor: config.useImage ? "transparent" : color,
        backgroundImage:
          config.useImage && config.images?.[0]
            ? `url(${config.images[0]})`
            : "none",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};
```

### 6. Centralized Calculations

```typescript
// src/engine/utils/calculations.ts
export const calculateTotalGrowth = (state: GameState): number => {
  let totalGrowth = 0;

  // Add generator contributions
  Object.values(state.generators).forEach((generator) => {
    const level = LEVELS.find((l) => l.name === generator.unlockedAtLevel);
    if (level && state.currentLevelId >= level.id) {
      totalGrowth += generator.baseEffect * generator.level;
    }
  });

  // Apply upgrade multipliers
  Object.values(state.upgrades).forEach((upgrade) => {
    if (upgrade.purchased && upgrade.type === "growth") {
      totalGrowth *= upgrade.effect;
    }
  });

  return totalGrowth;
};

export const calculateBlobSize = (biomass: number): number => {
  return Math.max(50, Math.min(400, 50 + Math.log10(biomass + 1) * 50));
};

export const calculateCameraZoom = (biomass: number, level: Level): number => {
  const nextLevel = getNextLevel(level);
  if (!nextLevel) return 0.02; // Max zoom out

  const progressInLevel = Math.max(0, biomass - level.biomassThreshold);
  const levelRange = nextLevel.biomassThreshold - level.biomassThreshold;
  const progressRatio = Math.min(1, progressInLevel / levelRange);

  // Zoom from 1.0 at level start to 0.02 at level end
  return 1.0 - progressRatio * 0.98;
};

export const getGeneratorCost = (generator: GeneratorState): number => {
  return Math.floor(
    generator.baseCost * Math.pow(generator.costMultiplier, generator.level)
  );
};
```

## Migration Plan

### Phase 1: Type Consolidation

1. Create centralized type definitions
2. Remove duplicate interfaces
3. Update imports across codebase

### Phase 2: State Store Implementation

1. Implement unified game store
2. Migrate from useGame hook to store
3. Update component props

### Phase 3: Component Simplification

1. Simplify ParticleSystem component
2. Remove redundant calculations
3. Update animation components

### Phase 4: Testing & Optimization

1. Add comprehensive tests
2. Performance optimization
3. Documentation updates

## Benefits

1. **Single Source of Truth**: All game state in one place
2. **Eliminated Redundancy**: No more duplicate types or calculations
3. **Better Performance**: Reduced re-renders and calculations
4. **Easier Testing**: Centralized state is easier to test
5. **Improved Maintainability**: Clear structure and documentation
6. **Type Safety**: Comprehensive TypeScript coverage

## Risks & Mitigation

1. **Breaking Changes**: Gradual migration with feature flags
2. **Performance Impact**: Benchmark before/after implementation
3. **Complexity**: Start with core state, add visual state incrementally
4. **Testing**: Comprehensive test coverage for all state changes

## Success Metrics

1. **Reduced Bundle Size**: Fewer duplicate type definitions
2. **Improved Performance**: Fewer re-renders and calculations
3. **Developer Experience**: Easier to understand and modify state
4. **Bug Reduction**: Fewer state synchronization issues
