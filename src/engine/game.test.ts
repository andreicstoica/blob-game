import { describe, it, expect, beforeEach } from 'vitest';
import { initialGameState, manualClick, tick, buyUpgrade } from './game';

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
    
    it('should start with zero income', () => {
        expect(gameState.income).toBe(0);
      });
  
      it('should allow buying upgrade', () => {
        let state = gameState;
        for (let i = 0; i < 10; i++) {
          state = manualClick(state);
        }

        state = buyUpgrade(state, 'basic-income');
        
        expect(state.biomass).toBe(0); // Spent all biomass
        expect(state.income).toBe(0.1); // Now generates 0.1 biomass per tick
      });
  
      it('should generate passive income when ticked', () => {
        // Set up state with income
        let state = { ...gameState, income: 0.1 };
        state = tick(state);
        
        expect(state.biomass).toBe(0.1); // Should gain 0.1 biomass from income
      });
    
      it('should not allow buying upgrade if not enough biomass', () => {
        const state = buyUpgrade(gameState, 'basic-income');
        expect(state.biomass).toBe(0);
        expect(state.income).toBe(0);
      });
});