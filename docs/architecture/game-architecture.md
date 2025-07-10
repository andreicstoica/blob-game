# Blob Game Architecture Guide

A reference for the architecture of blob game, why it's structured this way, and how to add new features while maintaining a clean separation between the game engine (logic) and the frontend (UI).

## File Structure & Architecture

Separation of concerns is important! **Game engine** contains all the logic and state management, acting as the engine and single source of truth. **UI components** only handle presentation, rendering the states and game components in a way that makes it a fun, playable game!

This is like separating the "brain" (engine) from the "face" (UI) of our game. Our noses/ears/mouth don't actually do the smelling/hearing/tasting - they send signals back to the brain where it is processed there with "logic" and "calculations".

```
src/
├── App.tsx                 # 🎯 Main App Router (should be simple and "dumb"!)
├── game/                   # 🧠 Game Engine (The Brain)
│   ├── types/                  # Type/interface definitions
│   │   ├── core.ts                 # Core game state types
│   │   ├── progression.ts          # Levels, progression, economy types
│   │   ├── ui.ts                   # UI component types
│   │   └── index.ts                # Re-exports all types from a single location
│   ├── systems/                # Game logic systems
│   │   ├── actions.ts              # Game actions (tick, buy, evolve)
│   │   ├── calculations.ts         # Math and calculations
│   │   ├── initialization.ts       # Game setup
│   │   ├── mapState.ts             # Map and level management
│   │   ├── nutrients.ts            # Food/nutrient logic
│   │   ├── scaleLevels.ts          # Evolution scaling
│   │   └── generatorValue.ts       # Shop value calculations
│   └── content/                # Game data
│       ├── config.ts               # Game configuration
│       ├── generators.ts           # Generator definitions
│       ├── upgrades.ts             # Upgrade definitions
│       └── levels.ts               # Level definitions
├── components/             # 🎨 UI Components (The Face)
│   ├── animations/             # Visual effects
│   ├── blob/                   # Blob component
│   ├── food/                   # Food/nutrient display
│   ├── hud/                    # Heads-up display
│   │   ├── Evolution/              # Evolution panel
│   │   ├── Shop/                   # Shop interface
│   │   └── GameStats.tsx           # Game statistics
│   └── map/                    # Map display
└── hooks/                  # 🔗 React hooks (The Bridge)
    ├── useGame.ts              # Main game hook
    ├── useCameraZoom.ts        # Camera logic
    └── useBlobSize.ts          # Blob sizing
```

## Architecture Diagrams

### 1. High-Level Architecture

```mermaid
graph TB
    subgraph "🎨 Frontend (UI)"
        App[App.tsx - Router]
        Components[React Components]
        Hooks[React Hooks]
    end

    subgraph "🧠 Game Engine"
        Types[Type Definitions]
        Systems[Game Systems]
        Content[Game Content]
    end

    subgraph "📊 State Management"
        GameState[Game State]
        MapState[Map State]
    end

    App --> Components
    Components --> Hooks
    Hooks --> GameState
    GameState --> Systems
    Systems --> Content
    Systems --> Types
    MapState --> Systems
```

### 2. Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as UI Component
    participant Hook as React Hook
    participant Engine as Game Engine
    participant State as Game State

    User->>UI: Clicks blob
    UI->>Hook: handleBlobClick()
    Hook->>Engine: manualClick(gameState)
    Engine->>State: Update biomass
    State-->>Engine: New state
    Engine-->>Hook: Updated state
    Hook-->>UI: Re-render with new data
    UI-->>User: Visual feedback
