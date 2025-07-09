import React from 'react';
import type { GameState } from '../../../engine/game';
import { NumberFormatter } from '../../../utils/numberFormat';
import { LEVELS } from '../../../engine/levels';

interface UpgradesProps {
  biomass: number;
  gameState: GameState;
  onBuyUpgrade: (upgradeId: string) => void;
  generatorFilter: 'current' | 'all';
  currentLevel: { name: string };
}

export const Upgrades: React.FC<UpgradesProps> = ({ 
  biomass,
  gameState,
  onBuyUpgrade,
  generatorFilter,
  currentLevel
}) => {
  const isContentAvailable = (unlockedAtLevel: string) => {
    const levelIndex = LEVELS.findIndex(level => level.name === unlockedAtLevel);
    const currentLevelIndex = LEVELS.findIndex(level => level.name === currentLevel.name);
    return levelIndex <= currentLevelIndex;
  };

  return (
    <>
      <h3 style={{ margin: '30px 0 15px 0', fontSize: '16px' }}>Upgrades</h3>
      {Object.values(gameState.upgrades)
        .filter(upgrade => {
          if (generatorFilter === 'current') {
            // Only show upgrades from current level
            return upgrade.unlockedAtLevel === currentLevel.name;
          } else {
            // Show all unlocked upgrades
            return isContentAvailable(upgrade.unlockedAtLevel);
          }
        })
        .sort((a, b) => {
          // Sort unpurchased first, then purchased
          if (a.purchased && !b.purchased) return 1;
          if (!a.purchased && b.purchased) return -1;
          return 0;
        })
        .map(upgrade => {
        const canAfford = biomass >= upgrade.cost && !upgrade.purchased;
        
        return (
          <div key={upgrade.id} style={{
            backgroundColor: upgrade.purchased 
              ? 'rgba(59, 130, 246, 0.2)' // blue for purchased
              : canAfford 
                ? 'rgba(74, 222, 128, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)',
            border: `2px solid ${
              upgrade.purchased 
                ? '#3b82f6' // blue border for purchased
                : canAfford 
                  ? '#4ade80' 
                  : '#666'
            }`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '10px',
            cursor: canAfford ? 'pointer' : 'not-allowed',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            transform: 'scale(1)',
            boxShadow: upgrade.purchased 
              ? '0 2px 8px rgba(59, 130, 246, 0.3)' // blue shadow for purchased
              : canAfford 
                ? '0 2px 8px rgba(74, 222, 128, 0.3)' 
                : 'none'
          }}
          onClick={() => canAfford && onBuyUpgrade(upgrade.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.01)';
            if (canAfford && !upgrade.purchased) {
              e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.3)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.4)';
            } else if (!upgrade.purchased) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            if (!upgrade.purchased) {
              e.currentTarget.style.backgroundColor = canAfford 
                ? 'rgba(74, 222, 128, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = canAfford 
                ? '0 2px 8px rgba(74, 222, 128, 0.3)' 
                : 'none';
            }
          }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '15px' }}>
              {upgrade.name}
              {upgrade.purchased && (
                <span style={{ marginLeft: '5px', color: '#3b82f6' }}>✓</span>
              )}
            </div>
            <div style={{ opacity: 0.8, marginBottom: '5px', lineHeight: '1.3', fontSize: '13px' }}>
              {upgrade.description}
            </div>
            {!upgrade.purchased && (
              <div style={{ 
                color: canAfford ? '#4ade80' : '#ef4444',
                fontWeight: 'bold',
                fontSize: '13px'
              }}>
                Cost: <span style={{ fontSize: '15px' }}>{NumberFormatter.cost(upgrade.cost, gameState)}</span>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}; 