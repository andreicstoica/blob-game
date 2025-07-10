import React from 'react';

interface ClickIndicatorProps {
  position: { x: number; y: number };
  isVisible: boolean;
}

export const ClickIndicator: React.FC<ClickIndicatorProps> = ({
  position,
  isVisible,
}) => {
  if (!isVisible) return null;

  const indicatorStyle: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -50%)',
    animation: 'clickPulse 1.5s ease-in-out infinite',
    zIndex: 1000,
  };

  return (
    <>
      {/* CSS Animation Styles */}
      <style>
        {`
          @keyframes clickPulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1);
              opacity: 0.8;
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .click-indicator {
              animation: none;
            }
          }
        `}
      </style>
      
      <div style={indicatorStyle} className="click-indicator">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-green-200">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {/* Left Click Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Mouse body */}
              <rect
                x="8"
                y="4"
                width="8"
                height="16"
                rx="4"
                stroke="#374151"
                strokeWidth="2"
                fill="#f3f4f6"
              />
              
              {/* Left click area highlight */}
              <rect
                x="8"
                y="4"
                width="4"
                height="8"
                rx="4"
                fill="#22c55e"
                fillOpacity="0.3"
              />
              
              {/* Scroll wheel */}
              <line
                x1="12"
                y1="6"
                x2="12"
                y2="10"
                stroke="#374151"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            
            <span>Click me!</span>
          </div>
        </div>
      </div>
    </>
  );
}; 