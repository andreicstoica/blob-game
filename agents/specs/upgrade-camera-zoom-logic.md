# Camera Zoom Logic Upgrade

**review /agents/agents.md before beginning, and make sure to ask any questions you have throughout the process.**

# Message

Act as an experienced vite react developer working on a clicker game. You are a seasoned vet that doesn't make bad decisions for future tech debt. IQ at least 500!!!

## 1. Goal

Enhance the camera zoom system to provide a more intuitive and visually appealing experience that properly scales with BOTH the blob's growth and level progression. The system should feel natural, provide clear visual feedback for evolution events, and maintain proper proportions across all 7 levels of the game. We want the camera to feel 'zoomed out' at the beginning, with the blob being small, and it should grow throughout the level progression. As the player gets close to evolving to the next level, the blob should appear pretty big in the screen, but nowhere near the entire screen in size.

## 2. Scope & File Paths

Modify the following files:

- `/src/hooks/useCameraZoom.ts` - Enhanced zoom logic with level-aware scaling
- `/src/hooks/useBlobSize.ts` - Improved blob size calculation
- `/src/engine/game.ts` - Add zoom reset triggers for evolution events - try to keep edits here minimal.
- `/src/components/HUD/Evolution/EvolutionPanel.tsx` - Update zoom display
- `/src/App.tsx` - Ensure proper zoom application

## 3. Context

The current camera zoom system has several issues:

- reference /docs/architecture-diagrams to better understand state flow in our game
- Zoom calculation is complex and doesn't feel natural
- I believe we are re-doing calculations, which hurts performance
- Level transitions don't provide clear visual feedback
- Blob size and zoom aren't properly coordinated
- The system doesn't account for the dramatic scale changes between levels
- The blob grows too large too quickly, and often grows bigger than the screen (both underlapping HUD elements, and growing off the entire screen)

The game has 7 levels with exponential biomass growth:

1. **Intro**: 0 → 1 biomass
2. **Microscopic**: 1 → 2,500 biomass
3. **Petri Dish**: 2,500 → 2,250,000 biomass
4. **Lab**: 2,250,000 → 800,000,000 biomass
5. **City**: 800,000,000 → 300,000,000,000 biomass
6. **Earth**: 300,000,000,000 → 100,000,000,000,000 biomass
7. **Solar System**: 100,000,000,000,000+ biomass

## 4. Requirements (Acceptance Criteria)

### Core Zoom System

- [ ] **Natural Growth Scaling**: Zoom should feel organic and proportional to biomass growth
- [ ] **Level-Aware Zoom Ranges**: Each level should have appropriate zoom min/max values
- [ ] **Smooth Transitions**: All zoom changes should be animated smoothly (0.015 lerp speed)
- [ ] **Screen Bounds Respect**: Zoom should never make the blob invisible or too small to interact with, but err on making the blob too small than too big
- [ ] **HUD Integration**: Account for 350px HUD width when calculating available screen space

### Evolution Zoom Effects

- [ ] **Zoom Reset on Evolution**: When evolving to a new level, zoom should reset to 1.0 with a dramatic "zoom out" effect
- [ ] **Evolution Feedback**: Provide clear visual indication that evolution occurred
- [ ] **Level Transition Animation**: Smooth transition from old zoom to new zoom range
- [ ] **Biomass Preservation**: Blob's actual biomass and size remain unchanged during evolution

### Level-Specific Zoom Ranges

- [ ] **Intro Level**: 1.0 → 0.8 (minimal zoom out) --> intro level is just a basic tutorial of sorts (will be built out later). don't make the zoom too much of a feature here
- [ ] **Microscopic Level**: 1.0 → 0.6 (moderate zoom out)
- [ ] **Petri Dish Level**: 1.0 → 0.4 (noticeable zoom out)
- [ ] **Lab Level**: 1.0 → 0.25 (significant zoom out)
- [ ] **City Level**: 1.0 → 0.15 (major zoom out)
- [ ] **Earth Level**: 1.0 → 0.08 (dramatic zoom out)
- [ ] **Solar System Level**: 1.0 → 0.04 (maximum zoom out)

### Technical Requirements

- [ ] **Performance**: Maintain 60fps zoom animations
- [ ] **Memory**: No memory leaks from animation frames
- [ ] **Responsive**: Work correctly on different screen sizes
- [ ] **Accessibility**: Ensure blob remains clickable at all zoom levels
- [ ] **Debug Support**: Add zoom level display in evolution panel

