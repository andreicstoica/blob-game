# New Camera Zoom Structure Specification

**review docs/agents/agents.md before beginning, and make sure to ask any questions you have throughout the process. also check docs/architecture-diagrams.md**

# Message

Act as an experienced vite react developer working on a clicker game. You are a seasoned vet that doesn't make bad decisions for future tech debt. IQ at least 500!!!

## 1. Goal

Transform the camera zoom system to create a more intuitive and visually appealing growth experience. Currently, the image shrinks and creates black areas around it. We want to implement a system where:

1. **Zoom-in Start**: Each level begins with the image zoomed in (based on current biomass to next level threshold ratio)
2. **Zoom-out Progression**: As biomass increases, the image gradually zooms out to show more of the environment
3. **Full Visibility**: By the end of the level (when biomass = next level threshold), the image should be completely visible at zoom level 1.0
4. **Blob Centering**: The blob must remain centered and not expand into the HUD area

## 2. Scope & File Paths

Modify the following files:

- `/src/hooks/useCameraZoom.ts` - New zoom calculation logic
- `/src/hooks/useBlobSize.ts` - Simplified blob size management
- `/src/game/map/Map.tsx` - Enhanced map component with zoom handling
- `/src/App.tsx` - Updated zoom application and blob positioning

## 3. Context

The current system has several issues:

- **Image Shrinking**: Background images shrink and create black borders
- **Poor Visual Feedback**: No clear indication of growth progress within a level. the only element the currently shrinks as the level progresses are the Particles in src/animations/ParticleSystem.tsx

The game has 7 levels with exponential biomass growth:

1. **Intro**: 0 → 1 biomass
2. **Microscopic**: 1 → 2,500 biomass
3. **Petri Dish**: 2,500 → 2,250,000 biomass
4. **Lab**: 2,250,000 → 800,000,000 biomass
5. **City**: 800,000,000 → 300,000,000,000 biomass
6. **Earth**: 300,000,000,000 → 100,000,000,000,000 biomass
7. **Solar System**: 100,000,000,000,000+ biomass

## 4. Requirements (Acceptance Criteria)

### Zoom Progression System

- [ ] **Zoom-in Start**: Each level begins with image zoomed in (zoom > 1.0) - significantly zoomed in
- [ ] **Progressive Zoom-out**: Image gradually zooms out as biomass increases
- [ ] **Full Visibility**: Image reaches zoom = 1.0 when biomass equals next level threshold
- [ ] **Smooth Transitions**: All zoom changes use smooth animation (0.015 lerp speed)
- [ ] **Level Reset**: Zoom resets to zoomed-in state when evolving to new level with new background

### Visual Requirements

- [ ] **No Black Areas**: Background image always fills the screen appropriately (either super zoomed in or fully stretched)
- [ ] **Blob Centering**: Blob remains centered in the playable area
- [ ] **HUD Protection**: Blob never expands into the HUD area (350px width)

### Technical Requirements

- [ ] **Performance**: Maintain 60fps with smooth zoom animations
- [ ] **Memory**: No memory leaks from zoom calculations
- [ ] **Consistency**: Zoom behavior is consistent across all levels
- [ ] **Accessibility**: Blob remains clickable at all zoom levels

## 5. Implementation Plan

### Phase 1: Core Zoom Logic

1. Update `useCameraZoom.ts` with new zoom calculation algorithm
2. Implement zoom-in-to-zoom-out progression system
3. Add level-specific zoom ranges and calculations

### Phase 2: Map Component Enhancement

4. Update `Map.tsx` to handle zoom transformations properly
5. Ensure background images scale correctly without black areas
6. Implement proper transform origin and positioning

### Phase 3: App Integration

7. Update `App.tsx` to apply zoom correctly to all components
8. Ensure blob positioning remains centered
9. Add HUD boundary protection

### Phase 4: Testing & Polish

10. Test zoom behavior across all levels
11. Verify smooth transitions and performance
12. Ensure responsive design works correctly

