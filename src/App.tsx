import "./globals.css";
import { AnimationLayer } from "./components/animations/AnimationLayer";
import { FlyingParticles } from "./components/animations/FlyingParticles";
import { BlobContainer } from "./components/blob/BlobContainer";

import { GameHUD } from "./components/hud/GameHUD";
import { MapGenerators } from "./components/map/MapGenerators";
import { GameWorld } from "./components/GameWorld";
import { useGame } from "./hooks/useGame";
import { useCameraZoom } from "./hooks/useCameraZoom";
import { useBlobSize } from "./hooks/useBlobSize";
import { useMapSelector } from "./game/systems/mapState";
import Map from "./components/map/Map";
import { useMemo } from "react";
import {
  calculateBlobPosition,
  calculateZoomRates,
} from "./game/systems/calculations";

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
  const blobPosition = useMemo(() => calculateBlobPosition(), []);

  // Calculate different zoom rates for parallax effect
  const zoomRates = useMemo(
    () => calculateZoomRates(currentZoom),
    [currentZoom]
  );

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Game World Container - Everything that zooms */}
      <GameWorld zoom={currentZoom}>
        {/* Background Layer - z-index: 0 */}
        <Map className="absolute inset-0 w-full h-full z-0" />

        {/* Particle System Layer - z-index: 30 */}
        {currentLevel && (
          <FlyingParticles
            gameState={gameState}
            currentLevel={currentLevel}
            zoomRate={zoomRates.particles}
            currentZoom={currentZoom}
          />
        )}

        {/* Blob Layer - z-index: 70 (above generators) */}
        <BlobContainer
          id="main-blob"
          biomass={gameState.biomass}
          size={blobSize}
          onBlobClick={handleBlobClick}
          clickPower={gameState.clickPower}
          zoomRate={zoomRates.blob}
          currentZoom={currentZoom}
        />
      </GameWorld>

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
