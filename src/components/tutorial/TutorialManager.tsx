import React from 'react';
import type { GameState } from '../../game/types';
import { TutorialArrow } from './TutorialArrow';
import { ClickIndicator } from './ClickIndicator';
import { getCurrentTutorialStep } from '../../game/systems/tutorial';

interface TutorialManagerProps {
  gameState: GameState;
  blobPosition: { x: number; y: number };
}

export const TutorialManager: React.FC<TutorialManagerProps> = ({
  gameState,
  blobPosition,
}) => {
  const currentStep = getCurrentTutorialStep(gameState.tutorial);

  // Only show tutorial for click-blob step
  if (!currentStep || currentStep.type !== 'click-blob') {
    return null;
  }

  return (
    <div className="tutorial-overlay fixed inset-0 pointer-events-none z-50">
      {/* Arrow pointing up at blob from below */}
      <TutorialArrow
        targetPosition={blobPosition}
        isVisible={true}
      />
      
      {/* Click indicator below the arrow */}
      <ClickIndicator
        position={{
          x: blobPosition.x,
          y: blobPosition.y + 110 // Position with extra 10px spacing
        }}
        isVisible={true}
      />
    </div>
  );
}; 