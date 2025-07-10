import React from 'react';
import { generateAmoebePath } from '../../game/systems/blobSystem';
import type { BlobAnimationValues } from '../../game/types/ui';

// Ripple particle interface (must match ParticleSpawner)
interface RippleParticle {
  id: string;
  x: number; // relative to blob center
  y: number; // relative to blob center
  size: number; // current ripple radius
  maxSize: number; // maximum ripple radius
  life: number; // 0 to 1, decreases over time
  maxLife: number;
  color: string;
  opacity: number;
}

interface BlobRippleContainerProps {
  blobId: string;
  position: { x: number; y: number };
  size: number;
  animationValues: BlobAnimationValues;
  rippleParticles: RippleParticle[];
}

export const BlobRippleContainer: React.FC<BlobRippleContainerProps> = ({
  blobId,
  position,
  size,
  animationValues,
  rippleParticles,
}) => {
  const clipPathId = `blob-ripple-clip-${blobId}`;
  const blobRadius = size * 0.35;
  const containerSize = blobRadius * 2.4;

  return (
    <div
      style={{
        position: "absolute",
        left: position.x - containerSize / 2,
        top: position.y - containerSize / 2,
        width: containerSize,
        height: containerSize,
        pointerEvents: "none",
        zIndex: 75, // Above blob (z-index 70) but below generators (z-index 80+)
      }}
    >
      {/* SVG for clipping path that matches blob shape */}
      <svg 
        width={size * 2} 
        height={size * 2}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      >
        <defs>
          <clipPath id={clipPathId}>
            <path d={generateAmoebePath(size, animationValues)} />
          </clipPath>
        </defs>
      </svg>

      {/* Ripple container with clipping */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size * 2,
          height: size * 2,
          transform: "translate(-50%, -50%)",
          clipPath: `url(#${clipPathId})`,
          overflow: "hidden",
        }}
      >
        {/* Render ripple particles */}
        {rippleParticles.map((ripple) => {
          // Position relative to blob center within the clipped container
          const rippleX = size + ripple.x - ripple.size;
          const rippleY = size + ripple.y - ripple.size;
          
          return (
            <div
              key={ripple.id}
              style={{
                position: "absolute",
                left: rippleX,
                top: rippleY,
                width: ripple.size * 2,
                height: ripple.size * 2,
                borderRadius: "50%",
                border: `4px solid ${ripple.color}`,
                backgroundColor: `${ripple.color}15`, // Very subtle fill
                opacity: ripple.opacity * 0.9, // Slightly more opaque
                boxShadow: `
                  0 0 ${ripple.size * 0.8}px ${ripple.color}cc,
                  0 0 ${ripple.size * 1.2}px ${ripple.color}66,
                  inset 0 0 ${ripple.size * 0.4}px ${ripple.color}33
                `,
                willChange: "transform, opacity",
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}; 