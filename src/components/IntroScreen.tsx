import React, { useState } from 'react';
import { useIntroStore } from '../store/introStore';
import { playSound } from '../utils/sound';

interface IntroScreenProps {
  onTransitionStart: () => void;
  onComplete: () => void;
  onEvolve?: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onTransitionStart, onComplete, onEvolve }) => {
  const [_visibleWords, setVisibleWords] = useState<string[]>([]);
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
  
  const currentWords: string[] = [];
  if (elapsed >= 0) currentWords.push('THE');      // Immediately
  if (elapsed >= 500) currentWords.push('BLOB');   // After 0.5s
  if (elapsed >= 1500) currentWords.push('MUST');  // After 1.5s
  if (elapsed >= 2500) currentWords.push('GROW');  // After 2.5s

  // Auto-complete after 4.5 seconds
  if (elapsed >= 4500 && !isTransitioning) {
    handleTransition();
  }

  // Force re-render every 100ms to update the animation
  setTimeout(() => {
    setVisibleWords([...currentWords]);
  }, 100);

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
        transform: scale(0.5);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      100% {
        transform: scale(1);
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
  };

  // BLOB - drops fast and then jiggles
  const blobWordStyle = {
    ...baseWordStyle,
    fontSize: '6.3rem', // 10% smaller (was 7rem)
    color: '#4ade80',
    animation: 'blobDrop 0.4s ease-out, jiggle 2s ease-in-out infinite 0.4s'
  };

  // MUST - no animations, just appears
  const mustWordStyle = {
    ...baseWordStyle,
    fontSize: '4.5rem', // 10% smaller (was 5rem)
    color: 'white',
  };

  // GROW - actually grows in size
  const growWordStyle = {
    ...baseWordStyle,
    fontSize: '6.3rem', // 10% smaller (was 7rem)
    color: '#fb923c',
    animation: 'grow 1.5s ease-out'
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
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '8px', // Increased from 6px to 8px for better spacing
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {currentWords.includes('THE') && (
            <span style={theWordStyle}>
              THE
            </span>
          )}
          {currentWords.includes('BLOB') && (
            <span style={blobWordStyle}>
              BLOB
            </span>
          )}
          {currentWords.includes('MUST') && (
            <span style={mustWordStyle}>
              MUST
            </span>
          )}
          {currentWords.includes('GROW') && (
            <span style={growWordStyle}>
              GROW
            </span>
          )}
        </div>
      </div>
    </>
  );
};
