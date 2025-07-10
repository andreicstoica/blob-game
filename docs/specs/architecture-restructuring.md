# Architecture Restructuring Specification

## Overview

This spec outlines a comprehensive restructuring of the blob-game codebase to improve architecture, data flow, and maintainability. The goal is to create a clear separation of concerns, better organization, and scalable structure for future development.

## Current Issues

### 1. Mixed Concerns in Components

- Game logic mixed with UI rendering
- Animation systems embedded in UI components
- Business logic scattered across multiple components
- Inconsistent state management patterns

### 2. Asset Organization

- Assets consolidated in `/public/assets`
- No clear categorization of asset types
- Inconsistent naming conventions

### 3. Poor Data Flow

- Components directly accessing global state
- Tight coupling between UI and game logic
- Difficult to test individual components
- Hard to reuse logic across components

### 4. Limited Utility Functions

- Math calculations duplicated across components
- Animation logic embedded in components
- Constants defined in multiple places
- No centralized validation or formatting

## Proposed Structure

### 1. Documentation Consolidation

**Current Structure:**

```
/docs/                   # Architecture diagrams
/agents/                 # AI agent guidelines and feature specs
```

**Proposed Structure:**

```
/docs/
├── architecture/
│   ├── diagrams.md
│   └── restructuring.md
├── specs/
│   ├── generator-visualization.md
│   ├── progression-scaling.md
│   └── ...
├── guides/
│   ├── agents.md
│   └── development.md
└── README.md
```

**Benefits:**

- Single source of truth for all documentation
- Standard convention (most projects use `/docs/`)
- Better organization with clear categories
- Easier to find and maintain documentation

### 2. Asset Consolidation

**Current Structure:**

```
/public/assets/          # Static images (world-map.jpg, solar-system.webp, galaxies/, earth/)
/public/assets/         # All assets consolidated here
```

**Proposed Structure:**

```
/public/assets/
├── images/
│   ├── backgrounds/     # world-map.jpg, solar-system.webp
│   ├── galaxies/        # galaxy-1.png, galaxy-2.webp
│   ├── earth/           # city.png, flower-plant.png, landscape.png
│   └── bacteria/        # brown-bacteria.png, green-bacteria.png, purple-bacteria.png
├── sounds/              # click-1.wav, click-2.mp3, notification-1.mp3, etc.
└── textures/            # asfalt-texture.png
```

### 2. Component Architecture Restructuring

**Current Structure:**

```
/src/components/
├── Animations/          # Animation system (should be separate)
├── Blob/               # Blob components
├── Map/                # Map and level components
├── HUD/                # HUD components
├── Food/               # Food components
├── GeneratorVisualization.tsx  # Mixed with other components
└── CycleMaps.tsx       # Standalone component
```

**Proposed Structure:**

```
/src/
├── components/          # Pure UI components (reusable)
│   ├── ui/             # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Panel.tsx
│   │   └── Tooltip.tsx
│   └── layout/         # Layout components
│       └── GameLayout.tsx
├── game/               # Game-specific components
│   ├── blob/           # Blob-related components
│   │   ├── Blob.tsx
│   │   └── BlobTest.tsx (move to /src/dev/)
│   ├── map/            # Map and level components
│   │   ├── Map.tsx
│   │   ├── GeneratorVisualization.tsx
│   │   └── levels/
│   ├── hud/            # HUD components
│   │   ├── GameStats.tsx
│   │   ├── Shop/
│   │   └── Evolution/
│   └── food/           # Food/nutrients components
│       └── Nutrients.tsx
└── animations/         # Animation system (moved from components)
    ├── FloatingNumber.tsx
    ├── Particle.tsx
    ├── ParticleSystem.tsx
    └── AnimationLayer.tsx
```

