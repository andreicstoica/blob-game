// src/components/Blob/Blob.tsx
import React, { useState, useEffect } from 'react';

export interface BlobProps {
  id: string;
  position: { x: number; y: number };
  size: number;
}

const Blob = React.memo(({ id, position, size }: BlobProps) => {
  const [path, setPath] = useState('');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
        const time = Date.now() * 0.002;
        
        const centerX = size / 2;
        const centerY = size / 2;
        const baseRadius = size * 0.35;
        
        // Create points around a circle with organic variation
        const points = [];
        const numPoints = 6; // Reduced from 8 for smoother curves
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const radiusVariation = Math.sin(time * 0.7 + i * 1.2) * 0.3; // Slightly reduced variation
            const radius = baseRadius + baseRadius * radiusVariation;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            points.push({ x, y });
        }
        
        // Create smooth closed curve using cubic Bézier
        let pathData = `M ${points[0].x} ${points[0].y}`;
        
        for (let i = 0; i < numPoints; i++) {
            const current = points[i];
            const next = points[(i + 1) % numPoints];
            const afterNext = points[(i + 2) % numPoints];
            
            // Control points for smooth curve
            const cp1x = current.x + (next.x - points[(i - 1 + numPoints) % numPoints].x) * 0.2;
            const cp1y = current.y + (next.y - points[(i - 1 + numPoints) % numPoints].y) * 0.2;
            const cp2x = next.x - (afterNext.x - current.x) * 0.2;
            const cp2y = next.y - (afterNext.y - current.y) * 0.2;
            
            pathData += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`;
        }
        
        pathData += ' Z'; // This should now close smoothly
        
        const scaleVariation = 1 + Math.sin(time * 0.5) * 0.15;
        
        setPath(pathData);
        setScale(scaleVariation);
        
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
      }}
    >
      <svg width={size} height={size}>
        <path 
          d={path} 
          fill="#4ade80" 
          stroke="white" 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
});
Blob.displayName = 'Blob'; // Helpful for debugging

export default Blob;