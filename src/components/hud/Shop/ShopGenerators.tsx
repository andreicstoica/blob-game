import React, { useMemo, useState, useEffect } from 'react';
import type { GameState } from '../../../game/types';
import type { TutorialState } from '../../../game/types/ui';
import { NumberFormatter } from '../../../utils/numberFormat';
import { getGeneratorValueInfo } from '../../../game/systems/generatorValue';
import { isContentAvailable, calculateTotalCost } from '../../../game/systems/actions';
import { GAME_CONFIG } from '../../../game/content/config';
import { Colors } from '../../../styles/colors';



interface ShopFloatingNumber {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface GeneratorsProps {
  biomass: number;
  gameState: GameState;
  tutorialState?: TutorialState;
  onBuyGenerator: (generatorId: string) => void;
  generatorFilter: 'current' | 'all';
  currentLevel: { name: string };
  buyMultiplier: 1 | 10 | 100;
}

export const ShopGenerators: React.FC<GeneratorsProps> = ({ 
  biomass,
  gameState,
  tutorialState,
  onBuyGenerator,
  generatorFilter,
  currentLevel,
  buyMultiplier
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
  // Sort generators by affordability and value
  const sortedGenerators = useMemo(() => {
    const filteredGenerators = Object.values(gameState.generators)
      .filter(generator => {
        // Always show tutorial generator during tutorial
        if (generator.id === 'tutorial-generator') {
          return tutorialState?.isActive && tutorialState.currentStep?.type === 'shop-intro' && !tutorialState.completedSteps.has('shop-intro');
        }
        
        if (generatorFilter === 'current') {
          // Only show generators from current level
          return generator.unlockedAtLevel === currentLevel.name;
        } else {
          // Show all unlocked generators
          return isContentAvailable(generator.unlockedAtLevel, currentLevel.name);
        }
      });

    return filteredGenerators.sort((a, b) => {
      const costA = calculateTotalCost(a, buyMultiplier);
      const costB = calculateTotalCost(b, buyMultiplier);
      const canAffordA = biomass >= costA;
      const canAffordB = biomass >= costB;

      // First sort by affordability (affordable generators first)
      if (canAffordA !== canAffordB) {
        return canAffordA ? -1 : 1;
      }

      // Then sort by value (better value = lower cost/growth ratio)
      const valueA = getGeneratorValueInfo(a.id, gameState);
      const valueB = getGeneratorValueInfo(b.id, gameState);
      
      if (valueA && valueB) {
        return valueA.value - valueB.value; // Lower value = better
      }
      
      return 0;
    });
  }, [gameState.generators, generatorFilter, currentLevel.name, biomass, buyMultiplier, gameState, tutorialState]);

  return (
    <>
      <h3 style={{ margin: '10px 0 10px 0', fontSize: '16px' }}>Generators</h3>
      {sortedGenerators.map((generator, index) => {

        const totalCost = calculateTotalCost(generator, buyMultiplier);
        const canAfford = biomass >= totalCost;
        
        // Tutorial generator is considered "purchased" after 1 level
        const isTutorialPurchased = generator.id === 'tutorial-generator' && generator.level >= 1;
        
        // Check if this is the first affordable generator
        const isFirstAffordable = canAfford && index === sortedGenerators.findIndex(g => biomass >= calculateTotalCost(g, buyMultiplier));
        
        // Get level color for gradient
        const getLevelColor = (levelName: string) => {
          switch (levelName) {
            case 'microscopic': return '#c0c0c0'; // Silver
            case 'petri-dish': return '#3b82f6'; // Blue
            case 'lab': return '#84cc16'; // Lime
            case 'neighborhood': return '#f59e0b'; // Amber
            case 'city': return '#8b5cf6'; // Purple
            case 'continent': return '#06b6d4'; // Cyan
            case 'earth': return '#10b981'; // Emerald
            case 'solar-system': return '#f97316'; // Orange
            default: return '#6b7280'; // Gray
          }
        };

        const levelColor = getLevelColor(generator.unlockedAtLevel);
        
        return (
          <div key={generator.id} 
            className="generator-card"
            style={{
              background: isTutorialPurchased 
                ? `${Colors.tutorial.primary}30` // purple for purchased tutorial generator
                : canAfford 
                  ? `linear-gradient(20deg, ${Colors.generators.primary}30 0%, ${Colors.generators.primary}30 70%, ${levelColor}20 70%, ${levelColor}20 100%)`
                  : `linear-gradient(20deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 70%, ${levelColor}15 70%, ${levelColor}15 100%)`,
              border: `2px solid ${
                isTutorialPurchased 
                  ? Colors.tutorial.primary // purple border for purchased tutorial generator
                  : canAfford 
                    ? Colors.generators.primary 
                    : '#666'
              }`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
              cursor: canAfford && !isTutorialPurchased ? 'pointer' : 'default',
              fontSize: '12px',
              position: 'relative',
              transition: 'all 0.3s ease-in-out',
              transform: 'scale(1)',
              boxShadow: isTutorialPurchased 
                ? `0 2px 8px ${Colors.tutorial.primary}40` // purple shadow for purchased tutorial generator
                : canAfford 
                  ? `0 2px 8px ${Colors.generators.primary}40` 
                  : 'none',
              animation: isFirstAffordable ? 'generatorPulse 2s ease-in-out infinite' : 'none'
            }}
          onClick={(e) => {
            if (canAfford && !isTutorialPurchased) {
              // Calculate growth increase before purchase
              const growthIncrease = generator.growthPerTick * buyMultiplier; // This is per tick
              const growthPerSecond = growthIncrease * (1000 / GAME_CONFIG.tickRate); // Convert to per-second
              
              onBuyGenerator(generator.id);
              
              // Add floating number animation for cost
              const rect = e.currentTarget.getBoundingClientRect();
              addFloatingNumber(
                `-${NumberFormatter.biomass(totalCost, gameState)}`,
                rect.right - 20,
                rect.top + rect.height / 2,
                '#ef4444'
              );
              
              // Add floating number animation for growth increase - position next to GameStats
              // Find the GameStats element and position relative to it
              const gameStatsElement = document.querySelector('[style*="position: fixed"][style*="top: 0"][style*="left: 600px"]');
              if (gameStatsElement) {
                const gameStatsRect = gameStatsElement.getBoundingClientRect();
                addFloatingNumber(
                  `${NumberFormatter.rate(growthPerSecond, gameState)}`,
                  gameStatsRect.left + gameStatsRect.width / 2 + 80, // Right of the GROWTH/SEC number
                  gameStatsRect.top + 80, // Aligned with the growth rate value
                  '#4ade80'
                );
              }
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.01)';
            if (isTutorialPurchased) {
              e.currentTarget.style.backgroundColor = `${Colors.tutorial.primary}40`;
              e.currentTarget.style.boxShadow = `0 4px 12px ${Colors.tutorial.primary}60`;
            } else if (canAfford) {
              e.currentTarget.style.backgroundColor = `${Colors.generators.primary}40`;
              e.currentTarget.style.boxShadow = `0 4px 12px ${Colors.generators.primary}60`;
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
            if (isTutorialPurchased) {
              e.currentTarget.style.backgroundColor = `${Colors.tutorial.primary}30`;
              e.currentTarget.style.boxShadow = `0 2px 8px ${Colors.tutorial.primary}40`;
            } else {
              e.currentTarget.style.backgroundColor = canAfford 
                ? `${Colors.generators.primary}30` 
                : 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = canAfford 
                ? `0 2px 8px ${Colors.generators.primary}40` 
                : 'none';
            }
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
                color: generator.level === 0 ? '#6b7280' : '#ffffff' 
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
                color: Colors.biomass.primary,
                fontSize: '13px',
                fontWeight: 'normal'
              }}>
                Per: <span style={{ fontSize: '15px' }}>{NumberFormatter.rate(generator.growthPerTick * 10, gameState)}</span> / sec
              </div>
              <div style={{ 
                color: Colors.biomass.primary,
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                Total: <span style={{ fontSize: '15px' }}>{NumberFormatter.rate(generator.growthPerTick * generator.level * 10, gameState)}</span> / sec
              </div>
            </div>
            
            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '15px' }}>
              {generator.name}
              {isTutorialPurchased && (
                <span style={{ marginLeft: '5px', color: Colors.tutorial.primary }}>✓</span>
              )}
            </div>
            <div style={{ opacity: 0.8, marginBottom: '5px', lineHeight: '1.3', fontSize: '13px' }}>
              {generator.description}
            </div>
              <div style={{ 
                marginTop: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {/* Value Indicator - Hidden for now */}
                {/* {valueInfo && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: valueInfo.color,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    flexShrink: 0
                  }}
                    title={`Value Rank: ${valueInfo.rank}/${Object.keys(gameState.generators).length} (${(valueInfo.value * 1000).toFixed(1)} growth/1000 biomass)`}
                  />
                )} */}
                <div style={{ 
                  color: canAfford ? '#f59e0b' : '#ef4444',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}>
                  Cost: <span style={{ fontSize: '15px' }}>
                    {NumberFormatter.biomass(totalCost, gameState)}
                  </span>
                </div>
              </div>
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
        
        @keyframes generatorPulse {
          0% {
            box-shadow: 0 2px 8px ${Colors.generators.primary}40;
            transform: scale(1);
          }
          50% {
            box-shadow: 0 4px 16px ${Colors.generators.primary}80;
            transform: scale(1.02);
          }
          100% {
            box-shadow: 0 2px 8px ${Colors.generators.primary}40;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}; 