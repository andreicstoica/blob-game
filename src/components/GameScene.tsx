import React, { useState, useCallback } from "react";
import type { GameSceneProps } from "../game/types";
import { getCurrentLevel } from "../game/systems/actions";
import { ParticleSystem } from "./particles/ParticleSystem";
import { BlobContainer } from "./blob/BlobContainer";
import { GeneratorFloatingNumbers } from "./generators/GeneratorFloatingNumbers";
import { FloatingNumber } from "./animations/FloatingNumber";
import { RippleSystem } from "./particles/RippleSystem";
import type { FloatingNumberAnimation } from "../game/types";
import Map from "./map/Map";
import { calculateBlobPosition } from "../game/systems/calculations";

export const GameScene: React.FC<GameSceneProps> = ({
  gameState,
  blobSize,
  onBlobClick,
  zoom,
}) => {
  const currentLevel = getCurrentLevel(gameState);
  const [floatingNumbers, setFloatingNumbers] = useState<
    FloatingNumberAnimation[]
  >([]);
  const [blobAnimationState, setBlobAnimationState] = useState<{
    clickBoost: number;
    pressure: number;
  }>({
    clickBoost: 0,
    pressure: 0,
  });

  const addFloatingNumber = useCallback(
    (
      position: { x: number; y: number },
      value: number,
      color?: string,
      emoji?: string
    ) => {
      const id = Math.random().toString();
      const startTime = Date.now();

      setFloatingNumbers((prev) => [
        ...prev,
        {
          id,
          type: "floatingNumber",
          position,
          value,
          color,
          startTime,
          emoji,
        },
      ]);
    },
    []
  );

  const removeFloatingNumber = useCallback((id: string) => {
    setFloatingNumbers((prev) => prev.filter((anim) => anim.id !== id));
  }, []);

  return (
    <div
      className="game-scene"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {/* Background Layer with Zoom - z-index: 0 */}
      <Map className="z-0" zoom={zoom} />

      {/* Environment Effects Layer - z-index: 30 (outside zoom) */}
      <ParticleSystem
        gameState={gameState}
        currentLevel={currentLevel}
        blobSize={blobSize}
      />

      {/* Player Layer - z-index: 70+ (outside zoom) */}
      {/* Blob Layer - z-index: 70 */}
      <BlobContainer
        id="main-blob"
        biomass={gameState.biomass}
        gameState={gameState}
        size={blobSize}
        onBlobClick={onBlobClick}
        clickPower={gameState.clickPower}
        addFloatingNumber={addFloatingNumber}
        onAnimationStateChange={setBlobAnimationState}
      />

      {/* Generator Floating Numbers - z-index: 80 */}
      <GeneratorFloatingNumbers
        gameState={gameState}
        blobPosition={calculateBlobPosition()}
      />

      {/* Ripple Effects Layer - z-index: 75 (above blob, below generators) */}
      <RippleSystem
        blobSize={blobSize}
        blobAnimationState={blobAnimationState}
      />

      {/* Animation Layer - z-index: 90+ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 90,
        }}
      >
        {/* Floating Numbers */}
        {floatingNumbers.map((anim) => (
          <FloatingNumber
            key={anim.id}
            value={anim.value}
            position={anim.position}
            color={anim.color}
            startTime={anim.startTime}
            onComplete={() => removeFloatingNumber(anim.id)}
            emoji={anim.emoji}
          />
        ))}
      </div>
    </div>
  );
};
