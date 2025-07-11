import React from 'react';
import { Colors } from '../../../styles/colors';

interface FilterToggleProps {
  filter: 'current' | 'all';
  onFilterChange: (filter: 'current' | 'all') => void;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({ filter, onFilterChange }) => {
  return (
    <div style={{ 
      display: 'flex', 
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '6px',
      padding: '2px'
    }}>
      <button
        onClick={() => onFilterChange(filter === 'current' ? 'all' : 'current')}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: filter === 'current' ? Colors.shop.primary : 'transparent',
          color: filter === 'current' ? '#000' : '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: filter === 'current' ? 'bold' : 'normal',
          transition: 'all 0.2s ease'
        }}
      >
        Current
      </button>
      <button
        onClick={() => onFilterChange(filter === 'all' ? 'current' : 'all')}
        style={{
          padding: '4px 12px',
          fontSize: '12px',
          backgroundColor: filter === 'all' ? Colors.shop.primary : 'transparent',
          color: filter === 'all' ? '#000' : '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: filter === 'all' ? 'bold' : 'normal',
          transition: 'all 0.2s ease'
        }}
      >
        All
      </button>
    </div>
  );
}; 