import React from 'react';
import type { NutrientState } from '../engine/game';

interface NutrientsProps {
  nutrients: NutrientState[];
}

export const Nutrients: React.FC<NutrientsProps> = ({ nutrients }) => {
  const visibleNutrients = nutrients.filter(n => !n.consumed);

  return (
    <>
      {visibleNutrients.map(nutrient => (
        <div
          key={nutrient.id}
          className="absolute w-6 h-6 bg-green-500 rounded-full animate-pulse z-20 border-2 border-green-300"
          style={{
            left: nutrient.x,
            top: nutrient.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </>
  );
}; 