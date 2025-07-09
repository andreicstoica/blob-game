# Blob Game Architecture Diagrams

LAST UPDATED: JULY 8th

## Class Diagram

```mermaid
classDiagram
    %% Core Game Engine
    class GameState {
        +blobs: BlobState[]
        +biomass: number
        +growth: number
        +clickPower: number
        +generators: Record~string, GeneratorState~
        +upgrades: Record~string, UpgradeState~
        +nutrients: NutrientState[]
        +currentLevelId: number
        +highestLevelReached: number
    }

    class BlobState {
        +size: number
    }

    class NutrientState {
        +id: string
        +x: number
        +y: number
        +consumed: boolean
    }

    class GeneratorState {
        +id: string
        +name: string
        +baseCost: number
        +description: string
        +baseEffect: number
        +level: number
        +costMultiplier: number
        +unlockedAtLevel: string
    }

    class UpgradeState {
        +id: string
        +name: string
        +cost: number
        +description: string
        +effect: number
        +type: 'growth' | 'split' | 'click' | 'blob'
        +purchased: boolean
        +unlockedAtLevel: string
    }

    class Level {
        +id: number
        +name: string
        +displayName: string
        +biomassThreshold: number
        +biomassDisplayFormat: 'standard' | 'scientific' | 'decimal' | 'whole'
        +background: string
        +foodTypes: string[]
        +description: string
    }

    class Cell {
        +x: number
        +y: number
        +status: CellStatus
    }

    class MapState {
        +currentLevel: Level
        +size: number
        +cells: Cell[]
        +get(x, y): CellStatus
        +set(x, y, status): void
        +setLevel(level): void
        +evolveToNextLevel(biomass): void
    }

    %% React Components
    class GameHUD {
        +biomass: number
        +gameState: GameState
        +onBuyGenerator(generatorId): void
        +onBuyUpgrade(upgradeId): void
        +onEvolve(): void
        +blobSize: number
    }

    class Shop {
        +biomass: number
        +gameState: GameState
        +onBuyGenerator(generatorId): void
        +onBuyUpgrade(upgradeId): void
        -generatorFilter: 'current' | 'all'
    }

    class GrowthStats {
        +biomass: number
        +gameState: GameState
    }

    class EvolutionPanel {
        +biomass: number
        +gameState: GameState
        +onEvolve(): void
    }

    class Blob {
        +id: string
        +position: {x, y}
        +size: number
        +biomass: number
        +onBlobClick(): void
        +onBlobPress(): void
        +onBlobRelease(): void
        +color: string
        +strokeColor: string
        +glowColor: string
        +isDisabled: boolean
        +isActive: boolean
        +clickPower: number
    }

    class Map {
        +className: string
    }

    class AnimationLayer {
        -floatingNumbers: FloatingNumberAnimation[]
        -particles: ParticleData[]
        +addFloatingNumber(position, value, color): void
        +addParticleBurst(position, count, colors): void
    }

    %% Hooks
    class useGame {
        +gameState: GameState
        +buyGenerator(generatorId): void
        +buyUpgrade(upgradeId): void
        +manualClick(): void
        +evolve(): void
    }

    class useBlobSize {
        +calculateBlobSize(biomass): number
    }

    class useCameraZoom {
        +calculateZoom(biomass): number
    }

    %% Relationships
    GameState ||--o{ BlobState : contains
    GameState ||--o{ NutrientState : contains
    GameState ||--o{ GeneratorState : contains
    GameState ||--o{ UpgradeState : contains
    GameState ||--|| Level : current
    MapState ||--o{ Cell : contains
    MapState ||--|| Level : current

    GameHUD ||--|| Shop : contains
    GameHUD ||--|| GrowthStats : contains
    GameHUD ||--|| EvolutionPanel : contains
    GameHUD ||--|| ScaleIndicator : contains

    useGame ||--|| GameState : manages
    useBlobSize ||--|| GameState : reads
    useCameraZoom ||--|| GameState : reads

    Map ||--o{ Blob : renders
    AnimationLayer ||--o{ FloatingNumber : manages
    AnimationLayer ||--o{ Particle : manages
```

## Sequence Diagrams

