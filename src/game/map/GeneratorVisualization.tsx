import React, { useMemo, useEffect } from 'react';
import type { GameState, GeneratorState } from '../../engine/core/game';
import { GENERATORS } from '../../engine/content/content';
import { getTotalGrowth } from '../../engine/core/game';

interface GeneratorVisualizationProps {
  gameState: GameState;
  blobPosition: { x: number; y: number };
  blobSize: number;
}

interface GeneratorEmoji {
  generatorId: string;
  emoji: string;
  position: { x: number; y: number };
  count: number;
  name: string;
}

// Ring radius around the blob
const RING_RADIUS = 120;
// Random offset range for positioning
const RANDOM_OFFSET = 5;

function calculateGeneratorPositions(
  generators: Record<string, GeneratorState>,
  blobPosition: { x: number; y: number }
): GeneratorEmoji[] {
  const generatorEmojis: GeneratorEmoji[] = [];
  
  // Get all generators with count > 0
  Object.values(generators).forEach(generator => {
    if (generator.level > 0) {
      const generatorData = GENERATORS[generator.id];
      if (generatorData) {
        // Extract emoji from generator name (first character)
        const emoji = generatorData.name.match(/^[^\s]+/)?.[0] || '⚪';
        
        // Create one emoji for each generator purchased
        for (let i = 0; i < generator.level; i++) {
          generatorEmojis.push({
            generatorId: generator.id,
            emoji,
            position: { x: 0, y: 0 }, // Will be calculated below
            count: generator.level,
            name: generatorData.name
          });
        }
      }
    }
  });
  
  // Calculate positions in a ring around the blob
  generatorEmojis.forEach((emoji, index) => {
    const angle = (index / generatorEmojis.length) * 2 * Math.PI;
    const baseX = blobPosition.x + Math.cos(angle) * RING_RADIUS;
    const baseY = blobPosition.y + Math.sin(angle) * RING_RADIUS;
    
    // Add random offset
    const randomX = (Math.random() - 0.5) * RANDOM_OFFSET;
    const randomY = (Math.random() - 0.5) * RANDOM_OFFSET;
    
    emoji.position = {
      x: baseX + randomX,
      y: baseY + randomY
    };
  });
  
  return generatorEmojis;
}

export const GeneratorVisualization: React.FC<GeneratorVisualizationProps> = ({
  gameState,
  blobPosition,
  blobSize
}) => {
  const generatorEmojis = useMemo(() => 
    calculateGeneratorPositions(gameState.generators, blobPosition),
    [gameState.generators, blobPosition]
  );
  
  // Trigger floating number animations every second
  useEffect(() => {
    console.log('GeneratorVisualization effect running, emojis:', generatorEmojis.length);
    if (generatorEmojis.length === 0) return;
    
    // Wait a bit for AnimationLayer to be ready
    const setupTimeout = setTimeout(() => {
      console.log('window.addFloatingNumber available:', !!window.addFloatingNumber);
      
      // Test immediate animation
      console.log('Testing immediate animation...');
      if (window.addFloatingNumber) {
        window.addFloatingNumber({ x: 100, y: 100 }, 1, '#ff0000');
      }
      
      const interval = setInterval(() => {
        console.log('Interval running, triggering animations for', generatorEmojis.length, 'emojis');
        
        // Show individual floating number for each emoji
        generatorEmojis.forEach(emoji => {
          const generator = gameState.generators[emoji.generatorId];
          if (generator && generator.baseEffect > 0) {
            // Show individual generator's contribution (not total for type)
            const individualGrowth = generator.baseEffect;
            
            // Determine color based on individual contribution
            const totalGrowth = getTotalGrowth(gameState);
            const contributionRatio = individualGrowth / totalGrowth;
            let color = '#4ade80'; // Default green
            
            if (contributionRatio < 0.01) {
              color = '#ef4444'; // Red for low contribution
            } else if (contributionRatio < 0.05) {
              color = '#f59e0b'; // Yellow for medium contribution
            }
            
            // Trigger floating number animation for this individual emoji
            if (window.addFloatingNumber) {
              console.log('Triggering individual floating number:', individualGrowth, 'at position:', emoji.position);
              window.addFloatingNumber(emoji.position, individualGrowth, color);
            } else {
              console.log('window.addFloatingNumber not available');
            }
          }
        });
      }, 1000); // Every 1 second
      
      return () => {
        console.log('Clearing interval');
        clearInterval(interval);
      };
    }, 500); // Wait 500ms for AnimationLayer to be ready
    
    return () => {
      clearTimeout(setupTimeout);
    };
  }, [generatorEmojis.length, gameState.generators]);
  
  if (generatorEmojis.length === 0) {
    return null;
  }
  
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {generatorEmojis.map((emoji, index) => (
        <div
          key={`${emoji.generatorId}-${index}`}
          style={{
            position: 'absolute',
            left: emoji.position.x,
            top: emoji.position.y,
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            opacity: 0.8,
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            pointerEvents: 'auto',
            cursor: 'help',
            animation: `generatorFloat 3s ease-in-out infinite`,
            animationDelay: `${index * 0.2}s`
          }}
          title={`${emoji.name} (${emoji.count} owned)`}
        >
          {emoji.emoji}
        </div>
      ))}
      
      <style>{`
        @keyframes generatorFloat {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}; 