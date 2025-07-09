import React from 'react';
import type { ScaleLevel } from './scaleLevels';

interface EvolutionScaleProps {
  biomass: number;
  blobSize: number;
  scale: ScaleLevel;
  zoom: number;
}

export const EvolutionScale: React.FC<EvolutionScaleProps> = ({ biomass, blobSize, scale, zoom }) => (
  <div
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "10px",
      }}
    >
      <span style={{ fontSize: "20px" }}>{scale.icon}</span>
      <div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            color: scale.color,
            margin: "0 0 2px 0",
          }}
        >
          {scale.name}
        </div>
        <div style={{ fontSize: "12px", opacity: 0.8 }}>{scale.description}</div>
      </div>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
      }}
    >
      <span style={{ fontSize: "14px" }}>Scale:</span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#4ade80",
        }}
      >
        {scale.unit}
      </span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
      }}
    >
      <span style={{ fontSize: "14px" }}>Current:</span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#4ade80",
        }}
      >
        {(() => {
          let actualScale = "";
          if (biomass < 30) {
            const progress = biomass / 30;
            actualScale = `${(1 + progress * 9).toFixed(1)} nm`;
          } else if (biomass < 300) {
            const progress = (biomass - 30) / 270;
            actualScale = `${(10 + progress * 90).toFixed(0)} nm`;
          } else if (biomass < 3000) {
            const progress = (biomass - 300) / 2700;
            actualScale = `${(0.1 + progress * 0.9).toFixed(1)} μm`;
          } else if (biomass < 30000) {
            const progress = (biomass - 3000) / 27000;
            actualScale = `${(1 + progress * 9).toFixed(0)} μm`;
          } else if (biomass < 300000) {
            const progress = (biomass - 30000) / 270000;
            actualScale = `${(1 + progress * 9).toFixed(0)} mm`;
          } else if (biomass < 3000000) {
            const progress = (biomass - 300000) / 2700000;
            actualScale = `${(10 + progress * 90).toFixed(0)} cm`;
          } else if (biomass < 30000000) {
            const progress = (biomass - 3000000) / 27000000;
            actualScale = `${(1 + progress * 99).toFixed(0)} m`;
          } else if (biomass < 300000000) {
            const progress = (biomass - 30000000) / 270000000;
            actualScale = `${(100 + progress * 9900).toFixed(0)} m`;
          } else if (biomass < 3000000000) {
            const progress = (biomass - 300000000) / 2700000000;
            actualScale = `${(10 + progress * 990).toFixed(0)} km`;
          } else if (biomass < 30000000000) {
            const progress = (biomass - 3000000000) / 27000000000;
            actualScale = `${(1000 + progress * 99000).toFixed(0)} km`;
          } else if (biomass < 300000000000) {
            const progress = (biomass - 30000000000) / 270000000000;
            actualScale = `${(10000 + progress * 990000).toFixed(0)} km`;
          } else if (biomass < 3000000000000) {
            const progress = (biomass - 300000000000) / 2700000000000;
            actualScale = `${(100000 + progress * 9900000).toFixed(0)} km`;
          } else if (biomass < 30000000000000) {
            const progress = (biomass - 3000000000000) / 27000000000000;
            actualScale = `${(1 + progress * 99).toFixed(1)} ly`;
          } else {
            const progress = Math.min(1, (biomass - 30000000000000) / 70000000000000);
            actualScale = `${(100 + progress * 9900).toFixed(0)} ly`;
          }
          return actualScale;
        })()}
      </span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
      }}
    >
      <span style={{ fontSize: "14px" }}>Blob Size:</span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#4ade80",
        }}
      >
        {blobSize.toFixed(0)}px
      </span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: "14px" }}>Zoom:</span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#4ade80",
        }}
      >
        {zoom.toFixed(2)}x
      </span>
    </div>
  </div>
); 