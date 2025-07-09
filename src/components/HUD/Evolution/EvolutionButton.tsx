import React from 'react';

interface EvolutionButtonProps {
  canEvolve: boolean;
  hasNextLevel: boolean;
  onEvolve?: () => void;
}

export const EvolutionButton: React.FC<EvolutionButtonProps> = ({ 
  canEvolve, 
  hasNextLevel, 
  onEvolve 
}) => {
  if (!hasNextLevel) {
    return (
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
    );
  }

  return (
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
  );
}; 