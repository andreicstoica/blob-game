// src/components/Blob/Blob.tsx
import React, { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG } from '../../engine/content';

export interface BlobProps {
  id: string;
  position: { x: number; y: number };
  size?: number; // Now optional since we can calculate from biomass
  biomass?: number; // New prop for biomass-based sizing
  // Game event callbacks
  onBlobClick?: ((blobId: string, clickPosition: { x: number; y: number }) => void) | (() => void);
  onBlobPress?: (blobId: string) => void;
  onBlobRelease?: (blobId: string) => void;
  onFoodEaten?: (blobId: string, foodId: string) => void; // New callback for eating
  // Visual customization props
  color?: string;
  strokeColor?: string;
  glowColor?: string;
  isDisabled?: boolean;
  animationSpeed?: number;
  // Game state props
  isActive?: boolean;
  // Food interaction props
  nearbyFood?: Array<{ id: string; x: number; y: number; distance: number }>;
}

const Blob = React.memo(({ 
  id, 
  position, 
  size: propSize,
  biomass,
  color = "#1adaac",
  strokeColor = "#cfffb1", 
  glowColor = "#cfffb1",
  isDisabled = false,
  animationSpeed = 0.3,
  onBlobClick,
  onBlobPress,
  onBlobRelease,
  onFoodEaten,
  isActive = true,
  nearbyFood = []
}: BlobProps) => {
  // Calculate size from biomass if not provided
  const size = propSize || (biomass ? Math.max(
    GAME_CONFIG.minBlobSize, 
    biomass * GAME_CONFIG.blobSizeMultiplier
  ) : 100); // Default size if neither size nor biomass provided

  const [path, setPath] = useState('');
  const [scale, setScale] = useState(1);
  const [clickEffect, setClickEffect] = useState({ active: false, x: 0, y: 0, intensity: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [eatingState, setEatingState] = useState({ 
    isEating: false, 
    targetFood: null as { id: string; x: number; y: number } | null,
    reachProgress: 0 
  });
  
  const clickEffectRef = useRef(clickEffect);
  const isPressedRef = useRef(isPressed);
  const eatingStateRef = useRef(eatingState);
  
  // Update refs when state changes
  useEffect(() => {
    clickEffectRef.current = clickEffect;
  }, [clickEffect]);

  useEffect(() => {
    isPressedRef.current = isPressed;
  }, [isPressed]);

  useEffect(() => {
    eatingStateRef.current = eatingState;
  }, [eatingState]);

  // Food detection and eating logic
  useEffect(() => {
    if (nearbyFood.length === 0 || eatingState.isEating) return;

    // Find closest food within eating range (5 pixels)
    const eatingRangeFood = nearbyFood.filter(food => food.distance <= 70);
    if (eatingRangeFood.length === 0) return;

    // Start eating the closest food
    const closestFood = eatingRangeFood.reduce((closest, current) => 
      current.distance < closest.distance ? current : closest
    );

    console.log(`Starting to eat food ${closestFood.id}`);
    setEatingState({
      isEating: true,
      targetFood: { 
        id: closestFood.id, 
        x: closestFood.x - position.x, // Relative to blob center
        y: closestFood.y - position.y 
      },
      reachProgress: 0
    });
  }, [nearbyFood, eatingState.isEating, position]);

  // Handle mouse events (same as before)
  const handleMouseDown = () => {
    if (isDisabled || !isActive) return;
    setIsPressed(true);
    onBlobPress?.(id);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDisabled || !isActive) return;
    setIsPressed(false);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left - size / 2;
    const clickY = e.clientY - rect.top - size / 2;
    
    if (onBlobClick) {
      if (onBlobClick.length === 0) {
        (onBlobClick as () => void)();
      } else {
        (onBlobClick as (blobId: string, clickPosition: { x: number; y: number }) => void)(id, { x: clickX, y: clickY });
      }
    }
    onBlobRelease?.(id);
    
    setClickEffect({
      active: true,
      x: clickX,
      y: clickY,
      intensity: 1
    });
    
    setTimeout(() => {
      setClickEffect(prev => ({ ...prev, active: false }));
    }, 400);
  };

  const handleMouseLeave = () => {
    if (isPressed) {
      setIsPressed(false);
    }
  };

  // Main animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      const time = Date.now() * 0.002;
      const currentClickEffect = clickEffectRef.current;
      const currentPressed = isPressedRef.current;
      const currentEating = eatingStateRef.current;
      
      const centerX = size / 2;
      const centerY = size / 2;
      const baseRadius = size * 0.35;
      
      const points = [];
      const numPoints = 6;
      
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        let radiusVariation = Math.sin(time * animationSpeed + i * 1.7) * 0.2;
        
        // Add click squish effect
        if (currentClickEffect.active) {
          const pointX = Math.cos(angle) * baseRadius;
          const pointY = Math.sin(angle) * baseRadius;
          const distanceToClick = Math.sqrt(
            (pointX - currentClickEffect.x) * (pointX - currentClickEffect.x) + 
            (pointY - currentClickEffect.y) * (pointY - currentClickEffect.y)
          );
          
          const squishAmount = Math.max(0, 1 - distanceToClick / (baseRadius * 0.8)) * currentClickEffect.intensity * 1;
          radiusVariation -= squishAmount;
        }
        
        // Add eating reach effect
        if (currentEating.isEating && currentEating.targetFood) {
          
          // Calculate how close this point is to the food direction
          const foodAngle = Math.atan2(currentEating.targetFood.y, currentEating.targetFood.x);
          const pointAngle = angle;
          let angleDiff = Math.abs(foodAngle - pointAngle);
          if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
          
          // Points closer to food direction stretch out more
          const reachStrength = Math.max(0, 1 - angleDiff / (Math.PI / 2)); // Strongest in 90-degree cone
          const reachAmount = reachStrength * currentEating.reachProgress * 0.6; // Max 60% extension
          
          radiusVariation += reachAmount;
        }
        
        const radius = baseRadius + baseRadius * radiusVariation;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        points.push({ x, y });
      }
      
      // Create smooth path (same as before)
      let pathData = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 0; i < numPoints; i++) {
        const current = points[i];
        const next = points[(i + 1) % numPoints];
        const afterNext = points[(i + 2) % numPoints];
        
        const cp1x = current.x + (next.x - points[(i - 1 + numPoints) % numPoints].x) * 0.2;
        const cp1y = current.y + (next.y - points[(i - 1 + numPoints) % numPoints].y) * 0.2;
        const cp2x = next.x - (afterNext.x - current.x) * 0.2;
        const cp2y = next.y - (afterNext.y - current.y) * 0.2;
        
        pathData += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`;
      }
      
      pathData += ' Z';
      
      // Scale calculation
      let scaleVariation = 1 + Math.sin(time * 0.5) * 0.15;
      
      if (currentPressed) {
        scaleVariation *= 0.95;
      }
      
      if (currentClickEffect.active) {
        scaleVariation += currentClickEffect.intensity * 0.05;
      }
      
      // Slightly grow when eating
      if (currentEating.isEating) {
        scaleVariation += 0.05;
      }
      
      if (isDisabled) {
        scaleVariation *= 0.8;
      }
      
      setPath(pathData);
      setScale(scaleVariation);
      
      // Animate click effect decay
      if (currentClickEffect.active && currentClickEffect.intensity > 0) {
        setClickEffect(prev => ({
          ...prev,
          intensity: Math.max(0, prev.intensity - 0.025)
        }));
      }
      
      // Animate eating progress
      if (currentEating.isEating) {
        setEatingState(prev => {
          const newProgress = Math.min(1, prev.reachProgress + 0.03); // Slow reach
          
          // When reach is complete, consume the food
          if (newProgress >= 1 && prev.targetFood) {
            onFoodEaten?.(id, prev.targetFood.id);
            console.log(`Food ${prev.targetFood.id} consumed!`);
            
            // Reset eating state after brief pause
            setTimeout(() => {
              setEatingState({ isEating: false, targetFood: null, reachProgress: 0 });
            }, 200);
          }
          
          return { ...prev, reachProgress: newProgress };
        });
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [size, animationSpeed, isDisabled, id, onFoodEaten]);

  const filterId = `glow-${id}`;

// In Blob.tsx, update the container style:

    return (
        <div
            data-blob-id={id}
            style={{
            position: 'absolute',
            // Make container 50% larger to accommodate stretching
            transform: `translate(${position.x - (size * 1.5)/2}px, ${position.y - (size * 1.5)/2}px) scale(${scale})`,
            willChange: 'transform',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.5 : 1
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <svg width={size * 1.5} height={size * 1.5}>
            <defs>
                <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={glowColor} floodOpacity="0.7"/>
                </filter>
            </defs>     
            <path 
                d={path} 
                fill={color} 
                stroke={strokeColor} 
                strokeWidth="2"
                filter={`url(#${filterId})`}
                // Center the path in the larger SVG
                transform={`translate(${size * 0.25}, ${size * 0.25})`}
            />
            </svg>
        </div>
    );
});

Blob.displayName = 'Blob';

export default Blob;