# Blob Game Architecture Diagrams

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

    class GameStats {
        +biomass: number
        +gameState: GameState
    }

    class EvolutionPanel {
        +biomass: number
        +gameState: GameState
        +onEvolve(): void
    }

    class EvolutionScale {
        +biomass: number
        +blobSize: number
        +scale: ScaleLevel
        +zoom: number
    }

    class CurrentLevel {
        +displayName: string
        +name: string
        +description: string
    }

    class NextEvolution {
        +nextLevel: Level
        +canEvolve: boolean
        +biomass: number
        +gameState: GameState
    }

    class EvolutionButton {
        +canEvolve: boolean
        +hasNextLevel: boolean
        +onEvolve(): void
    }

    class Generators {
        +biomass: number
        +gameState: GameState
        +onBuyGenerator(generatorId): void
        +generatorFilter: 'current' | 'all'
        +currentLevel: Level
    }

    class Upgrades {
        +biomass: number
        +gameState: GameState
        +onBuyUpgrade(upgradeId): void
        +generatorFilter: 'current' | 'all'
        +currentLevel: Level
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

    class ScaleLevel {
        +name: string
        +description: string
        +unit: string
        +color: string
        +icon: string
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
        +smoothZoomAnimation(): void
        +handleLevelReset(): void
    }

    class useMapSelector {
        +selectMapState(): MapState
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
    GameHUD ||--|| GameStats : contains
    GameHUD ||--|| EvolutionPanel : contains

    Shop ||--|| Generators : contains
    Shop ||--|| Upgrades : contains

    EvolutionPanel ||--|| EvolutionScale : contains
    EvolutionPanel ||--|| CurrentLevel : contains
    EvolutionPanel ||--|| NextEvolution : contains
    EvolutionPanel ||--|| EvolutionButton : contains

    useGame ||--|| GameState : manages
    useBlobSize ||--|| GameState : reads
    useCameraZoom ||--|| GameState : reads
    useMapSelector ||--|| MapState : reads

    Map ||--o{ Blob : renders
    AnimationLayer ||--o{ FloatingNumber : manages
    AnimationLayer ||--o{ Particle : manages

    ScaleLevel ||--|| EvolutionScale : used by
```

## Sequence Diagrams

### User Flow: Manual Click and Growth

```mermaid
sequenceDiagram
    participant User
    participant Blob
    participant App
    participant useGame
    participant GameState
    participant AnimationLayer
    participant GameStats

    User->>Blob: Click on blob
    Blob->>App: onBlobClick()
    App->>useGame: manualClick()
    useGame->>GameState: Update biomass += clickPower
    useGame->>AnimationLayer: addFloatingNumber()
    AnimationLayer->>FloatingNumber: Create floating number animation
    useGame->>GameStats: Update biomass display
    GameStats->>User: Show updated biomass
```

### User Flow: Purchase Generator

```mermaid
sequenceDiagram
    participant User
    participant Generators
    participant Shop
    participant GameHUD
    participant useGame
    participant GameState
    participant GeneratorState
    participant GameStats

    User->>Generators: Click generator
    Generators->>Shop: onBuyGenerator(generatorId)
    Shop->>GameHUD: onBuyGenerator(generatorId)
    GameHUD->>useGame: buyGenerator(generatorId)
    useGame->>GameState: Check if can afford
    alt Can afford
        useGame->>GameState: Deduct biomass
        useGame->>GeneratorState: Increment level
        useGame->>GameState: Recalculate growth
        useGame->>GameStats: Update growth display
        GameStats->>User: Show updated growth rate
    else Cannot afford
        useGame->>Generators: No change (return same state)
    end
```

### User Flow: Level Evolution

```mermaid
sequenceDiagram
    participant User
    participant EvolutionButton
    participant EvolutionPanel
    participant GameHUD
    participant useGame
    participant GameState
    participant MapState
    participant useCameraZoom
    participant Map

    User->>EvolutionButton: Click evolve
    EvolutionButton->>EvolutionPanel: onEvolve()
    EvolutionPanel->>GameHUD: onEvolve()
    GameHUD->>useGame: evolve()
    useGame->>GameState: Check evolution conditions
    alt Can evolve
        useGame->>GameState: Update currentLevelId
        useGame->>MapState: evolveToNextLevel()
        useGame->>useCameraZoom: Reset zoom to 1.0
        useCameraZoom->>Map: Apply zoom reset
        MapState->>Map: Update current level
        Map->>User: Show new level background
        EvolutionPanel->>User: Show evolution complete
    else Cannot evolve
        useGame->>EvolutionPanel: No change
    end
```

### User Flow: Camera Zoom with Blob Growth

```mermaid
sequenceDiagram
    participant GameState
    participant useCameraZoom
    participant useBlobSize
    participant App
    participant Map
    participant Blob

    GameState->>useCameraZoom: biomass changes
    useCameraZoom->>useBlobSize: getEngineBlobSize()
    useBlobSize->>useCameraZoom: return blob size (50-400px)
    useCameraZoom->>useCameraZoom: calculate target zoom
    useCameraZoom->>useCameraZoom: smooth animation
    useCameraZoom->>App: return currentSmoothZoom
    App->>Map: apply transform scale
    Map->>Blob: render with new zoom level
```

### User Flow: Nutrient Consumption

```mermaid
sequenceDiagram
    participant User
    participant Blob
    participant App
    participant useGame
    participant GameState
    participant NutrientState
    participant MapState

    User->>Blob: Click near nutrient
    Blob->>App: onBlobClick(position)
    App->>useGame: consumeNutrient(nutrientId)
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

### Camera Zoom State

```mermaid
stateDiagram-v2
    [*] --> LevelStart
    LevelStart --> Growing : biomass increases
    Growing --> NearlyFull : progress >= 0.8
    NearlyFull --> ReadyToEvolve : progress >= 1.0
    ReadyToEvolve --> LevelStart : evolution triggered
    Growing --> Growing : biomass continues
    NearlyFull --> Growing : biomass decreases
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
        App --> Nutrients
    end

    subgraph "Game Engine"
        GameState[GameState]
        MapState[MapState]
        useGame[useGame Hook]
        useBlobSize[useBlobSize Hook]
        useCameraZoom[useCameraZoom Hook]
        useMapSelector[useMapSelector Hook]
    end

    subgraph "HUD Components"
        GameHUD --> Shop
        GameHUD --> GameStats
        GameHUD --> EvolutionPanel

        Shop --> Generators
        Shop --> Upgrades

        EvolutionPanel --> EvolutionScale
        EvolutionPanel --> CurrentLevel
        EvolutionPanel --> NextEvolution
        EvolutionPanel --> EvolutionButton
    end

    subgraph "Game Objects"
        Map --> Blob
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
        ScaleLevel[ScaleLevel]
    end

    %% Connections
    useGame --> GameState
    useBlobSize --> GameState
    useCameraZoom --> GameState
    useMapSelector --> MapState
    GameHUD --> useGame
    Map --> MapState
    Blob --> useBlobSize
    Map --> useCameraZoom
    EvolutionScale --> ScaleLevel
```

## HUD Layout Architecture

```mermaid
graph TB
    subgraph "Screen Layout"
        Screen[1920x1080 Screen]

        subgraph "Left HUD - Shop"
            Shop[350px width]
            Shop --> Generators
            Shop --> Upgrades
        end

        subgraph "Right HUD - Evolution"
            Evolution[300px width]
            Evolution --> EvolutionScale
            Evolution --> CurrentLevel
            Evolution --> NextEvolution
            Evolution --> EvolutionButton
        end

        subgraph "Top HUD - Game Stats"
            GameStats[Centered, 600px from sides]
            GameStats --> BiomassDisplay
            GameStats --> GrowthRate
            GameStats --> ClickPower
        end

        subgraph "Playable Area"
            PlayArea[Available space for blob]
            PlayArea --> Blob
            PlayArea --> Map
        end
    end

    Screen --> Shop
    Screen --> Evolution
    Screen --> GameStats
    Screen --> PlayArea
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
        CameraSystem[Camera Zoom System]
    end

    subgraph "UI Updates"
        HUD[HUD Components]
        Animations[Visual Effects]
        Map[Map Rendering]
        Blob[Blob Rendering]
    end

    subgraph "Data Storage"
        GameState[Game State]
        Config[Game Configuration]
        Levels[Level Definitions]
        MapState[Map State]
    end

    Click --> GameEngine
    Purchase --> GameEngine
    Evolution --> GameEngine

    GameEngine --> StateManager
    StateManager --> Calculations
    Calculations --> CameraSystem

    Calculations --> HUD
    Calculations --> Animations
    Calculations --> Map
    CameraSystem --> Blob

    StateManager --> GameState
    StateManager --> MapState
    GameEngine --> Config
    GameEngine --> Levels

    GameState --> HUD
    MapState --> Map
    Config --> HUD
    Levels --> Map
```

## Camera Zoom System Architecture

```mermaid
graph TB
    subgraph "Camera Zoom System"
        useCameraZoom[useCameraZoom Hook]

        subgraph "Zoom Calculation"
            BlobSize[Engine Blob Size]
            ScreenBounds[Screen Boundaries]
            HUDBounds[HUD Boundaries]
            LevelProgress[Level Progress]
        end

        subgraph "Zoom Animation"
            TargetZoom[Target Zoom]
            SmoothZoom[Smooth Animation]
            LevelReset[Level Reset]
        end

        subgraph "Constraints"
            MinZoom[Minimum Zoom 0.02]
            MaxZoom[Maximum Zoom]
            PlayableArea[Playable Area Bounds]
        end
    end

    useCameraZoom --> BlobSize
    useCameraZoom --> ScreenBounds
    useCameraZoom --> HUDBounds
    useCameraZoom --> LevelProgress

    BlobSize --> TargetZoom
    ScreenBounds --> MaxZoom
    HUDBounds --> PlayableArea
    LevelProgress --> TargetZoom

    TargetZoom --> SmoothZoom
    SmoothZoom --> MinZoom
    SmoothZoom --> MaxZoom
    LevelReset --> SmoothZoom
```

This comprehensive architecture documentation shows the relationships between all major components, user flows, state transitions, and data flow patterns in the blob game, including the updated HUD structure and camera zoom system.