## 5. Implementation Plan

### Phase 1: Enhanced Zoom Calculation ✅ COMPLETED

1. ✅ Update `useCameraZoom.ts` with level-aware zoom ranges
2. ✅ Implement smooth zoom transitions with proper lerp
3. ✅ Add screen bounds calculation with HUD consideration
4. ✅ Handle level change detection and zoom reset

### Phase 2: Evolution Zoom Effects 🔄 IN PROGRESS

5. Add dramatic zoom-out animation on evolution
6. Implement level transition visual feedback
7. Ensure biomass and blob size remain unchanged
8. Add evolution completion indicators

### Phase 3: Level-Specific Optimization 🔄 IN PROGRESS

9. Fine-tune zoom ranges for each level
10. Optimize zoom curves for natural feel
11. Add level-specific zoom behavior
12. Test progression through all levels

### Phase 4: Polish & Integration 🔄 IN PROGRESS

13. Update evolution panel zoom display
14. Add zoom debugging information
15. Test edge cases and performance
16. Ensure responsive design compatibility

## 6. Technical Specifications

### Zoom Calculation Formula -- THESE ARE SUGGESTIONS

```typescript
// Level-specific zoom ranges
const ZOOM_RANGES = {
  intro: { start: 1.0, end: 0.8 },
  microscopic: { start: 1.0, end: 0.6 },
  "petri-dish": { start: 1.0, end: 0.4 },
  lab: { start: 1.0, end: 0.25 },
  city: { start: 1.0, end: 0.15 },
  earth: { start: 1.0, end: 0.08 },
  "solar-system": { start: 1.0, end: 0.04 },
};

// Calculate progress within current level
const progressInLevel = Math.max(0, biomass - currentLevel.biomassThreshold);
const levelRange = nextLevel.biomassThreshold - currentLevel.biomassThreshold;
const progressRatio = Math.min(1, progressInLevel / levelRange);

// Use square root for more gradual zoom-out
const zoomCurve = Math.sqrt(progressRatio);
const calculatedZoom = startZoom - zoomCurve * (startZoom - endZoom);

// Apply visibility constraints
const finalZoom = Math.min(calculatedZoom, maxZoomForVisibility);
return Math.max(0.02, finalZoom);
```

### Screen Bounds Calculation

```typescript
// Calculate maximum zoom to keep blob visible
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const padding = 100; // Minimum padding around blob

// Account for HUD on the left (350px width)
const availableWidth = screenWidth - 350;
const availableHeight = screenHeight;

// Calculate max zoom that keeps blob within bounds
const maxZoomForWidth = (availableWidth - padding) / blobSize;
const maxZoomForHeight = (availableHeight - padding) / blobSize;
const maxZoomForVisibility = Math.min(maxZoomForWidth, maxZoomForHeight);
```

## 7. Game-ified Growth & Emergent Complexity

### Core Design Philosophy

The camera system should feel **game-ified** - every zoom change should feel like a reward, achievement, or progression milestone. As the game progresses to later stages, the camera should introduce more "juice" and complexity to keep the experience fresh and engaging.

### Growth-Based Camera Behavior

#### Early Game (Intro → Petri Dish)

- **Simple, Predictable Zoom**: Linear or gentle curves
- **Clear Milestone Feedback**: Obvious zoom changes at biomass thresholds
- **Minimal Complexity**: Focus on teaching the player the zoom mechanic

#### Mid Game (Lab → City)

- **Enhanced Feedback**: More dramatic zoom curves
- **Speed-Based Zoom**: Zoom changes based on growth rate, not just biomass
- **Generator Milestones**: Special zoom effects when buying generators

#### Late Game (Earth → Solar System)

- **Complex Zoom Patterns**: Multiple zoom curves and effects
- **Performance-Based Zoom**: Zoom intensity based on player efficiency
- **Emergent Behaviors**: Unpredictable but satisfying zoom combinations

### Emergent Complexity System

