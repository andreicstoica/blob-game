import { describe, it, expect, beforeEach } from 'vitest';
import { 
    initialGameState, 
    manualClick, 
    tick, 
    buyGenerator, 
    buyUpgrade,
    getGeneratorCost,
    getTotalIncome
} from './game';

describe('Game Logic', () => {
    let gameState: typeof initialGameState;

    beforeEach(() => {
        gameState = { ...initialGameState };
    });

    describe('Initial State', () => {
        it('should start with 1 biomass', () => {
            expect(gameState.biomass).toBe(1);
        });

        it('should start with zero income', () => {
            expect(gameState.income).toBe(0);
        });

        it('should start with click power of 1', () => {
            expect(gameState.clickPower).toBe(1);
        });

        it('should have generators available', () => {
            expect(gameState.generators['basic-slime']).toBeDefined();
            expect(gameState.generators['slime-farm']).toBeDefined();
        });

        it('should have upgrades available', () => {
            expect(gameState.upgrades['click-power']).toBeDefined();
            expect(gameState.upgrades['efficient-generators']).toBeDefined();
        });
    });

    describe('Manual Click', () => {
        it('should increase biomass by click power', () => {
            const newState = manualClick(gameState);
            expect(newState.biomass).toBe(2); // 1 + 1 click power
        });

        it('should not mutate original state', () => {
            const originalBiomass = gameState.biomass;
            manualClick(gameState);
            expect(gameState.biomass).toBe(originalBiomass);
        });
    });

    describe('Generators', () => {
        it('should allow buying basic slime generator', () => {
            // Get enough biomass to buy the generator
            let state = gameState;
            for (let i = 0; i < 14; i++) {
                state = manualClick(state);
            }
            
            const generator = state.generators['basic-slime'];
            expect(getGeneratorCost(generator)).toBe(15);
            
            state = buyGenerator(state, 'basic-slime');
            
            expect(state.biomass).toBe(0); // Spent all biomass
            expect(state.income).toBe(0.1); // Now generates 0.1 biomass per tick
            expect(state.generators['basic-slime'].level).toBe(1);
        });

        it('should increase generator cost after purchase', () => {
            let state = gameState;
            for (let i = 0; i < 14; i++) {
                state = manualClick(state);
            }
            
            const originalCost = getGeneratorCost(state.generators['basic-slime']);
            state = buyGenerator(state, 'basic-slime');
            const newCost = getGeneratorCost(state.generators['basic-slime']);
            
            expect(newCost).toBeGreaterThan(originalCost);
        });

        it('should not allow buying generator if not enough biomass', () => {
            const state = buyGenerator(gameState, 'basic-slime');
            
            // Should remain unchanged
            expect(state.biomass).toBe(1);
            expect(state.income).toBe(0);
            expect(state.generators['basic-slime'].level).toBe(0);
        });

        it('should generate passive income when ticked', () => {
            // Set up state with generators
            let state = gameState;
            for (let i = 0; i < 14; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            // Tick the game
            state = tick(state);
            
            expect(state.biomass).toBe(0.1); // Should gain 0.1 biomass from income
        });

        it('should calculate total income correctly', () => {
            let state = gameState;
            
            // Buy multiple generators
            for (let i = 0; i < 14; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            for (let i = 0; i < 85; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'slime-farm');
            
            expect(getTotalIncome(state)).toBe(1.1); // 0.1 + 1.0
        });
    });

    describe('Upgrades', () => {
        it('should allow buying click power upgrade', () => {
            // Get enough biomass
            let state = gameState;
            for (let i = 0; i < 49; i++) {
                state = manualClick(state);
            }
            
            state = buyUpgrade(state, 'click-power');
            
            expect(state.biomass).toBe(0);
            expect(state.clickPower).toBe(2); // Doubled from 1
            expect(state.upgrades['click-power'].purchased).toBe(true);
        });

        it('should not allow buying upgrade twice', () => {
            let state = gameState;
            for (let i = 0; i < 100; i++) {
                state = manualClick(state);
            }
            
            state = buyUpgrade(state, 'click-power');
            const firstPurchase = state.clickPower;
            
            state = buyUpgrade(state, 'click-power');
            expect(state.clickPower).toBe(firstPurchase); // Should not change
        });

        it('should apply efficient generators upgrade correctly', () => {
            let state = gameState;
            
            // Buy basic slime generator
            for (let i = 0; i < 14; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            // Buy efficient generators upgrade
            for (let i = 0; i < 485; i++) {
                state = manualClick(state);
            }
            state = buyUpgrade(state, 'efficient-generators');
            
            // Should have base income (0.1) + upgrade bonus (0.1) = 0.2
            expect(state.income).toBe(0.2);
        });

        it('should not allow buying upgrade if not enough biomass', () => {
            const state = buyUpgrade(gameState, 'click-power');
            
            // Should remain unchanged
            expect(state.biomass).toBe(1);
            expect(state.clickPower).toBe(1);
            expect(state.upgrades['click-power'].purchased).toBe(false);
        });
    });
});