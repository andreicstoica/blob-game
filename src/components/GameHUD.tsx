import React from 'react';
import type { GameState } from '../engine/game';
import { getGeneratorCost } from '../engine/game';

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
      {/* Stats */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '25px' }}>
          Biomass: 
          <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '60px', marginLeft: '10px' }}>
            {biomass.toFixed(1)}
          </span>
        </h2>
        {gameState && (
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>Income:
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80', marginRight: '5px', marginLeft: '5px' }}>{gameState.growth.toFixed(1)}</span>
              <span style={{ fontSize: '12px' }}>Biomass / sec</span>
            </div>
            <div style={{ fontSize: '18px' }}>Click Power: 
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80', marginRight: '5px', marginLeft: '5px' }}>{gameState.clickPower}</span>
              <span style={{ fontSize: '12px' }}>Biomass / click</span>
            </div>
          </div>
        )}
      </div>

      {/* Shop */}
      {gameState && onBuyGenerator && onBuyUpgrade && (
        <div>
          {/* Generators */}
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Generators</h3>
          {Object.values(gameState.generators).map(generator => {
            const cost = getGeneratorCost(generator);
            const canAfford = biomass >= cost;
            
            return (
              <div key={generator.id} style={{
                backgroundColor: canAfford ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${canAfford ? '#4ade80' : '#666'}`,
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '8px',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                fontSize: '12px'
              }}
              onClick={() => canAfford && onBuyGenerator(generator.id)}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {generator.name} (Lv {generator.level})
                </div>
                <div style={{ opacity: 0.8, marginBottom: '5px' }}>
                  {generator.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Cost: {cost}</span>
                  <span>Owned: {generator.level}</span>
                </div>
              </div>
            );
          })}

          {/* Upgrades */}
          <h3 style={{ margin: '30px 0 15px 0', fontSize: '16px' }}>Upgrades</h3>
          {Object.values(gameState.upgrades).map(upgrade => {
            const canAfford = biomass >= upgrade.cost && !upgrade.purchased;
            
            return (
              <div key={upgrade.id} style={{
                backgroundColor: upgrade.purchased 
                  ? 'rgba(34, 197, 94, 0.3)' 
                  : canAfford 
                    ? 'rgba(74, 222, 128, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${
                  upgrade.purchased 
                    ? '#22c55e' 
                    : canAfford 
                      ? '#4ade80' 
                      : '#666'
                }`,
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '8px',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                fontSize: '12px'
              }}
              onClick={() => canAfford && onBuyUpgrade(upgrade.id)}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {upgrade.name}
                  {upgrade.purchased && (
                    <span style={{ marginLeft: '5px', color: '#22c55e' }}>✓</span>
                  )}
                </div>
                <div style={{ opacity: 0.8, marginBottom: '5px' }}>
                  {upgrade.description}
                </div>
                {!upgrade.purchased && (
                  <div>Cost: {upgrade.cost}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}; 