import React, { useState, useEffect } from "react";
import type { GameState } from "../types";
import type { Level } from "../core/content/levels";
import type { Particle } from "../types";
import { getNextLevel } from "../core/content/levels";
import { useBlobSize } from "../hooks/useBlobSize";
import { getParticleConfig } from "../core/config/particles";

// Off-screen spawning logic
const spawnOffScreenParticle = (
  config: ReturnType<typeof getParticleConfig>,
  gameState: GameState,
  currentLevel: Level
): Particle => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const centerX = screenWidth / 2;
  const centerY = screenHeight / 2;

  // Calculate progress within current level for dynamic sizing
  const nextLevel = getNextLevel(currentLevel);
  let sizeMultiplier = 1.0;

  if (nextLevel) {
    const progressInLevel = Math.max(
      0,
      gameState.biomass - currentLevel.biomassThreshold
    );
    const levelRange =
      nextLevel.biomassThreshold - currentLevel.biomassThreshold;
    const progressRatio = Math.min(1, progressInLevel / levelRange);

    // Bacteria start big when level just starts (progressRatio = 0)
    // and get smaller as player approaches next level (progressRatio = 1)
    // Use inverse relationship: bigger particles when progress is smaller
    sizeMultiplier = Math.max(0.3, 3.0 - progressRatio * 2.5);
  }

  // Spawn from one of the four screen edges
  const edge = Math.floor(Math.random() * 4);
  let x: number = 0,
    y: number = 0;

  switch (edge) {
    case 0: // Top
      x = Math.random() * screenWidth;
      y = -config.size * sizeMultiplier;
      break;
    case 1: // Right
      x = screenWidth + config.size * sizeMultiplier;
      y = Math.random() * screenHeight;
      break;
    case 2: // Bottom
      x = Math.random() * screenWidth;
      y = screenHeight + config.size * sizeMultiplier;
      break;
    case 3: // Left
      x = -config.size * sizeMultiplier;
      y = Math.random() * screenHeight;
      break;
    default:
      x = 0;
      y = 0;
  }

  // Calculate direction toward center with some randomness
  const dx = centerX - x;
  const dy = centerY - y;

  // Add some randomness to the direction (not perfectly straight)
  const randomAngle = (Math.random() - 0.5) * 0.5; // ±0.25 radians (~±14 degrees)
  const cos = Math.cos(randomAngle);
  const sin = Math.sin(randomAngle);

  // Apply rotation to the direction vector
  const rotatedDx = dx * cos - dy * sin;
  const rotatedDy = dx * sin + dy * cos;

  // Normalize direction vector
  const magnitude = Math.sqrt(rotatedDx * rotatedDx + rotatedDy * rotatedDy);
  const directionX = rotatedDx / magnitude;
  const directionY = rotatedDy / magnitude;

  return {
    id: Math.random().toString(36),
    x: typeof x === "number" ? x : 0,
    y: typeof y === "number" ? y : 0,
    speed: config.speed,
    size: config.size * sizeMultiplier,
    color: config.color,
    type: config.type,
    useImage: config.useImage,
    image: config.images
      ? config.images[Math.floor(Math.random() * config.images.length)]
      : undefined,
    direction: { x: directionX, y: directionY },
  };
};

interface ParticleSystemProps {
  gameState: GameState;
  currentLevel: Level;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  gameState,
  currentLevel,
}) => {
  if (!currentLevel) return null;

  const [particles, setParticles] = useState<Particle[]>([]);
  const config = getParticleConfig(currentLevel.name);

  // Get blob position and size
  const blobPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const blobSize = useBlobSize(gameState);

  // Spawn particles based on growth rate and level progress
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const nextLevel = getNextLevel(currentLevel);
      let progressRatio = 0;

      if (nextLevel) {
        const progressInLevel = Math.max(
          0,
          gameState.biomass - currentLevel.biomassThreshold
        );
        const levelRange =
          nextLevel.biomassThreshold - currentLevel.biomassThreshold;
        progressRatio = Math.min(1, progressInLevel / levelRange);
      }

      // Spawn rate increases as you progress through the level
      const progressMultiplier = 0.3 + progressRatio * 0.7; // 0.3x at start, 1.0x at end
      const spawnRate =
        config.spawnRate *
        progressMultiplier *
        (1 + (gameState.growth || 0) / 1000);
      const shouldSpawn = Math.random() < spawnRate / 60; // 60fps

      if (shouldSpawn) {
        const newParticle = spawnOffScreenParticle(
          config,
          gameState,
          currentLevel
        );
        setParticles((prev) => [...prev, newParticle]);
      }
    }, 16); // 60fps

    return () => clearInterval(spawnInterval);
  }, [config, gameState.growth, gameState.biomass, currentLevel]);

  // Animate particles moving across screen
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setParticles(
        (prev) =>
          prev
            .map((particle) => {
              const speed = particle.speed / 60; // 60fps
              const newX = particle.x + particle.direction.x * speed;
              const newY = particle.y + particle.direction.y * speed;

              // Optimized collision detection - use squared distances to avoid sqrt
              const dx = newX - blobPosition.x;
              const dy = newY - blobPosition.y;
              const distanceSquared = dx * dx + dy * dy;
              const collisionDistanceSquared = Math.pow(
                blobSize / 2 + particle.size / 2,
                2
              );

              if (distanceSquared <= collisionDistanceSquared) {
                // Particle hit blob - remove it
                return null;
              }

              // Check if particle is in the middle third of the screen
              const screenWidth = window.innerWidth;
              const screenHeight = window.innerHeight;
              const middleThirdStartX = screenWidth / 3;
              const middleThirdEndX = (screenWidth * 2) / 3;
              const middleThirdStartY = screenHeight / 3;
              const middleThirdEndY = (screenHeight * 2) / 3;

              if (
                newX >= middleThirdStartX &&
                newX <= middleThirdEndX &&
                newY >= middleThirdStartY &&
                newY <= middleThirdEndY
              ) {
                // Particle reached middle third - remove it
                return null;
              }

              return {
                ...particle,
                x: newX,
                y: newY,
              };
            })
            .filter(Boolean) as Particle[]
      );

      animationId = requestAnimationFrame(animate);
    };

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [particles.length, blobPosition.x, blobPosition.y, blobSize]);

  return (
    <div className="particle-system">
      {/* Particles flying across screen */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.useImage ? "transparent" : particle.color,
            borderRadius: particle.useImage ? "0%" : "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 10,
            boxShadow: particle.useImage
              ? "none"
              : `0 0 ${particle.size * 2}px ${particle.color}`,
            backgroundImage:
              particle.useImage && particle.image
                ? `url(${particle.image})`
                : "none",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      ))}
    </div>
  );
};
