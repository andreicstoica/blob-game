// Core game state, mechanics, and utility types

export interface BlobState {
    size: number
}

export interface GameState {
    blobs: BlobState[]
    biomass: number
    growth: number
    clickPower: number
    generators: Record<string, GeneratorState>
    upgrades: Record<string, UpgradeState>
    nutrients: NutrientState[]
    currentLevelId: number
    highestLevelReached: number
}

export type NumberType = 'biomass' | 'cost' | 'rate' | 'power' | 'threshold' | 'owned';
export interface FormatOptions {
  type: NumberType;
  gameState?: GameState;
  forceFormat?: 'standard' | 'scientific' | 'decimal' | 'whole';
  maxDecimals?: number;
  showPlus?: boolean;
  compact?: boolean;
}

// Import types that are used in GameState
import type { GeneratorState, UpgradeState, NutrientState } from './progression'; 