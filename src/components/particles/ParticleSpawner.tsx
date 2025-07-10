import React, { useState, useEffect, useMemo } from "react";
import type { GameState, Level, Particle } from "../../game/types";
import { calculateParticleConfig } from "../../game/systems/particles";
import brownBacteria from "/assets/images/particles/bacteria/brown-bacteria.png";
import greenBacteria from "/assets/images/particles/bacteria/green-bacteria.png";
import purpleBacteria from "/assets/images/particles/bacteria/purple-bacteria.png";
import galaxy1 from "/assets/images/particles/galaxies/galaxy-1.png";
import galaxy2 from "/assets/images/particles/galaxies/galaxy-2.webp";
import mouse1 from "/assets/images/particles/mice/mouse-1.png";
import mouse2 from "/assets/images/particles/mice/mouse-2.png";
import mouse3 from "/assets/images/particles/mice/mouse-3.png";
import spaceship1 from "/assets/images/particles/spaceships/spaceship-1.png";
import spaceship2 from "/assets/images/particles/spaceships/spaceship-2.png";
import spaceship3 from "/assets/images/particles/spaceships/spaceship-3.png";
import tank1 from "/assets/images/particles/tanks/tank-1.png";
import tank2 from "/assets/images/particles/tanks/tank-2.png";
import tank3 from "/assets/images/particles/tanks/tank-3.png";
import person1 from "/assets/images/particles/people/person-1.png";
import person2 from "/assets/images/particles/people/person-2.png";

// Interface for burst particles (firework effect)
interface BurstParticle {
  id: string;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  color: string;
  life: number; // 0 to 1, decreases over time
  size: number;
  maxLife: number;
}

// Visual assets for different particle types
const VISUAL_ASSETS = {
  bacteria: [brownBacteria, greenBacteria, purpleBacteria],
  mice: [mouse1, mouse2, mouse3],
  spaceships: [spaceship1, spaceship2, spaceship3],
  tanks: [tank1, tank2, tank3],
  galaxies: [galaxy1, galaxy2],
  people: [person1, person2],
};

interface ParticleSpawnerProps {
  gameState: GameState;
  currentLevel: Level;
  blobSize: number; // Need blob size for proper scaling
  children: (
    particles: Particle[],
    burstParticles: BurstParticle[]
  ) => React.ReactNode;
}