```

### 3. UI Component Breakdown

```mermaid
graph TB
    subgraph "🎯 App.tsx Router"
        App[App.tsx]
        App --> GameContainer[GameContainer]
    end

    subgraph "🎮 Game Container"
        GameContainer --> Blob[Blob]
        GameContainer --> HUD[GameHUD]
        GameContainer --> Map[Map]
        GameContainer --> Particles[ParticleSystem]
        GameContainer --> Nutrients[Nutrients]
    end

    subgraph "🎮 GameHUD Components"
        HUD --> Stats[GameStats]
        HUD --> Shop[Shop]
        HUD --> Evolution[EvolutionPanel]

        subgraph "🏪 Shop"
            Shop --> Generators[Generators]
            Shop --> Upgrades[Upgrades]
        end

        subgraph "🔄 Evolution"
            Evolution --> CurrentLevel[CurrentLevel]
            Evolution --> NextEvolution[NextEvolution]
            Evolution --> EvolutionButton[EvolutionButton]
        end
    end

    subgraph "🧠 Game Engine"
        GameHook[useGame Hook]
        GameState[Game State]
        Actions[Game Actions]
    end

    Blob --> GameHook
    HUD --> GameHook
    GameHook --> GameState
    GameHook --> Actions
```

### 4. Type System Architecture

```mermaid
graph TB
    subgraph "📋 Core Types"
        GameState[GameState]
        MapState[MapState]
        Generator[Generator]
        Upgrade[Upgrade]
        Level[Level]
    end

    subgraph "🎮 Entity Types"
        BlobType[Blob]
        NutrientType[Nutrient]
        ParticleType[Particle]
    end

    subgraph "📊 UI Types"
        ComponentProps[Component Props]
        AnimationProps[Animation Props]
        HUDProps[HUD Props]
    end

    subgraph "🔄 Progression Types"
        EvolutionState[Evolution State]
        ShopState[Shop State]
        LevelProgress[Level Progress]
    end

    GameState --> Generator
    GameState --> Upgrade
    GameState --> Level
    GameState --> BlobType
    GameState --> NutrientType

    MapState --> Level
    MapState --> LevelProgress

    ComponentProps --> GameState
    ComponentProps --> MapState
    AnimationProps --> ParticleType
    HUDProps --> EvolutionState
    HUDProps --> ShopState
```

### 5. Game Engine Systems

```mermaid
graph TB
    subgraph "🎮 Game Actions"
        Actions[actions.ts]
        Actions --> Tick[tick]
        Actions --> Buy[buyGenerator]
        Actions --> Evolve[evolve]
        Actions --> Click[manualClick]
    end

    subgraph "🧮 Calculations"
        Calc[calculations.ts]
        Calc --> Biomass[calculateBiomass]
        Calc --> Production[calculateProduction]
        Calc --> Costs[calculateCosts]
        Calc --> Scaling[calculateScaling]
    end

    subgraph "🗺️ Map & Progression"
        Map[mapState.ts]
        Map --> LevelChange[changeLevel]
        Map --> MapUpdate[updateMap]

        Scale[scaleLevels.ts]
        Scale --> EvolutionScale[scaleEvolution]
        Scale --> LevelScale[scaleLevel]
    end

    subgraph "🍎 Game Features"
        Nutrients[nutrients.ts]
        Nutrients --> SpawnFood[spawnNutrients]
        Nutrients --> ConsumeFood[consumeNutrients]

        Value[generatorValue.ts]
        Value --> ShopValue[calculateShopValue]
        Value --> UpgradeValue[calculateUpgradeValue]
    end

    subgraph "⚙️ Setup & State"
        Init[initialization.ts]
        Init --> GameInit[initializeGame]
        Init --> StateInit[initializeState]

        GameState[Game State]
        MapState[Map State]
    end

    Actions --> GameState
    Calc --> GameState
    Map --> MapState
    Scale --> GameState
    Nutrients --> GameState
    Value --> GameState
    Init --> GameState
    Init --> MapState
