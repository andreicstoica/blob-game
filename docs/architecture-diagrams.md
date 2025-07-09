# Architecture Diagrams

## State Management Flow

```mermaid
flowchart TD
    subgraph "React State (useGame Hook)"
        GS[GameState]
        GS --> B[biomass: number]
        GS --> G[growth: number]
        GS --> CP[clickPower: number]
        GS --> GEN[generators: Record<string, GeneratorState>]
        GS --> UP[upgrades: Record<string, UpgradeState>]
        GS --> N[nutrients: NutrientState[]]
        GS --> CL[currentLevelId: number]
        GS --> HL[highestLevelReached: number]
    end

    subgraph "Zustand State (useMap Hook)"
        MS[MapState]
        MS --> ML[currentLevel: Level]
        MS --> MC[cells: Cell[]]
        MS --> MSIZE[size: number]
        MS --> MGET[get: function]
        MS --> MSET[set: function]
        MS --> MSL[setLevel: function]
        MS --> MEL[evolveToNextLevel: function]
    end

    subgraph "State Management Problems"
        subgraph "Dual State Management"
            US[useGame Hook]
            UM[useMap Hook]

            US --> GS
            UM --> MS

            %% Problem: Tight coupling
            US -.->|"mapEvolveToNextLevel()"| UM
            US -.->|"evolveToNextLevel()"| UM
        end

        subgraph "State Synchronization Issues"
            SYNC1["Level info in GameState.currentLevelId"]
            SYNC2["Level info in MapState.currentLevel"]
            SYNC1 -.->|"Can get out of sync"| SYNC2

            SYNC3["Biomass in GameState"]
            SYNC4["Map evolution based on biomass"]
            SYNC3 -.->|"Manual sync required"| SYNC4
        end

        subgraph "Performance Issues"
            PERF1["Every tick updates entire GameState"]
            PERF2["Large cell array in MapState"]
            PERF3["No memoization of calculations"]
            PERF4["Unnecessary re-renders"]
        end
    end

    subgraph "Game Actions"
        ACT --> MC[manualClick]
        ACT --> CN[consumeNutrient]
        ACT --> BG[buyGenerator]
        ACT --> BU[buyUpgrade]
        ACT --> EL[evolveToNextLevel]
    end

    subgraph "Game Loop"
        GL --> TICK[tick function]
        TICK --> TG[getTotalGrowth]
        TICK --> SMN[spawnMoreNutrients]
    end

    %% Connections showing the problems
    GS --> ACT
    GS --> GL
    MS -.->|"Tight coupling"| ACT
    MS -.->|"Manual sync"| GL

    style GS fill:#e3f2fd
    style MS fill:#ffebee
    style US fill:#f3e5f5
    style UM fill:#fff3e0
    style SYNC1 fill:#ffcdd2
    style SYNC2 fill:#ffcdd2
    style PERF1 fill:#ffcdd2
    style PERF2 fill:#ffcdd2
```

## User Interaction Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant A as App.tsx
    participant UG as useGame Hook
    participant GS as GameState
    participant UM as useMap Hook
    participant MS as MapState
    participant ACT as Game Actions
    participant GL as Game Loop

    U->>A: Click Blob
    A->>UG: handleBlobClick()
    UG->>ACT: manualClick(state)
    ACT->>GS: Update biomass
    GS-->>UG: New state
    UG-->>A: Re-render

    U->>A: Buy Generator
    A->>UG: handleBuyGenerator(id)
    UG->>ACT: buyGenerator(state, id)
    ACT->>GS: Update generators & biomass
    GS-->>UG: New state
    UG-->>A: Re-render

    U->>A: Evolve
    A->>UG: handleEvolve()
    UG->>ACT: evolveToNextLevel(state)
    ACT->>GS: Update currentLevelId
    UG->>UM: mapEvolveToNextLevel(biomass)
    UM->>MS: Update currentLevel
    GS-->>UG: New state
    MS-->>UM: New state
    UG-->>A: Re-render

    loop Every tick
        GL->>GS: tick(state)
        GS->>ACT: getTotalGrowth()
        ACT-->>GS: growth value
        GS->>ACT: spawnMoreNutrients()
        ACT-->>GS: Updated nutrients
        GS-->>GL: New state
        GL-->>A: Re-render
    end
