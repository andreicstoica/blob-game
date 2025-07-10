import React from "react";
import type { GeneratorVisualization } from "../../game/types/ui";
import { GAME_CONFIG } from "../../game/content/config";
import { calculateBlobPosition } from "../../game/systems/calculations";

interface GeneratorElementProps {
  generator: GeneratorVisualization;
}

export const GeneratorElement: React.FC<GeneratorElementProps> = ({ generator }) => {
  const { display } = GAME_CONFIG.generatorVisualization;
  const blobPosition = calculateBlobPosition();
  
  const x = blobPosition.x + generator.position.x;
  const y = blobPosition.y + generator.position.y;

  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        fontSize: `${display.currentLevelSize}px`,
        lineHeight: 1,
        pointerEvents: "auto",
        userSelect: "none",
        color: "#000",
        textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
        zIndex: 85,
        cursor: "help",
      }}
      title={`${generator.emoji} (${generator.count} owned)`}
    >
      {generator.emoji}
    </div>
  );
}; 