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

interface EvolutionPanelProps {
  biomass: number;
  gameState?: GameState;
  onEvolve?: () => void;
  zoom?: number;
  width?: number;
}

export const EvolutionPanel: React.FC<EvolutionPanelProps> = ({
  biomass,
  gameState,
  onEvolve,
  width = 275,
}) => {
  if (!gameState) return null;

  const currentLevel = getCurrentLevel(gameState);
  const nextLevel = getNextLevel(gameState);
  const canEvolve = canEvolveToNextLevel(gameState);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: "0",
        transform: "translateY(-50%)",
        width: `${width}px`,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        borderRadius: "12px",
        zIndex: 1000,
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h2
        style={{
          margin: "0",
          fontSize: "24px",
          color: Colors.evolution.primary,
          textAlign: "center",
          textTransform: "uppercase",
          textShadow:
            "0 0 8px rgba(200, 200, 200, 0.25), 0 0 16px rgba(200, 200, 200, 0.25)",
        }}
      >
        EVOLUTION
      </h2>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <CurrentLevel
          displayName={currentLevel.displayName}
          name={currentLevel.name}
          description={currentLevel.description}
        />
      </div>

      {nextLevel && (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <NextEvolution
            nextLevel={nextLevel}
            canEvolve={canEvolve}
            biomass={biomass}
            gameState={gameState}
          />
        </div>
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
