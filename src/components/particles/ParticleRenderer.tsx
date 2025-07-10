import React from "react";
import type { Particle } from "../../game/types";

interface ParticleRendererProps {
  particles: Particle[];
}

export const ParticleRenderer: React.FC<ParticleRendererProps> = ({ particles }) => {
  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.useImage ? "transparent" : particle.color,
            borderRadius: particle.useImage ? "0%" : "50%",
            transform: "translate(-50%, -50%)",
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
          }}
        />
      ))}
    </>
  );
}; 