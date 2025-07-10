# Camera/Blob/Zoom Logic Separation

## Overview

Separate camera, blob positioning, and zoom calculations from frontend components into the engine core. Focus only on the camera/blob/zoom logic to maintain clean separation of concerns.

## Current Issues

### 1. App.tsx Contains UI Layout Calculations

**File:** `src/App.tsx` (lines 27-38)

```typescript
const blobPosition = useMemo(() => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const hudWidth = 350; // left
  const rightHudWidth = 350; // right

  const playableWidth = screenWidth - hudWidth - rightHudWidth;
  const centerX = hudWidth + playableWidth / 2;
  const centerY = screenHeight / 2;

  return { x: centerX, y: centerY };
}, []);
```

**Issue:** UI layout calculation should be in the engine as a pure function.

### 2. App.tsx Contains Parallax Zoom Calculations

**File:** `src/App.tsx` (lines 41-52)

```typescript
const zoomRates = useMemo(() => {
  return {
    background: currentZoom,
    particles: 1 + (currentZoom - 1) * 0.8,
    blob: 1 + (currentZoom - 1) * 0.3,
    nutrients: 1 + (currentZoom - 1) * 0.9,
    generators: 1 + (currentZoom - 1) * 0.7,
  };
}, [currentZoom]);
```

**Issue:** Parallax zoom calculations should be in the engine, not the component.

### 3. useBlobSize Mixes Game and UI Logic

**File:** `src/hooks/useBlobSize.ts` (lines 12-25)

```typescript
// Pure game logic
const biomassFactor = Math.log10(gameState.biomass + 1) / 8;
const calculatedSize =
  BLOB_BASE_SIZE +
  (BLOB_MAX_SIZE - BLOB_BASE_SIZE) * Math.min(1, biomassFactor);

// UI constraints mixed in
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const hudWidth = 350;
const padding = 50;
const maxWidth = (screenWidth - hudWidth - padding) / 4;
const maxHeight = (screenHeight - padding) / 4;
const maxSize = Math.min(maxWidth, maxHeight, BLOB_MAX_SIZE);

return Math.min(calculatedSize, maxSize);
```

**Issue:** Game blob size calculation mixed with UI screen constraints.

## Solution

### Step 1: Add Camera Functions to Engine

**File:** `src/engine/core/calculations.ts`

Add these functions after the existing `getTotalGrowth` function:

```typescript
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
```

### Step 2: Update App.tsx to Use Engine Functions

**File:** `src/App.tsx`

Add import at the top:

```typescript
import {
  calculateBlobPosition,
  calculateZoomRates,
} from "./engine/core/calculations";
```

Replace the blob position calculation:

```typescript
// Replace lines 27-38 with:
const blobPosition = useMemo(() => calculateBlobPosition(), []);
```

Replace the zoom rates calculation:

```typescript
// Replace lines 41-52 with:
const zoomRates = useMemo(() => calculateZoomRates(currentZoom), [currentZoom]);
```

### Step 3: Separate Game Logic from UI Constraints in useBlobSize

**File:** `src/hooks/useBlobSize.ts`

Keep only the pure game logic:

```typescript
export const useBlobSize = (gameState: GameState) => {
  return useMemo(() => {
    const BLOB_BASE_SIZE = 100;
    const BLOB_MAX_SIZE = 300;

    // Pure game logic - no UI constraints
    const biomassFactor = Math.log10(gameState.biomass + 1) / 8;
    const calculatedSize =
      BLOB_BASE_SIZE +
      (BLOB_MAX_SIZE - BLOB_BASE_SIZE) * Math.min(1, biomassFactor);

    return calculatedSize;
  }, [gameState.biomass]);
};
```

**Note:** Apply UI constraints where the size is used (e.g., in the Blob component or App.tsx) if needed, not in the game logic hook.

## Summary

Three focused changes for camera/blob/zoom separation:

1. **Add two functions** to `src/engine/core/calculations.ts` for layout and parallax calculations
2. **Update App.tsx** to use engine functions instead of inline calculations
3. **Remove UI constraints** from useBlobSize hook, keeping only pure game logic

This maintains the same functionality while cleanly separating game calculations from UI layout concerns.
