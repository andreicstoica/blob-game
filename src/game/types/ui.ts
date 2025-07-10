// UI component props and visual elements

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
  clickPower?: number;
}

export interface CameraState {
  currentZoom: number;
  targetZoom: number;
  isEvolving: boolean;
}

export interface GeneratorEmoji {
  generatorId: string;
  emoji: string;
  angle: number;
  count: number;
  name: string;
}

// Animation and particle system types
export interface Particle {
  id: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  type: 'nutrient' | 'energy' | 'matter' | 'cosmic';
  useImage?: boolean;
  image?: string;
  direction: { x: number; y: number };
}

export interface ParticleConfig {
  type: 'nutrient' | 'energy' | 'matter' | 'cosmic';
  spawnRate: number; // particles per second
  speed: number; // pixels per second
  size: number;
  color: string;
  level: number;
  useImage: boolean;
  images?: string[];
}

export interface FloatingNumberAnimation {
  id: string;
  type: 'floatingNumber';
  position: { x: number; y: number };
  value: number;
  color?: string;
  startTime: number;
}

export interface ParticleData {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  color: string;
  size: number;
  startTime: number;
  lifespan: number;
} 