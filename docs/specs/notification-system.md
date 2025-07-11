# Notification System Specification

## Overview

Add a simple milestone notification system using react-toastify to celebrate player achievements. Follows the existing game architecture with logic in `/game` and UI in `/components`.

## Requirements

### Core Features

- [ ] Toast notifications appear bottom-center, auto-dismiss after 10 seconds
- [ ] Track which milestones have been shown (persistent)
- [ ] Celebrate first purchases, size milestones, and achievements
- [ ] Don't impact game performance

### Milestone Categories

**Size Milestones:**

// when actually implementing, make sure these use the levels from levels.ts

- 1,000 biomass: "You're now the size of an ant! 🐜"
- 100,000 biomass: "You're as big as a mouse! 🐭"
- 10,000,000 biomass: "You're as big as a human! 🧑"
- 1,000,000,000 biomass: "You're as large as an American car! 🚗"
- 10,000,000,000 biomass: "You're the size of a house! 🏠"
- 100,000,000,000 biomass: "You're as big as a blue whale! 🐋"
- 1,000,000,000,000 biomass: "You're as tall as the Eiffel Tower! 🗼"
- 10,000,000,000,000 biomass: "You're the size of a NYC block! 🏙️"
- 100,000,000,000,000 biomass: "You're as big as a mountain! 🏔️"
- 10,000,000,000,000,000 biomass: "You're as big as a Monaco! 🌍"
- 1,000,000,000,000,000,000 biomass: "You're as big as Jupiter! 🪐"
- 1,000,000,000,000,000,000,000 biomass: "You're the size of the solar system! 🌌"

**Achievement Milestones:**

- First generator purchase: "Your first generator! Watch your biomass grow automatically. 💪"
- First upgrade purchase: "Upgrades boost your existing generators. Smart investment! ⚡"
- 100 total clicks: "Clicker Master! Your dedication is admirable."
- 1000 total clicks: "Click Legend! You've clicked 1,000 times."

## Architecture

Following existing patterns, keep all logic in the game engine and UI purely presentational.

### Game Engine (Logic)

**File: `/src/game/types/core.ts`**
Add to GameState:

```typescript
interface GameState {
  // ... existing state
  notifications: {
    shownMilestones: Set<string>;
    totalClicks: number;
  };
}
```

**File: `/src/game/systems/notifications.ts`** (new)

```typescript
import type { GameState } from "../types";
import { toast } from "react-toastify";

interface Milestone {
  id: string;
  biomassThreshold?: number;
  checkCondition?: (state: GameState) => boolean;
  message: string;
}

// Simple milestone definitions
const MILESTONES: Milestone[] = [
  {
    id: "ant-size",
    biomassThreshold: 1000,
    message: "You're now the size of an ant! 🐜",
  },
  {
    id: "mouse-size",
    biomassThreshold: 100000,
    message: "You've reached mouse proportions! 🐭",
  },
  {
    id: "human-size",
    biomassThreshold: 10000000,
    message: "You're now human-sized! 🧑",
  },
  {
    id: "car-size",
    biomassThreshold: 500000000,
    message: "You're as big as a car! 🚗",
  },
  {
    id: "house-size",
    biomassThreshold: 25000000000,
    message: "You're house-sized now! 🏠",
  },
  {
    id: "eiffel-tower-size",
    biomassThreshold: 1000000000000,
    message: "You're as tall as the Eiffel Tower! 🗼",
  },
  {
    id: "first-generator",
    checkCondition: (state) =>
      Object.values(state.generators).some((g) => g.level > 0),
    message: "Your first generator! Watch your biomass grow automatically. 🔬",
  },
  {
    id: "first-upgrade",
    checkCondition: (state) =>
      Object.values(state.upgrades).some((u) => u.purchased),
    message: "Upgrades boost your existing generators. Smart investment! ⚡",
  },
  {
    id: "clicker-master",
    checkCondition: (state) => state.notifications.totalClicks >= 100,
    message: "Clicker Master! Your dedication is admirable. 👆",
  },
];

export function checkAndShowNotifications(state: GameState): GameState {
  let newShownMilestones = new Set(state.notifications.shownMilestones);

  MILESTONES.forEach((milestone) => {
    if (newShownMilestones.has(milestone.id)) return;

    let shouldShow = false;
    if (milestone.biomassThreshold) {
      shouldShow = state.biomass >= milestone.biomassThreshold;
    } else if (milestone.checkCondition) {
      shouldShow = milestone.checkCondition(state);
    }

    if (shouldShow) {
      toast(milestone.message, {
        position: "bottom-center",
        autoClose: 10000,
        className: "blob-toast",
      });
      newShownMilestones.add(milestone.id);
    }
  });

  return {
    ...state,
    notifications: {
      ...state.notifications,
      shownMilestones: newShownMilestones,
    },
  };
}

export function incrementClickCount(state: GameState): GameState {
  return {
    ...state,
    notifications: {
      ...state.notifications,
      totalClicks: state.notifications.totalClicks + 1,
    },
  };
}
```

**File: `/src/game/systems/actions.ts`**
Update existing functions:

```typescript
import {
  checkAndShowNotifications,
  incrementClickCount,
} from "./notifications";

export function tick(state: GameState): GameState {
  // ... existing logic
  return checkAndShowNotifications(updatedState);
}

export function manualClick(state: GameState): GameState {
  // ... existing logic
  return checkAndShowNotifications(incrementClickCount(updatedState));
}

export function buyGenerator(state: GameState, generatorId: string): GameState {
  // ... existing logic
  return checkAndShowNotifications(updatedState);
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
  // ... existing logic
  return checkAndShowNotifications(updatedState);
}
```

**File: `/src/game/systems/initialization.ts`**
Update initial state:

```typescript
export const INITIAL_STATE: GameState = {
  // ... existing state
  notifications: {
    shownMilestones: new Set<string>(),
    totalClicks: 0,
  },
};
```

### UI Layer (Presentation)

**File: `/src/App.tsx`**
Add ToastContainer:

```typescript
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* ... existing content */}

      <ToastContainer
        position="bottom-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="blob-toast"
      />
    </div>
  );
}
```

**File: `/src/styles/globals.css`**
Add custom toast styling:

```css
.blob-toast {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  color: #f1f5f9;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.blob-toast .Toastify__toast-body {
  padding: 16px;
  font-size: 16px;
  line-height: 1.5;
}

.blob-toast .Toastify__progress-bar {
  background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
  height: 4px;
}
```

## Implementation Steps

1. **Install react-toastify**: `npm install react-toastify`
2. **Add notification types** to GameState
3. **Create `/src/game/systems/notifications.ts`** with milestone logic
4. **Update game actions** to check notifications
5. **Add ToastContainer** to App.tsx
6. **Add custom styles** to globals.css

## File Changes

**New Files:**

- `/src/game/systems/notifications.ts`

**Modified Files:**

- `/src/game/types/core.ts` - Add notification state
- `/src/game/systems/actions.ts` - Integrate notification checks
- `/src/game/systems/initialization.ts` - Initialize notification state
- `/src/App.tsx` - Add ToastContainer
- `/src/styles/globals.css` - Add toast styles

## Testing

- Verify notifications show at correct biomass thresholds
- Test first purchase notifications
- Confirm persistence (notifications don't repeat)
- Check performance impact (should be minimal)

This follows your existing architecture perfectly: game logic stays in `/game`, UI stays in `/components`, and the hook bridge pattern is maintained.
