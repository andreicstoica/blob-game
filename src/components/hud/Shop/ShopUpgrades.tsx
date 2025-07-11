import React, { useState, useEffect } from 'react';
import type { GameState } from '../../../game/types';
import { NumberFormatter } from '../../../utils/numberFormat';
import { LEVELS } from '../../../game/content/levels';

interface ShopFloatingNumber {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface UpgradesProps {
  biomass: number;
  gameState: GameState;
  onBuyUpgrade: (upgradeId: string) => void;
  generatorFilter: 'current' | 'all';
  currentLevel: { name: string };
}

export const ShopUpgrades: React.FC<UpgradesProps> = ({ 
  biomass,
  gameState,
  onBuyUpgrade,
  generatorFilter,
  currentLevel
}) => {
  const [floatingNumbers, setFloatingNumbers] = useState<ShopFloatingNumber[]>([]);

  // Clean up floating numbers after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setFloatingNumbers([]);
    }, 1000);
    return () => clearTimeout(timer);
  }, [floatingNumbers]);

  const addFloatingNumber = (text: string, x: number, y: number, color: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFloatingNumbers(prev => [...prev, { id, text, x, y, color }]);
  };
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
            background: upgrade.purchased 
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
          onClick={(e) => {
            if (canAfford) {
              onBuyUpgrade(upgrade.id);
              
              // Add floating number animation - position outside shop panel
              const rect = e.currentTarget.getBoundingClientRect();
              const shopPanel = e.currentTarget.closest('[style*="height: 100vh"]');
              const shopRect = shopPanel?.getBoundingClientRect();
              
              // Position the floating number outside the shop panel on the right
              const x = shopRect ? shopRect.right + 20 : rect.right + 20;
              const y = rect.top + rect.height / 2;
              
              addFloatingNumber(
                `-${NumberFormatter.biomass(upgrade.cost, gameState)}`,
                x,
                y,
                '#ef4444'
              );
            }
          }}
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
                Cost: <span style={{ fontSize: '15px' }}>{NumberFormatter.biomass(upgrade.cost, gameState)}</span>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Floating Numbers */}
      {floatingNumbers.map((floatingNumber) => (
        <div
          key={floatingNumber.id}
          style={{
            position: 'fixed',
            left: floatingNumber.x,
            top: floatingNumber.y,
            color: floatingNumber.color,
            fontWeight: 'bold',
            fontSize: '14px',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: 0,
            transform: 'translate(-50%, -50%)',
            animation: 'floatUp 1s ease-out forwards'
          }}
        >
          {floatingNumber.text}
        </div>
      ))}
      
      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(0);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(-10px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-40px);
          }
        }
      `}</style>
    </>
  );
}; 