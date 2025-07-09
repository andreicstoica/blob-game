# Camera Zoom Logic Upgrade - Evolution Reset & Off-Screen Growth

**review /agents/agents.md before beginning, and make sure to ask any questions you have throughout the process.**

# Message

Act as an experienced vite react developer working on a clicker game. You are a seasoned vet that doesn't make bad decisions for future tech debt. IQ at least 500!!!

## 1. Goal

Transform the camera zoom system to create a more dramatic and intuitive growth experience through two key mechanisms:

1. **Evolution Zoom Reset**: When evolving to a new level, zoom resets to show the blob as small, then gradually zooms out as the blob grows to fill the screen (just starting to overlap the HUD) by the end of the level.

2. **Off-Screen Growth Effect**: Instead of scaling the blob itself, create the illusion of growth by having off-screen elements (particles, nutrients, visual effects) fly into the center and merge with the blob, making it feel like it's growing through absorption.

## 2. Scope & File Paths

Modify the following files:

- `/src/hooks/useCameraZoom.ts` - Evolution-aware zoom reset logic
- `/src/hooks/useBlobSize.ts` - Remove blob scaling, keep consistent size
- `/src/engine/game.ts` - Add evolution detection and zoom reset triggers
- `/src/components/Animations/ParticleSystem.tsx` - Enhanced off-screen particle system
- `/src/components/Blob/Blob.tsx` - Add absorption animation effects
- `/src/components/Food/Nutrients.tsx` - Off-screen nutrient spawning system
- `/src/App.tsx` - Coordinate zoom and particle systems

## 3. Context

The current system has issues:

- Blob scales directly, which feels unnatural
- No clear visual feedback for evolution events
- Zoom doesn't reset well between levels
- Growth feels mechanical rather than organic

The game has 7 levels with exponential biomass growth:

1. **Intro**: 0 → 1 biomass
2. **Microscopic**: 1 → 2,500 biomass
3. **Petri Dish**: 2,500 → 2,250,000 biomass
4. **Lab**: 2,250,000 → 800,000,000 biomass
5. **City**: 800,000,000 → 300,000,000,000 biomass
6. **Earth**: 300,000,000,000 → 100,000,000,000,000 biomass
7. **Solar System**: 100,000,000,000,000+ biomass

## 4. Requirements (Acceptance Criteria)

### Evolution Zoom Reset System

- [ ] **Zoom Reset on Evolution**: When evolving to a new level, zoom immediately resets to 1.0 (blob appears small)
- [ ] **Progressive Zoom Out**: As biomass increases within a level, zoom gradually decreases to show more of the environment
- [ ] **Screen-Filling Growth**: By the end of each level, blob should be large enough to just start overlapping the HUD (350px width)
- [ ] **Smooth Transitions**: All zoom changes use 0.015 lerp speed for smooth animation
- [ ] **Level-Aware Ranges**: Each level has appropriate zoom range based on biomass scale

### Off-Screen Growth Effect

- [ ] **Off-Screen Particle Spawning**: Particles spawn from off-screen edges and fly toward blob center
- [ ] **Absorption Animation**: Particles merge with blob with satisfying visual/audio feedback
- [ ] **Growth Rate Scaling**: Particle spawn rate and intensity scales with biomass growth rate
- [ ] **Level-Appropriate Effects**: Different particle types and effects for each level

### Technical Requirements

- [ ] **Performance**: Maintain 60fps with particle system
- [ ] **Memory**: No memory leaks from particle animations
- [ ] **Responsive**: Work correctly on different screen sizes
- [ ] **Accessibility**: Ensure blob remains clickable at all zoom levels

## 5. Implementation Plan

### Phase 1: Evolution Zoom Reset ✅ COMPLETED

1. ✅ Update `useCameraZoom.ts` with evolution detection
2. ✅ Implement zoom reset logic on level change
3. ✅ Add progressive zoom-out calculation
4. ✅ Handle screen bounds with HUD consideration

### Phase 2: Off-Screen Growth System 🔄 IN PROGRESS

5. Remove blob scaling from `useBlobSize.ts`
6. Enhance `ParticleSystem.tsx` with off-screen spawning
7. Add absorption animations to `Blob.tsx`
8. Create level-specific particle effects

