import React, { useState, useEffect, useMemo, useCallback } from "react";
import { calculateBlobPosition } from "../../game/systems/calculations"; // Add this import

// Ripple particle interface
interface RippleParticle {
  id: string;
  x: number; // relative to blob center
  y: number; // relative to blob center
  size: number; // current ripple radius
  maxSize: number; // maximum ripple radius
  life: number; // 0 to 1, decreases over time
  maxLife: number;
  color: string;
  opacity: number;
  direction?: { x: number; y: number }; // movement direction from particle impact
  velocity?: { x: number; y: number }; // current velocity for directional animation
}

interface RippleSystemProps {
  blobSize: number;
  blobAnimationState?: {
    clickBoost: number;
    pressure: number;
  };
}

export const RippleSystem: React.FC<RippleSystemProps> = ({
  blobSize,
  blobAnimationState,
}) => {
  const [rippleParticles, setRippleParticles] = useState<RippleParticle[]>([]);

  // Get blob position - use the same calculation as the blob itself
  const blobPosition = useMemo(() => calculateBlobPosition(), []);

  // Calculate blob radius accounting for heat effect (clickBoost)
  const baseRadius = blobSize * 0.35; // Same calculation as blob component
  const heatShrinkage = blobAnimationState?.clickBoost || 0; // negative when shrinking
  const blobRadius = baseRadius + heatShrinkage; // clickBoost is negative, so this shrinks

  // Create ripple effect at absorption point with directional movement
  const createRippleEffect = useCallback(
    (
      absorbX: number,
      absorbY: number,
      direction?: { x: number; y: number }
    ) => {
      const blobCenterX = blobPosition.x;
      const blobCenterY = blobPosition.y;

      // Convert absorption position to blob-relative coordinates
      const relativeX = absorbX - blobCenterX;
      const relativeY = absorbY - blobCenterY;

      // Create single ripple for clean trajectory following
      const maxLife = 0.8 + Math.random() * 0.3; // Reduced lifetime: 0.8-1.1 seconds

      // Smart scaling: small ripples for small blobs, larger ripples for large blobs
      const baseSize = blobRadius * 0.3; // 30% of blob radius
      const minSize = Math.max(15, baseSize * 0.5); // Minimum 15px, or 15% of radius
      const maxSize = Math.max(40, baseSize); // Minimum 40px, or 30% of radius
      const finalSize = minSize + Math.random() * (maxSize - minSize);

      // White/light colors only (no blue)
      const rippleColors = ["#ffffff", "#f8fafc", "#e2e8f0"];
      const color =
        rippleColors[Math.floor(Math.random() * rippleColors.length)];

      // Calculate initial velocity based on particle direction
      const velocityMultiplier = 25 + Math.random() * 20; // 25-45 pixels per second
      const initialVelocity = direction
        ? {
            x: direction.x * velocityMultiplier,
            y: direction.y * velocityMultiplier,
          }
        : { x: 0, y: 0 };

      const newRipple: RippleParticle = {
        id: Math.random().toString(36),
        x: relativeX,
        y: relativeY,
        size: 2, // Start smaller
        maxSize: finalSize,
        life: maxLife,
        maxLife: maxLife,
        color,
        opacity: 0.6, // Reduced opacity for subtlety
        direction,
        velocity: initialVelocity,
      };

      setRippleParticles((prev) => [...prev, newRipple]);
    },
    [blobPosition, blobRadius]
  );

  // Listen for particle absorption events (we'll connect this to the particle system)
  useEffect(() => {
    const handleParticleAbsorption = (event: CustomEvent) => {
      const { x, y, direction } = event.detail;
      createRippleEffect(x, y, direction);
    };

    // Listen for custom particle absorption events
    window.addEventListener(
      "particle-absorbed",
      handleParticleAbsorption as EventListener
    );

    return () => {
      window.removeEventListener(
        "particle-absorbed",
        handleParticleAbsorption as EventListener
      );
    };
  }, [createRippleEffect]);

  // Optimized animation loop with reduced update frequency
  useEffect(() => {
    if (rippleParticles.length === 0) return;

    let animationId: number;
    let lastUpdate = 0;
    const updateInterval = 32; // Update every 32ms (~30fps instead of 60fps)

    const animate = (currentTime: number) => {
      if (currentTime - lastUpdate >= updateInterval) {
        setRippleParticles(
          (prev) =>
            prev
              .map((ripple) => {
                const deltaTime = updateInterval / 1000; // Convert to seconds
                const newLife = ripple.life - deltaTime;

                if (newLife <= 0) {
                  return null; // Remove expired ripple
                }

                // Simplified easing for performance
                const progress = 1 - newLife / ripple.maxLife; // 0 to 1
                const newSize = ripple.maxSize * progress;

                // Simple fade out
                const opacity = (1 - progress) * 0.6;

                // Update position based on velocity (directional movement)
                const newX = ripple.x + (ripple.velocity?.x || 0) * deltaTime;
                const newY = ripple.y + (ripple.velocity?.y || 0) * deltaTime;

                // Apply drag to velocity for natural deceleration
                const dragFactor = 0.95; // 5% velocity loss per update
                const newVelocity = ripple.velocity
                  ? {
                      x: ripple.velocity.x * dragFactor,
                      y: ripple.velocity.y * dragFactor,
                    }
                  : undefined;

                return {
                  ...ripple,
                  x: newX,
                  y: newY,
                  size: newSize,
                  life: newLife,
                  opacity,
                  velocity: newVelocity,
                };
              })
              .filter(Boolean) as RippleParticle[]
        );

        lastUpdate = currentTime;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [rippleParticles.length]);

  if (rippleParticles.length === 0) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 75 }}
    >
      {/* Tighter ripple container that matches blob size more closely */}
      <div
        style={{
          position: "absolute",
          // Adaptive container sizing - smaller for huge blobs to stay within boundaries
          left: blobPosition.x - blobRadius * (blobRadius > 300 ? 0.75 : 0.9),
          top: blobPosition.y - blobRadius * (blobRadius > 300 ? 0.75 : 0.9),
          width: blobRadius * (blobRadius > 300 ? 1.5 : 1.8),
          height: blobRadius * (blobRadius > 300 ? 1.5 : 1.8),
          borderRadius: "50%",
          overflow: "hidden",
          // Sharper mask for better blob boundary matching
          maskImage: `radial-gradient(circle at center, black 92%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle at center, black 92%, transparent 100%)`,
        }}
      >
        {/* Render ripple particles with simplified styling */}
        {rippleParticles.map((ripple) => {
          // Position relative to adaptive mask center
          const containerRadius = blobRadius * (blobRadius > 300 ? 0.75 : 0.9);
          const rippleX = containerRadius + ripple.x - ripple.size;
          const rippleY = containerRadius + ripple.y - ripple.size;

          // Scale border thickness: thinner for small blobs, thicker for large blobs
          const baseBorderThickness = baseRadius < 50 ? 1 : 2; // 1px for small blobs, 2px for larger
          const borderThickness = Math.max(
            baseBorderThickness,
            Math.round(ripple.size / 15)
          );

          return (
            <div
              key={ripple.id}
              style={{
                position: "absolute",
                left: rippleX,
                top: rippleY,
                width: ripple.size * 2,
                height: ripple.size * 2,
                borderRadius: "50%",
                border: `${borderThickness}px solid ${ripple.color}`,
                backgroundColor: `${ripple.color}08`, // More subtle fill
                opacity: ripple.opacity,
                // Subtle white glow
                boxShadow: `0 0 ${ripple.size * 0.6}px ${ripple.color}66`,
                willChange: "transform, opacity",
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
