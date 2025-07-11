import React, { useState } from "react";
import type { GameState } from "../../../game/types";
import type { TutorialState } from "../../../game/types/ui";
import { getCurrentLevel } from "../../../game/systems/actions";
import {
  ShopGenerators,
  ShopUpgrades,
  FilterToggle,
  BuyMultiplierToggle,
} from "./index";
import { Colors } from "../../../styles/colors";

interface ShopProps {
  biomass: number;
  gameState?: GameState;
  tutorialState?: TutorialState;
  onBuyGenerator?: (generatorId: string) => void;
  onBuyUpgrade?: (upgradeId: string) => void;
}

export const Shop: React.FC<ShopProps> = ({
  biomass,
  gameState,
  tutorialState,
  onBuyGenerator,
  onBuyUpgrade,
}) => {
  const [generatorFilter, setGeneratorFilter] = useState<"current" | "all">(
    "all"
  );
  const [buyMultiplier, setBuyMultiplier] = useState<1 | 10>(1);

  if (!gameState || !onBuyGenerator || !onBuyUpgrade) {
    return null;
  }

  const currentLevel = getCurrentLevel(gameState);

  const handleBuyGenerator = (generatorId: string) => {
    // Buy multiple generators based on multiplier
    for (let i = 0; i < buyMultiplier; i++) {
      onBuyGenerator(generatorId);
    }
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    onBuyUpgrade(upgradeId);
  };

  return (
    <div
      style={{
        userSelect: "none",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Header */}
      <div
        style={{
          padding: "20px 20px 15px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px 0",
            fontSize: "24px",
            color: Colors.shop.primary,
            textAlign: "center",
            userSelect: "none",
            textTransform: "uppercase",
            textShadow:
              "0 0 12px rgba(200, 200, 200, 0.4), 0 0 24px rgba(200, 200, 200, 0.4)",
          }}
        >
          SHOP
        </h2>

        {/* Filter and Buy Multiplier Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FilterToggle
            filter={generatorFilter}
            onFilterChange={setGeneratorFilter}
          />
          <BuyMultiplierToggle
            multiplier={buyMultiplier}
            onMultiplierChange={setBuyMultiplier}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "5px 20px 20px 20px",
        }}
      >
        {/* Generators Component */}
        <ShopGenerators
          biomass={biomass}
          gameState={gameState}
          tutorialState={tutorialState}
          onBuyGenerator={handleBuyGenerator}
          generatorFilter={generatorFilter}
          currentLevel={currentLevel}
          buyMultiplier={buyMultiplier}
        />

        {/* Upgrades Component */}
        <ShopUpgrades
          biomass={biomass}
          gameState={gameState}
          tutorialState={tutorialState}
          onBuyUpgrade={handleBuyUpgrade}
          generatorFilter={generatorFilter}
          currentLevel={currentLevel}
        />
      </div>

      <style>{`
        @keyframes purchasePulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        .generator-card:hover .generator-stats {
          opacity: 1 !important;
        }
        
        .generator-card, .upgrade-card {
          transition: all 0.3s ease-in-out, transform 0.2s ease-out !important;
        }
        
        /* Smooth position transitions for re-sorting */
        .generator-card, .upgrade-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
      `}</style>
    </div>
  );
};
