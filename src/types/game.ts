import type { NutrientState } from './nutrients';
import type { GeneratorState } from './generators';
import type { UpgradeState } from './upgrades';

export interface GameState {
  biomass: number;
  growth: number;
  clickPower: number;
  generators: Record<string, GeneratorState>;
  upgrades: Record<string, UpgradeState>;
  nutrients: NutrientState[];
  currentLevelId: number;
  highestLevelReached: number;
}

// Re-export types
export type { NutrientState } from './nutrients';
export type { GeneratorState } from './generators';
export type { UpgradeState } from './upgrades'; 