### User Flow: Manual Click and Growth

```mermaid
sequenceDiagram
    participant User
    participant Blob
    participant GameHUD
    participant useGame
    participant GameState
    participant AnimationLayer
    participant GrowthStats

    User->>Blob: Click on blob
    Blob->>GameHUD: onBlobClick()
    GameHUD->>useGame: manualClick()
    useGame->>GameState: Update biomass += clickPower
    useGame->>AnimationLayer: addFloatingNumber()
    AnimationLayer->>FloatingNumber: Create floating number animation
    useGame->>GrowthStats: Update biomass display
    GrowthStats->>User: Show updated biomass
```

### User Flow: Purchase Generator

```mermaid
sequenceDiagram
    participant User
    participant Shop
    participant GameHUD
    participant useGame
    participant GameState
    participant GeneratorState
    participant GrowthStats

    User->>Shop: Click generator
    Shop->>GameHUD: onBuyGenerator(generatorId)
    GameHUD->>useGame: buyGenerator(generatorId)
    useGame->>GameState: Check if can afford
    alt Can afford
        useGame->>GameState: Deduct biomass
        useGame->>GeneratorState: Increment level
        useGame->>GameState: Recalculate growth
        useGame->>GrowthStats: Update growth display
        GrowthStats->>User: Show updated growth rate
    else Cannot afford
        useGame->>Shop: No change (return same state)
    end
```

### User Flow: Level Evolution

```mermaid
sequenceDiagram
    participant GameState
    participant Level
    participant MapState
    participant Map
    participant EvolutionPanel
    participant User

    GameState->>Level: Check biomass threshold
    alt Biomass >= next level threshold
        GameState->>Level: Get next level
        GameState->>MapState: evolveToNextLevel()
        MapState->>Map: Update current level
        Map->>User: Show new level background
        EvolutionPanel->>User: Show evolution available
        User->>EvolutionPanel: Click evolve
        EvolutionPanel->>GameState: Trigger evolution
        GameState->>MapState: Set new level
        MapState->>Map: Update level display
    end
```

### User Flow: Nutrient Consumption

```mermaid
sequenceDiagram
    participant User
    participant Blob
    participant GameHUD
    participant useGame
    participant GameState
    participant NutrientState
    participant MapState

    User->>Blob: Click near nutrient
    Blob->>GameHUD: onBlobClick(position)
    GameHUD->>useGame: consumeNutrient(nutrientId)
    useGame->>GameState: Find nearby nutrients
    useGame->>NutrientState: Mark as consumed
    useGame->>GameState: Add biomass
    useGame->>MapState: Update cell status
    MapState->>User: Remove nutrient from map
```

## State Diagrams

### Game Level Progression

```mermaid
stateDiagram-v2
    [*] --> Intro
    Intro --> Microscopic : biomass >= 1
    Microscopic --> PetriDish : biomass >= 2500
    PetriDish --> Lab : biomass >= 2,250,000
    Lab --> City : biomass >= 800,000,000
    City --> Earth : biomass >= 300,000,000,000
    Earth --> SolarSystem : biomass >= 100,000,000,000,000
    SolarSystem --> [*] : Max level reached

    state Intro {
        [*] --> BasicGenerator
        BasicGenerator --> ClickPowerUpgrade
    }

    state Microscopic {
        [*] --> MicroscopicCloner
        MicroscopicCloner --> CellDivider
        CellDivider --> NucleusReplicator
    }

    state PetriDish {
        [*] --> ColonyExpander
        ColonyExpander --> SporeLauncher
        SporeLauncher --> ContaminantConverter
    }

    state Lab {
        [*] --> CentrifugeSorter
        CentrifugeSorter --> BioreactorTank
        BioreactorTank --> AutoclaveRecycler
    }

    state City {
        [*] --> HumanoidSlimes
        HumanoidSlimes --> SewerColonies
        SewerColonies --> SubwaySpreaders
    }

    state Earth {
        [*] --> CargoShipInfestors
        CargoShipInfestors --> AirplaneSporeUnits
        AirplaneSporeUnits --> ForestHiveColonies
    }

    state SolarSystem {
        [*] --> TerraformingOoze
        TerraformingOoze --> AsteroidSeeder
        AsteroidSeeder --> StarshipIncubator
    }
```

