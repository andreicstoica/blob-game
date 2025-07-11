import React from "react";
import { useIntroStore } from "../../../store/introStore";
import { playSound } from "../../../utils/sound";
import { Colors } from "../../../styles/colors";

interface EvolutionButtonProps {
  canEvolve: boolean;
  hasNextLevel: boolean;
  onEvolve?: () => void;
  currentLevelId?: number; // Add current level ID to determine button text
}

export const EvolutionButton: React.FC<EvolutionButtonProps> = ({
  canEvolve,
  hasNextLevel,
  onEvolve,
  currentLevelId = 0,
}) => {
  const startIntro = useIntroStore(state => state.startIntro);

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
            color: Colors.evolution.primary,
          }}
        >
          🏆 You've reached the maximum evolution level! There are no more
          universes to conquer.
        </p>
      </div>
    );
  }

  // Determine button text based on current level
  const isIntroLevel = currentLevelId === 0;
  const buttonText = isIntroLevel ? "Start Game!" : "Evolve!";
  const notReadyText = isIntroLevel ? "Not Ready" : "Not Ready";

  const handleClick = () => {
    if (isIntroLevel) {
      // For intro level: play sound immediately, start intro animation
      playSound('gameStart');
      startIntro();
      // Game progression will happen after animation completes via IntroScreen
    } else {
      // For other levels, use the normal evolve behavior
      onEvolve?.();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={!canEvolve}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: canEvolve ? Colors.evolution.primary : "#374151",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: canEvolve ? "pointer" : "not-allowed",
          opacity: canEvolve ? 1 : 0.5,
          transition: "all 0.2s ease",
          animation: canEvolve ? "evolvePulse 1.2s ease-in-out infinite" : "none",
          boxShadow: canEvolve ? "0 0 20px rgba(74, 222, 128, 0.5)" : "none",
        }}
        onMouseEnter={(e) => {
          if (canEvolve) {
            e.currentTarget.style.backgroundColor = Colors.evolution.secondary;
          }
        }}
        onMouseLeave={(e) => {
          if (canEvolve) {
            e.currentTarget.style.backgroundColor = Colors.evolution.primary;
          }
        }}
      >
        {canEvolve ? buttonText : notReadyText}
      </button>
      
      <style>{`
              @keyframes evolvePulse {
        0% {
          background-color: ${Colors.evolution.primary};
          box-shadow: 0 0 20px ${Colors.evolution.primary}80;
          transform: scale(1);
        }
        50% {
          background-color: ${Colors.evolution.secondary};
          box-shadow: 0 0 30px ${Colors.evolution.secondary}cc;
          transform: scale(1.05);
        }
        100% {
          background-color: ${Colors.evolution.primary};
          box-shadow: 0 0 20px ${Colors.evolution.primary}80;
          transform: scale(1);
        }
      }
      `}</style>
    </>
  );
};
