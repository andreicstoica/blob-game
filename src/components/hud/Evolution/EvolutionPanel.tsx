import React from 'react';
import type { GameState } from '../../../types';
import { getCurrentLevel, getNextLevelFromState, canEvolveToNextLevel } from '../../../core/systems/levelSystem';
import { CurrentLevel } from './CurrentLevel';
import { NextEvolution } from './NextEvolution';
import { EvolutionButton } from './EvolutionButton';
import { getScaleLevel } from './scaleLevels';

interface EvolutionPanelProps {
  biomass: number;
  blobSize: number;
  gameState?: GameState;
  onEvolve?: () => void;
  zoom?: number;
}

export const EvolutionPanel: React.FC<EvolutionPanelProps> = ({
  biomass,
  blobSize,
  gameState,
  onEvolve,
  zoom,
}) => {
  if (!gameState) return null;

  const currentLevel = getCurrentLevel(gameState);
  const nextLevel = getNextLevelFromState(gameState);
  const canEvolve = canEvolveToNextLevel(gameState);
  const scale = getScaleLevel(biomass);
  const currentZoom =
    zoom ?? Math.max(0.15, 1.0 - Math.log10(biomass + 1) * 0.3);

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

      <CurrentLevel
        displayName={currentLevel.displayName}
        name={currentLevel.name}
        description={currentLevel.description}
        scale={scale}
      />
      {nextLevel && (
        <NextEvolution
          nextLevel={nextLevel}
          canEvolve={canEvolve}
          biomass={biomass}
          gameState={gameState}
        />
      )}
      <EvolutionButton 
        canEvolve={canEvolve} 
        hasNextLevel={!!nextLevel} 
        onEvolve={onEvolve} 
      />

      {/* Debug Information */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "5px",
        }}
      >
        <h4
          style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#93c5fd" }}
        >
          Debug Info
        </h4>
        <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
          <div>Zoom: {currentZoom.toFixed(3)}</div>
          <div>Blob Size: {blobSize.toFixed(0)}px</div>
          <div>Growth Rate: {gameState.growth.toFixed(1)}/s</div>
          <div>Level: {currentLevel.name}</div>
        </div>
      </div>
    </div>
  );
};
