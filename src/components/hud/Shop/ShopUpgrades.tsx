import React, { useState, useEffect } from "react";
import type { GameState } from "../../../game/types";
import type { TutorialState } from "../../../game/types/ui";
import { NumberFormatter } from "../../../utils/numberFormat";
import { LEVELS } from "../../../game/content/levels";
import { Colors } from "../../../styles/colors";
import { playSound } from "../../../utils/sound";

interface ShopFloatingNumber {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface UpgradesProps {
  biomass: number;
  gameState: GameState;
  tutorialState?: TutorialState;
  onBuyUpgrade: (upgradeId: string) => void;
  generatorFilter: "current" | "all";
  currentLevel: { name: string };
}

export const ShopUpgrades: React.FC<UpgradesProps> = ({
  biomass,
  gameState,
  tutorialState,
  onBuyUpgrade,
  generatorFilter,
  currentLevel,
}) => {
  const [floatingNumbers, setFloatingNumbers] = useState<ShopFloatingNumber[]>(
    []
  );

  // Clean up floating numbers after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setFloatingNumbers([]);
    }, 1000);
    return () => clearTimeout(timer);
  }, [floatingNumbers]);

  const addFloatingNumber = (
    text: string,
    x: number,
    y: number,
    color: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFloatingNumbers((prev) => [...prev, { id, text, x, y, color }]);
  };
  const isContentAvailable = (unlockedAtLevel: string) => {
    const levelIndex = LEVELS.findIndex(
      (level) => level.name === unlockedAtLevel
    );
    const currentLevelIndex = LEVELS.findIndex(
      (level) => level.name === currentLevel.name
    );
    return levelIndex <= currentLevelIndex;
  };

  return (
    <>
      <h3
        style={{
          margin: "30px 0 15px 0",
          fontSize: "12px",
          padding: "8px 16px",
          backgroundColor: Colors.upgrades.primary,
          color: "#fff",
          border: `2px solid ${Colors.upgrades.primary}`,
          borderRadius: "6px",
          display: "inline-block",
          fontWeight: "bold",
        }}
      >
        Upgrades
      </h3>
      {(() => {
        const upgrades = Object.values(gameState.upgrades).filter((upgrade) => {
          // Always show tutorial upgrade during tutorial
          if (upgrade.id === "tutorial-upgrade") {
            return tutorialState?.isActive;
          }

          if (generatorFilter === "current") {
            // Only show upgrades from current level
            return upgrade.unlockedAtLevel === currentLevel.name;
          } else {
            // Show all unlocked upgrades
            return isContentAvailable(upgrade.unlockedAtLevel);
          }
        });

        // Tutorial upgrade is now included in game state, so no need to add it here

        return upgrades;
      })()
        .sort((a, b) => {
          // Sort unpurchased first, then purchased
          if (a.purchased && !b.purchased) return 1;
          if (!a.purchased && b.purchased) return -1;
          return 0;
        })
        .map((upgrade) => {
          const canAfford =
            (biomass >= upgrade.cost || upgrade.id === "tutorial-upgrade") &&
            !upgrade.purchased;

          // Check if tutorial upgrade should be enabled (after click-blob step is completed, but before evolution-intro)
          const isTutorialEnabled =
            upgrade.id === "tutorial-upgrade" &&
            tutorialState?.completedSteps.has("click-blob") &&
            !tutorialState?.completedSteps.has("evolution-intro");

          return (
            <div
              key={upgrade.id}
              style={{
                background: upgrade.id === "tutorial-upgrade"
                  ? upgrade.purchased
                    ? "rgba(128, 128, 128, 0.3)" // gray background for purchased tutorial upgrade
                    : tutorialState?.currentStep?.type === "click-blob"
                    ? "rgba(128, 128, 128, 0.3)" // gray background during click-blob phase
                    : `${Colors.upgrades.primary}30` // purple background for unpurchased tutorial upgrade
                  : "rgba(128, 128, 128, 0.2)", // Consistent gray background for other upgrades
                border: `2px solid ${
                  upgrade.purchased
                    ? Colors.upgrades.light // purple border for purchased tutorial upgrade
                    : upgrade.id === "tutorial-upgrade" && !isTutorialEnabled
                    ? "#666" // gray border for disabled tutorial upgrade
                    : canAfford
                    ? Colors.upgrades.primary
                    : "#666"
                }`,
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "10px",
                cursor:
                  canAfford &&
                  (upgrade.id !== "tutorial-upgrade" || isTutorialEnabled)
                    ? "pointer"
                    : "default",
                fontSize: "12px",
                transition: "all 0.2s ease",
                transform: "scale(1)",
                boxShadow: upgrade.purchased
                  ? `0 2px 8px ${Colors.upgrades.light}40` // purple shadow for purchased tutorial upgrade
                  : upgrade.id === "tutorial-upgrade" && !isTutorialEnabled
                  ? "none" // no shadow for disabled tutorial upgrade
                  : upgrade.id === "tutorial-upgrade" &&
                    tutorialState?.currentStep?.type === "click-blob"
                  ? "none" // no shadow during click-blob phase
                  : canAfford
                  ? `0 2px 8px ${Colors.upgrades.primary}40`
                  : "none",
              }}
              onClick={(e) => {
                if (
                  canAfford &&
                  (upgrade.id !== "tutorial-upgrade" || isTutorialEnabled)
                ) {
                  onBuyUpgrade(upgrade.id);

                  // Play cash register sound for upgrade purchases
                  if (upgrade.id !== "tutorial-upgrade") {
                    playSound("cashRegister", 0.6);
                  }

                  // Add floating number animation - position outside shop panel (skip for tutorial upgrade)
                  if (upgrade.id !== "tutorial-upgrade") {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const shopPanel = e.currentTarget.closest(
                      '[style*="height: 100vh"]'
                    );
                    const shopRect = shopPanel?.getBoundingClientRect();

                    // Position the floating number outside the shop panel on the right
                    const x = shopRect ? shopRect.right + 20 : rect.right + 20;
                    const y = rect.top + rect.height / 2;

                    addFloatingNumber(
                      `-${NumberFormatter.biomass(upgrade.cost, gameState)}`,
                      x,
                      y,
                      Colors.headlines.primary
                    );
                  }
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.01)";
                if (upgrade.purchased) {
                  e.currentTarget.style.borderColor = Colors.upgrades.light;
                  e.currentTarget.style.boxShadow = `0 4px 12px ${Colors.upgrades.light}60`;
                  if (upgrade.id === "tutorial-upgrade") {
                    e.currentTarget.style.backgroundColor = "rgba(128, 128, 128, 0.4)";
                  }
                } else if (
                  canAfford &&
                  !upgrade.purchased &&
                  (upgrade.id !== "tutorial-upgrade" || isTutorialEnabled)
                ) {
                  e.currentTarget.style.borderColor = Colors.upgrades.primary;
                  e.currentTarget.style.boxShadow = `0 4px 12px ${Colors.upgrades.primary}60`;
                  if (upgrade.id === "tutorial-upgrade") {
                    if (tutorialState?.currentStep?.type === "click-blob") {
                      e.currentTarget.style.backgroundColor = "rgba(128, 128, 128, 0.4)";
                    } else {
                      e.currentTarget.style.backgroundColor = `${Colors.upgrades.primary}40`;
                    }
                  }
                } else if (!upgrade.purchased) {
                  e.currentTarget.style.borderColor = "#999";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.1)";
                  if (upgrade.id === "tutorial-upgrade") {
                    if (tutorialState?.currentStep?.type === "click-blob") {
                      e.currentTarget.style.backgroundColor = "rgba(128, 128, 128, 0.4)";
                    } else {
                      e.currentTarget.style.backgroundColor = `${Colors.upgrades.primary}20`;
                    }
                  }
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                if (upgrade.purchased) {
                  e.currentTarget.style.borderColor = Colors.upgrades.light;
                  e.currentTarget.style.boxShadow = `0 2px 8px ${Colors.upgrades.light}40`;
                  if (upgrade.id === "tutorial-upgrade") {
                    e.currentTarget.style.backgroundColor = "rgba(128, 128, 128, 0.3)";
                  }
                } else if (!upgrade.purchased) {
                  e.currentTarget.style.borderColor =
                    upgrade.id === "tutorial-upgrade" && !isTutorialEnabled
                      ? "#666"
                      : canAfford
                      ? Colors.upgrades.primary
                      : "#666";
                  e.currentTarget.style.boxShadow =
                    upgrade.id === "tutorial-upgrade" && !isTutorialEnabled
                      ? "none"
                      : canAfford
                      ? `0 2px 8px ${Colors.upgrades.primary}40`
                      : "none";
                  if (upgrade.id === "tutorial-upgrade") {
                    if (tutorialState?.currentStep?.type === "click-blob") {
                      e.currentTarget.style.backgroundColor = "rgba(128, 128, 128, 0.3)";
                    } else {
                      e.currentTarget.style.backgroundColor = `${Colors.upgrades.primary}30`;
                    }
                  }
                }
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  fontSize: "15px",
                  position: "relative",
                }}
              >
                {upgrade.name}
                {upgrade.purchased && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      color: Colors.upgrades.light,
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <div
                style={{
                  opacity: 0.8,
                  marginBottom: "5px",
                  lineHeight: "1.3",
                  fontSize: "13px",
                }}
              >
                {upgrade.description}
              </div>
              {!upgrade.purchased && (
                <div
                  style={{
                    color: canAfford
                      ? Colors.biomass.primary
                      : Colors.headlines.medium,
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  Cost:{" "}
                  <span style={{ fontSize: "15px" }}>
                    {NumberFormatter.biomass(upgrade.cost, gameState)}
                  </span>
                </div>
              )}
            </div>
          );
        })}

      {/* Floating Numbers */}
      {floatingNumbers.map((floatingNumber) => (
        <div
          key={floatingNumber.id}
          style={{
            position: "fixed",
            left: floatingNumber.x,
            top: floatingNumber.y,
            color: floatingNumber.color,
            fontWeight: "bold",
            fontSize: "14px",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0,
            transform: "translate(-50%, -50%)",
            animation: "floatUp 1s ease-out forwards",
          }}
        >
          {floatingNumber.text}
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(0);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(-10px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-40px);
          }
        }
      `}</style>
    </>
  );
};