```typescript
interface ZoomComplexity {
  level: number; // 1-7, matches game levels
  growthRate: number; // Current biomass per second
  generatorCount: number; // Total generators owned
  upgradeCount: number; // Total upgrades purchased
  timeInLevel: number; // Seconds spent in current level
}

const COMPLEXITY_CONFIG = {
  // Early levels: Simple, predictable
  intro: {
    zoomCurve: "linear",
    effects: ["base"],
    complexity: 1,
  },
  microscopic: {
    zoomCurve: "square_root",
    effects: ["base", "growth_rate"],
    complexity: 2,
  },
  "petri-dish": {
    zoomCurve: "cubic",
    effects: ["base", "growth_rate", "generator_milestones"],
    complexity: 3,
  },

  // Mid levels: Enhanced feedback
  lab: {
    zoomCurve: "exponential",
    effects: ["base", "growth_rate", "generator_milestones", "speed_bonus"],
    complexity: 4,
  },
  city: {
    zoomCurve: "exponential",
    effects: [
      "base",
      "growth_rate",
      "generator_milestones",
      "speed_bonus",
      "upgrade_bonus",
    ],
    complexity: 5,
  },

  // Late levels: Maximum complexity
  earth: {
    zoomCurve: "chaotic",
    effects: [
      "base",
      "growth_rate",
      "generator_milestones",
      "speed_bonus",
      "upgrade_bonus",
      "time_bonus",
    ],
    complexity: 6,
  },
  "solar-system": {
    zoomCurve: "chaotic",
    effects: [
      "base",
      "growth_rate",
      "generator_milestones",
      "speed_bonus",
      "upgrade_bonus",
      "time_bonus",
      "performance_bonus",
    ],
    complexity: 7,
  },
};
```

### Game-ified Zoom Effects

#### Growth Rate Zoom

```typescript
// Zoom intensity based on how fast the player is growing
const calculateGrowthZoom = (growthRate: number, level: number) => {
  const baseMultiplier = 1.0;
  const growthMultiplier = Math.min(2.0, 1.0 + growthRate / 1000);

  // Late game: More dramatic growth effects
  if (level >= 5) {
    return baseMultiplier * Math.pow(growthMultiplier, 1.5);
  }

  return baseMultiplier * growthMultiplier;
};
```

#### Generator Milestone Zoom

```typescript
// Special zoom effects when reaching generator milestones
const GENERATOR_MILESTONES = {
  10: { zoom: 1.1, duration: 500 },
  25: { zoom: 1.15, duration: 600 },
  50: { zoom: 1.2, duration: 700 },
  100: { zoom: 1.25, duration: 800 },
  250: { zoom: 1.3, duration: 900 },
  500: { zoom: 1.35, duration: 1000 },
  1000: { zoom: 1.4, duration: 1200 },
};

const checkGeneratorMilestones = (
  generatorCount: number,
  currentZoom: number
) => {
  const milestone = GENERATOR_MILESTONES[generatorCount];
  if (milestone) {
    return {
      targetZoom: currentZoom * milestone.zoom,
      duration: milestone.duration,
      type: "generator_milestone",
    };
  }
  return null;
};
```

#### Speed-Based Zoom (Mid Game)

```typescript
// Zoom changes based on growth acceleration
const calculateSpeedZoom = (
  growthRate: number,
  previousGrowthRate: number,
  level: number
) => {
  if (level < 4) return 1.0; // Only active in mid-late game

  const acceleration = growthRate - previousGrowthRate;
  const speedMultiplier = 1.0 + acceleration / 10000;

  // Cap the effect to prevent extreme zoom changes
  return Math.max(0.8, Math.min(1.3, speedMultiplier));
};
```

#### Performance-Based Zoom (Late Game)

```typescript
// Zoom based on player efficiency and strategy
const calculatePerformanceZoom = (gameState: GameState, level: number) => {
  if (level < 6) return 1.0; // Only in late game

  const efficiency = calculatePlayerEfficiency(gameState);
  const performanceMultiplier = 0.9 + efficiency * 0.4;

  return performanceMultiplier;
};

const calculatePlayerEfficiency = (gameState: GameState) => {
  // Calculate how efficiently the player is progressing
  const biomass = gameState.biomass;
  const generators = Object.values(gameState.generators);
  const upgrades = Object.values(gameState.upgrades).filter((u) => u.purchased);

  const generatorEfficiency =
    generators.reduce((sum, gen) => sum + gen.level, 0) / biomass;
  const upgradeEfficiency = upgrades.length / Math.max(1, biomass / 1000000);

  return (generatorEfficiency + upgradeEfficiency) / 2;
};
```

### Dramatic Evolution Sequences

#### Evolution Camera Sequence

