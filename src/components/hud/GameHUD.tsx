import React from "react";
import type { GameHUDProps } from "../../game/types";
import { GameStats } from "./GameStats";
import { Shop } from "./Shop";
import { TutorialManager } from "../tutorial/TutorialManager";
import { calculateBlobPosition } from "../../game/systems/calculations";
import {
  getNextLevel,
  canEvolveToNextLevel,
  getCurrentLevel,
} from "../../game/systems/actions";
import { CurrentLevel } from "./Evolution/CurrentLevel";
import { NextEvolution } from "./Evolution/NextEvolution";
import { EvolutionButton } from "./Evolution/EvolutionButton";


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

  // Evolution data
  const currentLevel = gameState ? getCurrentLevel(gameState) : null;
  const nextLevel = gameState ? getNextLevel(gameState) : null;
  const canEvolve = gameState ? canEvolveToNextLevel(gameState) : false;

  // Calculate top bar dimensions
  const topBarHeight = 60;
  const topBarMargin = 40;
  
  return (
    <>
      {/* Evolution Bar - Top of screen with button in middle */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: `${shopWidth + topBarMargin}px`,
          right: `${topBarMargin}px`,
          height: `${topBarHeight}px`,
          zIndex: 1000,
          display: "flex",
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '0 0 8px 8px',
        }}
      >
        {/* Current Level Section */}
        {currentLevel && (
          <div style={{
            flex: 1,
            padding: '8px 12px',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
          }}>
            <CurrentLevel
              displayName={currentLevel.displayName}
              name={currentLevel.name}
              description={currentLevel.description}
            />
          </div>
        )}

        {/* Evolution Button Section - Center */}
        {gameState && currentLevel && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            borderRight: nextLevel ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
            minWidth: '120px', // Ensure button has enough space
          }}>
            <EvolutionButton
              canEvolve={canEvolve}
              hasNextLevel={!!nextLevel}
              onEvolve={onEvolve}
              currentLevelId={currentLevel.id}
            />
          </div>
        )}

        {/* Next Evolution Section */}
        {nextLevel && gameState && (
          <div style={{
            flex: 1,
            padding: '8px 12px',
            overflow: 'hidden',
          }}>
            <NextEvolution
              nextLevel={nextLevel}
              canEvolve={canEvolve}
              biomass={biomass}
              gameState={gameState}
            />
          </div>
        )}
      </div>

      {/* Biomass Card - No button anymore */}
      <div
        style={{
          position: "fixed",
          top: `${topBarHeight}px`,
          left: `${blobPosition.x}px`,
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <GameStats 
          biomass={biomass} 
          gameState={gameState}
        />
      </div>

      {/* Shop Section */}
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

      {/* Tutorial System - Highest z-index */}
      {tutorialState && (() => {
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
