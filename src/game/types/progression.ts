// Levels, progression, map entities, and shop

export interface Level {
  id: number;
  name: string;
  displayName: string;
  biomassThreshold: number;
  biomassDisplayFormat: 'standard' | 'scientific' | 'decimal' | 'whole';
  background: string;
  foodTypes: string[];
  description: string;
  blobSizeStart: number;
  blobSizeEnd: number;
}

export type CellStatus = 'empty' | 'nutrient' | 'blob';
export interface Cell {
  x: number;
  y: number;
  status: CellStatus;
}

export interface MapState {
  currentLevel: Level;
  size: number;
  cells: Cell[];
  get: (x: number, y: number) => CellStatus;
  set: (x: number, y: number, status: CellStatus) => void;
  setLevel: (level: Level) => void;
  evolveToNextLevel: (biomass: number) => void;
}

export interface ScaleLevel {
  name: string;
  description: string;
  unit: string;
  color: string;
  icon: string;
}


export interface GeneratorState {
  id: string
  name: string
  baseCost: number
  description: string
  growthPerTick: number
  level: number
  costMultiplier: number
  unlockedAtLevel: string
}

export interface UpgradeState {
  id: string
  name: string
  cost: number
  description: string
  effect: number
  type: 'growth' | 'split' | 'click' | 'blob'
  purchased: boolean
  unlockedAtLevel: string
  targetLevel?: string // Which level's generators this affects
}

export interface GeneratorValue {
  generatorId: string;
  value: number; // growth per biomass
  color: string; // hex color for the indicator
  rank: number; // 1 = best value, n = worst value
}