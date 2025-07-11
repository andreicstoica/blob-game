import React from 'react';
import type { TutorialState } from '../../game/types/ui';
import { TutorialArrow } from './TutorialArrow';
import { ClickIndicator } from './ClickIndicator';
import { TutorialPopup } from './TutorialPopup';
import { getCurrentTutorialStep } from '../../game/systems/tutorial';

interface TutorialManagerProps {
  tutorialState: TutorialState;
  blobPosition: { x: number; y: number };
  onTutorialStepComplete?: (stepId: string) => void;
}

export const TutorialManager: React.FC<TutorialManagerProps> = ({
  tutorialState,
  blobPosition,
  onTutorialStepComplete,
}) => {
  const currentStep = getCurrentTutorialStep(tutorialState);

  // Only show tutorial if it's active
  if (!tutorialState.isActive || !currentStep) {
    return null;
  }

  const handlePopupClose = () => {
    if (currentStep && onTutorialStepComplete) {
      onTutorialStepComplete(currentStep.id);
    }
  };

  return (
    <div className="tutorial-overlay fixed inset-0 pointer-events-none z-50">
      {/* Click blob tutorial */}
      {currentStep.type === 'click-blob' && (
        <>
          <TutorialArrow
            targetPosition={blobPosition}
            isVisible={true}
          />
          <ClickIndicator
            position={{
              x: blobPosition.x,
              y: blobPosition.y + 130
            }}
            isVisible={true}
          />
        </>
      )}

      {/* Shop intro popup */}
      {currentStep.type === 'shop-intro' && (
        <TutorialPopup
          position="shop"
          message={currentStep.popupMessage || ''}
          isVisible={true}
        />
      )}

      {/* Evolution intro popup */}
      {currentStep.type === 'evolution-intro' && (
        <TutorialPopup
          position="evolution"
          message={currentStep.popupMessage || ''}
          isVisible={true}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}; 