```

## Game State Transitions

```mermaid
stateDiagram-v2
    [*] --> Initializing
    Initializing --> Playing : Game loaded

    Playing --> BuyingGenerator : User clicks buy
    BuyingGenerator --> Playing : Generator purchased

    Playing --> BuyingUpgrade : User clicks upgrade
    BuyingUpgrade --> Playing : Upgrade purchased

    Playing --> Evolving : Biomass threshold reached
    Evolving --> Playing : Level evolved

    Playing --> ConsumingNutrient : User clicks nutrient
    ConsumingNutrient --> Playing : Nutrient consumed

    Playing --> ManualClick : User clicks blob
    ManualClick --> Playing : Biomass increased

    Playing --> GameTick : Timer fires
    GameTick --> Playing : Growth applied

    note right of Playing
        State includes:
        - biomass
        - generators
        - upgrades
        - nutrients
        - currentLevelId
    end note

    note right of Evolving
        Manual sync required:
        - Update GameState.currentLevelId
        - Update MapState.currentLevel
    end note
```

## Component Architecture

```mermaid
flowchart TD
    subgraph "App.tsx"
        APP[App Component]
        APP --> BL[Blob Component]
        APP --> NU[Nutrients Component]
        APP --> GH[GameHUD Component]
        APP --> MG[MapGenerators Component]
        APP --> MAP[Map Component]
        APP --> PS[ParticleSystem Component]
        APP --> AL[AnimationLayer Component]
    end

    subgraph "Game HUD"
        GH --> GS[GameStats Component]
        GH --> SH[Shop Component]
        GH --> EP[EvolutionPanel Component]

        SH --> SG[Generators Component]
        SH --> SU[Upgrades Component]

        EP --> CL[CurrentLevel Component]
        EP --> NE[NextEvolution Component]
        EP --> EB[EvolutionButton Component]
        EP --> ES[EvolutionScale Component]
    end

    subgraph "Map System"
        MAP --> CM[CycleMaps Component]
        MAP --> IL[IntroLevel Component]
        MAP --> ML[MicroscopeLevel Component]
        MAP --> PL[PetriLevel Component]
        MAP --> LL[LabLevel Component]
        MAP --> CIL[CityLevel Component]
        MAP --> EL[EarthLevel Component]
        MAP --> SSL[SunSolarSystemLevel Component]
    end

    subgraph "Animations"
        AL --> FN[FloatingNumber Component]
        AL --> P[Particle Component]
        PS --> P
    end

    style APP fill:#e1f5fe
    style GH fill:#f3e5f5
    style MAP fill:#e8f5e8
    style AL fill:#fff3e0