### Phase 3: Integration & Polish 🔄 IN PROGRESS

9. Coordinate zoom and particle systems
10. Add evolution visual feedback
11. Optimize performance and memory usage
12. Test across all levels

## 6. Technical Specifications

### Evolution Zoom Reset Logic

```typescript
// Level-specific zoom ranges (zoom decreases as blob grows)
const ZOOM_RANGES = {
  intro: { start: 1.0, end: 0.9 }, // Minimal zoom out for tutorial
  microscopic: { start: 1.0, end: 0.7 },
  "petri-dish": { start: 1.0, end: 0.5 },
  lab: { start: 1.0, end: 0.3 },
  city: { start: 1.0, end: 0.2 },
  earth: { start: 1.0, end: 0.1 },
  "solar-system": { start: 1.0, end: 0.05 },
};

// Calculate zoom based on progress within current level
const calculateEvolutionZoom = (
  biomass: number,
  currentLevel: Level,
  nextLevel: Level
) => {
  const progressInLevel = Math.max(0, biomass - currentLevel.biomassThreshold);
  const levelRange = nextLevel.biomassThreshold - currentLevel.biomassThreshold;
  const progressRatio = Math.min(1, progressInLevel / levelRange);

  const { start, end } = ZOOM_RANGES[currentLevel.name];
  const zoomCurve = Math.sqrt(progressRatio); // Gradual zoom out

  return start - zoomCurve * (start - end);
};

// Screen bounds calculation with HUD consideration
const calculateMaxZoom = (blobSize: number) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const hudWidth = 350;
  const padding = 50; // Minimum padding around blob

  const availableWidth = screenWidth - hudWidth;
  const availableHeight = screenHeight;

  const maxZoomForWidth = (availableWidth - padding) / blobSize;
  const maxZoomForHeight = (availableHeight - padding) / blobSize;

  return Math.min(maxZoomForWidth, maxZoomForHeight);
};
```

### Off-Screen Particle System

```typescript
interface ParticleConfig {
  type: "nutrient" | "energy" | "matter" | "cosmic";
  spawnRate: number; // particles per second
  speed: number; // pixels per second
  size: number;
  color: string;
  level: number;
}

const PARTICLE_CONFIGS = {
  intro: {
    type: "nutrient",
    spawnRate: 2,
    speed: 100,
    size: 4,
    color: "#4ade80",
    level: 1,
  },
  microscopic: {
    type: "nutrient",
    spawnRate: 5,
    speed: 120,
    size: 5,
    color: "#22c55e",
    level: 2,
  },
  "petri-dish": {
    type: "energy",
    spawnRate: 8,
    speed: 150,
    size: 6,
    color: "#eab308",
    level: 3,
  },
  lab: {
    type: "matter",
    spawnRate: 12,
    speed: 180,
    size: 7,
    color: "#3b82f6",
    level: 4,
  },
  city: {
    type: "matter",
    spawnRate: 18,
    speed: 200,
    size: 8,
    color: "#8b5cf6",
    level: 5,
  },
  earth: {
    type: "cosmic",
    spawnRate: 25,
    speed: 250,
    size: 10,
    color: "#ec4899",
    level: 6,
  },
  "solar-system": {
    type: "cosmic",
    spawnRate: 35,
    speed: 300,
    size: 12,
    color: "#f59e0b",
    level: 7,
  },
};

// Off-screen spawning logic
const spawnOffScreenParticle = (
  config: ParticleConfig,
  blobPosition: Position
) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Spawn from one of the four screen edges
  const edge = Math.floor(Math.random() * 4);
  let x, y;

  switch (edge) {
    case 0: // Top
      x = Math.random() * screenWidth;
      y = -config.size;
      break;
    case 1: // Right
      x = screenWidth + config.size;
      y = Math.random() * screenHeight;
      break;
    case 2: // Bottom
      x = Math.random() * screenWidth;
      y = screenHeight + config.size;
      break;
    case 3: // Left (account for HUD)
      x = -config.size;
      y = Math.random() * screenHeight;
      break;
  }

  return {
    id: Math.random().toString(36),
    x,
    y,
    targetX: blobPosition.x,
    targetY: blobPosition.y,
    speed: config.speed,
    size: config.size,
    color: config.color,
    type: config.type,
  };
};
```

