import React, { useMemo, useEffect } from "react";
import type { GameState } from "../../game/types";
import { GAME_CONFIG } from "../../game/content/config";
import {
  calculateGeneratorEmojis,
  calculateAllFloatingNumberData,
  type ScreenLayout,
} from "../../game/systems/generatorVisualization";

interface GeneratorVisualizationProps {
  gameState: GameState;
  blobPosition: { x: number; y: number };
  addFloatingNumber: (position: { x: number; y: number }, value: number, color?: string) => void;
}

export const MapGenerators: React.FC<GeneratorVisualizationProps> = ({
  gameState,
  addFloatingNumber,
}) => {
  const generatorEmojis = useMemo(() => {
    return calculateGeneratorEmojis(gameState);
  }, [gameState]);

  // Trigger floating number animations every second
  useEffect(() => {
    if (generatorEmojis.length === 0) return;

    const interval = setInterval(() => {
      const floatingNumbers = calculateAllFloatingNumberData(generatorEmojis, gameState);
      
      floatingNumbers.forEach((data) => {
        addFloatingNumber({ x: data.x, y: data.y }, data.value, data.color);
      });
    }, GAME_CONFIG.generatorVisualization.floatingNumberInterval);

    return () => clearInterval(interval);
  }, [generatorEmojis, gameState, addFloatingNumber]);

  if (generatorEmojis.length === 0) {
    return null;
  }

  // Calculate screen positions for generators
  const { centerX, centerY } = calculateScreenLayout();
  const { ringRadius, emojiSize } = GAME_CONFIG.generatorVisualization;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {generatorEmojis.map((emoji, index) => {
        const x = centerX + Math.cos(emoji.angle) * ringRadius;
        const y = centerY + Math.sin(emoji.angle) * ringRadius;

        return (
          <div
            key={`${emoji.generatorId}-${index}`}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              fontSize: `${emojiSize}px`,
              lineHeight: 1,
              pointerEvents: "auto",
              userSelect: "none",
              color: "#000",
              textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
              zIndex: 60,
              cursor: "help",
            }}
            title={`${emoji.name} (${emoji.count} owned)`}
          >
            {emoji.emoji}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to calculate screen layout (moved from engine for component use)
function calculateScreenLayout(): ScreenLayout {
  const { hudWidth, rightHudWidth } = GAME_CONFIG.generatorVisualization;
  const playableWidth = window.innerWidth - hudWidth - rightHudWidth;
  const centerX = hudWidth + playableWidth / 2;
  const centerY = window.innerHeight / 2;
  
  return { centerX, centerY, playableWidth };
}