```

## File Architecture

```mermaid
flowchart TD
    subgraph "src/"
        subgraph "core/"
            CS[gameState.ts]
            CA[gameActions.ts]
            CL[gameLoop.ts]

            subgraph "systems/"
                NS[nutrientSystem.ts]
                LS[levelSystem.ts]
                GS[generatorSystem.ts]
                US[upgradeSystem.ts]
                MS[mapState.ts]
            end

            subgraph "content/"
                CG[generators.ts]
                CU[upgrades.ts]
                CL[levels.ts]
            end

            subgraph "config/"
                GC[game.ts]
                PC[particles.ts]
            end
        end

        subgraph "types/"
            TG[game.ts]
            TGE[generators.ts]
            TU[upgrades.ts]
            TL[levels.ts]
            TP[particles.ts]
            TM[map.ts]
            TN[nutrients.ts]
        end

        subgraph "utils/"
            UC[calculations.ts]
            UN[numberFormat.ts]
        end

        subgraph "hooks/"
            HG[useGame.ts]
            HB[useBlobSize.ts]
            HC[useCameraZoom.ts]
        end

        subgraph "components/"
            subgraph "hud/"
                HGH[GameHUD.tsx]
                HGS[GameStats.tsx]

                subgraph "Shop/"
                    SG[Generators.tsx]
                    SU[Upgrades.tsx]
                    SS[Shop.tsx]
                    SGV[generatorValue.ts]
                    SI[index.ts]
                end

                subgraph "Evolution/"
                    EC[CurrentLevel.tsx]
                    EN[NextEvolution.tsx]
                    EB[EvolutionButton.tsx]
                    ES[EvolutionScale.tsx]
                    EP[EvolutionPanel.tsx]
                    EI[index.ts]
                    ELS[scaleLevels.ts]
                end
            end

            subgraph "map/"
                MM[Map.tsx]
                MC[CycleMaps.tsx]
                MG[MapGenerators.tsx]

                subgraph "levels/"
                    LI[IntroLevel.tsx]
                    LM[MicroscopeLevel.tsx]
                    LP[PetriLevel.tsx]
                    LL[LabLevel.tsx]
                    LC[CityLevel.tsx]
                    LE[EarthLevel.tsx]
                    LS[SunSolarSystemLevel.tsx]
                end
            end

            CB[blob/Blob.tsx]
            CF[food/Nutrients.tsx]
        end

        subgraph "animations/"
            AP[Particle.tsx]
            APS[ParticleSystem.tsx]
            AFN[FloatingNumber.tsx]
            AAL[AnimationLayer.tsx]
        end

        A[App.tsx]
        M[main.tsx]
    end

    style core fill:#e3f2fd
    style types fill:#f3e5f5
    style utils fill:#e8f5e8
    style hooks fill:#fff3e0
    style components fill:#fce4ec
    style animations fill:#f1f8e9
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph "User Input"
        UI[User Interactions]
        UI --> CLICK[Click Blob]
        UI --> NUTRIENT[Click Nutrient]
        UI --> BUY_GEN[Buy Generator]
        UI --> BUY_UP[Buy Upgrade]
        UI --> EVOLVE[Evolve]
    end

    subgraph "Game Actions"
        CLICK --> MC[manualClick]
        NUTRIENT --> CN[consumeNutrient]
        BUY_GEN --> BG[buyGenerator]
        BUY_UP --> BU[buyUpgrade]
        EVOLVE --> EL[evolveToNextLevel]
    end

    subgraph "State Updates"
        MC --> GS[GameState]
        CN --> GS
        BG --> GS
        BU --> GS
        EL --> GS
    end

    subgraph "Calculations"
        GS --> TG[getTotalGrowth]
        GS --> GCL[getCurrentLevel]
        GS --> GNN[getNearbyNutrients]
        GS --> GEC[getEffectiveClickPower]
    end

    subgraph "UI Updates"
        GS --> UI_COMP[UI Components]
        TG --> UI_COMP
        GCL --> UI_COMP
        GNN --> UI_COMP
        GEC --> UI_COMP
    end

    subgraph "Game Loop"
        GS --> TICK[tick function]
        TICK --> TG
        TICK --> SMN[spawnMoreNutrients]
        SMN --> GS
    end

    style UI fill:#e1f5fe
    style GS fill:#f3e5f5
    style UI_COMP fill:#e8f5e8
    style TICK fill:#fff3e0
