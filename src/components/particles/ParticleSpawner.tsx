import React, { useState, useEffect, useMemo } from "react";
import type {
  GameState,
  Level,
  Particle,
  TrailParticle,
  ComboTracker,
} from "../../game/types";
import { calculateParticleConfig } from "../../game/systems/particles";
import { VISUAL_ASSETS } from "../../styles/constants";

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

interface ParticleSpawnerProps {
  gameState: GameState;
  currentLevel: Level;
  blobSize: number; // Need blob size for proper scaling
  children: (
    particles: Particle[],
    burstParticles: BurstParticle[],
    trailParticles: TrailParticle[]
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
  const [trailParticles, setTrailParticles] = useState<TrailParticle[]>([]);
  const [comboTracker, setComboTracker] = useState<ComboTracker>({
    count: 0,
    recentAbsorptions: [],
    multiplier: 1,
    isActive: false,
  });

  // Get particle configuration from game engine
  const particleConfig = useMemo(
    () => calculateParticleConfig(gameState),
    [gameState]
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

  // Clear particles when level changes
  useEffect(() => {
    setParticles([]);
    setBurstParticles([]);
    setTrailParticles([]);
    setComboTracker({
      count: 0,
      recentAbsorptions: [],
      multiplier: 1,
      isActive: false,
    });
  }, [currentLevel.id]);

  // Update combo tracker when particle is absorbed
  const updateComboTracker = () => {
    const now = Date.now();
    const comboWindow = 2000; // 2 seconds combo window

    setComboTracker((prev) => {
      // Filter out old absorptions outside combo window
      const recentAbsorptions = prev.recentAbsorptions.filter(
        (time) => now - time < comboWindow
      );
      recentAbsorptions.push(now);

      const count = recentAbsorptions.length;
      const multiplier = Math.min(3, 1 + count * 0.2); // Up to 3x multiplier
      const isActive = count >= 2; // Combo starts at 2+ particles

      return {
        count,
        recentAbsorptions,
        multiplier,
        isActive,
      };
    });
  };

  // Create burst effect when particle is absorbed
  const createBurstEffect = (
    x: number,
    y: number,
    isCombo: boolean = false
  ) => {
    const baseCount = 4 + Math.floor(Math.random() * 3); // 4-6 burst particles (reduced)
    const burstCount = isCombo
      ? Math.floor(baseCount * comboTracker.multiplier)
      : baseCount;
    const newBursts: BurstParticle[] = [];

    // Use blob glow color for all bursts (consistent with blob)
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
      | "circle"
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
      case "intro":
        visualType = "circle";
        useImage = false;
        image = "";
        break;
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
      // Enhanced behavior properties
      state: "approaching" as const,
      spiralAngle: 0,
      magneticForce: 0.5 + Math.random() * 0.5, // Random magnetic strength 0.5-1.0
      trailHistory: [],
    };

    return particle;
  };

  // Spawn particles based on engine configuration
  useEffect(() => {
    if (!currentLevel) return;

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

  // Combined animation loop for particles and bursts (Performance optimization)
  useEffect(() => {
    if (
      !currentLevel ||
      (particles.length === 0 && burstParticles.length === 0)
    )
      return;

    let animationId: number;

    const animate = () => {
      // Update main particles with enhanced behaviors
      setParticles(
        (prev) =>
          prev
            .map((particle) => {
              const deltaTime = 1 / 60; // 60fps
              const speed = particle.speed * deltaTime;

              // Calculate distance and direction to blob
              const dx = blobPosition.x - particle.x;
              const dy = blobPosition.y - particle.y;
              const distanceToBlob = Math.sqrt(dx * dx + dy * dy);

              const normalizedDx = dx / distanceToBlob;
              const normalizedDy = dy / distanceToBlob;

              // Define behavior zones
              const magneticZone = blobRadius + 150; // Magnetic attraction zone
              const collisionZone = blobRadius - 10; // Absorption zone

              let newX = particle.x;
              let newY = particle.y;
              const newDirection = { ...particle.direction };
              let newState = particle.state || "approaching";

              // MAGNETIC ATTRACTION: Curve particles toward blob when in magnetic zone
              if (
                distanceToBlob <= magneticZone &&
                distanceToBlob > collisionZone
              ) {
                newState = "attracted";
                const magneticStrength =
                  (particle.magneticForce || 0.5) *
                  (1 - distanceToBlob / magneticZone);

                // Blend current direction with magnetic pull
                const blendFactor = magneticStrength * 0.3; // Gentle curve
                newDirection.x =
                  newDirection.x * (1 - blendFactor) +
                  normalizedDx * blendFactor;
                newDirection.y =
                  newDirection.y * (1 - blendFactor) +
                  normalizedDy * blendFactor;

                // Normalize to maintain speed
                const magnitude = Math.sqrt(
                  newDirection.x * newDirection.x +
                    newDirection.y * newDirection.y
                );
                newDirection.x /= magnitude;
                newDirection.y /= magnitude;
              }

              // Normal movement (no spiral)
              newX = particle.x + newDirection.x * speed;
              newY = particle.y + newDirection.y * speed;

              // PARTICLE ABSORPTION
              if (distanceToBlob <= collisionZone) {
                // Update combo tracker
                updateComboTracker();

                // Calculate burst position at blob edge with smart scaling
                const directionX =
                  (particle.x - blobPosition.x) / distanceToBlob;
                const directionY =
                  (particle.y - blobPosition.y) / distanceToBlob;
                // Smart edge offset: much closer for massive blobs
                const edgeOffsetPercent = Math.max(
                  0.02,
                  Math.min(0.15, 30 / blobRadius)
                ); // 2-15% based on size
                // Reduced max offset for huge blobs: closer burst effect
                const maxOffset = blobRadius > 400 ? 15 : 25; // 15px max for huge blobs, 25px for smaller ones
                const edgeOffset = Math.max(
                  3,
                  Math.min(maxOffset, blobRadius * edgeOffsetPercent)
                );
                const burstX =
                  blobPosition.x + directionX * (blobRadius + edgeOffset);
                const burstY =
                  blobPosition.y + directionY * (blobRadius + edgeOffset);

                // Create enhanced burst effect for combos (external)
                createBurstEffect(burstX, burstY, comboTracker.isActive);

                // Emit event for ripple system with particle direction
                window.dispatchEvent(
                  new CustomEvent("particle-absorbed", {
                    detail: {
                      x: particle.x,
                      y: particle.y,
                      isCombo: comboTracker.isActive,
                      direction: { x: newDirection.x, y: newDirection.y },
                    },
                  })
                );

                return null; // Remove particle
              }

              // NUTRIENT TRAILS: Add current position to trail history (only for small particles)
              let trailHistory = particle.trailHistory || [];
              const shouldShowTrails = particle.size <= 20; // Only show trails for particles 20px or smaller

              if (shouldShowTrails) {
                const now = Date.now();
                trailHistory = [
                  ...trailHistory,
                  { x: particle.x, y: particle.y, timestamp: now },
                ]
                  .filter((point) => now - point.timestamp < 500) // Keep 500ms of trail
                  .slice(-8); // Max 8 trail points
              }

              // Calculate opacity based on distance (dissolving effect)
              const absorptionZone = blobRadius + 30;
              let opacity = 1.0;
              if (distanceToBlob <= absorptionZone) {
                opacity = Math.max(0.1, distanceToBlob / absorptionZone);
              }

              return {
                ...particle,
                x: newX,
                y: newY,
                direction: newDirection,
                state: newState,
                trailHistory,
                opacity,
              } as Particle & { opacity: number };
            })
            .filter(Boolean) as Particle[]
      );

      // Generate trail particles from particle trail histories
      const currentTrails: TrailParticle[] = [];
      particles.forEach((particle) => {
        if (particle.trailHistory && particle.trailHistory.length > 1) {
          particle.trailHistory.forEach((trailPoint, index) => {
            const age = (Date.now() - trailPoint.timestamp) / 500; // 0-1 over 500ms
            const life = 1 - age;

            if (life > 0) {
              currentTrails.push({
                id: `${particle.id}-trail-${index}`,
                x: trailPoint.x,
                y: trailPoint.y,
                size: particle.size * (0.3 + life * 0.3), // Trail gets smaller over time
                color: particle.color,
                opacity: life * 0.6, // Trail is semi-transparent
                life,
                maxLife: 1,
              });
            }
          });
        }
      });

      setTrailParticles(currentTrails);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    particles.length,
    burstParticles.length,
    blobPosition,
    blobSize,
    currentLevel,
  ]);

  // Early return after all hooks
  if (!currentLevel) return null;

  return <>{children(particles, burstParticles, trailParticles)}</>;
};
