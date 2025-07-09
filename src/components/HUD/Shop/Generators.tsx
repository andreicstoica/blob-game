import React from 'react';
import type { GameState } from '../../../engine/game';
import { NumberFormatter } from '../../../utils/numberFormat';
import { LEVELS } from '../../../engine/levels';

interface GeneratorsProps {
  biomass: number;
  gameState: GameState;
  onBuyGenerator: (generatorId: string) => void;
  generatorFilter: 'current' | 'all';
  currentLevel: { name: string };
}

export const Generators: React.FC<GeneratorsProps> = ({ 
  biomass,
  gameState,
  onBuyGenerator,
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
      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Generators</h3>
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
        .sort((a, b) => {
          // Sort by cost
          return a.baseCost - b.baseCost;
        })
        .map(generator => {
        const cost = generator.baseCost * Math.pow(generator.costMultiplier, generator.level);
        const canAfford = biomass >= cost;
        
        return (
          <div key={generator.id} 
            className="generator-card"
            style={{
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
          onClick={() => canAfford && onBuyGenerator(generator.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.01)';
            if (canAfford) {
              e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.3)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.4)';
            } else {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.1)';
            }
            // Show stats on hover
            const statsElement = e.currentTarget.querySelector('.generator-stats') as HTMLElement;
            if (statsElement) {
              statsElement.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = canAfford 
              ? 'rgba(74, 222, 128, 0.2)' 
              : 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = canAfford 
              ? '0 2px 8px rgba(74, 222, 128, 0.3)' 
              : 'none';
            // Hide stats on leave
            const statsElement = e.currentTarget.querySelector('.generator-stats') as HTMLElement;
            if (statsElement) {
              statsElement.style.opacity = '0';
            }
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
                {NumberFormatter.owned(generator.level, gameState)}
              </div>
            </div>
            <div 
              className="generator-stats"
              style={{ 
                position: 'absolute', 
                bottom: '8px', 
                right: '8px',
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                opacity: 0,
                transition: 'opacity 0.2s ease'
              }}
            >
              <div style={{ 
                color: '#60a5fa',
                fontSize: '13px',
                fontWeight: 'normal'
              }}>
                Per: <span style={{ fontSize: '15px' }}>{NumberFormatter.rate(generator.baseEffect, gameState)}</span>
              </div>
              <div style={{ 
                color: '#60a5fa',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                Total: <span style={{ fontSize: '15px' }}>{NumberFormatter.rate(generator.baseEffect * generator.level, gameState)}</span>
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
                  Cost: <span style={{ fontSize: '15px' }}>{NumberFormatter.cost(cost, gameState)}</span>
                </div>
              </div>
          </div>
        );
      })}
    </>
  );
}; 