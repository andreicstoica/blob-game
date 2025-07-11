import React from "react";
import type { GameState } from "../../game/types";
import { useGeneratorAnimation } from "../../hooks/useGeneratorAnimation";
import { GeneratorElement } from "./GeneratorElement";
import { StackedGeneratorElement } from "./StackedGeneratorElement";

interface GeneratorSystemProps {
  gameState: GameState;
  blobSize: number;
  addFloatingNumber: (position: { x: number; y: number }, value: number, color?: string, emoji?: string) => void;
}

export const GeneratorSystem: React.FC<GeneratorSystemProps> = ({
  gameState,
  blobSize,
  addFloatingNumber,
}) => {
  const { generators, stackedGenerators, hasGenerators } = useGeneratorAnimation(
    gameState,
    blobSize,
    addFloatingNumber
  );

  if (!hasGenerators) {
    return null;
  }

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      zIndex: 80
    }}>
      {generators.map((generator) => (
        <GeneratorElement key={generator.id} generator={generator} />
      ))}
      {stackedGenerators.map((generator) => (
        <StackedGeneratorElement key={generator.id} generator={generator} />
      ))}
    </div>
  );
}; 