export const ParticleSpawner: React.FC<ParticleSpawnerProps> = ({
  gameState,
  currentLevel,
  blobSize,
  children,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);

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

  // Use blob size passed from parent (already calculated with all constraints)
  const blobRadius = blobSize * 0.35; // Same calculation as blob component

  // Create burst effect when particle is absorbed
  const createBurstEffect = (x: number, y: number) => {
    const burstCount = 4 + Math.floor(Math.random() * 3); // 4-6 burst particles (reduced)
    const newBursts: BurstParticle[] = [];

    // Use blob glow color to match the glow effect around the blob
    const blobGlowColor = "#cfffb1"; // Default blob glow color (yellow-green)

    // Create burst particles at absorption point
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2; // Spread evenly in circle
      const speed = 80 + Math.random() * 40; // Speed: 80-120
      const maxLife = 0.4 + Math.random() * 0.2; // Shorter lifetime: 0.4-0.6 seconds

      // Scale burst size with blob size for proportional appearance
      const baseBurstSize = Math.max(3, blobSize * 0.02); // 2% of blob size, minimum 3px
      const burstSize = baseBurstSize + Math.random() * (baseBurstSize * 0.5); // +0-50% variation

      newBursts.push({
        id: Math.random().toString(36),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: blobGlowColor,
        life: maxLife,
        maxLife,
        size: burstSize,
      });
    }

    setBurstParticles((prev) => [...prev, ...newBursts]);
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

    // Determine visual type and image based on current level
    let visualType:
      | "bacteria"
      | "mice"
      | "spaceships"
      | "tanks"
      | "galaxies"
      | "people";
    let useImage = true;
    let image: string;

    // Map level to specific visual types
    switch (currentLevel.name) {
      case "microscopic":
        visualType = "bacteria";
        image =
          VISUAL_ASSETS.bacteria[
            Math.floor(Math.random() * VISUAL_ASSETS.bacteria.length)
          ];
        break;
      case "petri-dish":
        visualType = "bacteria";
        image =
          VISUAL_ASSETS.bacteria[
            Math.floor(Math.random() * VISUAL_ASSETS.bacteria.length)
          ];
        break;
      case "lab":
        visualType = "mice";
        image =
          VISUAL_ASSETS.mice[
            Math.floor(Math.random() * VISUAL_ASSETS.mice.length)
          ];
        break;
      case "neighborhood":
        visualType = "people";
        image =
          VISUAL_ASSETS.people[
            Math.floor(Math.random() * VISUAL_ASSETS.people.length)
          ];
        break;
      case "city":
        visualType = "tanks";
        image =
          VISUAL_ASSETS.tanks[
            Math.floor(Math.random() * VISUAL_ASSETS.tanks.length)
          ];
        break;
      case "continent":
        visualType = "spaceships";
        image =
          VISUAL_ASSETS.spaceships[
            Math.floor(Math.random() * VISUAL_ASSETS.spaceships.length)
          ];
        break;
      case "earth":
        visualType = "spaceships";
        image =
          VISUAL_ASSETS.spaceships[
            Math.floor(Math.random() * VISUAL_ASSETS.spaceships.length)
          ];
        break;
      case "solar-system":
        visualType = "galaxies";
        image =
          VISUAL_ASSETS.galaxies[
            Math.floor(Math.random() * VISUAL_ASSETS.galaxies.length)
          ];
        break;
      default:
        // Fallback to bacteria for any unhandled levels
        visualType = "bacteria";
        image =
          VISUAL_ASSETS.bacteria[
            Math.floor(Math.random() * VISUAL_ASSETS.bacteria.length)
          ];
        break;
    }

    const particle = {
      id: Math.random().toString(36),
      x,
      y,
      speed: particleConfig.speed,
      size: particleConfig.size * particleConfig.sizeVariation,
      color: particleConfig.color,
      type: visualType,
      useImage,
      image,
      direction: { x: directionX, y: directionY },
    };

    return particle;
  };

  // Spawn particles based on engine configuration
  useEffect(() => {
    if (!currentLevel) return;

    // Intro level has no particles
    if (currentLevel.name === "intro") return;

    const spawnInterval = setInterval(() => {
      const shouldSpawn = Math.random() < (particleConfig.spawnRate * 0.4) / 60; // 60fps, reduced to 40% of original

      if (shouldSpawn) {
        const newParticle = spawnOffScreenParticle(
          blobPosition,
          particleConfig
        );
        setParticles((prev) => [...prev, newParticle]);
      }
    }, 16); // 60fps

    return () => clearInterval(spawnInterval);
  }, [particleConfig, blobPosition, currentLevel]);

  // Combined animation loop for both particles and bursts (Performance optimization)
  useEffect(() => {
    if (
      !currentLevel ||
      (particles.length === 0 && burstParticles.length === 0)
    )
      return;

    let animationId: number;

    const animate = () => {
      // Update main particles
      setParticles(
        (prev) =>
          prev
            .map((particle) => {
              const speed = particle.speed / 60; // 60fps
              const newX = particle.x + particle.direction.x * speed;
              const newY = particle.y + particle.direction.y * speed;

              // Calculate distance to blob for dissolving effect
              const dx = newX - blobPosition.x;
              const dy = newY - blobPosition.y;
              const distanceToBlob = Math.sqrt(dx * dx + dy * dy);

              // Define absorption zones
              const absorptionZone = blobRadius + 30; // 30px fade zone around blob
              const collisionZone = blobRadius - 10; // Remove when very close

              // Remove particle if it's in the collision zone
              if (distanceToBlob <= collisionZone) {
                // Calculate burst position at blob edge instead of absorption point
                const directionX = dx / distanceToBlob; // Normalized direction from blob center to particle
                const directionY = dy / distanceToBlob;
                // Scale edge offset with blob size (larger blob = larger offset for visibility)
                const edgeOffset = Math.max(5, blobRadius * 0.15); // 15% of blob radius, minimum 5px
                const burstX =
                  blobPosition.x + directionX * (blobRadius + edgeOffset);
                const burstY =
                  blobPosition.y + directionY * (blobRadius + edgeOffset);

                // Particle absorbed - create burst effect
                createBurstEffect(burstX, burstY);
                return null; // Remove particle
              }

              // Calculate opacity based on distance (dissolving effect)
              let opacity = 1.0;
              if (distanceToBlob <= absorptionZone) {
                // Fade from 1.0 to 0.0 as particle approaches blob
                opacity = Math.max(0.1, distanceToBlob / absorptionZone);
              }

              return {
                ...particle,
                x: newX,
                y: newY,
                opacity, // Add opacity to particle state
              } as Particle & { opacity: number };
            })
            .filter(Boolean) as Particle[]
      );

      // Update burst particles in the same loop
      setBurstParticles(
        (prev) =>
          prev
            .map((burst) => {
              const deltaTime = 0.016; // 60fps
              const newLife = burst.life - deltaTime;

              if (newLife <= 0) {
                return null; // Remove expired burst particle
              }

              return {
                ...burst,
                x: burst.x + burst.vx * deltaTime,
                y: burst.y + burst.vy * deltaTime,
                vx: burst.vx * 0.95, // Slight deceleration
                vy: burst.vy * 0.95,
                life: newLife,
              };
            })
            .filter(Boolean) as BurstParticle[]
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [
    particles.length,
    burstParticles.length,
    blobPosition,
    blobSize,
    currentLevel,
  ]);

  // Early return after all hooks
  if (!currentLevel) return null;

  return <>{children(particles, burstParticles)}</>;
};
