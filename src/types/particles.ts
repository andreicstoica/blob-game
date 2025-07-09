export type ParticleType = 'nutrient' | 'energy' | 'matter' | 'cosmic';

export interface ParticleConfig {
  type: ParticleType;
  spawnRate: number; // particles per second
  speed: number; // pixels per second
  size: number;
  color: string;
  level: number;
  useImage: boolean;
  images?: string[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

// For AnimationLayer
export interface ParticleData {
  id: string;
  position: Position;
  velocity: Velocity;
  color: string;
  size: number;
  startTime: number;
  lifespan: number;
}

// For ParticleSystem
export interface Particle {
  id: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  type: ParticleType;
  useImage?: boolean;
  image?: string;
  direction: Position;
}

// For Particle component
export interface ParticleProps {
  position: Position;
  velocity: Velocity;
  color?: string;
  size?: number;
  startTime: number;
  lifespan?: number;
  onComplete?: () => void;
} 