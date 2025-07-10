import "./globals.css";
import { GameScene } from "./components/GameScene";
import { GameHUD } from "./components/hud/GameHUD";
import { useGame } from "./hooks/useGame";
import { useCameraZoom } from "./hooks/useCameraZoom";
import { useBlobSize } from "./hooks/useBlobSize";
import { getCurrentLevel } from "./game/systems/actions";

function App() {
  const {
    gameState,
    tutorialState,
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

      {/* Game Scene - All game visuals */}
      <GameScene 
        gameState={gameState}
        blobSize={blobSize}
        onBlobClick={handleBlobClick}
        zoom={currentZoom}
      />

      {/* HUD Layer - UI overlays */}
      <GameHUD
        biomass={gameState.biomass}
        gameState={gameState}
        tutorialState={tutorialState}
        onBuyGenerator={handleBuyGenerator}
        onBuyUpgrade={handleBuyUpgrade}
        onEvolve={handleEvolve}
        blobSize={blobSize}
      />
    </div>
  );
}

export default App;
