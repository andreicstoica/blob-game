import React, { useMemo, useEffect } from "react";
import type { GameState } from "../../game/types";
import { GENERATORS } from "../../game/content/generators";
import { getTotalGrowth } from "../../game/systems/calculations";
import type { GeneratorEmoji } from '../../game/types';

interface GeneratorVisualizationProps {
  gameState: GameState;
  blobPosition: { x: number; y: number };
}

// Ring radius in pixels (inside the blob)
const RING_RADIUS = 30;

export const MapGenerators: React.FC<GeneratorVisualizationProps> = ({
  gameState,
}) => {
  const generatorEmojis = useMemo(() => {
    const emojis: GeneratorEmoji[] = [];

    // Get all generators with count > 0
    Object.values(gameState.generators).forEach((generator) => {
      if (generator.level > 0) {
        const generatorData = GENERATORS[generator.id];
        if (generatorData) {
          // Extract emoji from generator name
          const emoji = generatorData.name.split(" ")[0] || "⚪";
          console.log(`Generator: ${generatorData.name}, Emoji: "${emoji}"`);

          // Create one emoji for each generator purchased
          for (let i = 0; i < generator.level; i++) {
            emojis.push({
              generatorId: generator.id,
              emoji,
              angle: 0, // Will be calculated below
              count: generator.level,
              name: generatorData.name,
            });
          }
        }
      }
    });

    // Calculate angles for positioning
    emojis.forEach((emoji, index) => {
      emoji.angle = (index / emojis.length) * 2 * Math.PI;
    });

    return emojis;
  }, [gameState.generators]);

  // Trigger floating number animations every second
  useEffect(() => {
    if (generatorEmojis.length === 0) return;

    const interval = setInterval(() => {
      // Calculate positions and trigger animations
      const hudWidth = 350;
      const rightHudWidth = 350;
      const playableWidth = window.innerWidth - hudWidth - rightHudWidth;
      const centerX = hudWidth + playableWidth / 2;
      const centerY = window.innerHeight / 2;

      generatorEmojis.forEach((emoji) => {
        const generator = gameState.generators[emoji.generatorId];
        if (generator && generator.baseEffect > 0 && window.addFloatingNumber) {
          // Calculate position for floating numbers
          const x = centerX + Math.cos(emoji.angle) * RING_RADIUS;
          const y = centerY + Math.sin(emoji.angle) * RING_RADIUS;

          const individualGrowth = generator.baseEffect;

          // Determine color based on contribution
          const totalGrowth = getTotalGrowth(gameState);
          const contributionRatio = individualGrowth / totalGrowth;
          let color = "#4ade80"; // Default green

          if (contributionRatio < 0.01) {
            color = "#ef4444"; // Red for low contribution
          } else if (contributionRatio < 0.05) {
            color = "#f59e0b"; // Yellow for medium contribution
          }

          window.addFloatingNumber({ x, y }, individualGrowth, color);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [generatorEmojis, gameState.generators]);

  if (generatorEmojis.length === 0) {
    return null;
  }

  // Calculate screen positions for generators
  const hudWidth = 350;
  const rightHudWidth = 350;
  const playableWidth = window.innerWidth - hudWidth - rightHudWidth;
  const centerX = hudWidth + playableWidth / 2;
  const centerY = window.innerHeight / 2;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {generatorEmojis.map((emoji, index) => {
        const x = centerX + Math.cos(emoji.angle) * RING_RADIUS;
        const y = centerY + Math.sin(emoji.angle) * RING_RADIUS;

        return (
          <div
            key={`${emoji.generatorId}-${index}`}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              fontSize: "16px",
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
