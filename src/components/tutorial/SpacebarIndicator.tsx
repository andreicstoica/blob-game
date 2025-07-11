import React from "react";

interface SpacebarIndicatorProps {
  position: { x: number; y: number };
  isVisible: boolean;
}

export const SpacebarIndicator: React.FC<SpacebarIndicatorProps> = ({
  position,
  isVisible,
}) => {
  if (!isVisible) {
    return null;
  }

  const spacebarStyle: React.CSSProperties = {
    position: "fixed",
    left: position.x,
    top: position.y,
    transform: "translateX(-50%)",
    zIndex: 9999,
    pointerEvents: "none",
  };

  const arrowStyle: React.CSSProperties = {
    position: "fixed",
    left: position.x,
    top: position.y - 14, // Position arrow above the spacebar
    transform: "translateX(-50%)",
    animation: "tutorialBounce 2s ease-in-out infinite",
    zIndex: 9999,
    pointerEvents: "none",
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
          
          .spacebar-flicker {
            animation: leftButtonFlicker 1s ease-in-out infinite;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .tutorial-arrow {
              animation: none;
            }
            .spacebar-flicker {
              animation: none;
              fill: white;
            }
          }
        `}
      </style>

      {/* Green arrow pointing down to spacebar */}
      <div style={arrowStyle} className="tutorial-arrow">
        <svg
          width="75"
          height="100"
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
                floodColor="#16a34a"
                floodOpacity="0.8"
              />
            </filter>
          </defs>

          {/* Arrow body - pointing downward */}
          <path
            d="M30 20 L30 65"
            stroke="#16a34a"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#arrowGlow)"
          />

          {/* Arrow head - pointing downward */}
          <path
            d="M20 55 L30 70 L40 55"
            stroke="#16a34a"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#arrowGlow)"
          />
        </svg>
      </div>

      {/* Spacebar graphic */}
      <div style={spacebarStyle} className="spacebar-indicator">
        <svg
          width="120"
          height="40"
          viewBox="0 0 120 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Spacebar shadow/glow effect */}
          <defs>
            <filter
              id="spacebarGlow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="4"
                floodColor="#000000"
                floodOpacity="0.3"
              />
            </filter>
          </defs>

          {/* Spacebar body */}
          <rect
            x="5"
            y="8"
            width="110"
            height="24"
            rx="4"
            className="spacebar-flicker"
            stroke="#e5e7eb"
            strokeWidth="2"
            filter="url(#spacebarGlow)"
          />

          {/* Spacebar text */}
          <text
            x="60"
            y="22"
            textAnchor="middle"
            fill="#6b7280"
            fontSize="10"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            SPACE
          </text>
        </svg>
      </div>
    </>
  );
};
