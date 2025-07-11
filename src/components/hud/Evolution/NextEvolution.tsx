import React from "react";
import { NumberFormatter } from "../../../utils/numberFormat";
import type { GameState, Level } from '../../../game/types';

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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const titleStyle: React.CSSProperties = {
    margin: "0 0 4px 0",
    fontSize: "14px",
    color: "white",
    fontWeight: "bold"
  };

  const descriptionStyle: React.CSSProperties = {
    margin: "0 0 4px 0",
    fontSize: "10px",
    opacity: 0.8,
    lineHeight: "1.3",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  const requirementRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px"
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "bold",
    color: canEvolve ? "#4ade80" : "#ef4444",
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        Next: {nextLevel.displayName || nextLevel.name}
      </h3>
      
      <p style={descriptionStyle}>
        {nextLevel.description}
      </p>
      
      <div style={requirementRowStyle}>
        <span style={labelStyle}>Required:</span>
        <span style={valueStyle}>
          {NumberFormatter.threshold(nextLevel.biomassThreshold, gameState)}
        </span>
      </div>
    </div>
  );
};
