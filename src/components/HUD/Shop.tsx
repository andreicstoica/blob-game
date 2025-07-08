import React from 'react';
import type { GameState } from '../../engine/game';
import { getGeneratorCost, getCurrentLevel } from '../../engine/game';
import { LEVELS } from '../../engine/levels';

interface ShopProps {
  biomass: number;
  gameState?: GameState;
  onBuyGenerator?: (generatorId: string) => void;
  onBuyUpgrade?: (upgradeId: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ 
  biomass,
  gameState,
  onBuyGenerator, 
  onBuyUpgrade 
}) => {
  if (!gameState || !onBuyGenerator || !onBuyUpgrade) {
    return null;
  }

  const currentLevel = getCurrentLevel(gameState);
  const currentLevelIndex = currentLevel.id;

  // Helper function to check if content is available at current level
  const isContentAvailable = (unlockedAtLevel: string) => {
    const unlockLevel = LEVELS.find(level => level.name === unlockedAtLevel);
    return unlockLevel ? unlockLevel.id <= currentLevelIndex : false;
  };

  return (
    <div>
      {/* Generators */}
      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Generators</h3>
      {Object.values(gameState.generators)
        .filter(generator => isContentAvailable(generator.unlockedAtLevel))
        .map(generator => {
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
            fontSize: '12px',
            position: 'relative'
          }}
          onClick={() => canAfford && onBuyGenerator(generator.id)}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {generator.name} (Lv {generator.level})
            </div>
            <div style={{ opacity: 0.8, marginBottom: '5px' }}>
              {generator.description}
            </div>
            <div>Cost: {cost}</div>
            
            <div style={{ 
              position: 'absolute', 
              bottom: '8px', 
              right: '8px',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px' }}>Owned</div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: generator.level === 0 ? '#9ca3af' : '#f59e0b' 
              }}>
                {generator.level}
              </div>
            </div>
          </div>
        );
      })}

      {/* Upgrades */}
      <h3 style={{ margin: '30px 0 15px 0', fontSize: '16px' }}>Upgrades</h3>
      {Object.values(gameState.upgrades)
        .filter(upgrade => isContentAvailable(upgrade.unlockedAtLevel))
        .map(upgrade => {
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
  );
}; 