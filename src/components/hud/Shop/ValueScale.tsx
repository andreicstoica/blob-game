import React from 'react';
import type { GameState } from '../../../game/types';
import { NumberFormatter } from '../../../utils/numberFormat';
import { Colors } from '../../../styles/colors';

interface ValueScaleProps {
  gameState: GameState;
  highThreshold: number;
  lowThreshold: number;
}

export const ValueScale: React.FC<ValueScaleProps> = ({ highThreshold, lowThreshold }) => {
  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '6px',
      padding: '8px 12px',
      marginBottom: '15px',
      fontSize: '11px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'nowrap'
    }}>
      <span style={{ 
        fontWeight: 'normal',
        fontSize: '12px',
        color: '#fff'
      }}>Value:</span>
      
      {/* Best Value (Green) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 4px',
        backgroundColor: `${Colors.biomass.primary}20`,
        borderRadius: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: Colors.biomass.primary,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <span style={{
          color: Colors.biomass.primary,
          fontWeight: 'bold',
          fontSize: '12px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}>
          {NumberFormatter.compact(lowThreshold)}-
        </span>
      </div>
      
      {/* Medium Value (Yellow) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 4px',
        backgroundColor: `${Colors.evolution.primary}20`,
        borderRadius: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: Colors.evolution.primary,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <span style={{
          color: Colors.evolution.primary,
          fontWeight: 'bold',
          fontSize: '12px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}>
          {NumberFormatter.compact(lowThreshold)} - {NumberFormatter.compact(highThreshold)}
        </span>
      </div>
      
      {/* Worst Value (Red) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 4px',
        backgroundColor: `${Colors.headlines.primary}20`,
        borderRadius: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: Colors.headlines.primary,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <span style={{
          color: Colors.headlines.primary,
          fontWeight: 'bold',
          fontSize: '12px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}>
          {NumberFormatter.compact(highThreshold)}+
        </span>
      </div>
    </div>
  );
}; 