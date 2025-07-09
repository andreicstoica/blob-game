export interface GeneratorState {
  id: string;
  name: string;
  baseCost: number;
  description: string;
  baseEffect: number;
  level: number;
  costMultiplier: number;
  unlockedAtLevel: string;
}

export interface GeneratorConfig {
  id: string;
  name: string;
  baseCost: number;
  description: string;
  baseEffect: number;
  costMultiplier: number;
  unlockedAtLevel: string;
} 