import React, { useState, useEffect, useMemo } from "react";
import type { GameState, Level, Particle } from "../../game/types";
import { calculateParticleConfig } from "../../game/systems/particles";

interface ParticleSpawnerProps {
  gameState: GameState;
  currentLevel: Level;
  children: (particles: Particle[]) => React.ReactNode;
}

export const ParticleSpawner: React.FC<ParticleSpawnerProps> = ({
  gameState,
  currentLevel,
  children,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Get particle configuration from game engine
  const particleConfig = useMemo(
    () => calculateParticleConfig(gameState),
    [gameState.biomass, currentLevel?.id]
  );

  // Get blob position - match actual blob rendering position
  const blobPosition = useMemo(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    return { x: centerX, y: centerY };
  }, []);

  // Spawn particles based on engine configuration
  useEffect(() => {
    if (!currentLevel) return;

    const spawnInterval = setInterval(() => {
      const shouldSpawn = Math.random() < particleConfig.spawnRate / 60; // 60fps

      if (shouldSpawn) {
        const newParticle = spawnOffScreenParticle(blobPosition, particleConfig);
        setParticles((prev) => [...prev, newParticle]);
      }
    }, 16); // 60fps

    return () => clearInterval(spawnInterval);
  }, [particleConfig, blobPosition, currentLevel]);

  // Animate particles
  useEffect(() => {
    if (!currentLevel || particles.length === 0) return;

    let animationId: number;
    const blobSize = 100;

    const animate = () => {
      setParticles(
        (prev) =>
          prev
            .map((particle) => {
              const speed = particle.speed / 60; // 60fps
              const newX = particle.x + particle.direction.x * speed;
              const newY = particle.y + particle.direction.y * speed;

              // Check collision with blob using game engine
              if (
                checkParticleCollision(
                  { x: newX, y: newY },
                  particle.size,
                  blobPosition,
                  blobSize
                )
              ) {
                return null; // Remove particle
              }

              return { ...particle, x: newX, y: newY };
            })
            .filter(Boolean) as Particle[]
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [particles.length, blobPosition, currentLevel]);

  if (!currentLevel) return null;

  return <>{children(particles)}</>;
};

// Helper functions moved from FlyingParticles
const spawnOffScreenParticle = (
  blobPosition: { x: number; y: number },
  particleConfig: ReturnType<typeof calculateParticleConfig>
): Particle => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const targetX = blobPosition.x;
  const targetY = blobPosition.y;

  // Spawn from screen edges
  const margin = 50;
  const edge = Math.floor(Math.random() * 4);
  let x: number, y: number;

  switch (edge) {
    case 0: // Top edge
      x = Math.random() * screenWidth;
      y = -margin;
      break;
    case 1: // Right edge
      x = screenWidth + margin;
      y = Math.random() * screenHeight;
      break;
    case 2: // Bottom edge
      x = Math.random() * screenWidth;
      y = screenHeight + margin;
      break;
    case 3: // Left edge
    default:
      x = -margin;
      y = Math.random() * screenHeight;
      break;
  }

  // Calculate direction toward center
  const dx = targetX - x;
  const dy = targetY - y;
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  const directionX = dx / magnitude;
  const directionY = dy / magnitude;

  return {
    id: Math.random().toString(36),
    x,
    y,
    speed: particleConfig.speed,
    size: particleConfig.size * particleConfig.sizeVariation,
    color: particleConfig.color,
    type: particleConfig.visualType as 'nutrient' | 'energy' | 'matter' | 'cosmic',
    useImage: particleConfig.visualType === "bacteria",
    image: particleConfig.visualType === "bacteria" ? getRandomBacteriaImage() : undefined,
    direction: { x: directionX, y: directionY },
  };
};

const getRandomBacteriaImage = () => {
  const bacteriaImages = [
    "/assets/images/particles/bacteria/brown-bacteria.png",
    "/assets/images/particles/bacteria/green-bacteria.png",
    "/assets/images/particles/bacteria/purple-bacteria.png",
  ];
  return bacteriaImages[Math.floor(Math.random() * bacteriaImages.length)];
};

const checkParticleCollision = (
  particlePos: { x: number; y: number },
  particleSize: number,
  blobPos: { x: number; y: number },
  blobSize: number
): boolean => {
  const dx = particlePos.x - blobPos.x;
  const dy = particlePos.y - blobPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (blobSize + particleSize) / 2;
}; 