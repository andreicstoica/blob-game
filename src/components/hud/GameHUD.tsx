import React from "react";
import type { GameHUDProps } from "../../game/types";
import { GameStats } from "./GameStats";
import { Shop } from "./Shop";
import { EvolutionPanel } from "./Evolution/EvolutionPanel";
import { TutorialManager } from "../tutorial/TutorialManager";
import { SlimeTrail } from "../particles/SlimeTrail";
import { calculateBlobPosition } from "../../game/systems/calculations";
import { Colors } from "../../styles/colors";

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
  const shopWidth = 350;
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <GameStats biomass={biomass} gameState={gameState} />
        
        {/* Tutorial indicator - only show when tutorial is active */}
        {tutorialState?.isActive && (
          <div
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: Colors.biomass.dark,
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: "bold",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "4px 12px",
              borderRadius: "6px",
              border: `2px solid ${Colors.biomass.dark}`,
              textShadow: "0 0 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.8), 0 0 24px rgba(22, 163, 74, 0.6)",
            }}
          >
            TUTORIAL
          </div>
        )}
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

      {/* Slime Trail - Only active when tutorial is not active */}
      <SlimeTrail isActive={!tutorialState?.isActive} />

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
