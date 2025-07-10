import React, { useState, useEffect, useMemo } from "react";
import type { GameState, Level, Particle } from "../../game/types";
import {
  calculateParticleConfig,
  checkParticleCollision,
} from "../../game/systems/particles";
import brownBacteria from "/assets/images/particles/bacteria/brown-bacteria.png";
import greenBacteria from "/assets/images/particles/bacteria/green-bacteria.png";
import purpleBacteria from "/assets/images/particles/bacteria/purple-bacteria.png";

// Visual assets for different particle types
const VISUAL_ASSETS = {
  bacteria: [brownBacteria, greenBacteria, purpleBacteria],
  energy: [], // Use color circles
  matter: [], // Use color circles
  cosmic: [], // Use color circles
};

// Spawn particle from screen edge toward blob
const spawnOffScreenParticle = (
  blobPosition: { x: number; y: number },
  particleConfig: ReturnType<typeof calculateParticleConfig>
): Particle => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Target the actual blob position
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

  const particle = {
    id: Math.random().toString(36),
    x,
    y,
    speed: particleConfig.speed,
    size: particleConfig.size * particleConfig.sizeVariation,
    color: particleConfig.color,
    type: particleConfig.visualType as any,
    useImage: particleConfig.visualType === "bacteria",
    image:
      particleConfig.visualType === "bacteria"
        ? VISUAL_ASSETS.bacteria[
            Math.floor(Math.random() * VISUAL_ASSETS.bacteria.length)
          ]
        : undefined,
    direction: { x: directionX, y: directionY },
  };

  console.log("Particle spawn:", {
    edge,
    startPos: { x, y },
    target: { x: targetX, y: targetY },
    direction: { x: directionX, y: directionY },
    speed: particleConfig.speed,
  });

  return particle;
};

interface FlyingParticlesProps {
  gameState: GameState;
  currentLevel: Level;
}

export const FlyingParticles: React.FC<FlyingParticlesProps> = ({
  gameState,
  currentLevel,
}) => {
  if (!currentLevel) return null;

  const [particles, setParticles] = useState<Particle[]>([]);

  // Get particle configuration from game engine
  const particleConfig = useMemo(
    () => calculateParticleConfig(gameState),
    [gameState.biomass, currentLevel.id]
  );

  // Get blob position
  const blobPosition = useMemo(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const hudWidth = 350;
    const rightHudWidth = 350;

    const playableWidth = screenWidth - hudWidth - rightHudWidth;
    const centerX = hudWidth + playableWidth / 2;
    const centerY = screenHeight / 2;

    return { x: centerX, y: centerY };
  }, []);

  const blobSize = 100;

  // Spawn particles based on engine configuration
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const shouldSpawn = Math.random() < particleConfig.spawnRate / 60; // 60fps

      if (shouldSpawn) {
        const newParticle = spawnOffScreenParticle(
          blobPosition,
          particleConfig
        );
        setParticles((prev) => [...prev, newParticle]);
      }
    }, 16); // 60fps

    return () => clearInterval(spawnInterval);
  }, [particleConfig, blobPosition]);

  // Animate particles
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

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [particles.length, blobPosition, blobSize]);

  return (
    <div className="absolute inset-0 w-full h-full z-30 pointer-events-none">
      {/* Debug: Show target blob position */}
      <div
        style={{
          position: "absolute",
          left: blobPosition.x,
          top: blobPosition.y,
          width: 20,
          height: 20,
          backgroundColor: "red",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
        }}
      />

      {/* Render particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.useImage ? "transparent" : particle.color,
            borderRadius: particle.useImage ? "0%" : "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 30,
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
