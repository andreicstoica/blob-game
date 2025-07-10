import React from "react";
import type { GeneratorVisualization } from "../../game/types/ui";
import { GAME_CONFIG } from "../../game/content/config";
import { calculateBlobPosition } from "../../game/systems/calculations";

interface StackedGeneratorElementProps {
  generator: GeneratorVisualization;
}

export const StackedGeneratorElement: React.FC<StackedGeneratorElementProps> = ({ generator }) => {
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
        fontSize: `${display.stackedLevelSize}px`,
        lineHeight: 1,
        pointerEvents: "auto",
        userSelect: "none",
        color: "#000",
        textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
        zIndex: 80,
        cursor: "help",
      }}
      title={`${generator.emoji} (${generator.count} total from previous levels)`}
    >
      <div style={{ position: 'relative' }}>
        {generator.emoji}
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            fontSize: `${display.countOverlaySize}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          {generator.count}
        </div>
      </div>
    </div>
  );
}; 