```typescript
// Multi-phase evolution animation with increasing complexity
const EVOLUTION_SEQUENCES = {
  // Early levels: Simple zoom out
  intro: {
    phases: [
      { duration: 300, zoom: 1.0, easing: "easeOut" },
      { duration: 700, zoom: 0.8, easing: "easeInOut" },
    ],
  },

  // Mid levels: Enhanced with effects
  lab: {
    phases: [
      { duration: 200, zoom: 1.0, easing: "easeOut", effect: "pause" },
      { duration: 400, zoom: 0.3, easing: "easeOut", effect: "dramatic_zoom" },
      { duration: 600, zoom: 0.25, easing: "easeInOut", effect: "settle" },
    ],
  },

  // Late levels: Maximum drama
  "solar-system": {
    phases: [
      { duration: 150, zoom: 1.0, easing: "easeOut", effect: "pause" },
      { duration: 300, zoom: 0.1, easing: "easeOut", effect: "dramatic_zoom" },
      { duration: 200, zoom: 0.15, easing: "easeIn", effect: "bounce" },
      { duration: 500, zoom: 0.04, easing: "easeInOut", effect: "settle" },
    ],
  },
};
```

#### Evolution Visual Effects

```typescript
// Level-appropriate visual effects
const EVOLUTION_EFFECTS = {
  // Early levels: Simple flash
  intro: { flash: true, particles: false, screenShake: false },
  microscopic: { flash: true, particles: 5, screenShake: false },
  "petri-dish": { flash: true, particles: 10, screenShake: false },

  // Mid levels: Enhanced effects
  lab: { flash: true, particles: 20, screenShake: true, intensity: "medium" },
  city: { flash: true, particles: 30, screenShake: true, intensity: "high" },

  // Late levels: Maximum effects
  earth: {
    flash: true,
    particles: 50,
    screenShake: true,
    intensity: "extreme",
  },
  "solar-system": {
    flash: true,
    particles: 100,
    screenShake: true,
    intensity: "extreme",
    timeWarp: true,
  },
};
```

### Enhanced Camera Hook

```typescript
export const useCameraZoom = ({
  gameState,
  currentLevel,
}: UseCameraZoomProps) => {
  const [cameraState, setCameraState] = useState<CameraState>({
    currentZoom: 1.0,
    targetZoom: 1.0,
    complexity: 1,
    lastGrowthRate: 0,
    lastUpdateTime: Date.now(),
  });

  const lastLevelIdRef = useRef(currentLevel.id);
  const evolutionAnimationRef = useRef<(() => number) | null>(null);
  const milestoneAnimationRef = useRef<(() => number) | null>(null);

  // Calculate base zoom with complexity
  const baseZoom = useMemo(() => {
    const complexity = COMPLEXITY_CONFIG[currentLevel.name];
    let zoom = calculateBaseZoom(gameState.biomass, currentLevel);

    // Apply complexity-based effects
    if (complexity.effects.includes("growth_rate")) {
      zoom *= calculateGrowthZoom(gameState.growth, currentLevel.id);
    }

    if (complexity.effects.includes("generator_milestones")) {
      const milestone = checkGeneratorMilestones(
        Object.values(gameState.generators).reduce(
          (sum, gen) => sum + gen.level,
          0
        ),
        zoom
      );
      if (milestone) {
        milestoneAnimationRef.current = createMilestoneAnimation(
          zoom,
          milestone
        );
      }
    }

    if (complexity.effects.includes("speed_bonus")) {
      zoom *= calculateSpeedZoom(
        gameState.growth,
        cameraState.lastGrowthRate,
        currentLevel.id
      );
    }

    if (complexity.effects.includes("performance_bonus")) {
      zoom *= calculatePerformanceZoom(gameState, currentLevel.id);
    }

    return zoom;
  }, [gameState, currentLevel, cameraState.lastGrowthRate]);

  // Handle evolution events
  useEffect(() => {
    if (currentLevel.id !== lastLevelIdRef.current) {
      const evolutionSequence =
        EVOLUTION_SEQUENCES[currentLevel.name] || EVOLUTION_SEQUENCES.intro;
      evolutionAnimationRef.current =
        createEvolutionAnimation(evolutionSequence);

      // Trigger visual effects
      triggerEvolutionEffects(currentLevel.name);

      lastLevelIdRef.current = currentLevel.id;
    }
  }, [currentLevel.id]);

  // Main animation loop
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      let newZoom = cameraState.currentZoom;

      // Priority: Evolution animation
      if (evolutionAnimationRef.current) {
        newZoom = evolutionAnimationRef.current();
        if (newZoom === null) {
          evolutionAnimationRef.current = null;
        }
      }
      // Secondary: Milestone animation
      else if (milestoneAnimationRef.current) {
        newZoom = milestoneAnimationRef.current();
        if (newZoom === null) {
          milestoneAnimationRef.current = null;
        }
      }
      // Default: Smooth transition to target
      else {
        newZoom = lerp(cameraState.currentZoom, baseZoom, 0.02);
      }

      setCameraState((prev) => ({
        ...prev,
        currentZoom: newZoom,
        lastGrowthRate: gameState.growth,
        lastUpdateTime: Date.now(),
      }));

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [cameraState, baseZoom, gameState.growth]);

  return cameraState.currentZoom;
};
```

