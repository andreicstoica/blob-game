export type CellStatus = 'empty' | 'nutrient' | 'blob';

export interface Cell {
  x: number;
  y: number;
  status: CellStatus;
}

import type { Level } from './levels';

export interface MapState {
  currentLevel: Level;
  size: 128; // square grid, power of two
  cells: Cell[]; // flat array for speed
  /** helper to read cell idx = y*size + x */
  get: (x: number, y: number) => CellStatus;
  set: (x: number, y: number, status: CellStatus) => void;
  setLevel: (level: Level) => void;
  evolveToNextLevel: (biomass: number) => void;
}

// Re-export Level type
export type { Level } from './levels'; 