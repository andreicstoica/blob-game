import React from 'react';
import type { TutorialState } from '../../game/types/ui';
import { TutorialArrow } from './TutorialArrow';
import { ClickIndicator } from './ClickIndicator';
import { getCurrentTutorialStep } from '../../game/systems/tutorial';

interface TutorialManagerProps {
  tutorialState: TutorialState;
  blobPosition: { x: number; y: number };
}

export const TutorialManager: React.FC<TutorialManagerProps> = ({
  tutorialState,
  blobPosition,
}) => {
  const currentStep = getCurrentTutorialStep(tutorialState);

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