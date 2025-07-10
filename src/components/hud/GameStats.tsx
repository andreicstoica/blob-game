import React from 'react';
import type { GameState } from '../../game/types';
import { NumberFormatter } from '../../utils/numberFormat';
import { GAME_CONFIG } from '../../game/content/config';

interface GameStatsProps {
  biomass: number;
  gameState?: GameState;
}

export const GameStats: React.FC<GameStatsProps> = ({ biomass, gameState }) => {
  const formattedBiomass = NumberFormatter.biomass(biomass, gameState);
  const biomassLength = formattedBiomass.length;
  
  // Dynamic font size based on biomass length to ensure it fits
  let fontSize = 72;
  if (biomassLength > 8) fontSize = 54;
  if (biomassLength > 12) fontSize = 42;
  if (biomassLength > 16) fontSize = 36;
  
  // Scale padding based on biomass number length: Base 20px, add 5px for each character beyond 3
  const horizontalPadding = Math.max(20, 20 + (biomassLength - 3) * 5);

  return (
    <div style={{ 
      textAlign: 'center',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: 'fit-content',
      minWidth: '100px',
      maxWidth: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: `20px ${horizontalPadding}px`,
      borderRadius: '0 0 18px 18px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      userSelect: 'none'
    }}>
      {/* Main Biomass Display */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          fontSize: '18px', 
          opacity: 0.8, 
          marginBottom: '5px',
          marginTop: '30px',
          fontWeight: 'bold'
        }}>
          BIOMASS
        </div>
        <div style={{ 
          fontSize: `${fontSize}px`, 
          fontWeight: 'bold', 
          color: '#4ade80',
          textShadow: '0 0 20px rgba(74, 222, 128, 0.5)',
          lineHeight: '1',
          padding: '0 10px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: '0',
          flexShrink: 1
        }}>
          {formattedBiomass}
        </div>
      </div>

      {/* Growth and Click Power Row */}
      {gameState && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '12px', 
              opacity: 0.7, 
              marginBottom: '2px',
              fontWeight: 'bold'
            }}>
              GROWTH / SEC
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#4ade80',
              marginBottom: '5px'
            }}>
              {NumberFormatter.rate(gameState.growth * (1000 / GAME_CONFIG.tickRate), gameState)}
            </div>
          </div>
          
          <div style={{ 
            width: '1px', 
            height: '30px', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)' 
          }} />
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '12px', 
              opacity: 0.7, 
              marginBottom: '2px',
              fontWeight: 'bold'
            }}>
              CLICK POWER
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#4ade80',
              marginBottom: '5px'
            }}>
              {NumberFormatter.power(gameState.clickPower, gameState)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 