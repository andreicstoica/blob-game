import "./globals.css";
import { AnimationLayer } from "./components/Animations/AnimationLayer";
import Blob from "./components/Blob/Blob";
import { Nutrients } from "./components/Food/Nutrients";
import { GameHUD } from "./components/HUD/GameHUD";
import { ScaleIndicator } from "./components/HUD/ScaleIndicator";
import { useGame } from "./hooks/useGame";
import { useMapSelector } from "./engine/mapState";
import { useMemo } from "react";
import Map from "./components/Map/Map";

function App() {
  const {
    gameState,
    handleBlobClick,
    handleBuyGenerator,
    handleBuyUpgrade,
    handleEvolve,
  } = useGame();

  const currentLevel = useMapSelector((s) => s.currentLevel);
  const phases: (
    | "intro"
    | "microscope"
    | "petri"
    | "lab"
    | "city"
    | "earth"
    | "sunSolarSystem"
  )[] = [
    "intro",
    "microscope",
    "petri",
    "lab",
    "city",
    "earth",
    "sunSolarSystem",
  ];
  const nextPhase = () => {
    const currentIndex = phases.indexOf(currentLevel.id as any);
    const nextIndex = (currentIndex + 1) % phases.length;
    // This is just for debugging - we'll remove this later
    console.log('Debug: cycling to phase', phases[nextIndex]);
  };

  // Simple zoom calculation for world scaling
  const blobSize = Math.max(50, gameState.biomass * 10);
  const zoom = useMemo(() => {
    // Simple logarithmic zoom for world scaling
    const biomass = gameState.biomass;
    return Math.max(0.15, 1.0 - Math.log10(biomass + 1) * 0.3);
  }, [gameState.biomass]);

  // Blob position is always at center (0,0) in its coordinate system
  // const blobPosition = { x: 0, y: 0 };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* TEMP: Debug button to cycle map levels */}
      <button
        onClick={nextPhase}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-red-500/80 backdrop-blur-sm rounded-lg text-white border border-red-500/40 hover:bg-red-600/80 transition-colors"
        style={{ pointerEvents: "auto" }}
      >
        Next Level (Debug)
      </button>
      <div
        className="w-full h-full relative"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <Map className="absolute inset-0 w-full h-full z-0" />

        <Nutrients nutrients={gameState.nutrients} phase={currentLevel.id as any} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none">
          <Blob
            id="main-blob"
            biomass={gameState.biomass}
            position={{ x: 0, y: 0 }}
            onBlobClick={handleBlobClick}
          />
        </div>
      </div>

      {/* HUD stays outside zoom */}
      <GameHUD
        biomass={gameState.biomass}
        gameState={gameState}
        onBuyGenerator={handleBuyGenerator}
        onBuyUpgrade={handleBuyUpgrade}
        onEvolve={handleEvolve}
      />

      {/* Scale Indicator - pass biomass instead of zoom */}
      <ScaleIndicator biomass={gameState.biomass} blobSize={blobSize} />

      <AnimationLayer />
    </div>
  );
}

export default App;