**Why This Matters (#2 Explanation):**

The separation between pure UI components and game-specific components is crucial because:

1. **Reusability**: Pure UI components can be reused across different parts of the game or even in other projects
2. **Testing**: Pure UI components are easier to test since they don't depend on game state
3. **Maintenance**: Changes to game logic don't affect UI components and vice versa
4. **Team Development**: Different developers can work on UI vs game logic without conflicts
5. **Performance**: Pure UI components can be optimized independently
6. **Future-Proofing**: If we want to change the game engine or add new game modes, UI components remain stable

### 3. Engine & Logic Consolidation

**Current Structure:**

```
/src/engine/
├── game.ts             # Main game state
├── levels.ts           # Level data and logic (KEEP AS-IS)
├── mapState.ts         # Map state
├── content.ts          # Game content
└── game.test.ts        # Tests mixed with source
```

**Note:** The current separation between `/src/engine/levels.ts` (data/logic) and `/src/components/Map/levels/` (UI components) is correct and should be maintained. This follows the proper separation of concerns: data in engine, presentation in components.

**Proposed Structure:**

```
/src/engine/
├── core/               # Core game systems
│   ├── game.ts         # Main game state
│   ├── levels.ts       # Level management
│   └── mapState.ts     # Map state
├── systems/            # Game systems
│   ├── generators.ts   # Generator logic
│   ├── upgrades.ts     # Upgrade logic
│   ├── evolution.ts    # Evolution logic
│   └── progression.ts  # Progression scaling
├── content/            # Game content
│   ├── content.ts      # Game data
│   ├── generators.ts   # Generator definitions
│   └── upgrades.ts     # Upgrade definitions
└── types/              # Type definitions
    ├── game.ts         # Game state types
    ├── generators.ts   # Generator types
    └── upgrades.ts     # Upgrade types
```

### 4. Utils & Helpers Expansion

**Current Structure:**

```
/src/utils/
└── numberFormat.ts     # Only number formatting
```

**Proposed Structure:**

```
/src/utils/
├── formatting/         # Number and text formatting
│   ├── numberFormat.ts
│   └── textFormat.ts
├── math/              # Math utilities
│   ├── calculations.ts # Biomass calculations, scaling
│   └── scaling.ts      # Level progression math
├── animation/         # Animation utilities
│   ├── easing.ts       # Easing functions
│   └── timing.ts       # Animation timing
├── validation/        # Data validation
│   └── gameState.ts    # Game state validation
└── constants/         # Game constants
    ├── gameConstants.ts # Game configuration
    └── uiConstants.ts   # UI configuration
```

### 5. Hooks Organization

**Current Structure:**

```
/src/hooks/
├── useGame.ts          # Game state hook
├── useCameraZoom.ts    # UI interaction hook
└── useBlobSize.ts      # UI interaction hook
```

**Proposed Structure:**

```
/src/hooks/
├── game/              # Game state hooks
│   ├── useGame.ts
│   ├── useGameState.ts
│   └── useGenerators.ts
├── ui/                # UI interaction hooks
│   ├── useCameraZoom.ts
│   ├── useBlobSize.ts
│   └── useAnimation.ts
└── animations/        # Animation hooks
    └── useFloatingNumbers.ts
```

## Data Flow Architecture

### Current Flow (Problematic):

```
Components → Global State → Other Components
(Everything mixed together)
```

### Proposed Flow:

```
Engine (State) → Hooks (Logic) → Components (UI) → Animations (Effects)
```

**Benefits:**

1. **Unidirectional Data Flow**: Data flows in one direction, making it predictable
2. **Clear Responsibilities**: Each layer has a specific purpose
3. **Easy Testing**: Each layer can be tested independently
4. **Better Performance**: Components only re-render when their specific data changes
5. **Maintainability**: Changes in one layer don't affect others

## Implementation Strategy

### Phase 1: Foundation

1. Create new folder structure
2. Move assets to consolidated structure
3. Update import paths for assets
4. Create basic utility functions

### Phase 2: Component Migration

1. Move components to new structure
2. Update import paths
3. Separate pure UI components from game components
4. Move animation system out of components

### Phase 3: Engine Consolidation

1. Extract game logic from components
2. Create engine systems
3. Move business logic to appropriate layers
4. Create type definitions

### Phase 4: Hook Organization

1. Organize hooks by domain
2. Create new hooks for extracted logic
3. Update component dependencies
4. Test hook functionality

## Migration Checklist

### Files to Move:

- [x] `/src/assets/` → `/public/assets/`
- [ ] `/src/components/Animations/` → `/src/animations/`
- [ ] `/src/components/Blob/BlobTest.tsx` → `/src/dev/`
- [ ] `/src/components/GeneratorVisualization.tsx` → `/src/game/map/`
- [ ] `/agents/` → `/docs/` (consolidate documentation)

### Files to Create:

- [ ] `/src/utils/math/calculations.ts`
- [ ] `/src/utils/math/scaling.ts`
- [ ] `/src/utils/animation/easing.ts`
- [ ] `/src/utils/animation/timing.ts`
- [ ] `/src/utils/constants/gameConstants.ts`
- [ ] `/src/utils/constants/uiConstants.ts`
- [ ] `/src/engine/systems/generators.ts`
- [ ] `/src/engine/systems/upgrades.ts`
- [ ] `/src/engine/types/game.ts`

### Logic to Extract:

- [ ] Generator calculations from Shop components
- [ ] Upgrade logic from Evolution components
- [ ] Math calculations from various components
- [ ] Animation timing logic
- [ ] Constants from components

## Benefits Summary

1. **Maintainability**: Clear structure makes code easier to understand and modify
2. **Testability**: Separated concerns make unit testing straightforward
3. **Reusability**: Pure UI components and utilities can be reused
4. **Performance**: Better data flow and separation improves rendering efficiency
5. **Scalability**: Easy to add new features without restructuring
6. **Team Development**: Multiple developers can work on different layers
7. **Future-Proofing**: Structure supports future game features and modes

## Risk Mitigation

1. **Gradual Migration**: Implement changes in phases to avoid breaking functionality
2. **Comprehensive Testing**: Test each phase before proceeding
3. **Backup Strategy**: Keep original structure until migration is complete
4. **Documentation**: Update documentation as structure changes
5. **Team Communication**: Ensure all team members understand the new structure

## Success Metrics

1. **Reduced Import Complexity**: Fewer circular dependencies
2. **Improved Test Coverage**: Easier to test individual components
3. **Faster Development**: New features can be added more quickly
4. **Better Performance**: Reduced re-renders and optimized data flow
5. **Cleaner Code**: Less duplication and better organization
