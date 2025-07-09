import React from "react";
import type { GameState } from "../../engine/game";
import { GameStats } from "./GameStats";
import { Shop } from "./Shop";
import { EvolutionPanel } from "./Evolution";

interface GameHUDProps {
  biomass: number;
  gameState?: GameState;
  onBuyGenerator?: (generatorId: string) => void;
  onBuyUpgrade?: (upgradeId: string) => void;
  onEvolve?: () => void;
  blobSize?: number;
  zoom?: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  biomass,
  gameState,
  onBuyGenerator,
  onBuyUpgrade,
  onEvolve,
  blobSize = 50,
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
          onBuyGenerator={onBuyGenerator}
          onBuyUpgrade={onBuyUpgrade}
        />
      </div>

      <EvolutionPanel
        biomass={biomass}
        blobSize={blobSize}
        gameState={gameState}
        onEvolve={onEvolve}
        zoom={zoom}
      />
    </>
  );
};