## 6. Technical Specifications

### New Zoom Calculation Algorithm

Here are some suggestions:

```typescript
// Level-specific zoom ranges (zoom decreases from start to end)
const ZOOM_RANGES = {
  intro: { start: 1.2, end: 1.0 }, // Start zoomed in, end at normal
  microscopic: { start: 1.5, end: 1.0 },
  "petri-dish": { start: 2.0, end: 1.0 },
  lab: { start: 2.5, end: 1.0 },
  city: { start: 3.0, end: 1.0 },
  earth: { start: 3.5, end: 1.0 },
  "solar-system": { start: 4.0, end: 1.0 },
};

// Calculate zoom based on progress within current level
const calculateLevelZoom = (
  biomass: number,
  currentLevel: Level,
  nextLevel: Level | null
) => {
  if (!nextLevel) {
    // At max level, use simple logarithmic zoom
    const maxZoom =
      ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES]?.start || 1.5;
    const minZoom = 1.0;
    const progress = Math.min(1, Math.log10(biomass + 1) / 10);
    return maxZoom - progress * (maxZoom - minZoom);
  }

  const progressInLevel = Math.max(0, biomass - currentLevel.biomassThreshold);
  const levelRange = nextLevel.biomassThreshold - currentLevel.biomassThreshold;
  const progressRatio = Math.min(1, progressInLevel / levelRange);

  const { start, end } =
    ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES] ||
    ZOOM_RANGES.intro;

  // Use ease-out curve for more natural zoom progression
  const easedProgress = 1 - Math.pow(1 - progressRatio, 2);

  return start - easedProgress * (start - end);
};

// Screen bounds calculation with HUD consideration
const calculateMaxZoom = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const hudWidth = 350;
  const padding = 100; // Minimum padding around blob

  const availableWidth = screenWidth - hudWidth - padding;
  const availableHeight = screenHeight - padding;

  // Calculate maximum zoom that keeps blob within bounds
  const maxZoomForWidth = availableWidth / 200; // Assuming 200px blob size
  const maxZoomForHeight = availableHeight / 200;

  return Math.min(maxZoomForWidth, maxZoomForHeight, 4.0); // Cap at 4x zoom
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
      // Evolution detected - reset to zoomed-in state
      const newLevelZoom =
        ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES]?.start ||
        1.2;

      setCameraState((prev) => ({
        ...prev,
        targetZoom: newLevelZoom,
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
    if (cameraState.isEvolving) {
      return (
        ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES]?.start || 1.2
      );
    }

    const nextLevel = getNextLevel(currentLevel);
    const calculatedZoom = calculateLevelZoom(
      gameState.biomass,
      currentLevel,
      nextLevel
    );

    // Apply screen bounds constraint
    const maxZoom = calculateMaxZoom();
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

### Enhanced Map Component

```typescript
interface MapProps {
  className?: string;
  zoom?: number;
}