### Visual Effects System

#### Screen Shake (Mid-Late Game)

```typescript
const ScreenShake: React.FC<{
  isActive: boolean;
  intensity: "medium" | "high" | "extreme";
}> = ({ isActive, intensity }) => {
  const [shakeOffset, setShakeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) return;

    const intensityValues = {
      medium: { amplitude: 3, frequency: 0.02 },
      high: { amplitude: 6, frequency: 0.03 },
      extreme: { amplitude: 10, frequency: 0.04 },
    };

    const config = intensityValues[intensity];
    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const decay = 1 - progress;

      const x = (Math.random() - 0.5) * config.amplitude * decay;
      const y = (Math.random() - 0.5) * config.amplitude * decay;

      setShakeOffset({ x, y });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setShakeOffset({ x: 0, y: 0 });
      }
    };

    animate();
  }, [isActive, intensity]);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
        pointerEvents: "none",
        zIndex: 9997,
      }}
    />
  );
};
```

#### Time Warp Effect (Late Game)

```typescript
const TimeWarpEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [timeWarp, setTimeWarp] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    // Create time warp effect with frame rate manipulation
    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Slow down time during evolution
      const timeScale =
        progress < 0.3
          ? 0.3
          : progress > 0.7
          ? 1.0
          : 0.3 + (progress - 0.3) * 1.75;

      setTimeWarp(timeScale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeWarp(1);
      }
    };

    animate();
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `rgba(0, 0, 255, ${(1 - timeWarp) * 0.3})`,
        pointerEvents: "none",
        zIndex: 9996,
        transition: "background-color 0.1s ease-out",
      }}
    />
  );
};
```

## 8. Constraints

- Use TypeScript strict mode
- Adhere to existing coding conventions (Prettier, Tailwind, Zustand)
- Maintain existing game mechanics and UI layout
- No breaking changes to public interfaces unless specified
- Focus on core functionality first, polish features later
- Ensure 60fps performance on modern devices
- Support responsive design across different screen sizes

## 9. Testing Scenarios

### Zoom Behavior Tests

- [ ] Zoom scales naturally with biomass growth
- [ ] Zoom resets properly on evolution
- [ ] Blob remains clickable at all zoom levels
- [ ] Screen bounds are respected
- [ ] HUD doesn't interfere with zoom calculations

### Level Progression Tests

- [ ] Each level has appropriate zoom range
- [ ] Evolution provides clear visual feedback
- [ ] Biomass and blob size remain unchanged during evolution
- [ ] Smooth transitions between levels
- [ ] No zoom glitches or jumps

### Performance Tests

- [ ] 60fps zoom animations maintained
- [ ] No memory leaks from animation frames
- [ ] Responsive on different screen sizes
- [ ] No performance degradation over time

## 10. Future Enhancements

### Advanced Zoom Features (Post-MVP)

- **Zoom Controls**: Manual zoom in/out controls
- **Zoom Presets**: Quick zoom to specific levels
- **Zoom Animations**: More sophisticated transition effects
- **Zoom Indicators**: Visual indicators for zoom level
- **Zoom Lock**: Option to lock zoom at specific level

### Visual Polish (Post-MVP)

- **Evolution Effects**: Particle systems, screen flashes
- **Zoom Transitions**: Easing functions for smoother animations
- **Level Indicators**: Visual cues for current zoom level
- **Zoom History**: Remember player's preferred zoom levels

---

This spec provides a comprehensive upgrade to the camera zoom system that will create a more intuitive and visually appealing experience while maintaining the game's core mechanics and performance requirements.
