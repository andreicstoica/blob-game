import "./globals.css";
import { AnimationLayer } from "./components/animations/AnimationLayer";
import { ParticleSystem } from "./components/animations/ParticleSystem";
import Blob from "./components/blob/Blob";
import { Nutrients } from "./components/food/Nutrients";
import { GameHUD } from "./components/hud/GameHUD";
import { MapGenerators } from "./components/map/MapGenerators";
import { useGame } from "./hooks/useGame";
import { useCameraZoom } from "./hooks/useCameraZoom";
import { useBlobSize } from "./hooks/useBlobSize";
import { useMapSelector } from "./game/systems/mapState";
import Map from "./components/map/Map";
import { useMemo } from "react";

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

  // Calculate blob position to keep it centered in the playable area
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

  // Calculate different zoom rates for parallax effect
  const zoomRates = useMemo(() => {
    return {
      // Background zooms normally
      background: currentZoom,
      // Particles zoom at 80% of the rate for depth effect
      particles: 1 + (currentZoom - 1) * 0.8,
      // Blob scales inversely to maintain visibility
      blob: 1 + (currentZoom - 1) * 0.3,
      // Nutrients zoom at 90% rate
      nutrients: 1 + (currentZoom - 1) * 0.9,
      // Generators zoom at 70% rate for more depth
      generators: 1 + (currentZoom - 1) * 0.7,
    };
  }, [currentZoom]);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Game World Container - Everything that zooms */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `scale(${currentZoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* Background Layer - z-index: 0 */}
        <Map className="absolute inset-0 w-full h-full z-0" />

        {/* Nutrients Layer - z-index: 10 */}
        <div
          className="absolute inset-0 w-full h-full z-10"
          style={{
            transform: `scale(${zoomRates.nutrients / currentZoom})`,
            transformOrigin: "center center",
          }}
        >
          <Nutrients
            nutrients={gameState.nutrients}
            phase={currentLevel.id as any}
          />
        </div>

        {/* Particle System Layer - z-index: 30 */}
        {currentLevel && (
          <div
            className="absolute inset-0 w-full h-full z-30"
            style={{
              transform: `scale(${zoomRates.particles / currentZoom})`,
              transformOrigin: "center center",
            }}
          >
            <ParticleSystem gameState={gameState} currentLevel={currentLevel} />
          </div>
        )}

        {/* Blob Layer - z-index: 70 (above generators) */}
        <div
          className="absolute cursor-pointer select-none"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${
              zoomRates.blob / currentZoom
            })`,
            zIndex: 70,
          }}
        >
          <Blob
            id="main-blob"
            biomass={gameState.biomass}
            size={blobSize}
            position={{ x: 0, y: 0 }}
            onBlobClick={handleBlobClick}
            clickPower={gameState.clickPower}
          />
        </div>
      </div>

      {/* HUD Layer - Outside zoom container */}
      <GameHUD
        biomass={gameState.biomass}
        gameState={gameState}
        onBuyGenerator={handleBuyGenerator}
        onBuyUpgrade={handleBuyUpgrade}
        onEvolve={handleEvolve}
        blobSize={blobSize}
        zoom={currentZoom}
      />

      {/* Generators Layer - Outside zoom container */}
      <MapGenerators gameState={gameState} blobPosition={blobPosition} />

      {/* Animation Layer - Outside zoom container */}
      <AnimationLayer />
    </div>
  );
}

export default App;
