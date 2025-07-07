import "./globals.css";

import Blob from "./components/Blob/Blob";
import { Nutrients } from "./components/Nutrients";
import { GameHUD } from "./components/GameHUD";
import { ScaleIndicator } from "./components/ScaleIndicator";
import { useGame } from "./hooks/useGame";
import { useMapSelector } from "./engine/mapState";
import { useMemo } from "react";

function App() {
  const {
    gameState,
    handleBlobClick,
    handleBuyGenerator,
    handleBuyUpgrade,
    handleNutrientEaten,
    getNearbyNutrientsForBlob,
  } = useGame();

  const phase = useMapSelector((s) => s.phase);

  // Calculate zoom based on blob size
  const blobSize = Math.max(50, gameState.biomass * 10);
  const zoom = useMemo(() => {
    const baseZoom = 1.0;
    const zoomFactor = Math.max(0.15, baseZoom - (blobSize - 50) / 200);
    return zoomFactor;
  }, [blobSize]);

  // Blob position is always at center (0,0) in its coordinate system
  const blobPosition = { x: 0, y: 0 };
  const nearbyNutrients = getNearbyNutrientsForBlob(blobPosition);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div
        className="w-full h-full relative"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <Nutrients nutrients={gameState.nutrients} phase={phase} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none">
          <Blob
            id="main-blob"
            biomass={gameState.biomass}
            position={{ x: 0, y: 0 }}
            onBlobClick={handleBlobClick}
            onFoodEaten={handleNutrientEaten}
            nearbyFood={nearbyNutrients}
          />
        </div>
      </div>

      {/* HUD stays outside zoom */}
      <GameHUD
        biomass={gameState.biomass}
        gameState={gameState}
        onBuyGenerator={handleBuyGenerator}
        onBuyUpgrade={handleBuyUpgrade}
      />

      {/* Scale Indicator */}
      <ScaleIndicator zoom={zoom} blobSize={blobSize} />
    </div>
  );
}

export default App;
