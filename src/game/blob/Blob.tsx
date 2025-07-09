import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_CONFIG } from '../../engine/content/content';

export interface BlobProps {
  id: string;
  position: { x: number; y: number };
  size?: number;
  biomass?: number;
  onBlobClick?:
    | ((blobId: string, clickPosition: { x: number; y: number }) => void)
    | (() => void);
  onBlobPress?: (blobId: string) => void;
  onBlobRelease?: (blobId: string) => void;
  color?: string;
  strokeColor?: string;
  glowColor?: string;
  isDisabled?: boolean;
  isActive?: boolean;
  clickPower?: number; // The current click power value to display
}

const Blob = React.memo(
  ({
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
    isActive = true,
    clickPower = 1, // Default click power
  }: BlobProps) => {
    const filterId = `glow-${id}`;

    const calculateCurrentSize = useCallback(() => {
      return (
        propSize ||
        (biomass
          ? Math.max(
              GAME_CONFIG.minBlobSize,
              biomass * GAME_CONFIG.blobSizeMultiplier
            )
          : 100)
      );
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
      clickHeat: 0,
      clickTimes: [] as number[],
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

      // Calculate world position for floating number (relative to viewport)
      const worldX = e.clientX;
      const worldY = e.clientY; // Move up from the click point to avoid mouse cursor

      // Trigger floating number animation
      if (window.addFloatingNumber && clickPower > 0) {
        // Generate random color in blue-purple-white gradient
        const colors = [
          "#6366f1", // Indigo
          "#8b5cf6", // Violet
          "#a855f7", // Purple
          "#c084fc", // Light purple
          "#ddd6fe", // Very light purple
          "#e0e7ff", // Light indigo
          "#f3f4f6", // Light gray
          "#ffffff", // White
          "#7c3aed", // Dark purple
          "#3b82f6", // Blue
          "#fbbf24", // Yellow
          "#facc15", // Bright yellow
          "#22c55e", // Green
          "#4ade80", // Light green
          "#10b981", // Emerald
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        window.addFloatingNumber(
          { x: worldX, y: worldY },
          clickPower,
          randomColor
        );
      }

      if (onBlobClick) {
        if (onBlobClick.length === 0) {
          (onBlobClick as () => void)();
        } else {
          (
            onBlobClick as (
              blobId: string,
              clickPosition: { x: number; y: number }
            ) => void
          )(id, { x: clickX, y: clickY });
        }
      }
      onBlobRelease?.(id);

      const now = Date.now();
      const animValues = animationValuesRef.current;

      // Add pressure for click animation
      const pressureBoost = 0.2;
      const maxPressure = 1.5;
      animValues.pressure = Math.min(
        maxPressure,
        animValues.pressure + pressureBoost
      );
      animValues.lastClickTime = now;

      // Track click for heat/color effect
      animValues.clickTimes.push(now);

      // Remove old clicks (older than 2 seconds)
      const heatWindow = 2000;
      animValues.clickTimes = animValues.clickTimes.filter(
        (time) => now - time < heatWindow
      );

      // Calculate click heat based on recent click frequency
      // Need at least 3 clicks in the window to start heating up
      if (animValues.clickTimes.length >= 3) {
        const clickFrequency =
          animValues.clickTimes.length / (heatWindow / 1000); // clicks per second
        const maxFrequency = 5; // Max expected clicks per second for full heat
        animValues.clickHeat = Math.min(1, clickFrequency / maxFrequency);
      }
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

        // Core animation logic for smooth growth
        const interpolationFactor = 0.05;
        visualSizeRef.current +=
          (stableSize - visualSizeRef.current) * interpolationFactor;

        const currentVisualSize = visualSizeRef.current;
        const stableRadius = currentVisualSize * 0.35;

        // Update breathing and noise based on the current visual size
        animValues.breathing =
          Math.abs(Math.sin(time * 0.6)) * (stableRadius * 0.1);

        const amoebaNoise = [];
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const noiseFreq = time * 0.4 + angle * 3;
          const noise =
            Math.sin(noiseFreq) * 0.15 + Math.cos(noiseFreq * 1.7) * 0.1;
          amoebaNoise.push(noise);
        }
        animValues.amoebaNoise = amoebaNoise;

        // CLICK ANIMATION (Shrink & Bounce)
        const timeSinceLastClick = now - animValues.lastClickTime;
        const recoveryDelay = 150;

        if (timeSinceLastClick > recoveryDelay) {
          if (animValues.pressure > 0) {
            animValues.pressure *= 0.88; // Keep size decay at 0.88
            if (animValues.pressure < 0.01) {
              animValues.pressure = 0;
            }
          }
        }

        // HEAT/COLOR DECAY - Cool down when not clicking rapidly
        if (timeSinceLastClick > 500) {
          animValues.clickHeat *= 0.97; // Faster color decay: was 0.985, now 0.95
          if (animValues.clickHeat < 0.01) {
            animValues.clickHeat = 0;
          }
        }

        // Use a fixed shrink amount instead of percentage-based
        const maxShrinkAmount = Math.min(15, stableRadius * 0.15); // Cap at 15px, or 15% of radius (whichever is smaller)
        animValues.clickBoost = -animValues.pressure * maxShrinkAmount;

        // Update overall scale
        let scaleVariation = 1.0;
        if (isDisabled) {
          scaleVariation *= 0.9;
        }
        setScale(scaleVariation);

        // Re-render if enough time has passed
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
        const radius = baseRadius + breathing + clickBoost + noise * baseRadius;
        points.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        });
      }

      if (points.length < 2) return "";
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];
      let path = `M ${(lastPoint.x + firstPoint.x) / 2} ${
        (lastPoint.y + firstPoint.y) / 2
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

    const currentVisualSize = visualSizeRef.current;

    // Function to interpolate between green and orange based on heat
    const getHeatColor = (baseColor: string, heat: number) => {
      if (heat === 0) return baseColor;

      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : { r: 0, g: 0, b: 0 };
      };

      const rgbToHex = (r: number, g: number, b: number) => {
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

      const greenRgb = hexToRgb(baseColor);
      const orangeRgb = { r: 255, g: 140, b: 0 };

      const r = greenRgb.r + (orangeRgb.r - greenRgb.r) * heat;
      const g = greenRgb.g + (orangeRgb.g - greenRgb.g) * heat;
      const b = greenRgb.b + (orangeRgb.b - greenRgb.b) * heat;

      return rgbToHex(r, g, b);
    };

    // Get current heated colors
    const currentHeat = animationValuesRef.current.clickHeat;
    const heatedColor = getHeatColor(color, currentHeat);
    const heatedStrokeColor = getHeatColor(strokeColor, currentHeat * 0.7);

    // Dynamic glow effect based on heat
    const glowDeviation = 4 + 10 * currentHeat; // Glow gets wider when heated
    const gradientIntensity = 0.9 + 2 * currentHeat;

    // Calculate tighter bounds for the clickable area
    const blobRadius = currentVisualSize * 0.35;
    const containerSize = blobRadius * 2.4; // Clickable area size

    return (
      <div
        data-blob-id={id}
        style={{
          position: "absolute",
          left: position.x - containerSize / 2,
          top: position.y - containerSize / 2,
          width: containerSize,
          height: containerSize,
          transform: `scale(${scale})`,
          willChange: "transform",
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.5 : 1,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width={currentVisualSize * 2}
          height={currentVisualSize * 2}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none", // Let the parent div handle clicks
          }}
        >
          <defs>
            <radialGradient id={`gradient-${id}`} cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor={heatedColor}
                stopOpacity={gradientIntensity}
              />
              <stop
                offset="100%"
                stopColor={heatedStrokeColor}
                stopOpacity="0.8"
              />
            </radialGradient>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation={glowDeviation}
                floodColor={glowColor}
                floodOpacity="0.7"
              />
            </filter>
          </defs>
          <path
            d={generateAmoebePath()}
            fill={`url(#gradient-${id})`}
            stroke={heatedStrokeColor}
            strokeWidth="2"
            filter={`url(#${filterId})`}
          />
        </svg>
      </div>
    );
  }
);

Blob.displayName = "Blob";
export default Blob;
