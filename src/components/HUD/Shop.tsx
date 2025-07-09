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
  const [generatorFilter, setGeneratorFilter] = useState<'current' | 'all'>('current');

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
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    onBuyUpgrade(upgradeId);
  };

  return (
    <div style={{ 
      userSelect: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      height: '100vh',
      overflowY: 'auto'
    }}>
      <h2 style={{
        margin: '0 0 20px 0',
        fontSize: '24px',
        color: '#93c5fd',
        textAlign: 'center',
        userSelect: 'none'
      }}>
        Shop
      </h2>
      {/* Generators */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Generators</h3>
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          padding: '2px'
        }}>
          <button
            onClick={() => setGeneratorFilter(generatorFilter === 'current' ? 'all' : 'current')}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: generatorFilter === 'current' ? '#60a5fa' : 'transparent',
              color: generatorFilter === 'current' ? '#000' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: generatorFilter === 'current' ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            Current
          </button>
          <button
            onClick={() => setGeneratorFilter(generatorFilter === 'all' ? 'current' : 'all')}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              backgroundColor: generatorFilter === 'all' ? '#60a5fa' : 'transparent',
              color: generatorFilter === 'all' ? '#000' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: generatorFilter === 'all' ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            All
          </button>
        </div>
      </div>
      {Object.values(gameState.generators)
        .filter(generator => {
          if (generatorFilter === 'current') {
            // Only show generators from current level
            return generator.unlockedAtLevel === currentLevel.name;
          } else {
            // Show all unlocked generators
            return isContentAvailable(generator.unlockedAtLevel);
          }
        })
        .map(generator => {
        const cost = getGeneratorCost(generator);
        const canAfford = biomass >= cost;
        
        return (
          <div key={generator.id} style={{
            backgroundColor: canAfford 
              ? 'rgba(74, 222, 128, 0.2)' 
              : 'rgba(255, 255, 255, 0.1)',
            border: `2px solid ${
              canAfford 
                ? '#4ade80' 
                : '#666'
            }`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '10px',
            cursor: canAfford ? 'pointer' : 'default',
            fontSize: '12px',
            position: 'relative',
            transition: 'all 0.2s ease',
            transform: 'scale(1)',
            boxShadow: canAfford 
              ? '0 2px 8px rgba(74, 222, 128, 0.3)' 
              : 'none'
          }}
          onClick={() => canAfford && handleBuyGenerator(generator.id)}
          onMouseEnter={(e) => {
            if (canAfford) {
              e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.3)';
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = canAfford 
              ? 'rgba(74, 222, 128, 0.2)' 
              : 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = canAfford 
              ? '0 2px 8px rgba(74, 222, 128, 0.3)' 
              : 'none';
          }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px',
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              justifyContent: 'flex-end'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>Owned:</div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: generator.level === 0 ? '#9ca3af' : '#ffffff' 
              }}>
                {generator.level}
              </div>
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '8px', 
              right: '8px',
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <div style={{ 
                color: '#60a5fa',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                Per: +<span style={{ fontSize: '15px' }}>{generator.baseEffect}</span>
              </div>
              <div style={{ 
                color: '#f59e0b',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                Total: +<span style={{ fontSize: '15px' }}>{(generator.baseEffect * generator.level).toLocaleString()}</span>
              </div>
            </div>
            
            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '15px' }}>
              {generator.name}
            </div>
            <div style={{ opacity: 0.8, marginBottom: '5px', lineHeight: '1.3', fontSize: '13px' }}>
              {generator.description}
            </div>
              <div style={{ 
                marginTop: '5px'
              }}>
                <div style={{ 
                  color: canAfford ? '#f59e0b' : '#ef4444',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}>
                  Cost: <span style={{ fontSize: '15px' }}>{cost.toLocaleString()}</span>
                </div>
              </div>
          </div>
        );
      })}

      {/* Upgrades */}
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
          onClick={() => canAfford && handleBuyUpgrade(upgrade.id)}
          onMouseEnter={(e) => {
            if (canAfford && !upgrade.purchased) {
              e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.3)';
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!upgrade.purchased) {
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
                Cost: <span style={{ fontSize: '15px' }}>{upgrade.cost.toLocaleString()}</span>
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