```

## Key Principles

### 1. App.tsx Should Be Dumb

**Ideal State**: App.tsx should be a simple router that:

- Renders the main game container
- Handles basic layout
- Delegates all logic, calculations, and state management to the game engine

**Why This Matters**:

- Makes testing easier (test logic separately from UI)
- Allows UI changes without fundamentally changing/reinventing game logic
- Creates a single source of truth
- Makes the codebase more maintainable and scalable

### 2. Logic Belongs in the Game Engine

**Ideal State**: All game logic should be in the `game/systems/` folder

- Calculations in `calculations.ts`
- Actions in `actions.ts`
- State management in appropriate system files
- Game data and configuration in `game/content/` (generators, upgrades, levels, config)

**Why This Matters**:

- Logic can be tested independently
- Logic can be reused across different UI components
- Easier to debug and maintain
- Clear separation of concerns

### 3. Types Drive Everything

All game state, props, and data structures are defined in `game/types/`. This ensures:

- Type safety across the entire application
- Clear contracts between components
- Better IDE support and error catching
- Self-documenting code

## Adding New Features

### Step 1: Define Types

Add new types to the appropriate file in `game/types/`:

- Core game state → `core.ts`
- UI components → `ui.ts`
- Progression → `progression.ts`

### Step 2: Add Game Logic

Create or update files in `game/systems/`:

- New actions → `actions.ts`
- Calculations → `calculations.ts`
- State management → appropriate system file

### Step 3: Add Content

If your feature needs configuration data, add it to `game/content/`:

- Game config → `config.ts`
- Items/upgrades → `generators.ts` or `upgrades.ts`
- Levels → `levels.ts`

### Step 4: Create UI Components

Build React components in `components/` that:

- Import types from `game/types`
- Use hooks to access game state
- Don't contain business logic

### Step 5: Connect Everything

Use React hooks to bridge the UI and game engine:

- Main game logic → `useGame.ts`
- Camera logic → `useCameraZoom.ts`
- Blob sizing → `useBlobSize.ts`
- Specialized logic → create new hooks in `hooks/`

## Common Mistakes to Avoid

### ❌ Don't Put Logic in Components

```typescript
// BAD: Logic in component
const MyComponent = () => {
  const calculateSomething = (data) => {
    // Complex calculation here
  };
  return <div>{calculateSomething(data)}</div>;
};
```

### ✅ Put Logic in the Engine

```typescript
// GOOD: Logic in engine
// game/systems/calculations.ts
export const calculateSomething = (data) => {
  // Complex calculation here
};

// Component just uses the logic
const MyComponent = () => {
  const result = calculateSomething(data);
  return <div>{result}</div>;
};
```

### ❌ Don't Make App.tsx Complex

```typescript
// BAD: App.tsx with calculations
const App = () => {
  const complexCalculation = () => {
    /* ... */
  };
  const positioningLogic = () => {
    /* ... */
  };
  return <div>{/* complex JSX */}</div>;
};
```

### ✅ Keep App.tsx Simple

```typescript
// GOOD: App.tsx as router
const App = () => {
  return (
    <div className="game-container">
      <GameContainer />
    </div>
  );
};
```

## Testing Strategy

### Engine Testing

Test game logic independently:

```typescript
// Test game actions
describe("buyGenerator", () => {
  it("should increase generator level", () => {
    const state = {
      /* test state */
    };
    const result = buyGenerator(state, "generator-id");
    expect(result.generators["generator-id"].level).toBe(1);
  });
});
```

### Component Testing

Test UI components with mocked game state:

```typescript
// Test component rendering
describe("GameHUD", () => {
  it("should display biomass", () => {
    const mockGameState = { biomass: 100 };
    render(<GameHUD gameState={mockGameState} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
```

## Conclusion

This architecture provides a solid foundation for a maintainable, scalable game. By keeping logic in the engine and UI in components, we can:

- Test game logic independently
- Reuse logic across different UI contexts
- Make changes without breaking other parts
- Onboard new team members more easily
- Add features more confidently

Remember: **The game engine is the brain, the UI is the face. Keep them separate, and everything will work better.**
