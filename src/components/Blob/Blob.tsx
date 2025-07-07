// src/components/Blob/Blob.tsx
import React, { useState, useEffect, useRef } from 'react';

export interface BlobProps {
  id: string;
  position: { x: number; y: number };
  size: number;
}

const Blob = React.memo(({ id, position, size }: BlobProps) => {
  const [path, setPath] = useState('');
  const [scale, setScale] = useState(1);
  const [clickEffect, setClickEffect] = useState({ active: false, x: 0, y: 0, intensity: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const clickEffectRef = useRef(clickEffect);
  const isPressedRef = useRef(isPressed);
  
  // Update refs when state changes
  useEffect(() => {
    clickEffectRef.current = clickEffect;
  }, [clickEffect]);

  useEffect(() => {
    isPressedRef.current = isPressed;
  }, [isPressed]);

  // Handle mouse down - shrink the blob
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('Mouse down - shrinking blob');
    setIsPressed(true);
  };

  // Handle mouse up - do the squish effect
  const handleMouseUp = (e: React.MouseEvent) => {
    console.log('Mouse up - squish effect');
    setIsPressed(false);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left - size / 2;
    const clickY = e.clientY - rect.top - size / 2;
    
    console.log('Release position:', { clickX, clickY });
    
    setClickEffect({
      active: true,
      x: clickX,
      y: clickY,
      intensity: 1
    });
    
    // Reset after animation
    setTimeout(() => {
      setClickEffect(prev => ({ ...prev, active: false }));
    }, 400);
  };

  // Handle mouse leave - reset pressed state if mouse leaves while pressed
  const handleMouseLeave = () => {
    if (isPressed) {
      console.log('Mouse left while pressed - resetting');
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
      
      const centerX = size / 2;
      const centerY = size / 2;
      const baseRadius = size * 0.35;
      
      const points = [];
      const numPoints = 6;
      
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        let radiusVariation = Math.sin(time * 0.3 + i * 1.7) * 0.2;
        
        // Add click squish effect (on release)
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
        
        const radius = baseRadius + baseRadius * radiusVariation;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        points.push({ x, y });
      }
      
      // Create smooth path
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
      
      // Scale calculation: normal pulse + press effect + release effect
      let scaleVariation = 1 + Math.sin(time * 0.5) * 0.15; // Normal pulsing
      
      if (currentPressed) {
        scaleVariation *= 0.95; // Shrink when pressed
      }
      
      if (currentClickEffect.active) {
        scaleVariation += currentClickEffect.intensity * 0.05; // Bigger bounce on release
      }
      
      setPath(pathData);
      setScale(scaleVariation);
      
      // Animate click effect decay
      if (currentClickEffect.active && currentClickEffect.intensity > 0) {
        setClickEffect(prev => ({
          ...prev,
          intensity: Math.max(0, prev.intensity - 0.025) // Slightly slower decay
        }));
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [size]);

  return (
    <div
      data-blob-id={id}
      style={{
        position: 'absolute',
        transform: `translate(${position.x - size/2}px, ${position.y - size/2}px) scale(${scale})`,
        willChange: 'transform',
        cursor: 'pointer'
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <svg width={size} height={size}>
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#cfffb1" floodOpacity="0.7"/>
            </filter>
        </defs>     
        <path 
          d={path} 
          fill="#1adaac" 
          stroke="#cfffb1" 
          strokeWidth="2"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
});

Blob.displayName = 'Blob';

export default Blob;