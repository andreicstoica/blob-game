import React from "react";
import type { ScaleLevel } from '../../../game/types';

interface EvolutionScaleProps {
  biomass: number;
  blobSize: number;
  scale: ScaleLevel;
  zoom: number;
}

export const EvolutionScale: React.FC<EvolutionScaleProps> = ({
  scale,
  zoom,
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
      Scale: {scale.name}
    </h3>
    <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
      <div style={{ marginBottom: "5px" }}>
        <span style={{ opacity: 0.8 }}>Unit: </span>
        <span style={{ color: scale.color, fontWeight: "bold" }}>
          {scale.icon} {scale.unit}
        </span>
      </div>
      <div style={{ marginBottom: "5px" }}>
        <span style={{ opacity: 0.8 }}>Description: </span>
        <span>{scale.description}</span>
      </div>
      <div>
        <span style={{ opacity: 0.8 }}>Zoom: </span>
        <span>{zoom.toFixed(3)}</span>
      </div>
    </div>
  </div>
);
