import { describe, it, expect, beforeEach } from 'vitest';
import { initialGameState, manualClick, tick } from './game';

describe('Simple Game Tests', () => {
  let gameState: typeof initialGameState;

  beforeEach(() => {
    gameState = { ...initialGameState };
  });

  it('should start with zero biomass', () => {
    expect(gameState.biomass).toBe(0);
  });

  it('should increase biomass when clicking', () => {
    const newState = manualClick(gameState);
    expect(newState.biomass).toBe(1);
  });

  it('should generate income when ticking', () => {
    const newState = tick(gameState);
    expect(newState.biomass).toBe(gameState.income);
  });
});