### Enhanced Camera Hook

```typescript
export const useCameraZoom = ({
  gameState,
  currentLevel,
}: UseCameraZoomProps) => {
  const [cameraState, setCameraState] = useState({
    currentZoom: 1.0,
    targetZoom: 1.0,
    isEvolving: false,
  });

  const lastLevelIdRef = useRef(currentLevel.id);

  // Handle evolution events
  useEffect(() => {
    if (currentLevel.id !== lastLevelIdRef.current) {
      // Evolution detected - reset zoom
      setCameraState((prev) => ({
        ...prev,
        targetZoom: 1.0,
        isEvolving: true,
      }));

      // Clear evolution state after animation
      setTimeout(() => {
        setCameraState((prev) => ({ ...prev, isEvolving: false }));
      }, 1000);

      lastLevelIdRef.current = currentLevel.id;
    }
  }, [currentLevel.id]);

  // Calculate target zoom based on biomass progress
  const targetZoom = useMemo(() => {
    if (cameraState.isEvolving) return 1.0;

    const nextLevel = getNextLevel(currentLevel);
    const calculatedZoom = calculateEvolutionZoom(
      gameState.biomass,
      currentLevel,
      nextLevel
    );

    // Apply screen bounds constraint
    const maxZoom = calculateMaxZoom(BLOB_BASE_SIZE);
    return Math.min(calculatedZoom, maxZoom);
  }, [gameState.biomass, currentLevel, cameraState.isEvolving]);

  // Smooth zoom animation
  useEffect(() => {
    setCameraState((prev) => ({
      ...prev,
      targetZoom,
    }));
  }, [targetZoom]);

  // Animation loop
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setCameraState((prev) => ({
        ...prev,
        currentZoom: lerp(prev.currentZoom, prev.targetZoom, 0.015),
      }));

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [cameraState.targetZoom]);

  return cameraState.currentZoom;
};
```

### Blob Absorption System

```typescript
interface AbsorptionEffect {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  progress: number;
  duration: number;
}

export const useBlobAbsorption = (
  gameState: GameState,
  currentLevel: Level
) => {
  const [absorptionEffects, setAbsorptionEffects] = useState<
    AbsorptionEffect[]
  >([]);

  // Create absorption effect when particle reaches blob
  const createAbsorptionEffect = (particle: Particle) => {
    const effect: AbsorptionEffect = {
      id: particle.id,
      x: particle.x,
      y: particle.y,
      size: particle.size,
      color: particle.color,
      progress: 0,
      duration: 500, // 500ms absorption animation
    };

    setAbsorptionEffects((prev) => [...prev, effect]);

    // Remove effect after animation completes
    setTimeout(() => {
      setAbsorptionEffects((prev) => prev.filter((e) => e.id !== particle.id));
    }, effect.duration);
  };

  // Animation loop for absorption effects
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setAbsorptionEffects((prev) =>
        prev.map((effect) => ({
          ...effect,
          progress: Math.min(1, effect.progress + 16 / effect.duration), // 60fps
        }))
      );

      animationId = requestAnimationFrame(animate);
    };

    if (absorptionEffects.length > 0) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [absorptionEffects.length]);

  return { absorptionEffects, createAbsorptionEffect };
};
```

### Enhanced Particle System

