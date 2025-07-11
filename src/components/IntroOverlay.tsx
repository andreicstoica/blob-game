import React, { useEffect, useRef, useState } from 'react';

interface IntroOverlayProps {
  onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startTime) {
      setStartTime(Date.now());
      timerRef.current = window.setTimeout(() => {
        onComplete();
      }, 4000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startTime, onComplete]);

  if (!startTime) return null;

  const now = Date.now();
  const elapsed = now - startTime;

  // Word appearance timings
  const showThe = elapsed >= 0;
  const showBlob = elapsed >= 500;
  const showMust = elapsed >= 1500;
  const showGrow = elapsed >= 2500;

  // GROW animation: scale from 0.7 to 1.1 over 1.5s
  let growScale = 0.7;
  if (showGrow) {
    const growElapsed = Math.min(1, (elapsed - 2500) / 1500);
    growScale = 0.7 + 0.4 * growElapsed;
  }

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
    @keyframes growAndJiggle {
      0%, 100% { 
        transform: rotate(0deg) scale(var(--grow-scale, 1));
      }
      25% { 
        transform: rotate(1deg) scale(calc(var(--grow-scale, 1) * 1.02));
      }
      50% { 
        transform: rotate(-1deg) scale(calc(var(--grow-scale, 1) * 1.05));
      }
      75% { 
        transform: rotate(1deg) scale(calc(var(--grow-scale, 1) * 1.02));
      }
    }
  `;

  const baseWordStyle = {
    fontFamily: '"Darker Grotesque", "Mars Attacks", "Arial Black", Arial, sans-serif',
    fontWeight: 900,
    display: 'inline-block',
    margin: '0 4px',
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
  } as React.CSSProperties;

  const theWordStyle = {
    ...baseWordStyle,
    fontSize: '4.5rem',
    color: 'white',
  };

  const blobWordStyle = {
    ...baseWordStyle,
    fontSize: '6.3rem',
    color: '#4ade80',
    animation: 'blobDrop 0.4s ease-out, jiggle 2s ease-in-out infinite 0.4s'
  };

  const mustWordStyle = {
    ...baseWordStyle,
    fontSize: '4.5rem',
    color: 'white',
  };

  const growWordStyle = {
    ...baseWordStyle,
    fontSize: '6.3rem',
    color: '#fb923c',
    '--grow-scale': growScale,
    transform: `scale(${growScale})`,
    transition: showGrow ? 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)' : undefined,
  } as React.CSSProperties;

  return (
    <>
      <style>{animations}</style>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          pointerEvents: 'none'
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '6px', 
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {showThe && (
            <span style={theWordStyle}>
              THE
            </span>
          )}
          {showBlob && (
            <span style={blobWordStyle}>
              BLOB
            </span>
          )}
          {showMust && (
            <span style={mustWordStyle}>
              MUST
            </span>
          )}
          {showGrow && (
            <span style={growWordStyle}>
              GROW
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default IntroOverlay; 