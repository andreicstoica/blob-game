import React, { useState, useMemo } from 'react';
import type { GameState } from '../../../game/types';
import { getCurrentLevel, getUnlockedGenerators } from '../../../game/systems/actions';
import { Generators, Upgrades, FilterToggle, BuyMultiplierToggle, ValueScale } from './index';


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
  const [buyMultiplier, setBuyMultiplier] = useState<1 | 10 | 100>(1);

  if (!gameState || !onBuyGenerator || !onBuyUpgrade) {
    return null;
  }

  const currentLevel = getCurrentLevel(gameState);

  // Calculate value thresholds for the scale - use useMemo to recalculate when gameState changes
  const valueThresholds = useMemo(() => {
    // Get all unlocked generators through current level
    const unlockedGenerators = getUnlockedGenerators(gameState);
    
    if (unlockedGenerators.length === 0) {
      return { highThreshold: 0, lowThreshold: 0 };
    }
    
    // Calculate values for unlocked generators only
    const unlockedValues = unlockedGenerators.map(generator => {
      const nextCost = generator.baseCost * Math.pow(generator.costMultiplier, generator.level);
      const growthIncrease = generator.baseEffect;
      return growthIncrease > 0 ? nextCost / growthIncrease : 0;
    }).filter(value => value > 0);
    
    if (unlockedValues.length === 0) {
      return { highThreshold: 0, lowThreshold: 0 };
    }
    
    // Find min and max values for unlocked generators
    const minValue = Math.min(...unlockedValues);
    const maxValue = Math.max(...unlockedValues);
    const valueRange = maxValue - minValue;
    
    if (valueRange === 0) {
      return { highThreshold: minValue, lowThreshold: minValue };
    }
    
    // Calculate thresholds based on value ranges for unlocked generators
    // Lower values = better deals (green), higher values = worse deals (red)
    const lowThreshold = minValue + (valueRange * 0.33); // 33% from min (green/yellow boundary)
    const highThreshold = minValue + (valueRange * 0.66); // 66% from min (yellow/red boundary)
    
    return { highThreshold, lowThreshold };
  }, [gameState, currentLevel.name]);

  const handleBuyGenerator = (generatorId: string) => {
    // Buy multiple generators based on multiplier
    for (let i = 0; i < buyMultiplier; i++) {
      onBuyGenerator(generatorId);
    }
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    onBuyUpgrade(upgradeId);
  };

  return (
    <div style={{ 
      userSelect: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Fixed Header */}
      <div style={{ 
        padding: '20px 20px 15px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
        
        {/* Filter and Buy Multiplier Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px',
          gap: '10px'
        }}>
          <FilterToggle 
            filter={generatorFilter} 
            onFilterChange={setGeneratorFilter} 
          />
          <BuyMultiplierToggle 
            multiplier={buyMultiplier} 
            onMultiplierChange={setBuyMultiplier} 
          />
        </div>

        {/* Value Scale Display */}
        <ValueScale 
          gameState={gameState}
          highThreshold={valueThresholds.highThreshold}
          lowThreshold={valueThresholds.lowThreshold}
        />
      </div>

      {/* Scrollable Content */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '0 20px 20px 20px'
      }}>
        {/* Generators Component */}
        <Generators
          biomass={biomass}
          gameState={gameState}
          onBuyGenerator={handleBuyGenerator}
          generatorFilter={generatorFilter}
          currentLevel={currentLevel}
          buyMultiplier={buyMultiplier}
        />

        {/* Upgrades Component */}
        <Upgrades
          biomass={biomass}
          gameState={gameState}
          onBuyUpgrade={handleBuyUpgrade}
          generatorFilter={generatorFilter}
          currentLevel={currentLevel}
        />
      </div>

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
        
        .generator-card:hover .generator-stats {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}; 