export default function Map({ className, zoom = 1.0 }: MapProps) {
  const currentLevel = useMapSelector((s) => s.currentLevel);

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        backgroundImage: `url(/assets/images/backgrounds/${currentLevel.background}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
        width: `${100 / zoom}%`,
        height: `${100 / zoom}%`,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${zoom})`,
      }}
    />
  );
}
```

### Updated App Component

```typescript
function App() {
  const {
    gameState,
    handleBlobClick,
    handleBuyGenerator,
    handleBuyUpgrade,
    handleEvolve,
  } = useGame();

  const currentLevel = useMapSelector((s) => s.currentLevel);
  const currentZoom = useCameraZoom({
    gameState,
    currentLevel,
  });
  const blobSize = useBlobSize(gameState);

  // Calculate blob position to keep it centered
  const blobPosition = useMemo(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const hudWidth = 350;

    // Center blob in the playable area (excluding HUD)
    const playableWidth = screenWidth - hudWidth;
    const centerX = hudWidth + playableWidth / 2;
    const centerY = screenHeight / 2;

    return { x: centerX, y: centerY };
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <Map className="absolute inset-0 w-full h-full z-0" zoom={currentZoom} />

      <Nutrients
        nutrients={gameState.nutrients}
        phase={currentLevel.id as any}
      />

      <div
        className="absolute cursor-pointer select-none"
        style={{
          left: blobPosition.x,
          top: blobPosition.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Blob
          id="main-blob"
          biomass={gameState.biomass}
          position={{ x: 0, y: 0 }}
          onBlobClick={handleBlobClick}
          clickPower={gameState.clickPower}
        />
      </div>

      <MapGenerators gameState={gameState} blobPosition={blobPosition} />

      {/* Particle System for off-screen growth effect */}
      {currentLevel && (
        <ParticleSystem gameState={gameState} currentLevel={currentLevel} />
      )}

      <GameHUD
        biomass={gameState.biomass}
        gameState={gameState}
        onBuyGenerator={handleBuyGenerator}
        onBuyUpgrade={handleBuyUpgrade}
        onEvolve={handleEvolve}
        blobSize={blobSize}
        zoom={currentZoom}
      />

      <AnimationLayer />
    </div>
  );
}
```

## 7. Level-Specific Zoom Behavior

### Early Game (Intro → Petri Dish)

- **Start Zoom**: 1.2x - 2.0x (moderately zoomed in)
- **End Zoom**: 1.0x (normal view)
- **Progression**: Gradual zoom-out as biomass increases

### Mid Game (Lab → City)

- **Start Zoom**: 2.5x - 3.0x (more zoomed in)
- **End Zoom**: 1.0x (normal view)
- **Progression**: Smooth zoom-out with ease-out curve

### Late Game (Earth → Solar System)

- **Start Zoom**: 3.5x - 4.0x (highly zoomed in)
- **End Zoom**: 1.0x (normal view)
- **Progression**: Dramatic zoom-out for scale emphasis

## 8. Constraints

- Use TypeScript strict mode
- Maintain existing game mechanics and UI layout
- Ensure 60fps performance with zoom animations
- Support responsive design across different screen sizes
- No breaking changes to public interfaces unless specified
- Keep blob clickable at all zoom levels

## 9. Testing Scenarios

### Zoom Progression Tests

- [ ] Each level starts with appropriate zoom-in level
- [ ] Zoom gradually decreases as biomass increases
- [ ] Image reaches zoom = 1.0 at level completion
- [ ] Smooth transitions between zoom levels

### Visual Tests

- [ ] No black areas around background images
- [ ] Background images always fill screen appropriately
- [ ] Blob remains centered in playable area
- [ ] Blob never expands into HUD area

### Performance Tests

- [ ] 60fps maintained during zoom animations
- [ ] No memory leaks from zoom calculations
- [ ] Responsive on different screen sizes
- [ ] Smooth evolution transitions

### Integration Tests

- [ ] Zoom works correctly with all game components
- [ ] Evolution resets zoom appropriately
- [ ] HUD remains functional at all zoom levels
- [ ] Particle system works with zoom changes

## 10. Future Enhancements

### Advanced Zoom Effects (Post-MVP)

- **Parallax Effects**: Different zoom rates for background layers
- **Zoom Transitions**: Special effects during evolution
- **Dynamic Zoom**: Zoom based on player actions or events
- **Zoom Indicators**: Visual feedback for zoom level

### Performance Optimizations (Post-MVP)

- **Zoom Caching**: Cache zoom calculations for better performance
- **Lazy Loading**: Load background images based on zoom level
- **Compression**: Optimize background images for different zoom levels
- **Preloading**: Preload next level's background during zoom transitions

---

This spec transforms the camera system from a shrinking image with black areas to a dynamic zoom-in-to-zoom-out progression that provides clear visual feedback for growth and maintains proper screen coverage throughout all levels.
