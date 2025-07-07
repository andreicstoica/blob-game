import React from 'react';
import type { GameState } from '../../engine/game';
import { GrowthStats } from './GrowthStats';
import { Shop } from './Shop';

interface GameHUDProps {
  biomass: number;
  gameState?: GameState;
  onBuyGenerator?: (generatorId: string) => void;
  onBuyUpgrade?: (upgradeId: string) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ 
  biomass,
  gameState,
  onBuyGenerator, 
  onBuyUpgrade 
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '350px',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 1000
    }}>
      <GrowthStats biomass={biomass} gameState={gameState} />
      
      <div style={{
        height: '1px',
        backgroundColor: '#4ade80',
        opacity: 0.3,
        margin: '20px 0',
        borderRadius: '1px'
      }} />
      
      <Shop 
        biomass={biomass}
        gameState={gameState}
        onBuyGenerator={onBuyGenerator}
        onBuyUpgrade={onBuyUpgrade}
      />
    </div>
  );
}; 