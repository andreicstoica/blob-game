import React from "react";
import type { ScaleLevel } from "../../../game/types";

interface CurrentLevelProps {
  displayName: string;
  name: string;
  description: string;
  scale?: ScaleLevel;
}

export const CurrentLevel: React.FC<CurrentLevelProps> = ({
  displayName,
  name,
  description,
  scale,
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
      Current Level: {displayName || name}
    </h3>
    <p
      style={{
        margin: "0 0 10px 0",
        fontSize: "14px",
        opacity: 0.8,
      }}
    >
      {description}
    </p>
    {scale && (
      <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
        <div style={{ marginBottom: "5px" }}>
          <span style={{ opacity: 0.8 }}>Scale: </span>
          <span style={{ color: scale.color, fontWeight: "bold" }}>
            {scale.icon} {scale.name} ({scale.unit})
          </span>
        </div>
      </div>
    )}
  </div>
);
