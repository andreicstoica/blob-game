import React from "react";

interface ScaleIndicatorProps {
  biomass: number;
  blobSize: number;
}

interface ScaleLevel {
  name: string;
  description: string;
  unit: string;
  color: string;
  icon: string;
}

const getScaleLevel = (biomass: number): ScaleLevel => {
  if (biomass < 30) {
    // Extended from 10 to 30 (3x longer)
    return {
      name: "Microscopic",
      description: "Individual bacteria",
      unit: "1-10 μm",
      color: "#10b981",
      icon: "🦠",
    };
  } else if (biomass < 300) {
    // Shifted from 100 to 300 to maintain 10x scaling
    return {
      name: "Cellular",
      description: "Cell clusters",
      unit: "10-100 μm",
      color: "#3b82f6",
      icon: "🧬",
    };
  } else if (biomass < 3000) {
    // Shifted from 1000 to 3000
    return {
      name: "Organism",
      description: "Small organisms",
      unit: "0.1-1 mm",
      color: "#8b5cf6",
      icon: "🐛",
    };
  } else if (biomass < 30000) {
    // Shifted from 10000 to 30000
    return {
      name: "Local",
      description: "Visible creatures",
      unit: "1-10 mm",
      color: "#f59e0b",
      icon: "🐜",
    };
  } else if (biomass < 300000) {
    // Shifted from 100000 to 300000
    return {
      name: "Regional",
      description: "Small animals",
      unit: "1-10 cm",
      color: "#ef4444",
      icon: "🐭",
    };
  } else if (biomass < 3000000) {
    // Shifted from 1000000 to 3000000
    return {
      name: "Terrestrial",
      description: "Large organisms",
      unit: "10 cm - 1 m",
      color: "#84cc16",
      icon: "🐕",
    };
  } else {
    return {
      name: "Planetary",
      description: "Earth scale",
      unit: "1+ meters",
      color: "#06b6d4",
      icon: "🌍",
    };
  }
};

export const ScaleIndicator: React.FC<ScaleIndicatorProps> = ({
  biomass,
  blobSize,
}) => {
  const scale = getScaleLevel(biomass);

  // Calculate zoom for display purposes
  const zoom = Math.max(0.15, 1.0 - Math.log10(biomass + 1) * 0.3);

  // Only show when zooming out
  if (biomass < 2) return null;

  // Calculate scale bar length (relative to zoom)
  const scaleBarLength = Math.max(20, (1 - zoom) * 100);

  return (
    <div
      style={{
        position: "fixed",
        right: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 9999,
        width: "200px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        borderRadius: "4px",
        border: "1px solid #666",
      }}
    >
      {/* Scale Level Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "15px",
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
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            {scale.description}
          </div>
        </div>
      </div>

      {/* Scale Bar */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "5px",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.8 }}>Scale:</div>
          <div
            style={{ fontSize: "14px", fontWeight: "bold", color: "#4ade80" }}
          >
            {scale.unit}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: `${scaleBarLength}px`,
              height: "8px",
              backgroundColor: scale.color,
              borderRadius: "4px",
              boxShadow: `0 0 8px ${scale.color}50`,
            }}
          />
          <div style={{ fontSize: "10px", opacity: 0.8 }}>
            {(() => {
              // Calculate actual scale value based on biomass position within range
              let actualScale = "";
              if (biomass < 30) {
                const progress = biomass / 30;
                actualScale = `${(1 + progress * 9).toFixed(1)} μm`;
              } else if (biomass < 300) {
                const progress = (biomass - 30) / 270;
                actualScale = `${(10 + progress * 90).toFixed(0)} μm`;
              } else if (biomass < 3000) {
                const progress = (biomass - 300) / 2700;
                actualScale = `${(0.1 + progress * 0.9).toFixed(1)} mm`;
              } else if (biomass < 30000) {
                const progress = (biomass - 3000) / 27000;
                actualScale = `${(1 + progress * 9).toFixed(0)} mm`;
              } else if (biomass < 300000) {
                const progress = (biomass - 30000) / 270000;
                actualScale = `${(1 + progress * 9).toFixed(0)} cm`;
              } else if (biomass < 3000000) {
                const progress = (biomass - 300000) / 2700000;
                actualScale = `${(10 + progress * 90).toFixed(0)} cm`;
              } else {
                const progress = Math.min(1, (biomass - 3000000) / 7000000);
                actualScale = `${(1 + progress * 9).toFixed(1)} m`;
              }
              return actualScale;
            })()}
          </div>
        </div>
      </div>

      {/* Zoom Info */}
      <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "15px" }}>
        <div style={{ marginBottom: "2px" }}>
          Zoom:{" "}
          <span style={{ color: "#4ade80", fontWeight: "bold" }}>
            {zoom.toFixed(2)}x
          </span>
        </div>
        <div style={{ marginBottom: "2px" }}>
          Blob:{" "}
          <span style={{ color: "#4ade80", fontWeight: "bold" }}>
            {blobSize.toFixed(0)}px
          </span>
        </div>
        <div>
          View:{" "}
          <span style={{ color: "#4ade80", fontWeight: "bold" }}>
            {(1 / zoom).toFixed(1)}x
          </span>{" "}
          expanded
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "5px" }}>
          Scale Progress
        </div>
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#333",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.max(10, (1 - zoom) * 100)}%`,
              height: "100%",
              backgroundColor: scale.color,
              borderRadius: "4px",
              transition: "all 0.3s ease",
              boxShadow: `0 0 4px ${scale.color}50`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