```

## Class Diagram

```mermaid
classDiagram
    class GameState {
        +number biomass
        +number growth
        +number clickPower
        +Record~string, GeneratorState~ generators
        +Record~string, UpgradeState~ upgrades
        +NutrientState[] nutrients
        +number currentLevelId
        +number highestLevelReached
    }

    class MapState {
        +Level currentLevel
        +Cell[] cells
        +number size
        +function get(x, y)
        +function set(x, y, status)
        +function setLevel(level)
        +function evolveToNextLevel(biomass)
    }

    class GeneratorState {
        +string id
        +string name
        +number baseCost
        +string description
        +number baseEffect
        +number level
        +number costMultiplier
        +string unlockedAtLevel
    }

    class UpgradeState {
        +string id
        +string name
        +number cost
        +string description
        +number effect
        +string type
        +boolean purchased
        +string unlockedAtLevel
    }

    class NutrientState {
        +string id
        +number x
        +number y
        +boolean consumed
    }

    class Cell {
        +number x
        +number y
        +CellStatus status
    }

    class Level {
        +number id
        +string name
        +string emoji
        +number biomassThreshold
        +string background
    }

    class Particle {
        +number x
        +number y
        +number vx
        +number vy
        +number life
        +string color
        +number size
    }

    GameState --> GeneratorState : contains
    GameState --> UpgradeState : contains
    GameState --> NutrientState : contains
    MapState --> Cell : contains
    MapState --> Level : contains
    ParticleSystem --> Particle : manages
```

## User Flow Diagram

```mermaid
flowchart TD
    A[User Opens Game] --> B[Initialize Game State]
    B --> C[Load Initial Level: Intro]
    C --> D[Render Game UI]

    D --> E{User Interaction}
    E -->|Click Blob| F[Manual Click Action]
    E -->|Click Nutrient| G[Consume Nutrient]
    E -->|Buy Generator| H[Purchase Generator]
    E -->|Buy Upgrade| I[Purchase Upgrade]
    E -->|Evolve| J[Level Evolution]

    F --> K[Add Click Power to Biomass]
    G --> L[Add 1 Biomass + Mark Consumed]
    H --> M[Calculate Cost + Apply Generator Effect]
    I --> N[Calculate Cost + Apply Upgrade Effect]
    J --> O[Check Threshold + Advance Level]

    K --> P[Game Tick Loop]
    L --> P
    M --> P
    N --> P
    O --> P

    P --> Q[Calculate Total Growth]
    Q --> R[Add Growth to Biomass]
    R --> S[Spawn More Nutrients if Needed]
    S --> T[Update UI Components]
    T --> E

    style A fill:#e1f5fe
    style E fill:#fff3e0
    style P fill:#f3e5f5
    style T fill:#e8f5e8
```

## Proposed Unified State Architecture

```mermaid
flowchart TD
    subgraph "Unified State Management"
        subgraph "Single Source of Truth"
            US[useGameStore Hook]
            US --> GS[GameState]
            GS --> B[biomass: number]
            GS --> G[growth: number]
            GS --> CP[clickPower: number]
            GS --> GEN[generators: Record<string, GeneratorState>]
            GS --> UP[upgrades: Record<string, UpgradeState>]
            GS --> N[nutrients: NutrientState[]]
            GS --> CL[currentLevel: Level]
            GS --> HL[highestLevelReached: number]
            GS --> MC[cells: Cell[]]
        end

        subgraph "Centralized Actions"
            ACT[Game Actions]
            ACT --> MC[manualClick]
            ACT --> CN[consumeNutrient]
            ACT --> BG[buyGenerator]
            ACT --> BU[buyUpgrade]
            ACT --> EL[evolveToNextLevel]
            ACT --> SMN[spawnMoreNutrients]
        end

        subgraph "Optimized Game Loop"
            GL[Game Loop]
            GL --> TICK[tick function]
            TICK --> TG[getTotalGrowth]
            TICK --> SMN
        end
    end

    subgraph "Benefits"
        BEN1["Single state source"]
        BEN2["No synchronization issues"]
        BEN3["Consistent update patterns"]
        BEN4["Better performance"]
        BEN5["Easier testing"]
    end

    GS --> ACT
    GS --> GL
    ACT --> GS
    GL --> GS

    style GS fill:#e8f5e8
    style US fill:#e3f2fd
    style ACT fill:#f3e5f5
    style GL fill:#fff3e0
    style BEN1 fill:#c8e6c9
    style BEN2 fill:#c8e6c9
    style BEN3 fill:#c8e6c9
    style BEN4 fill:#c8e6c9
    style BEN5 fill:#c8e6c9
```
