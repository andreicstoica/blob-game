import React from "react";
import { NumberFormatter } from "../../../utils/numberFormat";
import type { GameState } from '../../../engine/core/game';

interface NextEvolutionProps {
  nextLevel: any;
  canEvolve: boolean;
  biomass: number;
  gameState: GameState;
}

export const NextEvolution: React.FC<NextEvolutionProps> = ({
  nextLevel,
  canEvolve,
  biomass,
  gameState,
}) => (
  <div
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
    }}
  >
    <h3
      style={{
        margin: "0 0 10px 0",
        fontSize: "18px",
        color: "white",
      }}
    >
      Next Evolution: {nextLevel.displayName || nextLevel.name}
    </h3>
    <p
      style={{
        margin: "0 0 15px 0",
        fontSize: "14px",
        opacity: 0.8,
      }}
    >
      {nextLevel.description}
    </p>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <span style={{ fontSize: "14px" }}>Required Biomass:</span>
      <span
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: canEvolve ? "#4ade80" : "#ef4444",
        }}
      >
        {NumberFormatter.threshold(nextLevel.biomassThreshold, gameState)}
      </span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: "14px" }}>Your Biomass:</span>
      <span
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: canEvolve ? "#4ade80" : "#9ca3af",
        }}
      >
        {NumberFormatter.biomass(biomass, gameState)}
      </span>
    </div>
  </div>
);
