import './globals.css'
import CycleMaps from "./components/CycleMaps";
import Blob from './components/Blob/Blob';
import { Nutrients } from './components/Nutrients';
import { GameHUD } from './components/GameHUD';
import { useGame } from './hooks/useGame';
import { AnimationLayer } from './components/Animations/AnimationLayer.tsx';

function App() {
  const { 
    gameState, 
    handleBlobClick, 
    handleBuyGenerator, 
    handleBuyUpgrade, 
    handleNutrientEaten, 
    getNearbyNutrientsForBlob 
  } = useGame();

  // Calculate blob position (center of screen)
  const blobPosition = { x: 400, y: 300 }; // Center of 800x600 screen
  const nearbyNutrients = getNearbyNutrientsForBlob(blobPosition);

  return (
    <div className="w-screen h-screen relative">
      <CycleMaps />
      <GameHUD 
        biomass={gameState.biomass}
        gameState={gameState}
        onBuyGenerator={handleBuyGenerator}
        onBuyUpgrade={handleBuyUpgrade}
      />
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
      <Nutrients nutrients={gameState.nutrients} />

      <AnimationLayer />
      
      {/* Temporary debug display */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded text-sm z-50 font-mono">
        <div>Total Nutrients: {gameState.nutrients.length}</div>
        <div>Visible: {gameState.nutrients.filter(n => !n.consumed).length}</div>
        <div>Nearby: {nearbyNutrients.length}</div>
        <div>Blob Size: {Math.max(50, gameState.biomass * 10)}</div>
        {gameState.nutrients.slice(0, 3).map(n => (
          <div key={n.id} className="text-xs">
            {n.id}: ({Math.round(n.x)}, {Math.round(n.y)}) {n.consumed ? 'consumed' : 'active'}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;