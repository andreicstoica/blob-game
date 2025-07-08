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

// Helper to interpolate between two color values
const interpolateColor = (color1: number, color2: number, factor: number) => {
  return Math.round(color1 + (color2 - color1) * factor);
};

const Blob = React.memo(({
  id,
  position,
  size: propSize,
  biomass,
  glowColor = "#cfffb1",
  isDisabled = false,
  onBlobClick,
  onBlobPress,
  onBlobRelease,
  isActive = true
}: BlobProps) => {

  const filterId = `glow-${id}`;

  const calculateCurrentSize = useCallback(() => {
    return propSize || (biomass ? Math.max(
      GAME_CONFIG.minBlobSize,
      biomass * GAME_CONFIG.blobSizeMultiplier
    ) : 100);
  }, [propSize, biomass]);

  const [stableSize, setStableSize] = useState(() => calculateCurrentSize());
  const visualSizeRef = useRef(stableSize);

  const [scale, setScale] = useState(1);
  const [isPressed, setIsPressed] = useState(false);

  const animationValuesRef = useRef({
    breathing: 0,
    clickBoost: 0,
    amoebaNoise: [] as number[],
    pressure: 0,
    lastClickTime: 0,
  });

  const [, forceRender] = useState({});
  const lastRenderTime = useRef(0);

  useEffect(() => {
    const newSize = calculateCurrentSize();
    setStableSize(newSize);
  }, [biomass, propSize, calculateCurrentSize]);

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

    const pressureBoost = 0.2;
    const maxPressure = 1.5;
    animationValuesRef.current.pressure = Math.min(
        maxPressure,
        animationValuesRef.current.pressure + pressureBoost
    );
    animationValuesRef.current.lastClickTime = Date.now();
  };

  const handleMouseLeave = () => {
    if (isPressed) setIsPressed(false);
  };

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      const now = Date.now();
      const time = now * 0.001;
      const animValues = animationValuesRef.current;

      const interpolationFactor = 0.05;
      visualSizeRef.current += (stableSize - visualSizeRef.current) * interpolationFactor;

      const currentVisualSize = visualSizeRef.current;
      const stableRadius = currentVisualSize * 0.35;

      animValues.breathing = Math.abs(Math.sin(time * 0.6)) * (stableRadius * 0.1);
      
      const amoebaNoise = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const noiseFreq = time * 0.4 + angle * 3;
        const noise = Math.sin(noiseFreq) * 0.15 + Math.cos(noiseFreq * 1.7) * 0.1;
        amoebaNoise.push(noise);
      }
      animValues.amoebaNoise = amoebaNoise;
      
      const timeSinceLastClick = now - animValues.lastClickTime;
      const recoveryDelay = 150;

      if (timeSinceLastClick > recoveryDelay) {
        if (animValues.pressure > 0) {
          animValues.pressure *= 0.94;
          if (animValues.pressure < 0.01) {
            animValues.pressure = 0;
          }
        }
      }
      
      const maxShrinkAmount = stableRadius * 0.4;
      animValues.clickBoost = -animValues.pressure * maxShrinkAmount;

      let scaleVariation = 1.0;
      if (isDisabled) {
        scaleVariation *= 0.9;
      }
      setScale(scaleVariation);

      if (now - lastRenderTime.current >= 16) {
        lastRenderTime.current = now;
        forceRender({});
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [stableSize, isDisabled]);

  const generateAmoebePath = () => {
    const currentSize = visualSizeRef.current;
    const centerX = currentSize;
    const centerY = currentSize;
    const baseRadius = currentSize * 0.35;
    const { breathing, clickBoost, amoebaNoise } = animationValuesRef.current;
    
    const numPoints = 8;
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const noise = (amoebaNoise && amoebaNoise[i]) || 0;
      const radius = baseRadius + breathing + clickBoost + (noise * baseRadius);
      points.push({ 
          x: centerX + Math.cos(angle) * radius, 
          y: centerY + Math.sin(angle) * radius
      });
    }

    if (points.length < 2) return '';
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    let path = `M ${(lastPoint.x + firstPoint.x) / 2} ${(lastPoint.y + firstPoint.y) / 2}`;

    for (let i = 0; i < numPoints; i++) {
      const currentPoint = points[i];
      const nextPoint = points[(i + 1) % points.length];
      const midX = (currentPoint.x + nextPoint.x) / 2;
      const midY = (currentPoint.y + nextPoint.y) / 2;
      path += ` Q ${currentPoint.x} ${currentPoint.y} ${midX} ${midY}`;
    }
    path += ' Z';
    return path;
  };

  const currentVisualSize = visualSizeRef.current;

  // --- Dynamic Effects Calculation ---
  const maxPressure = 1.5;
  const currentPressure = animationValuesRef.current.pressure;
  
  const pressureColorThreshold = 0.21;
  let heatFactor = 0;

  if (currentPressure > pressureColorThreshold) {
    const effectivePressure = currentPressure - pressureColorThreshold;
    const effectiveMaxPressure = maxPressure - pressureColorThreshold;
    heatFactor = Math.min(effectivePressure / effectiveMaxPressure, 1);
  }

  const heatedColor = `rgb(
    ${interpolateColor(26, 255, heatFactor)},
    ${interpolateColor(218, 165, heatFactor)},
    ${interpolateColor(172, 0, heatFactor)}
  )`;
  
  const heatedStrokeColor = `rgb(
    ${interpolateColor(207, 255, heatFactor)},
    ${interpolateColor(255, 220, heatFactor)},
    ${interpolateColor(177, 100, heatFactor)}
  )`;

  const glowOpacity = 0.7 + (0.3 * heatFactor); // Starts at 0.7, goes up to 1.0

  // ✅ CHANGED: Calculate glow width based on the heatFactor
  const glowDeviation = 4 + (10 * heatFactor); // Starts at 4, goes up to 10

  return (
    <div
      data-blob-id={id}
      style={{
        position: 'absolute',
        transform: `translate(${position.x - currentVisualSize}px, ${position.y - currentVisualSize}px) scale(${scale})`,
        willChange: 'transform',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <svg width={currentVisualSize * 2} height={currentVisualSize * 2}>
        <defs>
            {/* ✅ CHANGED: stdDeviation is now dynamic */}
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation={glowDeviation} floodColor={glowColor} floodOpacity={glowOpacity}/>
          </filter>
        </defs>
        <path
          d={generateAmoebePath()}
          fill={heatedColor}
          stroke={heatedStrokeColor}
          strokeWidth="2"
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  );
});

Blob.displayName = 'Blob';
export default Blob;