import React from "react";
import { Colors } from "../../styles/colors";

interface TutorialPopupProps {
  position: "shop" | "evolution";
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export const TutorialPopup: React.FC<TutorialPopupProps> = ({
  position,
  message,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  // Position the popup based on the target area
  const getPopupStyle = () => {
    const baseStyle = {
      position: "fixed" as const,
      background: "rgba(64, 64, 64, 0.9)",
      color: "white",
      padding: "20px 16px",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "normal",
      maxWidth: "280px",
      zIndex: 1000,
      cursor: onClose ? "pointer" : "default",
      transition: "all 0.3s ease-in-out",
      fontFamily: "Arial, sans-serif",
    };

    if (position === "shop") {
      return {
        ...baseStyle,
        left: "370px", // Moved further right (was 320px)
        top: "35%", // Moved up (was 40%)
        transform: "translateY(-50%)",
        maxWidth: "320px",
        boxShadow: `0 2px 8px ${Colors.shop.primary}40`,
        border: `2px solid ${Colors.shop.primary}`,
      };
    } else if (position === "evolution") {
      return {
        ...baseStyle,
        right: "375px", // Position further left to avoid overlap with evolution panel
        top: "35%", // Moved up (was 45%)
        transform: "translateY(-50%)",
        boxShadow: `0 2px 8px ${Colors.evolution.primary}40`,
        border: `2px solid ${Colors.evolution.primary}`,
      };
    }

    return baseStyle;
  };

  return (
    <div
      style={getPopupStyle()}
      onClick={onClose || undefined}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(1.01)";
        e.currentTarget.style.background = "rgba(80, 80, 80, 0.95)";
        const borderColor =
          position === "shop"
            ? Colors.shop.primary
            : Colors.evolution.primary;
        e.currentTarget.style.boxShadow = `0 4px 12px ${borderColor}60`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        e.currentTarget.style.background = "rgba(64, 64, 64, 0.9)";
        const borderColor =
          position === "shop"
            ? Colors.shop.primary
            : Colors.evolution.primary;
        e.currentTarget.style.boxShadow = `0 2px 8px ${borderColor}40`;
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "28px" }}>💡</span>
        <div
          style={{
            opacity: 0.8,
            lineHeight: "1.3",
            fontSize: "15px",
            whiteSpace: "pre-line",
          }}
        >
          {message.split("\n").map((line, index) => (
            <div
              key={index}
              style={{
                marginBottom: "0px",
              }}
            >
              {line.split(" ").map((word, wordIndex) => {
                // Handle punctuation by checking the word without trailing punctuation
                const cleanWord = word.replace(/[.,!?]$/, "");

                if (cleanWord === "Generators") {
                  return (
                    <span
                      key={wordIndex}
                      style={{
                        fontWeight: "bold",
                        color: Colors.generators.primary,
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                }
                if (cleanWord === "Evolution" || cleanWord === "Evolutions") {
                  return (
                    <span
                      key={wordIndex}
                      style={{
                        fontWeight: "bold",
                        color: Colors.evolution.primary,
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                }
                if (cleanWord === "Levels") {
                  return (
                    <span
                      key={wordIndex}
                      style={{
                        fontWeight: "bold",
                        color: Colors.evolution.primary,
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                }
                if (cleanWord === "Upgrades") {
                  return (
                    <span
                      key={wordIndex}
                      style={{
                        fontWeight: "bold",
                        color: Colors.upgrades.light,
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                }
                if (cleanWord === "Biomass") {
                  return (
                    <span
                      key={wordIndex}
                      style={{
                        fontWeight: "bold",
                        color: Colors.biomass.primary,
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                }

                // Special handling for "How far can you go?" phrase
                if (line.includes("How far can you go?")) {
                  const phraseStart = line.indexOf("How far can you go?");
                  const phraseEnd =
                    phraseStart + "How far can you go?".length;
                  const wordStart = line.indexOf(word);

                  if (wordStart >= phraseStart && wordStart < phraseEnd) {
                    return (
                      <span key={wordIndex} style={{ fontWeight: "bold" }}>
                        {word}{" "}
                      </span>
                    );
                  }
                }
                if (cleanWord === "Shop") {
                  return (
                    <span
                      key={wordIndex}
                      style={{
                        fontWeight: "bold",
                        color: Colors.shop.primary,
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                }
                return word + " ";
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
