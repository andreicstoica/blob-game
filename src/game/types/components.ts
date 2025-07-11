// Component prop interfaces - centralized location for all UI component props

import type { GameState } from './core';
import type { TutorialState } from './ui';
import type { BlobProps } from './ui';

// Game Scene and HUD
export interface GameSceneProps {
  gameState: GameState;
  blobSize: number;
  onBlobClick: (blobId: string, clickPosition: { x: number; y: number }) => void;
  zoom?: number;
}

export interface GameHUDProps {
  biomass: number;
  gameState?: GameState;
  tutorialState?: TutorialState;
  onBuyGenerator?: (generatorId: string) => void;
  onBuyUpgrade?: (upgradeId: string) => void;
  onEvolve?: () => void;
  onTutorialStepComplete?: (stepId: string) => void;
  blobSize?: number;
  zoom?: number;
}

export interface GameStatsProps {
  biomass: number;
  gameState?: GameState;
}

// Shop Components
export interface ShopProps {
  biomass: number;
  gameState?: GameState;
  onBuyGenerator?: (generatorId: string) => void;
  onBuyUpgrade?: (upgradeId: string) => void;
}

export interface GeneratorsProps {
  biomass: number;
  gameState: GameState;
  onBuyGenerator: (generatorId: string) => void;
  generatorFilter: 'current' | 'all';
  currentLevel: { name: string };
  buyMultiplier: 1 | 10 | 100;
}

export interface UpgradesProps {
  biomass: number;
  gameState: GameState;
  onBuyUpgrade: (upgradeId: string) => void;
  generatorFilter: 'current' | 'all';
  currentLevel: { name: string };
}

export interface FilterToggleProps {
  filter: 'current' | 'all';
  onFilterChange: (filter: 'current' | 'all') => void;
}

export interface BuyMultiplierToggleProps {
  multiplier: 1 | 10 | 100;
  onMultiplierChange: (multiplier: 1 | 10 | 100) => void;
}

export interface ValueScaleProps {
  gameState: GameState;
  currentLevel: { name: string };
}

// Evolution Components
export interface EvolutionPanelProps {
  biomass: number;
  gameState?: GameState;
  onEvolve?: () => void;
  blobSize?: number;
  zoom?: number;
}

export interface CurrentLevelProps {
  biomass: number;
  gameState?: GameState;
}

export interface EvolutionScaleProps {
  biomass: number;
  gameState?: GameState;
}

export interface NextEvolutionProps {
  biomass: number;
  gameState?: GameState;
}

export interface EvolutionButtonProps {
  canEvolve: boolean;
  onEvolve: () => void;
}

// Blob Components
export interface BlobContainerProps extends Omit<BlobProps, "position"> {
  id: string;
  biomass: number;
  size: number;
  onBlobClick: (blobId: string, clickPosition: { x: number; y: number }) => void;
  clickPower: number;
  addFloatingNumber: (position: { x: number; y: number }, value: number, color?: string, emoji?: string) => void;
  onAnimationStateChange?: (animationState: { clickBoost: number; pressure: number }) => void;
}

export interface BlobRippleContainerProps {
  blobSize: number;
  blobAnimationState: { clickBoost: number; pressure: number };
}

// Generator Components
export interface GeneratorSystemProps {
  gameState: GameState;
  blobSize: number;
  addFloatingNumber: (position: { x: number; y: number }, value: number, color?: string, emoji?: string) => void;
}

export interface GeneratorElementProps {
  generator: {
    id: string;
    type: 'individual' | 'stacked';
    emoji: string;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    count: number;
    totalEffect: number;
    levelId: string;
    lastFloatingNumber: number;
    waveOffset: number;
    waveFrequency: number;
    waveAmplitude: number;
    speedMultiplier: number;
  };
}

export interface StackedGeneratorElementProps {
  generator: {
    id: string;
    type: 'individual' | 'stacked';
    emoji: string;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    count: number;
    totalEffect: number;
    levelId: string;
    lastFloatingNumber: number;
    waveOffset: number;
    waveFrequency: number;
    waveAmplitude: number;
    speedMultiplier: number;
  };
}

// Particle Components
export interface ParticleSystemProps {
  gameState: GameState;
  currentLevel: { name: string };
  blobSize: number;
}

export interface ParticleSpawnerProps {
  gameState: GameState;
  currentLevel: { name: string };
  blobSize: number;
  children: (particles: any[], burstParticles: any[], trailParticles: any[]) => React.ReactNode;
}

export interface ParticleRendererProps {
  particles: any[];
  burstParticles: any[];
  trailParticles: any[];
}

export interface RippleSystemProps {
  blobSize: number;
  blobAnimationState: { clickBoost: number; pressure: number };
}

// Animation Components
export interface FloatingNumberProps {
  value: number;
  position: { x: number; y: number };
  color?: string;
  startTime: number;
  onComplete?: () => void;
}

// Tutorial Components
export interface TutorialManagerProps {
  tutorialState: TutorialState;
  blobPosition: { x: number; y: number };
}

export interface TutorialArrowProps {
  target: { x: number; y: number };
  onComplete: () => void;
}

export interface ClickIndicatorProps {
  target: { x: number; y: number };
  onComplete: () => void;
}

// Map Components
export interface MapProps {
  className?: string;
  zoom?: number;
}

// Dev Components
export interface BlobTestProps {
  biomass: number;
  onBlobClick: () => void;
} 