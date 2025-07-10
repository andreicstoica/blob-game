import React from 'react';

interface TutorialArrowProps {
  targetPosition: { x: number; y: number };
  isVisible: boolean;
}

export const TutorialArrow: React.FC<TutorialArrowProps> = ({
  targetPosition,
  isVisible,
}) => {
  if (!isVisible) return null;

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    left: targetPosition.x - 30, // Center the arrow horizontally
    top: targetPosition.y - 120, // Position above the blob
    transform: 'translateX(-50%)',
    animation: 'tutorialBounce 2s ease-in-out infinite',
    zIndex: 1000,
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
          
          {/* Arrow body */}
          <path
            d="M30 10 L30 55"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#arrowGlow)"
          />
          
          {/* Arrow head */}
          <path
            d="M20 45 L30 60 L40 45"
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