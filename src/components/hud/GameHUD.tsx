import React from "react";
import type { GameHUDProps } from "../../game/types";
import { GameStats } from "./GameStats";
import { Shop } from "./Shop";
import { EvolutionPanel } from "./Evolution/EvolutionPanel";
import { TutorialManager } from "../tutorial/TutorialManager";
import { calculateBlobPosition } from "../../game/systems/calculations";

export const GameHUD: React.FC<GameHUDProps> = ({
  biomass,
  gameState,
  tutorialState,
  onBuyGenerator,
  onBuyUpgrade,
  onEvolve,
  onTutorialStepComplete,
}) => {
  const blobPosition = calculateBlobPosition();
  const shopWidth = 300;
  const evolutionWidth = 300;

  return (
    <>
      {/* GameStats - Center of screen */}
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <GameStats biomass={biomass} gameState={gameState} />
      </div>

      {/* Shop Section - Left side */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${shopWidth}px`,
          height: "100vh",
          zIndex: 1000,
        }}
      >
        <Shop
          biomass={biomass}
          gameState={gameState}
          tutorialState={tutorialState}
          onBuyGenerator={onBuyGenerator}
          onBuyUpgrade={onBuyUpgrade}
        />
      </div>

      {/* Evolution Panel - Right side */}
      {gameState && (
        <EvolutionPanel
          biomass={biomass}
          gameState={gameState}
          onEvolve={onEvolve}
          width={evolutionWidth}
        />
      )}

      {/* Tutorial System - Highest z-index */}
      {tutorialState &&
        (() => {
          return (
            <TutorialManager
              tutorialState={tutorialState}
              blobPosition={blobPosition}
              onTutorialStepComplete={onTutorialStepComplete}
            />
          );
        })()}
    </>
  );
};
