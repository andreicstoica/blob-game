# Engine-Frontend Separation Specification (Simplified)

## Overview

Address the instances where game logic is intertwined with frontend components. Keep it straightforward—just relocate the calculations to their appropriate places.

## Current Issues

### 1. App.tsx Contains UI Calculations

- `blobPosition` calculation based on screen dimensions
- `zoomRates` calculation for parallax effects
- These should be simple functions within the engine

### 2. MapGenerators Contains Game Logic

- Generator positioning calculations
- Floating number generation logic
- Missing `calculateGeneratorPositions` function

### 3. useBlobSize Mixes Game and UI Logic

- Screen bounds calculations in the game logic hook
- Game blob size should be separated from UI constraints

### 4. generatorValue.ts in Incorrect Folder

- Game calculations located in `/src/game/hud/Shop/`
- Should be moved to `/src/engine/core/`

## Simple Solution

### Step 1: Add Missing Functions to Existing Engine Files

**File:** `/src/engine/core/calculations.ts`

```typescript
// Add these functions to the existing file

export function calculateBlobPosition(): { x: number; y: number } {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const hudWidth = 350;
  const rightHudWidth = 350;

  const playableWidth = screenWidth - hudWidth - rightHudWidth;
  const centerX = hudWidth + playableWidth / 2;
  const centerY = screenHeight / 2;

  return { x: centerX, y: centerY };
}

export function calculateZoomRates(currentZoom: number) {
  return {
    background: currentZoom,
    particles: 1 + (currentZoom - 1) * 0.8,
    blob: 1 + (currentZoom - 1) * 0.3,
    nutrients: 1 + (currentZoom - 1) * 0.9,
    generators: 1 + (currentZoom - 1) * 0.7,
  };
}

export function calculateGeneratorPositions(
  gameState: GameState,
  blobPosition: { x: number; y: number }
): Array<{
  generatorId: string;
  position: { x: number; y: number };
  emoji: string;
  count: number;
  name: string;
}> {
  const positions: Array<{
    generatorId: string;
    position: { x: number; y: number };
    emoji: string;
    count: number;
    name: string;
  }> = [];
  const ringRadius = 30;

  // Get all generators with count > 0
  Object.values(gameState.generators).forEach((generator) => {
    if (generator.level > 0) {
      const generatorData = GENERATORS[generator.id];
      if (generatorData) {
        const emoji = generatorData.name.split(" ")[0] || "⚪";

        // Create one emoji for each generator purchased
        for (let i = 0; i < generator.level; i++) {
          positions.push({
            generatorId: generator.id,
            emoji,
            position: { x: 0, y: 0 }, // Will be calculated below
            count: generator.level,
            name: generatorData.name,
          });
        }
      }
    }
  });

  // Calculate positions in a ring around the blob
  positions.forEach((pos, index) => {
    const angle = (index / positions.length) * 2 * Math.PI;
    pos.position.x = blobPosition.x + Math.cos(angle) * ringRadius;
    pos.position.y = blobPosition.y + Math.sin(angle) * ringRadius;
  });

  return positions;
}
```

### Step 2: Move generatorValue.ts to the Engine

**Move file:** `/src/game/hud/Shop/generatorValue.ts` → `/src/engine/core/generatorValue.ts`

**Update:** `/src/game/hud/Shop/generatorValue.ts`

```typescript
// Re-export from engine
export * from "../../../engine/core/generatorValue";
```

### Step 3: Update App.tsx to Use Engine Functions

**File:** `/src/App.tsx`

```typescript
// Replace the useMemo calculations with:
import {
  calculateBlobPosition,
  calculateZoomRates,
} from "./engine/core/calculations";

// Replace this:
const blobPosition = useMemo(() => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const hudWidth = 350;
  const rightHudWidth = 350;
  const playableWidth = screenWidth - hudWidth - rightHudWidth;
  const centerX = hudWidth + playableWidth / 2;
  const centerY = screenHeight / 2;
  return { x: centerX, y: centerY };
}, []);

const zoomRates = useMemo(() => {
  return {
    background: currentZoom,
    particles: 1 + (currentZoom - 1) * 0.8,
    blob: 1 + (currentZoom - 1) * 0.3,
    nutrients: 1 + (currentZoom - 1) * 0.9,
    generators: 1 + (currentZoom - 1) * 0.7,
  };
}, [currentZoom]);

// With this:
const blobPosition = useMemo(() => calculateBlobPosition(), []);
const zoomRates = useMemo(() => calculateZoomRates(currentZoom), [currentZoom]);
```

### Step 4: Update MapGenerators to Use Engine Function

**File:** `/src/game/map/MapGenerators.tsx`

```typescript
// Replace the existing positioning logic with:
import { calculateGeneratorPositions } from "../../engine/core/calculations";

// Replace the generatorEmojis calculation with:
const generatorPositions = useMemo(
  () => calculateGeneratorPositions(gameState, blobPosition),
  [gameState.generators, blobPosition]
);

// Then use generatorPositions instead of generatorEmojis
```

### Step 5: Simplify useBlobSize

**File:** `/src/hooks/useBlobSize.ts`

```typescript
// Keep the game logic, move UI constraints to where they're used
export const useBlobSize = (gameState: GameState) => {
  return useMemo(() => {
    const BLOB_BASE_SIZE = 100;
    const BLOB_MAX_SIZE = 300;

    // Pure game logic - no UI constraints
    const biomassFactor = Math.log10(gameState.biomass + 1) / 8;
    return (
      BLOB_BASE_SIZE +
      (BLOB_MAX_SIZE - BLOB_BASE_SIZE) * Math.min(1, biomassFactor)
    );
  }, [gameState.biomass]);
};
```

## That's It!

Just these five simple changes:

1. Add three functions to the existing `/src/engine/core/calculations.ts`
2. Move one file to the engine
3. Update App.tsx to use engine functions (two lines)
4. Update MapGenerators to use engine function (three lines)
5. Remove UI logic from the useBlobSize hook

No new files, no complex architecture—just place the calculations where they belong.
