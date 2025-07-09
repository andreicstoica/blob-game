// src/components/Animations/ParticleSystem.tsx
import React, { useState, useEffect } from "react";
import type { GameState } from "../../engine/game";
import type { Level } from "../../engine/levels";
import { getNextLevel } from "../../engine/levels";
import brownBacteria from "../../assets/bacteria/brown-bacteria.png";
import greenBacteria from "../../assets/bacteria/green-bacteria.png";
import purpleBacteria from "../../assets/bacteria/purple-bacteria.png";

interface Particle {
  id: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  type: "nutrient" | "energy" | "matter" | "cosmic";
  useImage?: boolean;
  image?: string;
  direction: { x: number; y: number };
}

interface ParticleConfig {
  type: "nutrient" | "energy" | "matter" | "cosmic";
  spawnRate: number; // particles per second
  speed: number; // pixels per second
  size: number;
  color: string;
  level: number;
  useImage: boolean;
  images?: string[];
}

const PARTICLE_CONFIGS = {
  intro: {
    type: "nutrient",
    spawnRate: 2,
    speed: 100,
    size: 4,
    color: "#4ade80",
    level: 1,
    useImage: false,
  },
  microscopic: {
    type: "nutrient",
    spawnRate: 5,
    speed: 120,
    size: 40,
    color: "#22c55e",
    level: 2,
    useImage: true,
    images: [brownBacteria, greenBacteria, purpleBacteria],
  },
  "petri-dish": {
    type: "energy",
    spawnRate: 8,
    speed: 150,
    size: 6,
    color: "#eab308",
    level: 3,
    useImage: false,
  },
  lab: {
    type: "matter",
    spawnRate: 12,
    speed: 180,
    size: 7,
    color: "#3b82f6",
    level: 4,
    useImage: false,
  },
  city: {
    type: "matter",
    spawnRate: 18,
    speed: 200,
    size: 8,
    color: "#8b5cf6",
    level: 5,
    useImage: false,
  },
  earth: {
    type: "cosmic",
    spawnRate: 25,
    speed: 250,
    size: 10,
    color: "#ec4899",
    level: 6,
    useImage: false,
  },
  "solar-system": {
    type: "cosmic",
    spawnRate: 35,
    speed: 300,
    size: 12,
    color: "#f59e0b",
    level: 7,
    useImage: false,
  },
};

// Off-screen spawning logic
const spawnOffScreenParticle = (
  config: ParticleConfig,
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
  const config = (PARTICLE_CONFIGS[
    currentLevel?.name as keyof typeof PARTICLE_CONFIGS
  ] || PARTICLE_CONFIGS.intro) as ParticleConfig;

  // Get blob position and size
  const blobPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const blobSize = 100; // Base blob size from useBlobSize hook

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
