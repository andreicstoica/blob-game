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
          return tutorialState?.isActive;
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
      <h3 style={{ 
        margin: '10px 0 10px 0', 
        fontSize: '12px',
        padding: '8px 16px',
        border: `2px solid ${Colors.generators.primary}`,
        borderRadius: '6px',
        display: 'inline-block'
      }}>Generators</h3>
      {sortedGenerators.map((generator, index) => {

        const totalCost = calculateTotalCost(generator, buyMultiplier);
        const canAfford = biomass >= totalCost;
        
        // Tutorial generator is considered "purchased" after 1 level
        const isTutorialPurchased = generator.id === 'tutorial-generator' && generator.level >= 1;
        
        // Check if tutorial generator should be enabled (after click-blob step is completed, but before evolution-intro)
        const isTutorialEnabled = generator.id === 'tutorial-generator' && 
          tutorialState?.completedSteps.has('click-blob') && 
          !tutorialState?.completedSteps.has('evolution-intro');
        
        // Check if this is the first affordable generator
        const isFirstAffordable = canAfford && index === sortedGenerators.findIndex(g => biomass >= calculateTotalCost(g, buyMultiplier));
        

        
        return (
          <div key={generator.id} 
            className="generator-card"
            style={{
              background: isTutorialPurchased 
                ? `${Colors.generators.light}30` // light generator color for purchased tutorial generator
                : generator.id === 'tutorial-generator' && !isTutorialEnabled
                  ? 'rgba(128, 128, 128, 0.3)' // gray for disabled tutorial generator
                  : canAfford 
                    ? `${Colors.generators.primary}30`
                    : 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${
                isTutorialPurchased 
                  ? Colors.generators.light // light generator border for purchased tutorial generator
                  : generator.id === 'tutorial-generator' && !isTutorialEnabled
                    ? '#666' // gray border for disabled tutorial generator
                    : canAfford 
                      ? Colors.generators.primary 
                      : '#666'
              }`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
              cursor: canAfford && !isTutorialPurchased && (generator.id !== 'tutorial-generator' || isTutorialEnabled) ? 'pointer' : 'default',
              fontSize: '12px',
              position: 'relative',
              transition: 'all 0.3s ease-in-out',
              transform: 'scale(1)',
              boxShadow: isTutorialPurchased 
                ? `0 2px 8px ${Colors.generators.light}40` // light generator shadow for purchased tutorial generator
                : generator.id === 'tutorial-generator' && !isTutorialEnabled
                  ? 'none' // no shadow for disabled tutorial generator
                : generator.id === 'tutorial-generator' && tutorialState?.currentStep?.type === 'click-blob'
                  ? 'none' // no shadow during click-blob phase
                  : canAfford 
                    ? `0 2px 8px ${Colors.generators.primary}40` 
                    : 'none',
              animation: isFirstAffordable ? 'generatorPulse 2s ease-in-out infinite' : 'none'
            }}
          onClick={(e) => {
            if (canAfford && !isTutorialPurchased && (generator.id !== 'tutorial-generator' || isTutorialEnabled)) {
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
                Colors.headlines.primary
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
              e.currentTarget.style.backgroundColor = `${Colors.generators.light}40`;
              e.currentTarget.style.boxShadow = `0 4px 12px ${Colors.generators.light}60`;
            } else if (canAfford && (generator.id !== 'tutorial-generator' || isTutorialEnabled)) {
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
              e.currentTarget.style.backgroundColor = `${Colors.generators.light}30`;
              e.currentTarget.style.boxShadow = `0 2px 8px ${Colors.generators.light}40`;
            } else {
              e.currentTarget.style.backgroundColor = generator.id === 'tutorial-generator' && !isTutorialEnabled
                ? 'rgba(128, 128, 128, 0.3)'
                : canAfford 
                  ? `${Colors.generators.primary}30` 
              : 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = generator.id === 'tutorial-generator' && !isTutorialEnabled
                ? 'none'
                : canAfford 
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
                color: generator.level === 0 ? '#d1d5db' : '#ffffff' 
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
                  color: canAfford ? Colors.biomass.primary : Colors.headlines.primary,
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