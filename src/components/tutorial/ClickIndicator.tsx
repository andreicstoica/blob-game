import React from 'react';
import { Colors } from '../../styles/colors';

interface ClickIndicatorProps {
  position: { x: number; y: number };
  isVisible: boolean;
}

export const ClickIndicator: React.FC<ClickIndicatorProps> = ({
  position,
  isVisible,
}) => {
  if (!isVisible) {
    return null;
  }

  const indicatorStyle: React.CSSProperties = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    pointerEvents: 'none',
  };



  return (
    <>
      {/* CSS Animation Styles */}
      <style>
        {`
          @keyframes leftButtonFlicker {
            0%, 50% {
              fill: ${Colors.biomass.dark};
            }
            51%, 100% {
              fill: white;
            }
          }
          
          .left-button-flicker {
            animation: leftButtonFlicker 1s ease-in-out infinite;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .left-button-flicker {
              animation: none;
              fill: ${Colors.biomass.dark};
            }
          }
        `}
      </style>
      
      <div style={indicatorStyle} className="click-indicator">
        <svg
          width="60"
          height="90"
          viewBox="0 0 48 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mouse shadow/glow effect */}
          <defs>
            <filter id="mouseGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="4"
                floodColor="#000000"
                floodOpacity="0.1"
              />
            </filter>
          </defs>
          
          {/* Mouse body (bottom section) - with gap from buttons */}
          <path
            d="M 8 33 L 40 33 L 40 48 A 16 16 0 0 1 24 64 A 16 16 0 0 1 8 48 L 8 33 Z"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
            filter="url(#mouseGlow)"
          />
          
          {/* Left click button (top left, flickering) - with gaps */}
          <path
            d="M 8 24 A 16 16 0 0 1 24 8 L 22 8 L 22 29 L 8 29 A 16 16 0 0 1 8 24 Z"
            className="left-button-flicker"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
          
          {/* Right click button (top right, white) - with gaps */}
          <path
            d="M 26 8 L 24 8 A 16 16 0 0 1 40 24 A 16 16 0 0 1 40 29 L 26 29 L 26 8 Z"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        </svg>
      </div>
    </>
  );
}; 