import React from 'react';
import { Colors } from '../../../styles/colors';

interface BuyMultiplierToggleProps {
  multiplier: 1 | 10 | 100;
  onMultiplierChange: (multiplier: 1 | 10 | 100) => void;
}

export const BuyMultiplierToggle: React.FC<BuyMultiplierToggleProps> = ({ multiplier, onMultiplierChange }) => {
  return (
    <div style={{ 
      display: 'flex', 
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '6px',
      padding: '2px',
      width: 'fit-content'
    }}>
      <button
        onClick={() => onMultiplierChange(1)}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: multiplier === 1 ? Colors.shop.primary : 'transparent',
          color: multiplier === 1 ? '#000' : '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: multiplier === 1 ? 'bold' : 'normal',
          transition: 'all 0.2s ease',
          textAlign: 'center'
        }}
      >
        Buy 1
      </button>
      <button
        onClick={() => onMultiplierChange(10)}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: multiplier === 10 ? Colors.shop.primary : 'transparent',
          color: multiplier === 10 ? '#000' : '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: multiplier === 10 ? 'bold' : 'normal',
          transition: 'all 0.2s ease',
          textAlign: 'center'
        }}
      >
        Buy 10
      </button>
      <button
        onClick={() => onMultiplierChange(100)}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: multiplier === 100 ? Colors.shop.primary : 'transparent',
          color: multiplier === 100 ? '#000' : '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: multiplier === 100 ? 'bold' : 'normal',
          transition: 'all 0.2s ease',
          textAlign: 'center'
        }}
      >
        Buy 100
      </button>
    </div>
  );
}; 