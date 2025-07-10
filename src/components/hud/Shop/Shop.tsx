import React, { useState, useMemo } from 'react';
import type { GameState } from '../../../game/types';
import { getCurrentLevel } from '../../../game/systems/actions';
import { Generators, Upgrades, FilterToggle, BuyMultiplierToggle, ValueScale } from './index';
import { calculateAllGeneratorValues } from '../../../game/systems/generatorValue';

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
    const allValues = calculateAllGeneratorValues(gameState);
    
    if (allValues.length === 0) {
      return { highThreshold: 0, lowThreshold: 0 };
    }
    
    // Get all valid values
    const validValues = allValues.map(v => v.value).filter(v => v > 0);
    
    if (validValues.length === 0) {
      return { highThreshold: 0, lowThreshold: 0 };
    }
    
    // Find min and max values
    const minValue = Math.min(...validValues);
    const maxValue = Math.max(...validValues);
    const valueRange = maxValue - minValue;
    
    if (valueRange === 0) {
      return { highThreshold: minValue, lowThreshold: minValue };
    }
    
    // Calculate thresholds based on value ranges
    const lowThreshold = minValue + (valueRange * 0.33); // 33% from min (green/yellow boundary)
    const highThreshold = minValue + (valueRange * 0.66); // 66% from min (yellow/red boundary)
    
    return { highThreshold, lowThreshold };
  }, [gameState]);

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