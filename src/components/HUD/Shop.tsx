import React, { useState } from 'react';
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
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());

  if (!gameState || !onBuyGenerator || !onBuyUpgrade) {
    return null;
  }

  const currentLevel = getCurrentLevel(gameState);
  const currentLevelIndex = currentLevel.id;

  // Helper function to check if content is available at current level
  const isContentAvailable = (unlockedAtLevel: string) => {
    const unlockLevel = LEVELS.find(level => level.name === unlockedAtLevel);
    
    // Tutorial-only items: only show in intro level
    if (unlockedAtLevel === 'intro') {
      return currentLevelIndex === 0; // Only show in intro level (id: 0)
    }
    
    return unlockLevel ? unlockLevel.id <= currentLevelIndex : false;
  };

  const handleBuyGenerator = (generatorId: string) => {
    onBuyGenerator(generatorId);
    setPurchasedItems(prev => new Set([...prev, generatorId]));
    // Remove from purchased items after animation
    setTimeout(() => {
      setPurchasedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(generatorId);
        return newSet;
      });
    }, 1000);
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    onBuyUpgrade(upgradeId);
    setPurchasedItems(prev => new Set([...prev, upgradeId]));
    // Remove from purchased items after animation
    setTimeout(() => {
      setPurchasedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(upgradeId);
        return newSet;
      });
    }, 1000);
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
        const isPurchased = purchasedItems.has(generator.id);
        
        return (
          <div key={generator.id} style={{
            backgroundColor: isPurchased 
              ? 'rgba(34, 197, 94, 0.4)' 
              : canAfford 
                ? 'rgba(74, 222, 128, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)',
            border: `2px solid ${
              isPurchased 
                ? '#22c55e' 
                : canAfford 
                  ? '#4ade80' 
                  : '#666'
            }`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '10px',
            cursor: canAfford ? 'pointer' : 'not-allowed',
            fontSize: '12px',
            position: 'relative',
            transition: 'all 0.2s ease',
            transform: isPurchased ? 'scale(1.02)' : 'scale(1)',
            boxShadow: isPurchased 
              ? '0 0 20px rgba(34, 197, 94, 0.5)' 
              : canAfford 
                ? '0 2px 8px rgba(74, 222, 128, 0.3)' 
                : 'none'
          }}
          onClick={() => canAfford && handleBuyGenerator(generator.id)}
          onMouseEnter={(e) => {
            if (canAfford && !isPurchased) {
              e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.3)';
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isPurchased) {
              e.currentTarget.style.backgroundColor = canAfford 
                ? 'rgba(74, 222, 128, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = canAfford 
                ? '0 2px 8px rgba(74, 222, 128, 0.3)' 
                : 'none';
            }
          }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>
              {generator.name} (Lv {generator.level})
            </div>
            <div style={{ opacity: 0.8, marginBottom: '5px', lineHeight: '1.3' }}>
              {generator.description}
            </div>
            <div style={{ 
              display: 'flex'
            }}>
              <div style={{ 
                color: canAfford ? '#60a5fa' : '#ef4444',
                fontWeight: 'bold',
                fontSize: '12px',
                marginRight: '10px'
              }}>
                Cost: <span style={{ fontSize: '14px' }}>{cost.toLocaleString()}</span>
              </div>
              <div style={{ 
                color: '#4ade80',
                fontSize: '12px',
                fontWeight: 'bold',
                flex: 1
              }}>
                Growth: +<span style={{ fontSize: '14px' }}>{generator.baseEffect}</span>
              </div>
            </div>
            
            <div style={{ 
              position: 'absolute', 
              bottom: '8px', 
              right: '8px',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '2px' }}>Owned</div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: generator.level === 0 ? '#9ca3af' : '#f59e0b' 
              }}>
                {generator.level}
              </div>
            </div>

            {isPurchased && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                animation: 'purchasePulse 1s ease-out'
              }}>
                ✨
              </div>
            )}
          </div>
        );
      })}

      {/* Upgrades */}
      <h3 style={{ margin: '30px 0 15px 0', fontSize: '16px' }}>Upgrades</h3>
      {Object.values(gameState.upgrades)
        .filter(upgrade => isContentAvailable(upgrade.unlockedAtLevel))
        .map(upgrade => {
        const canAfford = biomass >= upgrade.cost && !upgrade.purchased;
        const isPurchased = purchasedItems.has(upgrade.id);
        
        return (
          <div key={upgrade.id} style={{
            backgroundColor: upgrade.purchased 
              ? 'rgba(34, 197, 94, 0.3)' 
              : isPurchased
                ? 'rgba(34, 197, 94, 0.4)'
              : canAfford 
                ? 'rgba(74, 222, 128, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)',
            border: `2px solid ${
              upgrade.purchased 
                ? '#22c55e' 
                : isPurchased
                ? '#22c55e' 
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
            transform: isPurchased ? 'scale(1.02)' : 'scale(1)',
            boxShadow: upgrade.purchased 
              ? '0 2px 8px rgba(34, 197, 94, 0.3)' 
              : isPurchased
                ? '0 0 20px rgba(34, 197, 94, 0.5)'
                : canAfford 
                  ? '0 2px 8px rgba(74, 222, 128, 0.3)' 
                  : 'none'
          }}
          onClick={() => canAfford && handleBuyUpgrade(upgrade.id)}
          onMouseEnter={(e) => {
            if (canAfford && !upgrade.purchased && !isPurchased) {
              e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.3)';
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!upgrade.purchased && !isPurchased) {
              e.currentTarget.style.backgroundColor = canAfford 
                ? 'rgba(74, 222, 128, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = canAfford 
                ? '0 2px 8px rgba(74, 222, 128, 0.3)' 
                : 'none';
            }
          }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>
              {upgrade.name}
              {upgrade.purchased && (
                <span style={{ marginLeft: '5px', color: '#22c55e' }}>✓</span>
              )}
            </div>
            <div style={{ opacity: 0.8, marginBottom: '5px', lineHeight: '1.3' }}>
              {upgrade.description}
            </div>
            {!upgrade.purchased && (
              <div style={{ 
                color: canAfford ? '#4ade80' : '#ef4444',
                fontWeight: 'bold'
              }}>
                Cost: {upgrade.cost.toLocaleString()}
              </div>
            )}

            {isPurchased && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                animation: 'purchasePulse 1s ease-out'
              }}>
                ✨
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes purchasePulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
}; 