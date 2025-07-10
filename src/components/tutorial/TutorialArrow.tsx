import React from 'react';

interface TutorialArrowProps {
  targetPosition: { x: number; y: number };
  isVisible: boolean;
}

export const TutorialArrow: React.FC<TutorialArrowProps> = ({
  targetPosition,
  isVisible,
}) => {
  if (!isVisible) {
    return null;
  }

  const arrowStyle: React.CSSProperties = {
    position: 'fixed',
    left: targetPosition.x,
    top: targetPosition.y + 40,
    transform: 'translateX(-50%)',
    animation: 'tutorialBounce 2s ease-in-out infinite',
    zIndex: 1000,
    pointerEvents: 'none',
  };



  return (
    <>
      {/* CSS Animation Styles */}
      <style>
        {`
          @keyframes tutorialBounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .tutorial-arrow {
              animation: none;
            }
          }
        `}
      </style>
      
      <div style={arrowStyle} className="tutorial-arrow">
        <svg
          width="60"
          height="80"
          viewBox="0 0 60 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arrow glow effect */}
          <defs>
            <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="3"
                floodColor="#22c55e"
                floodOpacity="0.8"
              />
            </filter>
          </defs>
          
          {/* Arrow body - now pointing upward */}
          <path
            d="M30 25 L30 70"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#arrowGlow)"
          />
          
          {/* Arrow head - now pointing upward */}
          <path
            d="M20 35 L30 20 L40 35"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#arrowGlow)"
          />
        </svg>
      </div>
    </>
  );
}; 