import React from "react";
import type { GameHUDProps } from "../../game/types";
import { GameStats } from "./GameStats";
import { Shop } from "./Shop";
import { EvolutionPanel } from "./Evolution";
import { TutorialManager } from "../tutorial/TutorialManager";



export const GameHUD: React.FC<GameHUDProps> = ({
  biomass,
  gameState,
  tutorialState,
  onBuyGenerator,
  onBuyUpgrade,
  onEvolve,
  onTutorialStepComplete,
  zoom,
}) => {
  return (
    <>
      {/* Game Stats Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "600px",
          right: "600px",
          height: "140px",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          minWidth: '200px'
        }}
      >
        <GameStats biomass={biomass} gameState={gameState} />
      </div>

      {/* Shop Section */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "370px",
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

      <EvolutionPanel
        biomass={biomass}
        gameState={gameState}
        onEvolve={onEvolve}
        zoom={zoom}
      />

      {/* Tutorial System - Highest z-index */}
      {tutorialState && (() => {
        return (
          <TutorialManager
            tutorialState={tutorialState}
            blobPosition={{
              x: window.innerWidth / 2,
              y: window.innerHeight / 2
            }}
            onTutorialStepComplete={onTutorialStepComplete}
          />
        );
      })()}
    </>
  );
};
