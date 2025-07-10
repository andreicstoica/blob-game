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
import Map from "./components/map/Map";
import { getCurrentLevel } from "./game/systems/actions";

function App() {
  const {
    gameState,
    handleBlobClick,
    handleBuyGenerator,
    handleBuyUpgrade,
    handleEvolve,
  } = useGame();

  const currentLevel = getCurrentLevel(gameState);
  const currentZoom = useCameraZoom({ gameState, currentLevel });
  const blobSize = useBlobSize(gameState);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Game World Container - Everything that zooms */}
      <GameWorld zoom={currentZoom}>
        {/* Background Layer - z-index: 0 */}
        <Map className="absolute inset-0 w-full h-full z-0" />

        {/* Particle System Layer - z-index: 30 */}
        <FlyingParticles gameState={gameState} currentLevel={currentLevel} />
      </GameWorld>

      {/* HUD Layer - Outside zoom container */}
      <GameHUD
        biomass={gameState.biomass}
        gameState={gameState}
        onBuyGenerator={handleBuyGenerator}
        onBuyUpgrade={handleBuyUpgrade}
        onEvolve={handleEvolve}
        blobSize={blobSize}
      />

      {/* Animation Layer with BlobContainer and MapGenerators - Outside zoom container */}
      <AnimationLayer>
        {(addFloatingNumber) => (
          <>
            {/* Blob Layer - z-index: 70 (above generators) */}
            <BlobContainer
              id="main-blob"
              biomass={gameState.biomass}
              size={blobSize}
              onBlobClick={handleBlobClick}
              clickPower={gameState.clickPower}
              addFloatingNumber={addFloatingNumber}
            />
            
            <MapGenerators 
              gameState={gameState} 
              blobSize={blobSize}
              addFloatingNumber={addFloatingNumber}
            />
          </>
        )}
      </AnimationLayer>
    </div>
  );
}

export default App;
