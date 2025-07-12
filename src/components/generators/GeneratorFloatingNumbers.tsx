import React, { useState, useEffect, useRef } from 'react';
import type { GameState, GeneratorState } from '../../game/types';
import { NumberFormatter } from '../../utils/numberFormat';
import { Colors } from '../../styles/colors';

interface FloatingNumber {
  id: string;
  generatorId: string;
  value: number;
  x: number;
  y: number;
  color: string;
  emoji: string;
  createdAt: number;
}

interface GeneratorFloatingNumbersProps {
  gameState: GameState;
  blobPosition: { x: number; y: number };
}

export const GeneratorFloatingNumbers: React.FC<GeneratorFloatingNumbersProps> = ({
  gameState,
  blobPosition,
}) => {
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const lastUpdateRef = useRef<number>(Date.now());
  const generatorTimersRef = useRef<Record<string, number>>({});

  // Debug: Log component mount and props
  useEffect(() => {
    // Component mounted successfully
  }, []);

  // Get all generators with their individual instances
  const getAllGeneratorInstances = (): Array<{ generator: GeneratorState; instanceId: string }> => {
    const instances: Array<{ generator: GeneratorState; instanceId: string }> = [];
    
    Object.values(gameState.generators).forEach((generator) => {
      // Skip tutorial generator
      if (generator.id === 'tutorial-generator') return;
      
      // Create an instance for each level of the generator
      for (let i = 0; i < generator.level; i++) {
        instances.push({
          generator,
          instanceId: `${generator.id}-${i}`
        });
      }
    });
    
    return instances;
  };

  // Calculate generator contribution color based on total growth
  const getGeneratorColor = (generator: GeneratorState): string => {
    const totalGrowth = Object.values(gameState.generators).reduce((sum, gen) => {
      if (gen.id === 'tutorial-generator') return sum;
      return sum + gen.growthPerTick * gen.level;
    }, 0);
    
    const contribution = generator.growthPerTick / totalGrowth;
    
    if (contribution >= 0.3) return Colors.upgrades.primary; // Purple
    if (contribution >= 0.15) return Colors.headlines.primary; // Red
    if (contribution >= 0.05) return Colors.evolution.primary; // Orange
    if (contribution >= 0.01) return Colors.evolution.secondary; // Yellow
    return Colors.biomass.primary; // Green
  };

  // Get emoji for generator
  const getGeneratorEmoji = (generator: GeneratorState): string => {
    return generator.name.split(' ')[0] || '⚪';
  };

  // Generate random position within blob bounds
  const getRandomPosition = (): { x: number; y: number } => {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 30; // Within 30px of blob center
    
    return {
      x: blobPosition.x + Math.cos(angle) * distance,
      y: blobPosition.y + Math.sin(angle) * distance
    };
  };

  // Add floating number for a generator instance
  const addFloatingNumber = (generator: GeneratorState, instanceId: string) => {
    const position = getRandomPosition();
    const color = getGeneratorColor(generator);
    const emoji = getGeneratorEmoji(generator);
    
    const floatingNumber: FloatingNumber = {
      id: `${instanceId}-${Date.now()}`,
      generatorId: generator.id,
      value: generator.growthPerTick,
      x: position.x,
      y: position.y,
      color,
      emoji,
      createdAt: Date.now()
    };
    
    setFloatingNumbers(prev => [...prev, floatingNumber]);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const instances = getAllGeneratorInstances();
      
      console.log('Animation tick - instances:', instances.length, 'instances:', instances.map(i => ({ id: i.generator.id, level: i.generator.level })));
      
      instances.forEach(({ generator, instanceId }) => {
        const lastUpdate = generatorTimersRef.current[instanceId] || 0;
        
        // Trigger floating number every 1 second per generator instance
        if (now - lastUpdate >= 1000) {
          console.log('Adding floating number for:', generator.id, 'instance:', instanceId);
          addFloatingNumber(generator, instanceId);
          generatorTimersRef.current[instanceId] = now;
        }
      });
      
      lastUpdateRef.current = now;
    };

    const interval = setInterval(animate, 100); // Check every 100ms
    return () => clearInterval(interval);
  }, [gameState, blobPosition]);

  // Clean up old floating numbers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFloatingNumbers(prev => 
        prev.filter(number => now - number.createdAt < 2000) // Keep for 2 seconds
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {floatingNumbers.map((floatingNumber) => {
        const age = Date.now() - floatingNumber.createdAt;
        const progress = age / 2000; // 2 second lifetime
        const opacity = 1 - progress;
        const yOffset = -40 - (progress * 20); // Float up and fade

        return (
          <div
            key={floatingNumber.id}
            style={{
              position: 'fixed',
              left: floatingNumber.x,
              top: floatingNumber.y + yOffset,
              transform: 'translate(-50%, -50%)',
              color: floatingNumber.color,
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: opacity,
              pointerEvents: 'none',
              zIndex: 9999,
              textShadow: `0 0 8px ${floatingNumber.color}80`,
              transition: 'none',
            }}
          >
            <span style={{ marginRight: '4px' }}>{floatingNumber.emoji}</span>
            {NumberFormatter.rate(floatingNumber.value, gameState)}
          </div>
        );
      })}
    </>
  );
}; 