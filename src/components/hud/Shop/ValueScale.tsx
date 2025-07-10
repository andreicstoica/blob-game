import React from 'react';
import type { GameState } from '../../../game/types';
import { NumberFormatter } from '../../../utils/numberFormat';

interface ValueScaleProps {
  gameState: GameState;
  highThreshold: number;
  lowThreshold: number;
}

export const ValueScale: React.FC<ValueScaleProps> = ({ gameState, highThreshold, lowThreshold }) => {
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
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#22c55e',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <span style={{
          color: '#22c55e',
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
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#f59e0b',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <span style={{
          color: '#f59e0b',
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
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <span style={{
          color: '#ef4444',
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