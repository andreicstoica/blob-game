import React from 'react';
import type { GameState } from '../../../engine/game';
import { getCurrentLevel, getNextLevel, canEvolveToNextLevel } from '../../../engine/game';
import { EvolutionScale } from './EvolutionScale';
import { CurrentLevel } from './CurrentLevel';
import { NextEvolution } from './NextEvolution';
import { EvolutionButton } from './EvolutionButton';
import { getScaleLevel } from './scaleLevels';

interface EvolutionPanelProps {
  biomass: number;
  blobSize: number;
  gameState?: GameState;
  onEvolve?: () => void;
}

export const EvolutionPanel: React.FC<EvolutionPanelProps> = ({
  biomass,
  blobSize,
  gameState,
  onEvolve,
}) => {
  if (!gameState) return null;

  const currentLevel = getCurrentLevel(gameState);
  const nextLevel = getNextLevel(gameState);
  const canEvolve = canEvolveToNextLevel(gameState);
  const scale = getScaleLevel(biomass);
  const zoom = Math.max(0.15, 1.0 - Math.log10(biomass + 1) * 0.3);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "300px",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        overflowY: "auto",
        zIndex: 1000,
        userSelect: "none",
      }}
    >
      <h2
        style={{
          margin: "0 0 20px 0",
          fontSize: "24px",
          color: "#93c5fd",
          textAlign: "center",
        }}
      >
        Evolution
      </h2>

      <EvolutionScale biomass={biomass} blobSize={blobSize} scale={scale} zoom={zoom} />
      <CurrentLevel displayName={currentLevel.displayName} name={currentLevel.name} description={currentLevel.description} />
      {nextLevel && (
        <NextEvolution nextLevel={nextLevel} canEvolve={canEvolve} biomass={biomass} gameState={gameState} />
      )}
      <EvolutionButton 
        canEvolve={canEvolve} 
        hasNextLevel={!!nextLevel} 
        onEvolve={onEvolve} 
      />
    </div>
  );
};
