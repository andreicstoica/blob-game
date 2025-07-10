import React from "react";
import type { Particle } from "../../game/types";

// Interface for burst particles (must match ParticleSpawner)
interface BurstParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  size: number;
  maxLife: number;
}

interface ParticleRendererProps {
  particles: Particle[];
  burstParticles: BurstParticle[];
}

export const ParticleRenderer: React.FC<ParticleRendererProps> = ({ 
  particles, 
  burstParticles 
}) => {
  return (
    <>
      {/* Render main particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.useImage ? "transparent" : particle.color,
            borderRadius: particle.useImage ? "0%" : "50%",
            transform: `translate3d(${particle.x - particle.size/2}px, ${particle.y - particle.size/2}px, 0)`,
            zIndex: 30,
            boxShadow: particle.useImage
              ? "none"
              : `0 0 ${particle.size * 2}px ${particle.color}`,
            backgroundImage:
              particle.useImage && particle.image
                ? `url(${particle.image})`
                : "none",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 'opacity' in particle ? (particle as Particle & { opacity: number }).opacity : 1, // Apply opacity for dissolving effect
            willChange: "transform, opacity", // GPU optimization hint
          }}
        />
      ))}
      
      {/* Render burst particles (firework effect) */}
      {burstParticles.map((burst) => {
        const opacity = burst.life / burst.maxLife; // Fade out as life decreases
        const glowSize = burst.size * 2; // Simplified single glow
        return (
          <div
            key={burst.id}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: burst.size,
              height: burst.size,
              backgroundColor: burst.color,
              borderRadius: "50%",
              transform: `translate3d(${burst.x - burst.size/2}px, ${burst.y - burst.size/2}px, 0)`,
              zIndex: 31, // Above main particles
              opacity,
              boxShadow: `0 0 ${glowSize}px ${burst.color}`, // Single glow for performance
              willChange: "transform, opacity", // GPU optimization hint
            }}
          />
        );
      })}
    </>
  );
}; 