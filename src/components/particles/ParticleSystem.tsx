import React from "react";
import type { GameState, Level } from "../../game/types";
import { ParticleSpawner } from "./ParticleSpawner";
import { ParticleRenderer } from "./ParticleRenderer";

interface ParticleSystemProps {
  gameState: GameState;
  currentLevel: Level;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  gameState,
  currentLevel,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full z-30 pointer-events-none">
      <ParticleSpawner gameState={gameState} currentLevel={currentLevel}>
        {(particles) => (
          <ParticleRenderer particles={particles} />
        )}
      </ParticleSpawner>
    </div>
  );
}; 