import "./globals.css";
import { GameScene } from "./components/GameScene";
import { GameHUD } from "./components/hud/GameHUD";
import { IntroScreen } from "./components/IntroScreen";
import { useGame } from "./hooks/useGame";
import { useCameraZoom } from "./hooks/useCameraZoom";
import { useBlobSize } from "./hooks/useBlobSize";
import { getCurrentLevel } from "./game/systems/actions";
import { useState } from "react";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroTransition = () => {
    // Just a placeholder for the IntroScreen callback
    // The actual transition is handled by the IntroScreen component
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Game Screen - always renders in background */}
      <GameComponent showIntro={showIntro} />
      
      {/* Intro Screen - overlays on top with transparency */}
      {showIntro && (
        <IntroScreen 
          onTransitionStart={handleIntroTransition}
          onComplete={handleIntroComplete}
        />
      )}
    </div>
  );
}

// Game component that always renders
function GameComponent({ showIntro }: { showIntro: boolean }) {
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
    <div 
      className="w-screen h-screen relative overflow-hidden"
      style={{
        opacity: showIntro ? 0.3 : 1, // Dimmed when intro is showing
        transition: 'opacity 0.5s ease-in-out',
        zIndex: 1 // Lower z-index so intro appears on top
      }}
    >
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