```typescript
export const ParticleSystem: React.FC<{
  gameState: GameState;
  currentLevel: Level;
  blobPosition: Position;
  onParticleAbsorbed: (particle: Particle) => void;
}> = ({ gameState, currentLevel, blobPosition, onParticleAbsorbed }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const config = PARTICLE_CONFIGS[currentLevel.name];

  // Spawn particles based on growth rate
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const spawnRate = config.spawnRate * (1 + gameState.growth / 1000);
      const shouldSpawn = Math.random() < spawnRate / 60; // 60fps

      if (shouldSpawn) {
        const newParticle = spawnOffScreenParticle(config, blobPosition);
        setParticles((prev) => [...prev, newParticle]);
      }
    }, 16); // 60fps

    return () => clearInterval(spawnInterval);
  }, [config, gameState.growth, blobPosition]);

  // Animate particles toward blob
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setParticles(
        (prev) =>
          prev
            .map((particle) => {
              const dx = blobPosition.x - particle.x;
              const dy = blobPosition.y - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 10) {
                // Particle reached blob - trigger absorption
                onParticleAbsorbed(particle);
                return null;
              }

              const speed = particle.speed / 60; // 60fps
              const moveX = (dx / distance) * speed;
              const moveY = (dy / distance) * speed;

              return {
                ...particle,
                x: particle.x + moveX,
                y: particle.y + moveY,
              };
            })
            .filter(Boolean) as Particle[]
      );

      animationId = requestAnimationFrame(animate);
    };

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [particles.length, blobPosition, onParticleAbsorbed]);

  return (
    <div className="particle-system">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      ))}
    </div>
  );
};
```

### Absorption Animation Component

```typescript
export const AbsorptionAnimation: React.FC<{
  effects: AbsorptionEffect[];
}> = ({ effects }) => {
  return (
    <div className="absorption-effects">
      {effects.map((effect) => {
        const scale = 1 + effect.progress * 2; // Grow as absorbed
        const opacity = 1 - effect.progress; // Fade out
        const blur = effect.progress * 5; // Blur as absorbed

        return (
          <div
            key={effect.id}
            className="absorption-effect"
            style={{
              position: "absolute",
              left: effect.x,
              top: effect.y,
              width: effect.size,
              height: effect.size,
              backgroundColor: effect.color,
              borderRadius: "50%",
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              filter: `blur(${blur}px)`,
              pointerEvents: "none",
              zIndex: 11,
              transition: "all 0.1s ease-out",
            }}
          />
        );
      })}
    </div>
  );
};
```

## 7. Level-Specific Growth Effects

### Early Game (Intro → Petri Dish)

- **Simple Nutrient Particles**: Basic green particles flying in
- **Moderate Spawn Rate**: 2-8 particles per second
- **Clear Absorption**: Simple scale and fade effects

### Mid Game (Lab → City)

- **Energy Particles**: Glowing particles with trails
- **Higher Spawn Rate**: 12-18 particles per second
- **Enhanced Absorption**: Scale, fade, and blur effects

### Late Game (Earth → Solar System)

- **Cosmic Particles**: Multi-colored particles with complex patterns
- **Maximum Spawn Rate**: 25-35 particles per second
- **Dramatic Absorption**: Scale, fade, blur, and particle burst effects

## 8. Constraints

- Use TypeScript strict mode
- Maintain existing game mechanics and UI layout
- Ensure 60fps performance with particle system
- Support responsive design across different screen sizes
- No breaking changes to public interfaces unless specified

## 9. Testing Scenarios

### Evolution Zoom Tests

- [ ] Zoom resets to 1.0 on evolution
- [ ] Progressive zoom-out within each level
- [ ] Blob reaches screen-filling size by level end
- [ ] Smooth transitions between zoom levels

### Particle System Tests

- [ ] Particles spawn from off-screen edges
- [ ] Particles fly toward blob center
- [ ] Absorption effects trigger correctly
- [ ] Performance remains at 60fps with many particles

### Integration Tests

- [ ] Zoom and particle systems work together
- [ ] Evolution provides clear visual feedback
- [ ] No memory leaks from animations
- [ ] Responsive on different screen sizes

## 10. Future Enhancements

### Advanced Particle Effects (Post-MVP)

- **Particle Trails**: Particles leave trails as they move
- **Particle Bursts**: Explosion effects when particles are absorbed
- **Level-Specific Particles**: Unique particle types for each level
- **Particle Sound Effects**: Audio feedback for absorption

### Enhanced Absorption (Post-MVP)

- **Blob Pulsing**: Blob pulses when absorbing particles
- **Absorption Rings**: Expanding rings when particles are absorbed
- **Growth Indicators**: Visual indicators showing biomass increase
- **Combo Effects**: Special effects for rapid absorption

---

This spec transforms the growth system from mechanical blob scaling to an organic, visually satisfying experience where the blob grows through absorbing off-screen elements, with dramatic zoom resets on evolution to emphasize the scale changes between levels.