### Generator Purchase State

```mermaid
stateDiagram-v2
    [*] --> Available
    Available --> CanAfford : biomass >= cost
    Available --> CannotAfford : biomass < cost
    CanAfford --> Purchasing : user clicks
    CannotAfford --> Available : biomass increases
    Purchasing --> Purchased : successful purchase
    Purchasing --> CanAfford : insufficient biomass
    Purchased --> Available : new generator level
```

### Upgrade Purchase State

```mermaid
stateDiagram-v2
    [*] --> Unlocked
    Unlocked --> Available : level requirement met
    Unlocked --> Locked : level requirement not met
    Available --> CanAfford : biomass >= cost
    Available --> CannotAfford : biomass < cost
    CanAfford --> Purchasing : user clicks
    CannotAfford --> Available : biomass increases
    Purchasing --> Purchased : successful purchase
    Purchasing --> CanAfford : insufficient biomass
    Purchased --> [*] : upgrade applied
```

### Blob Animation State

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Breathing : animation loop
    Breathing --> Idle : animation cycle
    Idle --> Clicked : user interaction
    Clicked --> Shrinking : click animation
    Shrinking --> Bouncing : bounce back
    Bouncing --> Idle : animation complete
    Clicked --> Heating : rapid clicks
    Heating --> Cooling : click frequency drops
    Cooling --> Idle : heat dissipates
```

### Game Session State

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> MainMenu : assets loaded
    MainMenu --> Playing : start game
    Playing --> Paused : user pauses
    Paused --> Playing : user resumes
    Playing --> GameOver : lose condition
    Playing --> Victory : win condition
    GameOver --> MainMenu : restart
    Victory --> MainMenu : new game
    MainMenu --> [*] : exit game
```

## Component Architecture

```mermaid
graph TB
    subgraph "React App"
        App[App.tsx]
        App --> GameHUD
        App --> Map
        App --> AnimationLayer
    end

    subgraph "Game Engine"
        GameState[GameState]
        MapState[MapState]
        useGame[useGame Hook]
        useBlobSize[useBlobSize Hook]
        useCameraZoom[useCameraZoom Hook]
    end

    subgraph "UI Components"
        GameHUD --> Shop
        GameHUD --> GrowthStats
        GameHUD --> EvolutionPanel
        GameHUD --> ScaleIndicator
    end

    subgraph "Game Objects"
        Map --> Blob
        Map --> Nutrients
        Map --> LevelBackgrounds
    end

    subgraph "Animations"
        AnimationLayer --> FloatingNumber
        AnimationLayer --> ParticleSystem
        ParticleSystem --> Particle
    end

    subgraph "Data Layer"
        GameState --> Generators
        GameState --> Upgrades
        GameState --> Levels
        MapState --> Cells
    end

    %% Connections
    useGame --> GameState
    useBlobSize --> GameState
    useCameraZoom --> GameState
    GameHUD --> useGame
    Map --> MapState
    Blob --> useBlobSize
    Map --> useCameraZoom
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph "User Input"
        Click[Blob Click]
        Purchase[Generator/Upgrade Purchase]
        Evolution[Level Evolution]
    end

    subgraph "Game Logic"
        GameEngine[Game Engine]
        StateManager[State Management]
        Calculations[Growth Calculations]
    end

    subgraph "UI Updates"
        HUD[HUD Components]
        Animations[Visual Effects]
        Map[Map Rendering]
    end

    subgraph "Data Storage"
        GameState[Game State]
        Config[Game Configuration]
        Levels[Level Definitions]
    end

    Click --> GameEngine
    Purchase --> GameEngine
    Evolution --> GameEngine

    GameEngine --> StateManager
    StateManager --> Calculations

    Calculations --> HUD
    Calculations --> Animations
    Calculations --> Map

    StateManager --> GameState
    GameEngine --> Config
    GameEngine --> Levels

    GameState --> HUD
    Config --> HUD
    Levels --> Map
```

This comprehensive architecture documentation shows the relationships between all major components, user flows, state transitions, and data flow patterns in the blob game.
