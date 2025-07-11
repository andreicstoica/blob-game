import { GAME_CONFIG } from '../content/config';
import type { BlobAnimationValues } from '../types/ui';

// Size calculation
export const calculateBlobSize = (
  propSize?: number,
  biomass?: number
): number => {
  return (
    propSize ||
    (biomass
      ? Math.max(
        GAME_CONFIG.minBlobSize,
        biomass * GAME_CONFIG.blobSizeMultiplier
      )
      : 100)
  );
};

// Color utility functions
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    (
      (1 << 24) +
      (Math.round(r) << 16) +
      (Math.round(g) << 8) +
      Math.round(b)
    )
      .toString(16)
      .slice(1)
  );
};

export const getHeatColor = (baseColor: string, heat: number): string => {
  if (heat === 0) return baseColor;

  const greenRgb = hexToRgb(baseColor);
  const orangeRgb = { r: 255, g: 140, b: 0 };

  const r = greenRgb.r + (orangeRgb.r - greenRgb.r) * heat;
  const g = greenRgb.g + (orangeRgb.g - greenRgb.g) * heat;
  const b = greenRgb.b + (orangeRgb.b - greenRgb.b) * heat;

  return rgbToHex(r, g, b);
};

// Animation calculations
export const updateBlobAnimations = (
  animValues: BlobAnimationValues,
  stableSize: number,
  currentTime: number,
  biomass?: number
): void => {
  const time = currentTime * 0.001;
  const stableRadius = stableSize * 0.35;

  // Update breathing animation
  animValues.breathing = Math.abs(Math.sin(time * 0.6)) * (stableRadius * 0.1);

  // Generate amoeba noise with ripple effect
  const amoebaNoise = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const noiseFreq = time * 0.4 + angle * 3;
    let noise = Math.sin(noiseFreq) * 0.15 + Math.cos(noiseFreq * 1.7) * 0.1;

    // Add ripple effect to the noise
    if (animValues.rippleIntensity > 0) {
      // Scale ripple intensity up with biomass - larger blobs ripple more
      const biomassFactor = biomass ? Math.min(3.0, 1 + (biomass / 5000)) : 1;
      const rippleAmplitude = 0.08 * biomassFactor; // Base amplitude, scales with biomass
      const rippleWave = Math.sin(animValues.ripplePhase + angle * 4) * animValues.rippleIntensity * rippleAmplitude;
      noise += rippleWave;
    }

    amoebaNoise.push(noise);
  }
  animValues.amoebaNoise = amoebaNoise;

  // Update ripple animation
  if (animValues.rippleIntensity > 0) {
    animValues.ripplePhase += 0.08; // Slow ripple speed
    animValues.rippleIntensity *= 0.985; // Slower decay - longer lasting ripples
    if (animValues.rippleIntensity < 0.01) {
      animValues.rippleIntensity = 0;
    }
  }

  // Click animation (pressure decay)
  const timeSinceLastClick = currentTime - animValues.lastClickTime;
  const recoveryDelay = 150;

  if (timeSinceLastClick > recoveryDelay) {
    if (animValues.pressure > 0) {
      animValues.pressure *= 0.88;
      if (animValues.pressure < 0.01) {
        animValues.pressure = 0;
      }
    }
  }

  // Heat/color decay
  if (timeSinceLastClick > 500) {
    animValues.clickHeat *= 0.97;
    if (animValues.clickHeat < 0.01) {
      animValues.clickHeat = 0;
    }
  }

  // Calculate click boost for size - reduced to max 10% shrink
  const maxShrinkAmount = stableRadius * 0.1; // Max 10% shrink
  animValues.clickBoost = -animValues.pressure * maxShrinkAmount;
};

// Click handling logic
export const handleBlobClick = (
  animValues: BlobAnimationValues,
  currentTime: number
): void => {
  // Add pressure for click animation
  const pressureBoost = 0.2;
  const maxPressure = 1.5;
  animValues.pressure = Math.min(
    maxPressure,
    animValues.pressure + pressureBoost
  );
  animValues.lastClickTime = currentTime;

  // Add to ripple effect (don't interrupt existing ripples)
  animValues.rippleIntensity = Math.min(1.0, animValues.rippleIntensity + 0.25);
  // Don't reset ripplePhase - let the wave continue naturally

  // Track click for heat/color effect
  animValues.clickTimes.push(currentTime);

  // Remove old clicks (older than 2 seconds)
  const heatWindow = 2000;
  animValues.clickTimes = animValues.clickTimes.filter(
    (time) => currentTime - time < heatWindow
  );

  // Calculate click heat based on recent click frequency
  if (animValues.clickTimes.length >= 3) {
    const clickFrequency =
      animValues.clickTimes.length / (heatWindow / 1000);
    const maxFrequency = 5;
    animValues.clickHeat = Math.min(1, clickFrequency / maxFrequency);
  }
};

// Path generation for blob shape
export const generateAmoebePath = (
  currentSize: number,
  animValues: BlobAnimationValues
): string => {
  const centerX = currentSize;
  const centerY = currentSize;
  const baseRadius = currentSize * 0.35;
  const { breathing, clickBoost, amoebaNoise } = animValues;

  const numPoints = 8;
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const noise = (amoebaNoise && amoebaNoise[i]) || 0;
    const radius = baseRadius + breathing + clickBoost + noise * baseRadius;
    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }

  if (points.length < 2) return "";
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  let path = `M ${(lastPoint.x + firstPoint.x) / 2} ${(lastPoint.y + firstPoint.y) / 2
    }`;

  for (let i = 0; i < points.length; i++) {
    const currentPoint = points[i];
    const nextPoint = points[(i + 1) % points.length];
    const midX = (currentPoint.x + nextPoint.x) / 2;
    const midY = (currentPoint.y + nextPoint.y) / 2;
    path += ` Q ${currentPoint.x} ${currentPoint.y} ${midX} ${midY}`;
  }
  path += " Z";
  return path;
};

// Initialize animation values
export const createBlobAnimationValues = (): BlobAnimationValues => ({
  breathing: 0,
  clickBoost: 0,
  amoebaNoise: [],
  pressure: 0,
  lastClickTime: 0,
  clickHeat: 0,
  clickTimes: [],
  ripplePhase: 0,
  rippleIntensity: 0,
}); 