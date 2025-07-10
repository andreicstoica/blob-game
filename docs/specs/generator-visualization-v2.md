# Generator Visualization v2 - Internal Blob System

## Overview

Transform the generator visualization from a static ring around the blob to a dynamic system where generators float inside the blob, move continuously, and stack by level for better visual hierarchy and performance.

## Core Concept

- **Current Level**: Individual generator emojis float inside the blob
- **Previous Levels**: Combined into single icons showing total count (e.g., "🦠 x15")
- **Movement**: Smooth, continuous motion with boundary collision
- **Performance**: Intelligent stacking prevents visual clutter

## Technical Requirements

### 1. Positioning System

#### Blob Boundary Detection

- Use circular boundary for simplicity (radius = blob size \* 0.35)
- 10px padding from edge
- Calculate available area: `radius - padding`

#### Generator Positioning

- Random initial positions within available area
- Respect blob's current size and position
- Update positions when blob size changes

### 2. Movement System

#### Physics Parameters

- **Speed**: 5px/second (constant for all generators)
- **Movement**: Smooth, continuous motion
- **Collision**: Simple direction change at boundaries
- **Trajectory**: Random initial direction, changes on collision

#### Movement Algorithm

```typescript
interface GeneratorMovement {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  blobRadius: number;
  padding: number;
}

function updateGeneratorPosition(
  movement: GeneratorMovement,
  deltaTime: number
) {
  // Calculate new position
  const newX = movement.position.x + movement.velocity.x * deltaTime;
  const newY = movement.position.y + movement.velocity.y * deltaTime;

  // Check boundary collision
  const distance = Math.sqrt(newX * newX + newY * newY);
  const maxDistance = movement.blobRadius - movement.padding;

  if (distance > maxDistance) {
    // Bounce: reverse velocity and normalize
    const angle = Math.atan2(newY, newX);
    movement.velocity.x = -Math.cos(angle) * 5;
    movement.velocity.y = -Math.sin(angle) * 5;

    // Clamp position to boundary
    movement.position.x = Math.cos(angle) * maxDistance;
    movement.position.y = Math.sin(angle) * maxDistance;
  } else {
    movement.position.x = newX;
    movement.position.y = newY;
  }
}
```

### 3. Stacking System

#### Level Grouping

- **Current Level**: Show individual generators
- **Previous Levels**: Combine into single icons with count display
- **Stacking Logic**: Group by `unlockedAtLevel` field

#### Visual Representation

```typescript
interface StackedGenerator {
  levelId: string;
  emoji: string;
  totalCount: number;
  totalEffect: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

// Example: "🦠 x15" for 15 microscopic generators
```

### 4. Floating Number System

#### Animation Triggers

- **Individual Generators**: Every 1 second per generator
- **Stacked Generators**: Every 1 second, showing total contribution
- **Performance Cap**: Maximum 100 floating numbers per second

#### Contribution Calculation

```typescript
function calculateGeneratorContribution(generator: GeneratorState): number {
  return generator.baseEffect * generator.level;
}

function calculateStackedContribution(generators: GeneratorState[]): number {
  return generators.reduce(
    (total, gen) => total + gen.baseEffect * gen.level,
    0
  );
}
```

## Data Structures

### Updated Types

```typescript
interface GeneratorVisualization {
  id: string;
  type: "individual" | "stacked";
  emoji: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  count: number;
  totalEffect: number;
  levelId: string;
  lastFloatingNumber: number; // timestamp
}

interface GeneratorMovementState {
  blobSize: number;
  blobPosition: { x: number; y: number };
  generators: GeneratorVisualization[];
  lastUpdate: number;
}
```

## Engine Functions

### Core Functions

```typescript
// Calculate which generators should be stacked vs individual
function calculateGeneratorGroups(gameState: GameState): {
  currentLevel: GeneratorState[];
  previousLevels: Record<string, GeneratorState[]>;
};

// Initialize movement for generators
function initializeGeneratorMovement(
  generators: GeneratorState[],
  blobSize: number,
  padding: number
): GeneratorVisualization[];

// Update all generator positions
function updateGeneratorPositions(
  generators: GeneratorVisualization[],
  blobSize: number,
  deltaTime: number
): GeneratorVisualization[];

// Calculate floating number data
function calculateFloatingNumbers(
  generators: GeneratorVisualization[],
  currentTime: number
): FloatingNumberData[];
```

## UI Component Updates

### MapGenerators Component

```typescript
interface MapGeneratorsProps {
  gameState: GameState;
  blobSize: number;
  blobPosition: { x: number; y: number };
  addFloatingNumber: (
    position: { x: number; y: number },
    value: number,
    color?: string
  ) => void;
}
```

### Rendering Logic

- Position generators relative to blob center
- Scale with blob size
- Render stacked generators with count overlay
- Handle floating number animations

## Configuration

### Game Config Updates

```typescript
generatorVisualization: {
  // ... existing config
  movement: {
    speed: 5, // pixels per second
    padding: 10, // pixels from blob edge
  },
  stacking: {
    maxIndividualGenerators: 100,
    maxFloatingNumbersPerSecond: 100,
  },
  display: {
    currentLevelSize: 16, // font size
    stackedLevelSize: 14, // font size
    countOverlaySize: 10, // font size for "x15"
  }
}
```

## Implementation Phases

### Phase 1: Core Movement System

1. Update engine functions for internal positioning
2. Implement basic movement and collision
3. Update component to render inside blob

### Phase 2: Stacking System

1. Implement level grouping logic
2. Add stacked generator rendering
3. Update floating number calculations

### Phase 3: Polish & Performance

1. Add smooth animations
2. Implement performance optimizations
3. Add visual feedback for interactions

## Success Criteria

- [ ] Generators move smoothly inside blob boundaries
- [ ] Previous level generators stack into single icons
- [ ] Floating numbers show correct contributions
- [ ] Performance remains smooth with 50+ generators
- [ ] Visual hierarchy clearly shows current vs previous levels
- [ ] Movement feels natural and non-distracting

## Future Enhancements

- **Amoeba Boundary**: Use actual blob shape instead of circle
- **Generator Interactions**: Generators affect each other's movement
- **Visual Effects**: Glow effects, particle trails
- **Sound Integration**: Audio feedback for generator interactions
- **Blob Deformation**: Generators slightly deform blob shape
