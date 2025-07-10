import React, { useState } from 'react';
import type { GameState } from '../../../game/types';
import { getCurrentLevel } from '../../../game/systems/actions';
import { Generators, Upgrades } from './index';

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
      
      {/* Filter Toggle */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
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

      {/* Generators Component */}
      <Generators
        biomass={biomass}
        gameState={gameState}
        onBuyGenerator={handleBuyGenerator}
        generatorFilter={generatorFilter}
        currentLevel={currentLevel}
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