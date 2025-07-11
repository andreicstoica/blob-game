import React from "react";
import type { GameState, Level } from "../../game/types";
import { ParticleSpawner } from "./ParticleSpawner";
import { ParticleRenderer } from "./ParticleRenderer";

interface ParticleSystemProps {
  gameState: GameState;
  currentLevel: Level;
  blobSize: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  gameState,
  currentLevel,
  blobSize,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full z-30 pointer-events-none">
      <ParticleSpawner 
        gameState={gameState} 
        currentLevel={currentLevel} 
        blobSize={blobSize}
      >
        {(particles, burstParticles) => (
          <ParticleRenderer 
            particles={particles} 
            burstParticles={burstParticles}
          />
        )}
      </ParticleSpawner>
    </div>
  );
}; 