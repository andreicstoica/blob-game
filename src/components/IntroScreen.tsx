import React, { useState } from 'react';
import { useIntroStore } from '../store/introStore';
import { Colors } from '../styles/colors';
import { playSound } from '../utils/sound';

interface IntroScreenProps {
  onTransitionStart: () => void;
  onComplete: () => void;
  onEvolve?: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onTransitionStart, onComplete, onEvolve }) => {
  const [startTime] = useState(() => Date.now());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const endIntro = useIntroStore(state => state.endIntro);

  const handleTransition = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    onTransitionStart(); // Start game render and fade-in
    
          // Complete transition after faster fade out
      setTimeout(() => {
        endIntro(); // Use Zustand store to end the intro
        playSound('evolve'); // Play evolve sound when game starts
        onEvolve?.(); // Start the game progression (this should handle tutorial state)
        onComplete(); // Keep the original callback for any additional logic
      }, 500); // Reduced from 1000ms to 500ms
  };

  const handleClick = () => {
    if (!isTransitioning) {
      handleTransition();
    }
  };

  // Simple time-based rendering without useEffect
  const now = Date.now();
  const elapsed = now - startTime;
  
  // Track which words should be visible
  const showThe = elapsed >= 0;
  const showBlob = elapsed >= 150; // 150ms after THE
  const showMust = elapsed >= 1000; // 1 second after start
  const showGrow = elapsed >= 2000; // 2 seconds after start

  // Auto-complete after 4.5 seconds
  if (elapsed >= 4500 && !isTransitioning) {
    handleTransition();
  }

  // Custom animations
  const animations = `
    @keyframes jiggle {
      0%, 100% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(1deg) scale(1.02); }
      50% { transform: rotate(-1deg) scale(1.05); }
      75% { transform: rotate(1deg) scale(1.02); }
    }

    @keyframes blobDrop {
      0% {
        opacity: 0;
        transform: translateY(-200px) scale(1);
      }
      70% {
        opacity: 1;
        transform: translateY(0) scale(1.3, 0.7);
      }
      85% {
        transform: translateY(0) scale(0.9, 1.1);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes grow {
      0% {
        transform: scale(0.05);
        opacity: 0;
      }
      80% {
        transform: scale(2.0);
        opacity: 1;
      }
      90% {
        transform: scale(2.2);
        opacity: 1;
      }
      100% {
        transform: scale(1.8);
        opacity: 1;
      }
    }

    @keyframes slam {
      0% {
        transform: translateY(-80px) scale(0.6);
        opacity: 0;
      }
      60% {
        transform: translateY(5px) scale(1.05);
        opacity: 1;
      }
      80% {
        transform: translateY(-2px) scale(0.98);
        opacity: 1;
      }
      100% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
  `;

  const baseWordStyle = {
    fontFamily: '"Darker Grotesque", "Mars Attacks", "Arial Black", Arial, sans-serif',
    fontWeight: 900, // Use the heaviest weight for maximum impact
    display: 'inline-block',
    margin: '0 4px', // Reduced from 8px to 4px - closer together
    
    // Muddy effects
    filter: 'blur(0.3px) contrast(1.1)',
    textShadow: `
      0 0 3px rgba(0,0,0,0.8),
      0 2px 4px rgba(0,0,0,0.6),
      0 4px 8px rgba(0,0,0,0.4),
      1px 1px 2px rgba(0,0,0,0.9)
    `,
    
    letterSpacing: '0.1em',
    WebkitTextStroke: '1px rgba(0,0,0,0.3)',
    textStroke: '1px rgba(0,0,0,0.3)'
  };

  // THE - no animations, just appears
  const theWordStyle = {
    ...baseWordStyle,
    fontSize: '4.5rem', // 10% smaller (was 5rem)
    color: 'white',
    opacity: showThe ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out'
  };

  // BLOB - drops fast and then jiggles
  const blobWordStyle = {
    ...baseWordStyle,
    fontSize: '6.3rem', // 10% smaller (was 7rem)
    color: Colors.biomass.primary,
    animation: 'blobDrop 0.4s ease-out, jiggle 2s ease-in-out infinite 0.4s'
  };

  // MUST - dramatic slam entrance
  const mustWordStyle = {
    ...baseWordStyle,
    fontSize: '6.6rem', // 20% bigger (was 5.5rem)
    color: 'white',
    animation: 'slam 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  };

  // GROW - actually grows in size
  const growWordStyle = {
    ...baseWordStyle,
    fontSize: '8rem', // Much bigger base size
    color: '#fb923c', // Keep the old orange color
    animation: 'grow 3s cubic-bezier(0.34, 1.56, 0.64, 1)'
  };

  return (
    <>
      {/* Inject CSS animations */}
      <style>{animations}</style>
      
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Much more transparent
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100, // Higher z-index to be on top
          cursor: isTransitioning ? 'default' : 'pointer',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
        onClick={handleClick}
      >
        <div style={{ 
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', 
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '10vh'
        }}>
          {/* First row: THE and BLOB - fixed position */}
          <div style={{ 
            position: 'absolute',
            top: '8vh',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '30px',
            minHeight: '120px'
          }}>
            <div style={{ width: '200px', textAlign: 'center' }}>
              {showThe && (
                <span style={theWordStyle}>
                  THE
                </span>
              )}
            </div>
            <div style={{ width: '200px', textAlign: 'center', transform: 'translateX(-20%)' }}>
              {showBlob && (
                <span style={blobWordStyle}>
                  BLOB
                </span>
              )}
            </div>
          </div>
          
          {/* Second row: MUST - fixed position */}
          <div style={{ 
            position: 'absolute',
            top: 'calc(8vh + 140px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '120px'
          }}>
            {showMust && (
              <span style={mustWordStyle}>
                MUST
              </span>
            )}
          </div>
          
          {/* Third row: GROW - fixed position */}
          <div style={{ 
            position: 'absolute',
            top: 'calc(8vh + 280px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '200px'
          }}>
            {showGrow && (
              <span style={growWordStyle}>
                GROW
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
