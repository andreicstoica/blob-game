import React from 'react';
import { Particle } from './Particle';

interface ParticleData {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  color: string;
  size: number;
  startTime: number;
  lifespan: number;
}

interface ParticleSystemProps {
  particles: ParticleData[];
  onParticleComplete: (id: string) => void;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particles,
  onParticleComplete
}) => {
  return (
    <>
      {particles.map(particle => (
        <Particle
          key={particle.id}
          position={particle.position}
          velocity={particle.velocity}
          color={particle.color}
          size={particle.size}
          startTime={particle.startTime}
          lifespan={particle.lifespan}
          onComplete={() => onParticleComplete(particle.id)}
        />
      ))}
    </>
  );
};