import React from 'react';
import type { GameState } from '../../engine/game';
import { GrowthStats } from './GrowthStats';
import { Shop } from './Shop';
import { EvolutionPanel } from './EvolutionPanel';
import { ScaleIndicator } from './ScaleIndicator';

interface GameHUDProps {
  biomass: number;
  gameState?: GameState;
  onBuyGenerator?: (generatorId: string) => void;
  onBuyUpgrade?: (upgradeId: string) => void;
  onEvolve?: () => void;
  blobSize?: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({ 
  biomass,
  gameState,
  onBuyGenerator, 
  onBuyUpgrade,
  onEvolve,
  blobSize = 50
}) => {
  return (
    <>
      {/* Growth Stats Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: '600px',
        right: '600px',
        height: '140px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <GrowthStats
          biomass={biomass}
          gameState={gameState}
        />
      </div>

      {/* Shop Section */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '350px',
        height: '100vh',
        zIndex: 1000
      }}>
        <Shop 
          biomass={biomass}
          gameState={gameState}
          onBuyGenerator={onBuyGenerator}
          onBuyUpgrade={onBuyUpgrade}
        />
      </div>

      <EvolutionPanel 
        biomass={biomass}
        gameState={gameState}
        onEvolve={onEvolve}
      />
      <ScaleIndicator biomass={biomass} blobSize={blobSize} />
    </>
  );
}; 