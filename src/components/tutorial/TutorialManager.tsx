import React, { useState, useEffect } from 'react';
import type { TutorialState } from '../../game/types/ui';
import { TutorialArrow } from './TutorialArrow';
import { ClickIndicator } from './ClickIndicator';
import { TutorialPopup } from './TutorialPopup';
import { SpacebarIndicator } from './SpacebarIndicator';
import { getCurrentTutorialStep } from '../../game/systems/tutorial';
import { Colors } from '../../styles/colors';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="tutorial-overlay fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
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
              y: blobPosition.y + 134
            }}
            isVisible={true}
          />
          {/* Spacebar indicator above blob */}
          <SpacebarIndicator
            position={{
              x: blobPosition.x,
              y: blobPosition.y - 135
            }}
            isVisible={true}
          />
          {/* Tutorial text under mouse cursor */}
          <div
            style={{
              position: 'fixed',
              left: mousePosition.x,
              top: mousePosition.y + 20,
              transform: 'translateX(-50%)',
              fontSize: '12px',
              color: Colors.biomass.dark,
              textAlign: 'center',
              textTransform: 'uppercase',
              textShadow: '0 0 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.8), 0 0 24px rgba(22, 163, 74, 0.6)',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              pointerEvents: 'none',
              zIndex: 10000,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '2px 7px',
              borderRadius: '4px',
              border: `2px solid ${Colors.biomass.dark}`,
            }}
          >
            TUTORIAL
          </div>
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