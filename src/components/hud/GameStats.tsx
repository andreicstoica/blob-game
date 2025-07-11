import React from 'react';
import type { GameState } from '../../game/types';
import { NumberFormatter } from '../../utils/numberFormat';
import { GAME_CONFIG } from '../../game/content/config';

interface GameStatsProps {
  biomass: number;
  gameState?: GameState;
}

export const GameStats: React.FC<GameStatsProps> = ({ 
  biomass, 
  gameState
}) => {
  const formattedBiomass = NumberFormatter.biomass(biomass, gameState);
  const biomassLength = formattedBiomass.length;
  
  // Font size for biomass display
  let fontSize = 48;
  if (biomassLength > 8) fontSize = 36;
  if (biomassLength > 12) fontSize = 28;
  if (biomassLength > 16) fontSize = 24;

  return (
    <div style={{ 
      textAlign: 'center',
      minHeight: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: 'fit-content',
      minWidth: '320px',
      maxWidth: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '15px',
      borderRadius: '0 0 12px 12px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      userSelect: 'none'
    }}>
      {/* Main Biomass Display */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          fontSize: '16px',
          opacity: 0.8, 
          marginBottom: '5px',
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
              marginBottom: '3px',
              fontWeight: 'bold'
            }}>
              GROWTH
            </div>
            <div style={{ 
              fontSize: '16px',
              fontWeight: 'bold', 
              color: '#4ade80',
            }}>
              +{NumberFormatter.rate(gameState.growth * (1000 / GAME_CONFIG.tickRate), gameState)}<span style={{ fontSize: '14px', color: 'white' }}> / sec</span>
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
              marginBottom: '3px',
              fontWeight: 'bold'
            }}>
              CLICK POWER
            </div>
            <div style={{ 
              fontSize: '16px',
              fontWeight: 'bold', 
              color: '#4ade80',
            }}>
              {NumberFormatter.power(gameState.clickPower, gameState)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 