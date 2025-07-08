// src/components/Blob/Blob.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_CONFIG } from '../../engine/content';

export interface BlobProps {
  id: string;
  position: { x: number; y: number };
  size?: number;
  biomass?: number;
  onBlobClick?: ((blobId: string, clickPosition: { x: number; y: number }) => void) | (() => void);
  onBlobPress?: (blobId: string) => void;
  onBlobRelease?: (blobId: string) => void;
  color?: string;
  strokeColor?: string;
  glowColor?: string;
  isDisabled?: boolean;
  isActive?: boolean;
}

// Simple, smooth easing - no bouncing to prevent shrinking flicker
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

const Blob = React.memo(({
  id,
  position,
  size: propSize,
  biomass,
  color = "#1adaac",
  strokeColor = "#cfffb1",
  glowColor = "#cfffb1",
  isDisabled = false,
  onBlobClick,
  onBlobPress,
  onBlobRelease,
  isActive = true
}: BlobProps) => {

  const filterId = `glow-${id}`;

  // Calculate stable size from biomass/props
  const calculateCurrentSize = useCallback(() => {
    return propSize || (biomass ? Math.max(
      GAME_CONFIG.minBlobSize,
      biomass * GAME_CONFIG.blobSizeMultiplier
    ) : 100);
  }, [propSize, biomass]);

  // Track the stable biomass-based size
  const [stableSize, setStableSize] = useState(() => calculateCurrentSize());

  // Animation states - USING REFS for smooth animation
  const [scale, setScale] = useState(1);
  const [isPressed, setIsPressed] = useState(false);
  const animationValuesRef = useRef({
    organicX: 0,
    organicY: 0,
    breathing: 0,
    clickBoost: 0,
    amoebaNoise: [] as number[]
  });
  const [, forceRender] = useState({});
  const lastRenderTime = useRef(0);

  // Click effect state - simplified with STABLE BASE SIZE
  const [clickEffect, setClickEffect] = useState({
    active: false,
    startTime: 0,
    baseRadiusAtStart: 0 // LOCK the base radius when click starts
  });

  // Growth animation state with pause capability
  const [growthEffect, setGrowthEffect] = useState({
    active: false,
    startTime: 0,
    fromSize: 0,
    toSize: 0,
    pausedAt: 0 // Track where we paused
  });

  // Refs for animation
  const clickEffectRef = useRef(clickEffect);
  const growthEffectRef = useRef(growthEffect);

  // Update refs
  useEffect(() => { clickEffectRef.current = clickEffect; }, [clickEffect]);
  useEffect(() => { growthEffectRef.current = growthEffect; }, [growthEffect]);

  // Update stable size when biomass changes - SIMPLIFIED
  useEffect(() => {
    const newSize = calculateCurrentSize();

    if (newSize > stableSize) {
      // Growth detected - trigger growth animation
      setGrowthEffect({
        active: true,
        startTime: Date.now(),
        fromSize: stableSize,
        toSize: newSize,
        pausedAt: 0 // Add missing pausedAt property
      });
      setStableSize(newSize);
    } else if (stableSize === 0) {
      // Initial setup
      setStableSize(newSize);
    }
  }, [biomass, propSize]);

  // Mouse handlers
  const handleMouseDown = () => {
    if (isDisabled || !isActive) return;
    setIsPressed(true);
    onBlobPress?.(id);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDisabled || !isActive) return;
    setIsPressed(false);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left - stableSize;
    const clickY = e.clientY - rect.top - stableSize;

    if (onBlobClick) {
      if (onBlobClick.length === 0) {
        (onBlobClick as () => void)();
      } else {
        (onBlobClick as (blobId: string, clickPosition: { x: number; y: number }) => void)(id, { x: clickX, y: clickY });
      }
    }
    onBlobRelease?.(id);

    // Start click animation that uses STABLE base radius
    setClickEffect({
      active: true,
      startTime: Date.now(),
      baseRadiusAtStart: stableSize * 0.35 // LOCK the radius when click starts
    });
  };

  const handleMouseLeave = () => {
    if (isPressed) setIsPressed(false);
  };

  // CLEAN ANIMATION LOOP - BREATHING EFFECT ONLY
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      const time = Date.now() * 0.001;
      const currentClick = clickEffectRef.current;
      const currentGrowth = growthEffectRef.current;

      // === GROWTH STATE MANAGEMENT (no size calculations) ===
      if (currentGrowth.active) {
        if (currentClick.active) {
          // Pause growth
          if (currentGrowth.pausedAt === 0) {
            const elapsed = Date.now() - currentGrowth.startTime;
            setGrowthEffect(prev => ({ ...prev, pausedAt: elapsed }));
          }
        } else {
          // Resume growth
          if (currentGrowth.pausedAt > 0) {
            const newStartTime = Date.now() - currentGrowth.pausedAt;
            setGrowthEffect(prev => ({ ...prev, startTime: newStartTime, pausedAt: 0 }));
          }

          const elapsed = Date.now() - currentGrowth.startTime;
          const progress = Math.min(elapsed / 800, 1);

          if (progress >= 1) {
            setGrowthEffect(prev => ({ ...prev, active: false }));
          }
        }
      }

      // === ORGANIC PULSATING EFFECTS + AMOEBA SHAPE ===
      const stableRadius = stableSize * 0.35;
      const organicX = Math.abs(Math.sin(time * 0.7)) * (stableRadius * 0.03);
      const organicY = Math.abs(Math.cos(time * 0.5)) * (stableRadius * 0.03);
      const breathing = Math.abs(Math.sin(time * 0.6)) * (stableRadius * 0.1);

      // Generate amoeba-like noise for 8 control points around the blob
      const amoebaNoise = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const noiseFreq = time * 0.4 + angle * 3; // Different frequency per point
        const noise = Math.sin(noiseFreq) * 0.15 + Math.cos(noiseFreq * 1.7) * 0.1; // Multiple sine waves
        amoebaNoise.push(noise);
      }

      // === CLICK ANIMATION ===
      let clickBoost = 0;
      if (currentClick.active) {
        const elapsed = Date.now() - currentClick.startTime;
        const totalDuration = 1400;
        const progress = Math.min(elapsed / totalDuration, 1);

        if (progress >= 1) {
          setClickEffect(prev => ({ ...prev, active: false }));
        } else {
          let effectMultiplier;

          if (progress < 0.15) {
            const expansionProgress = progress / 0.15;
            effectMultiplier = easeOutCubic(expansionProgress);
          } else {
            const contractionProgress = (progress - 0.15) / 0.85;
            effectMultiplier = 1 - easeOutCubic(contractionProgress);
          }

          clickBoost = effectMultiplier * (currentClick.baseRadiusAtStart * 0.15);
        }
      }

      // === UPDATE REF ===
      animationValuesRef.current = {
        organicX,
        organicY,
        breathing,
        clickBoost,
        amoebaNoise
      };

      // === SCALE EFFECTS ===
      let scaleVariation = 1.0;

      if (currentGrowth.active && !currentClick.active && currentGrowth.pausedAt === 0) {
        const elapsed = Date.now() - currentGrowth.startTime;
        const progress = Math.min(elapsed / 800, 1);
        const popEffect = easeOutCubic(progress);
        scaleVariation += popEffect * 0.1;
      }

      if (isDisabled) {
        scaleVariation *= 0.9;
      }

      setScale(scaleVariation);

      // === RE-RENDER ===
      const now = Date.now();
      if (now - lastRenderTime.current >= 16) {
        lastRenderTime.current = now;
        forceRender({});
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [stableSize]);

  // ✅ FIXED: This function now generates a much smoother, more organic path.
  const generateAmoebePath = () => {
    const centerX = stableSize;
    const centerY = stableSize;
    const baseRadius = stableSize * 0.35;
    const breathing = animationValuesRef.current?.breathing || 0;
    const clickBoost = animationValuesRef.current?.clickBoost || 0;
    const amoebaNoise = animationValuesRef.current?.amoebaNoise || [];

    const numPoints = 8;
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const noise = amoebaNoise[i] || 0;
      const radius = baseRadius + breathing + clickBoost + (noise * baseRadius);

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      points.push({ x, y });
    }

    if (points.length < 2) {
      return '';
    }

    // Start the path at the midpoint between the last and first points
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    let path = `M ${(lastPoint.x + firstPoint.x) / 2} ${(lastPoint.y + firstPoint.y) / 2}`;

    // Use the vertices as control points (Q) between the midpoints of the lines
    for (let i = 0; i < points.length; i++) {
      const currentPoint = points[i];
      const nextPoint = points[(i + 1) % points.length];

      const midX = (currentPoint.x + nextPoint.x) / 2;
      const midY = (currentPoint.y + nextPoint.y) / 2;

      path += ` Q ${currentPoint.x} ${currentPoint.y} ${midX} ${midY}`;
    }

    path += ' Z'; // Close the path
    return path;
  };

  return (
    <div
      data-blob-id={id}
      style={{
        position: 'absolute',
        transform: `translate(${position.x - stableSize}px, ${position.y - stableSize}px) scale(${scale})`,
        willChange: 'transform',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <svg width={stableSize * 2} height={stableSize * 2}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={glowColor} floodOpacity="0.7"/>
          </filter>
        </defs>

        {/* Amoeba-like blob shape */}
        <path
          d={generateAmoebePath()}
          fill={color}
          stroke={strokeColor}
          strokeWidth="2"
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  );
});

Blob.displayName = 'Blob';

export default Blob;