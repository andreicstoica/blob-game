import React, { useState, useEffect, useRef, useCallback } from "react";
import type { BlobProps } from "../../game/types";
import { Colors } from "../../styles/colors";
import {
  calculateBlobSize,
  getHeatColor,
  updateBlobAnimations,
  handleBlobClick,
  generateAmoebePath,
  createBlobAnimationValues,
} from "../../game/systems/blobSystem";
import type { BlobAnimationValues } from "../../game/types/ui";

const Blob = React.memo(
  ({
    id,
    position,
    size: propSize,
    biomass,
    gameState,
    color = Colors.biomass.primary,
    strokeColor = Colors.biomass.light,
    glowColor = Colors.biomass.light,
    isDisabled = false,
    onBlobClick,
    onBlobPress,
    onBlobRelease,
    isActive = true,
    clickPower = 1, // Default click power
    addFloatingNumber,
    onAnimationStateChange,
  }: BlobProps) => {
    const filterId = `glow-${id}`;

    const calculateCurrentSize = useCallback(() => {
      return calculateBlobSize(propSize, biomass);
    }, [propSize, biomass]);

    const [stableSize, setStableSize] = useState(() => calculateCurrentSize());
    const visualSizeRef = useRef(stableSize);
    const [scale, setScale] = useState(1);
    const [isPressed, setIsPressed] = useState(false);
    const [rotation, setRotation] = useState(0); // Add rotation state
    const [isSpacePressed, setIsSpacePressed] = useState(false); // Add spacebar tracking

    const animationValuesRef = useRef<BlobAnimationValues>(
      createBlobAnimationValues()
    );

    const [, forceRender] = useState({});
    const lastRenderTime = useRef(0);

    // Function to get color based on blob heat for floating numbers
    const getFloatingNumberColor = useCallback((heat: number): string => {
      if (heat < 0.2) {
        return "#3b82f6"; // Blue - cool/slow
      } else if (heat < 0.4) {
        return "#22c55e"; // Green - warming up
      } else if (heat < 0.6) {
        return "#fbbf24"; // Yellow - hot
      } else if (heat < 0.8) {
        return "#f97316"; // Orange - very hot
      } else {
        return "#ef4444"; // Red - blazing hot
      }
    }, []);

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
      if (addFloatingNumber && clickPower > 0) {
        const currentHeat = animationValuesRef.current.clickHeat;
        const heatColor = getFloatingNumberColor(currentHeat);
        addFloatingNumber({ x: worldX, y: worldY }, clickPower, heatColor);
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

      // Handle blob click animation and effects
      handleBlobClick(animationValuesRef.current, Date.now());
    };

    const handleMouseLeave = () => {
      if (isPressed) setIsPressed(false);
    };

    // Handle keyboard events for spacebar clicking - FIXED VERSION
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && !isDisabled && isActive && !isSpacePressed) {
          e.preventDefault(); // Prevent page scrolling
          setIsSpacePressed(true); // Mark spacebar as pressed
          
          // Simulate a click at the blob's center
          const worldX = window.innerWidth / 2;
          const worldY = window.innerHeight / 2;
          
          // Trigger floating number animation
          if (addFloatingNumber && clickPower > 0) {
            const currentHeat = animationValuesRef.current.clickHeat;
            const heatColor = getFloatingNumberColor(currentHeat);
            addFloatingNumber({ x: worldX, y: worldY }, clickPower, heatColor);
          }

          if (onBlobClick) {
            if (onBlobClick.length === 0) {
              (onBlobClick as () => void)();
            } else {
              (onBlobClick as (blobId: string, clickPosition: { x: number; y: number }) => void)(
                id, 
                { x: 0, y: 0 } // Center of blob
              );
            }
          }

          // Handle blob click animation and effects
          handleBlobClick(animationValuesRef.current, Date.now());
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          setIsSpacePressed(false); // Reset spacebar tracking
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }, [id, isDisabled, isActive, clickPower, addFloatingNumber, onBlobClick, gameState, getFloatingNumberColor, isSpacePressed]);

    useEffect(() => {
      let animationId: number;
      const animate = () => {
        const now = Date.now();
        const animValues = animationValuesRef.current;

        // Core animation logic for smooth growth
        const interpolationFactor = 0.05;
        visualSizeRef.current +=
          (stableSize - visualSizeRef.current) * interpolationFactor;

        const currentVisualSize = visualSizeRef.current;

        // Update all blob animations
        updateBlobAnimations(animValues, currentVisualSize, now, biomass);

        // Update rotation - slow rotation (360 degrees in 30 seconds)
        setRotation(prev => (prev + 0.2) % 360);

        // Notify parent of animation state changes for ripple system
        if (onAnimationStateChange) {
          onAnimationStateChange({
            clickBoost: animValues.clickBoost,
            pressure: animValues.pressure,
          });
        }

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
    }, [stableSize, isDisabled, onAnimationStateChange]);

    const currentVisualSize = visualSizeRef.current;

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
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`, // Add rotation
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
            d={generateAmoebePath(
              currentVisualSize,
              animationValuesRef.current
            )}
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
