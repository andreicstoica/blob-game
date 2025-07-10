import React, { useState, useEffect, useRef } from 'react';
import { NumberFormatter } from '../../utils/numberFormat';

interface FloatingNumberProps {
  value: number;
  position: { x: number; y: number };
  color?: string;
  startTime: number; // Pass start time from parent
  onComplete?: () => void;
}

export const FloatingNumber: React.FC<FloatingNumberProps> = ({
  value,
  position,
  color = '#4ade80',
  startTime,
  onComplete
}) => {
  const [opacity, setOpacity] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const animationRef = useRef<number>(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    const duration = 1000; // 1 second

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setOffsetY(-50 * easeOut); // Float up 50px
      setOpacity(1 - progress); // Fade out

      if (progress >= 1) {
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete?.();
        }
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startTime, onComplete]); // Only re-run if startTime changes

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y + offsetY,
        transform: 'translate(-50%, -50%)',
        fontSize: '20px',
        fontWeight: 'bold',
        color: color,
        textShadow: `0 0 10px ${color}`,
        opacity: opacity,
        pointerEvents: 'none',
        userSelect: 'none',
        fontFamily: 'monospace',
        zIndex: 1000
      }}
    >
      +{NumberFormatter.compact(value)}
    </div>
  );
};