import React from 'react';
import type { GameState } from '../../engine/game';
import { getCurrentLevel, getNextLevel, canEvolveToNextLevel } from '../../engine/game';
import { NumberFormatter } from '../../utils/numberFormat';

interface EvolutionPanelProps {
  biomass: number;
  blobSize: number;
  gameState?: GameState;
  onEvolve?: () => void;
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
    return {
      name: "Atomic",
      description: "Individual atoms and molecules",
      unit: "1-10 nm",
      color: "#10b981",
      icon: "⚛️",
    };
  } else if (biomass < 300) {
    return {
      name: "Molecular",
      description: "Complex molecules and compounds",
      unit: "10-100 nm",
      color: "#3b82f6",
      icon: "🧬",
    };
  } else if (biomass < 3000) {
    return {
      name: "Cellular",
      description: "Individual cells and organelles",
      unit: "0.1-1 μm",
      color: "#8b5cf6",
      icon: "🔬",
    };
  } else if (biomass < 30000) {
    return {
      name: "Tissue",
      description: "Cell clusters and tissues",
      unit: "1-10 μm",
      color: "#f59e0b",
      icon: "🦠",
    };
  } else if (biomass < 300000) {
    return {
      name: "Organ",
      description: "Organs and small organisms",
      unit: "1-10 mm",
      color: "#ef4444",
      icon: "🐛",
    };
  } else if (biomass < 3000000) {
    return {
      name: "Organism",
      description: "Complete living beings",
      unit: "10 cm - 1 m",
      color: "#84cc16",
      icon: "🐕",
    };
  } else if (biomass < 30000000) {
    return {
      name: "Building",
      description: "Structures and buildings",
      unit: "1-100 m",
      color: "#06b6d4",
      icon: "🏢",
    };
  } else if (biomass < 300000000) {
    return {
      name: "City",
      description: "Urban areas and districts",
      unit: "100 m - 10 km",
      color: "#f97316",
      icon: "🏙️",
    };
  } else if (biomass < 3000000000) {
    return {
      name: "Regional",
      description: "States and provinces",
      unit: "10-1000 km",
      color: "#a855f7",
      icon: "🗺️",
    };
  } else if (biomass < 30000000000) {
    return {
      name: "Continental",
      description: "Continents and large landmasses",
      unit: "1000-10000 km",
      color: "#ec4899",
      icon: "🌎",
    };
  } else if (biomass < 300000000000) {
    return {
      name: "Planetary",
      description: "Planets and moons",
      unit: "10000-100000 km",
      color: "#14b8a6",
      icon: "🌍",
    };
  } else if (biomass < 3000000000000) {
    return {
      name: "Stellar",
      description: "Stars and solar systems",
      unit: "100000-1000000 km",
      color: "#fbbf24",
      icon: "⭐",
    };
  } else if (biomass < 30000000000000) {
    return {
      name: "Galactic",
      description: "Galaxies and star clusters",
      unit: "1-100 light years",
      color: "#8b5cf6",
      icon: "🌌",
    };
  } else {
    return {
      name: "Cosmic",
      description: "Intergalactic structures",
      unit: "100+ light years",
      color: "#6366f1",
      icon: "🌌",
    };
  }
};

export const EvolutionPanel: React.FC<EvolutionPanelProps> = ({
  biomass,
  blobSize,
  gameState,
  onEvolve,
}) => {
  if (!gameState) return null;

  const currentLevel = getCurrentLevel(gameState);
  const nextLevel = getNextLevel(gameState);
  const canEvolve = canEvolveToNextLevel(gameState);
  const scale = getScaleLevel(biomass);
  const zoom = Math.max(0.15, 1.0 - Math.log10(biomass + 1) * 0.3);

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

      {/* Scale Level Display */}
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
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              {scale.description}
            </div>
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
            {nextLevel && (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{
                        margin: '0 0 10px 0',
                        fontSize: '18px',
                        color: 'white'
                    }}>
                        Next Evolution: {nextLevel.displayName || nextLevel.name}
                    </h3>
                    <p style={{
                        margin: '0 0 15px 0',
                        fontSize: '14px',
                        opacity: 0.8
                    }}>
                        {nextLevel.description}
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <span style={{ fontSize: '14px' }}>Required Biomass:</span>
                        <span style={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            color: canEvolve ? '#4ade80' : '#ef4444'
                        }}>
                            {NumberFormatter.threshold(nextLevel.biomassThreshold, gameState)}
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '14px' }}>Your Biomass:</span>
                        <span style={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            color: canEvolve ? '#4ade80' : '#9ca3af'
                        }}>
                            {NumberFormatter.biomass(biomass, gameState)}
                        </span>
                    </div>
                </div>
            )}
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
          Current Level: {currentLevel.displayName || currentLevel.name}
        </h3>
        <p
          style={{
            margin: "0",
            fontSize: "14px",
            opacity: 0.8,
          }}
        >
          {currentLevel.description}
        </p>
      </div>

      {nextLevel && (
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
              {formatBiomass(
                nextLevel.biomassThreshold,
                nextLevel.biomassDisplayFormat
              )}
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
              {formatBiomass(biomass, nextLevel.biomassDisplayFormat)}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={onEvolve}
        disabled={!canEvolve}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: canEvolve ? "#4ade80" : "#374151",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: canEvolve ? "pointer" : "not-allowed",
          opacity: canEvolve ? 1 : 0.5,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (canEvolve) {
            e.currentTarget.style.backgroundColor = "#22c55e";
          }
        }}
        onMouseLeave={(e) => {
          if (canEvolve) {
            e.currentTarget.style.backgroundColor = "#4ade80";
          }
        }}
      >
        {canEvolve ? "Evolve!" : "Not Ready"}
      </button>

      {!nextLevel && (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "14px",
              color: "#4ade80",
            }}
          >
            🏆 You've reached the maximum evolution level! There are no more
            universes to conquer.
          </p>
        </div>
      )}
    </div>
  );
};
