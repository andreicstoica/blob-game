import React from "react";
import type { GameState } from "../../../game/types";
import { Colors } from "../../../styles/colors";
import {
  getNextLevel,
  canEvolveToNextLevel,
  getCurrentLevel,
} from "../../../game/systems/actions";
import { CurrentLevel } from "./CurrentLevel";
import { NextEvolution } from "./NextEvolution";
import { EvolutionButton } from "./EvolutionButton";
import { getScaleLevel } from "../../../game/systems/scaleLevels";

interface EvolutionPanelProps {
  biomass: number;
  gameState?: GameState;
  onEvolve?: () => void;
  zoom?: number;
}

export const EvolutionPanel: React.FC<EvolutionPanelProps> = ({
  biomass,
  gameState,
  onEvolve,
}) => {
  if (!gameState) return null;

  const currentLevel = getCurrentLevel(gameState);
  const nextLevel = getNextLevel(gameState);
    const canEvolve = canEvolveToNextLevel(gameState);
  const scale = getScaleLevel(biomass);


  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "300px",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
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
          color: Colors.evolution.primary,
          textAlign: "center",
          textTransform: "uppercase",
          textShadow: "0 0 8px rgba(200, 200, 200, 0.25), 0 0 16px rgba(200, 200, 200, 0.25)"
        }}
      >
        EVOLUTION
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
        currentLevelId={currentLevel.id}
      />
    </div>
  );
};
