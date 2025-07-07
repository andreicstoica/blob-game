// Test for blob, do not merge
import './App.css'
import { BlobTest } from './components/Blob/BlobTest';
import { GameHUD } from './components/GameHUD';
import { useGame } from './hooks/useGame';

function App() {
  const { gameState, handleBlobClick, handleBuyGenerator, handleBuyUpgrade } = useGame();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GameHUD 
        biomass={gameState.biomass}
        gameState={gameState}
        onBuyGenerator={handleBuyGenerator}
        onBuyUpgrade={handleBuyUpgrade}
      />
      <BlobTest onBlobClick={handleBlobClick} biomass={gameState.biomass} />
    </div>
  );
}

export default App;
