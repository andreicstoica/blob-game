import "./globals.css";
import { AnimationLayer } from "./animations/AnimationLayer";
import Blob from "./game/blob/Blob";
import { Nutrients } from "./game/food/Nutrients";
import { GameHUD } from "./game/hud/GameHUD";
import { GeneratorVisualization } from "./game/map/GeneratorVisualization";
import { useGame } from "./hooks/useGame";
import { useCameraZoom } from "./hooks/useCameraZoom";
import { useBlobSize } from "./hooks/useBlobSize";
import { useMapSelector } from "./engine/systems/mapState";
import Map from "./game/map/Map";

function App() {
  const {
    gameState,
    handleBlobClick,
    handleBuyGenerator,
    handleBuyUpgrade,
    handleEvolve,
  } = useGame();

  const currentLevel = useMapSelector((s) => s.currentLevel);
  const currentZoom = useCameraZoom({ gameState, currentLevel });
  const blobSize = useBlobSize(gameState);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div
        className="w-full h-full relative"
        style={{
          transform: `scale(${currentZoom})`,
          transformOrigin: "center center",
        }}
      >
        <Map className="absolute inset-0 w-full h-full z-0" />

        <Nutrients
          nutrients={gameState.nutrients}
          phase={currentLevel.id as any}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none">
          <Blob
            id="main-blob"
            biomass={gameState.biomass}
            position={{ x: 0, y: 0 }}
            onBlobClick={handleBlobClick}
            clickPower={gameState.clickPower}
          />
        </div>
        
        <GeneratorVisualization
          gameState={gameState}
          blobPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
          blobSize={blobSize}
        />
      </div>

      <GameHUD
        biomass={gameState.biomass}
        gameState={gameState}
        onBuyGenerator={handleBuyGenerator}
        onBuyUpgrade={handleBuyUpgrade}
        onEvolve={handleEvolve}
        blobSize={blobSize}
      />

      <AnimationLayer />
    </div>
  );
}

export default App;
