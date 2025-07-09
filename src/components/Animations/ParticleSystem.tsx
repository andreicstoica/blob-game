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

    // Calculate biomass ratio: current biomass / required biomass for next level
    const biomassRatio = gameState.biomass / nextLevel.biomassThreshold;

    // Particles start big when biomass is small relative to target
    // and get smaller as biomass approaches the target
    // Use inverse relationship: bigger particles when biomass ratio is smaller
    sizeMultiplier = Math.max(0.3, 3.0 - biomassRatio * 2.5);
  }

  // Spawn from one of the four screen edges
  const edge = Math.floor(Math.random() * 4);
  let x: number = 0,
    y: number = 0;
  let directionX: number = 0,
    directionY: number = 0;

  switch (edge) {
    case 0: // Top
      x = Math.random() * screenWidth;
      y = -config.size * sizeMultiplier;
      directionX = (Math.random() - 0.5) * 2; // Random horizontal direction
      directionY = Math.random() * 0.5 + 0.5; // Always move down
      break;
    case 1: // Right
      x = screenWidth + config.size * sizeMultiplier;
      y = Math.random() * screenHeight;
      directionX = -(Math.random() * 0.5 + 0.5); // Always move left
      directionY = (Math.random() - 0.5) * 2; // Random vertical direction
      break;
    case 2: // Bottom
      x = Math.random() * screenWidth;
      y = screenHeight + config.size * sizeMultiplier;
      directionX = (Math.random() - 0.5) * 2; // Random horizontal direction
      directionY = -(Math.random() * 0.5 + 0.5); // Always move up
      break;
    case 3: // Left (account for HUD)
      x = -config.size * sizeMultiplier;
      y = Math.random() * screenHeight;
      directionX = Math.random() * 0.5 + 0.5; // Always move right
      directionY = (Math.random() - 0.5) * 2; // Random vertical direction
      break;
    default:
      x = 0;
      y = 0;
      directionX = 1;
      directionY = 1;
  }

  // Normalize direction vector
  const magnitude = Math.sqrt(
    directionX * directionX + directionY * directionY
  );
  directionX /= magnitude;
  directionY /= magnitude;

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

  // Spawn particles based on growth rate
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const spawnRate = config.spawnRate * (1 + (gameState.growth || 0) / 1000);
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
  }, [particles.length]);

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
