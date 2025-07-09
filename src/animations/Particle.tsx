import React, { useState, useEffect, useRef } from 'react';

interface ParticleProps {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  color?: string;
  size?: number;
  startTime: number;
  lifespan?: number;
  onComplete?: () => void;
}

export const Particle: React.FC<ParticleProps> = ({
  position: initialPosition,
  velocity,
  color = '#4ade80',
  size = 4,
  startTime,
  lifespan = 800,
  onComplete
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number | undefined>(undefined);
  const hasCompleted = useRef(false);

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / lifespan, 1);

      if (progress >= 1) {
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete?.();
        }
        return;
      }

      // Update position based on velocity and time
      const newX = initialPosition.x + velocity.x * elapsed * 0.001; // Convert to seconds
      const newY = initialPosition.y + velocity.y * elapsed * 0.001;
      
      // Add gravity effect
      const gravity = 50; // pixels per second squared
      const gravityY = 0.5 * gravity * Math.pow(elapsed * 0.001, 2);
      
      setPosition({ x: newX, y: newY + gravityY });
      
      // Fade out over time
      setOpacity(1 - progress);
      
      // Shrink slightly over time
      setScale(1 - progress * 0.3);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startTime, initialPosition, velocity, lifespan, onComplete]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        opacity: opacity,
        transform: `translate(-50%, -50%) scale(${scale})`,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        pointerEvents: 'none',
        zIndex: 999
      }}
    />
  );
};