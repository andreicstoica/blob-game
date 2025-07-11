import "./globals.css";
import { GameScene } from "./components/GameScene";
import { GameHUD } from "./components/hud/GameHUD";
import { IntroScreen } from "./components/IntroScreen";
import { useGame } from "./hooks/useGame";
import { useCameraZoom } from "./hooks/useCameraZoom";
import { useBlobSize } from "./hooks/useBlobSize";
import { getCurrentLevel } from "./game/systems/actions";
import { useIntroStore } from "./store/introStore";
import { calculateBlobPosition } from "./game/systems/calculations";
import { initSounds } from "./utils/sound"; // Add this import
import { useEffect } from "react"; // Add this import

// Toast imports for GameComponent
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const showIntro = useIntroStore((state) => state.showIntro);
  const endIntro = useIntroStore((state) => state.endIntro);
  const gameHook = useGame();

  // Initialize sounds when app loads
  useEffect(() => {
    initSounds();
  }, []);

  const handleIntroTransition = () => {
    // Placeholder for any transition logic
  };

  const handleIntroComplete = () => {
    endIntro();
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Game Screen - always renders in background */}
      <GameComponent showIntro={showIntro} gameHook={gameHook} />

      {/* Intro Screen - overlays on top with transparency */}
      {showIntro && (
        <IntroScreen
          onTransitionStart={handleIntroTransition}
          onComplete={handleIntroComplete}
          onEvolve={gameHook.handleEvolve}
        />
      )}
    </div>
  );
}

// Game component that always renders
function GameComponent({
  showIntro,
  gameHook,
}: {
  showIntro: boolean;
  gameHook: ReturnType<typeof useGame>;
}) {
  const {
    gameState,
    tutorialState,
    handleBlobClick,
    handleBuyGenerator,
    handleBuyUpgrade,
    handleEvolve,
  } = gameHook;

  const currentLevel = getCurrentLevel(gameState);
  const currentZoom = useCameraZoom({ gameState, currentLevel });
  const blobSize = useBlobSize(gameState);
  const blobPosition = calculateBlobPosition(); // Calculate blob position for toast alignment

  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      style={{
        opacity: showIntro ? 0.3 : 1, // Dimmed when intro is showing
        filter: showIntro ? "blur(10px)" : "none", // Blur background during intro
        transition: "opacity 0.25s ease-in-out, filter 1s ease-in-out",
        zIndex: 1, // Lower z-index so intro appears on top
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
        onTutorialStepComplete={gameHook.handleTutorialStepComplete}
        blobSize={blobSize}
      />

      {/* Toast Notifications - Aligned with blob horizontally */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: `${blobPosition.x}px`,
          transform: "translateX(-50%)",
          zIndex: 9999,
          pointerEvents: "none", // Allow clicks to pass through
        }}
      >
        <ToastContainer
          position="top-center" // Use top-center since we're positioning the container manually
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="blob-toast"
          style={{
            position: "relative",
            pointerEvents: "auto", // Re-enable pointer events for the toasts themselves
          }}
        />
      </div>
    </div>
  );
}

export default App;
