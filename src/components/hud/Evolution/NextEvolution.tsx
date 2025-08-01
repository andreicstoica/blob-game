import React from "react";
import { NumberFormatter } from "../../../utils/numberFormat";
import type { GameState, Level } from "../../../game/types";
import { Colors } from "../../../styles/colors";

interface NextEvolutionProps {
  nextLevel: Level;
  canEvolve: boolean;
  biomass: number;
  gameState: GameState;
}

export const NextEvolution: React.FC<NextEvolutionProps> = ({
  nextLevel,
  canEvolve,
  gameState,
}) => {
  // Styles
  const containerStyle: React.CSSProperties = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const titleStyle: React.CSSProperties = {
    margin: "0 0 4px 0",
    fontSize: "15px",
    color: "white",
    fontWeight: "bold",
  };

  const descriptionStyle: React.CSSProperties = {
    margin: "0 0 4px 0",
    fontSize: "13px",
    opacity: 0.8,
    lineHeight: "1.3",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const requirementRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: "bold",
    color: canEvolve ? Colors.biomass.primary : Colors.headlines.primary,
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        Next: {nextLevel.displayName || nextLevel.name}
      </h3>

      <p style={descriptionStyle}>{nextLevel.description}</p>

      <div style={requirementRowStyle}>
        <span style={labelStyle}>Required:</span>
        <span style={valueStyle}>
          {NumberFormatter.threshold(nextLevel.biomassThreshold, gameState)}
        </span>
      </div>
    </div>
  );
};
