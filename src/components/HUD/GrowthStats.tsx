import React from 'react';
import type { GameState } from '../../engine/game';

interface GrowthStatsProps {
  biomass: number;
  gameState?: GameState;
}

export const GrowthStats: React.FC<GrowthStatsProps> = ({ biomass, gameState }) => {
  const formatBiomass = (value: number) => {
    if (value >= 1000) {
      return Math.floor(value).toLocaleString();
    }
    return value.toFixed(1);
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ margin: '0 0 10px 0', fontSize: '25px' }}>
        Biomass: 
        <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '60px', marginLeft: '10px' }}>
          {formatBiomass(biomass)}
        </span>
      </h2>
      {gameState && (
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Growth:
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80', marginRight: '5px', marginLeft: '5px' }}>{(gameState.growth * 10).toFixed(1)}</span>
            <span style={{ fontSize: '12px' }}>Biomass / sec</span>
          </div>
          <div style={{ fontSize: '18px' }}>Click Power: 
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80', marginRight: '5px', marginLeft: '5px' }}>{gameState.clickPower}</span>
            <span style={{ fontSize: '12px' }}>Biomass / click</span>
          </div>
        </div>
      )}
    </div>
  );
}; 