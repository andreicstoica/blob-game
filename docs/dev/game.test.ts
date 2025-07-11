import { describe, it, expect, beforeEach } from 'vitest';
import {
    INITIAL_STATE,
    tick,
    manualClick,
    buyGenerator,
    buyUpgrade,
    type GameState
} from '../game/systems/actions';
import { GAME_CONFIG } from '../game/content/config';
import { GENERATORS } from '../game/content/generators';
import { UPGRADES } from '../game/content/upgrades';
import { getTotalGrowth } from '../game/systems/calculations';

describe('Game State', () => {
    it('should initialize with correct default values', () => {
        expect(INITIAL_STATE.biomass).toBe(GAME_CONFIG.startingBiomass);
        expect(INITIAL_STATE.growth).toBe(0);
        expect(INITIAL_STATE.clickPower).toBe(GAME_CONFIG.startingClickPower);
        expect(INITIAL_STATE.currentLevelId).toBe(0);
        expect(INITIAL_STATE.highestLevelReached).toBe(0);
        expect(INITIAL_STATE.gameMode).toBe('tutorial');
    });

    it('should initialize generators with correct default values', () => {
        Object.values(INITIAL_STATE.generators).forEach(generator => {
            expect(generator.level).toBe(0);
            expect(generator.baseCost).toBeGreaterThan(0);
            expect(generator.growthPerTick).toBeGreaterThan(0);
            expect(generator.costMultiplier).toBeGreaterThan(1);
        });
    });

    it('should initialize upgrades with correct default values', () => {
        Object.values(INITIAL_STATE.upgrades).forEach(upgrade => {
            expect(upgrade.purchased).toBe(false);
            expect(upgrade.cost).toBeGreaterThan(0);
            expect(upgrade.effect).toBeGreaterThan(0);
        });
    });
});

describe('Game Logic', () => {
    let gameState: GameState;

    beforeEach(() => {
        gameState = { ...INITIAL_STATE };
    });

    describe('Manual Click', () => {
        it('should increase biomass by click power', () => {
            const newState = manualClick(gameState);
            expect(newState.biomass).toBe(GAME_CONFIG.startingBiomass + gameState.clickPower);
        });

        it('should not mutate original state', () => {
            const originalBiomass = gameState.biomass;
            manualClick(gameState);
            expect(gameState.biomass).toBe(originalBiomass);
        });

        it('should work with higher click power', () => {
            let state = gameState;
            // Get enough biomass to buy click power upgrade
            const clickUpgradeCost = UPGRADES['click-power'].cost;
            const clicksNeeded = Math.ceil(clickUpgradeCost / state.clickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            state = buyUpgrade(state, 'click-power');
            
            const newState = manualClick(state);
            const expectedClickPower = state.clickPower + UPGRADES['click-power'].effect;
            expect(newState.biomass).toBe(expectedClickPower);
        });
    });

    describe('Game Tick', () => {
        it('should add growth to biomass on tick', () => {
            let state = gameState;
            // Get enough biomass to buy a generator
            const generatorCost = GENERATORS['basic-generator'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / state.clickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-generator');
            
            const newState = tick(state);
            expect(newState.biomass).toBe(GENERATORS['basic-generator'].growthPerTick);
        });

        it('should not mutate original state on tick', () => {
            const originalBiomass = gameState.biomass;
            tick(gameState);
            expect(gameState.biomass).toBe(originalBiomass);
        });

        it('should calculate and apply growth correctly on tick', () => {
            let state = gameState;
            // Buy a generator
            const generatorCost = GENERATORS['basic-generator'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / state.clickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-generator');
            
            // The growth should be calculated correctly
            const expectedGrowth = GENERATORS['basic-generator'].growthPerTick;
            expect(state.growth).toBe(expectedGrowth);
            
            // Tick should apply the growth and update the growth field
            const newState = tick(state);
            expect(newState.biomass).toBe(state.biomass + expectedGrowth);
            expect(newState.growth).toBe(expectedGrowth);
        });
    });

    describe('Generators', () => {
        it('should allow buying generators when enough biomass', () => {
            let state = gameState;
            const generatorCost = GENERATORS['basic-generator'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / state.clickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            
            state = buyGenerator(state, 'basic-generator');
            
            expect(state.biomass).toBe(0);
            expect(state.generators['basic-generator'].level).toBe(1);
        });

        it('should not allow buying generators when insufficient biomass', () => {
            const state = buyGenerator(gameState, 'basic-generator');
            expect(state).toEqual(gameState);
        });

        it('should not mutate original state when buying generator', () => {
            const originalState = { ...gameState };
            buyGenerator(gameState, 'basic-generator');
            expect(gameState).toEqual(originalState);
        });

        it('should calculate generator costs correctly', () => {
            let state = gameState;
            const generator = GENERATORS['basic-generator'];
            
            // Buy first generator
            const firstCost = generator.baseCost;
            const firstClicks = Math.ceil(firstCost / state.clickPower);
            
            for (let i = 0; i < firstClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-generator');
            
            // Buy second generator
            const secondCost = generator.baseCost * Math.pow(generator.costMultiplier, 1);
            const secondClicks = Math.ceil(secondCost / state.clickPower);
            
            for (let i = 0; i < secondClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-generator');
            
            expect(state.generators['basic-generator'].level).toBe(2);
        });

        it('should handle buying multiple generators', () => {
            let state = gameState;
            
            // Buy basic generator
            const basicGeneratorCost = GENERATORS['basic-generator'].baseCost;
            const basicGeneratorClicks = Math.ceil(basicGeneratorCost / state.clickPower);
            
            for (let i = 0; i < basicGeneratorClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-generator');
            
            // Buy microscopic cloner
            const clonerCost = GENERATORS['microscopic-cloner'].baseCost;
            const clonerClicks = Math.ceil(clonerCost / state.clickPower);
            
            for (let i = 0; i < clonerClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'microscopic-cloner');
            
            expect(state.generators['basic-generator'].level).toBe(1);
            expect(state.generators['microscopic-cloner'].level).toBe(1);
        });

        it('should calculate total growth correctly', () => {
            let state = gameState;
            
            // Buy basic generator
            const basicGeneratorCost = GENERATORS['basic-generator'].baseCost;
            const basicGeneratorClicks = Math.ceil(basicGeneratorCost / state.clickPower);
            
            for (let i = 0; i < basicGeneratorClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-generator');
            
            // Buy microscopic cloner
            const clonerCost = GENERATORS['microscopic-cloner'].baseCost;
            const clonerClicks = Math.ceil(clonerCost / state.clickPower);
            
            for (let i = 0; i < clonerClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'microscopic-cloner');
            
            const expectedGrowth = GENERATORS['basic-generator'].growthPerTick + GENERATORS['microscopic-cloner'].growthPerTick;
            expect(getTotalGrowth(state)).toBe(expectedGrowth);
        });
    });

    describe('Upgrades', () => {
        it('should allow buying click power upgrade', () => {
            let state = gameState;
            const upgradeCost = UPGRADES['click-power'].cost;
            const clicksNeeded = Math.ceil(upgradeCost / state.clickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            
            state = buyUpgrade(state, 'click-power');
            
            expect(state.biomass).toBe(0);
            const expectedClickPower = state.clickPower + UPGRADES['click-power'].effect;
            expect(state.clickPower).toBe(expectedClickPower);
            expect(state.upgrades['click-power'].purchased).toBe(true);
        });

        it('should not allow buying upgrade twice', () => {
            let state = gameState;
            const upgradeCost = UPGRADES['click-power'].cost;
            const clicksNeeded = Math.ceil(upgradeCost / state.clickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            
            state = buyUpgrade(state, 'click-power');
            const firstPurchase = state.clickPower;
            
            state = buyUpgrade(state, 'click-power');
            expect(state.clickPower).toBe(firstPurchase);
        });

        it('should not allow buying upgrade when insufficient biomass', () => {
            const state = buyUpgrade(gameState, 'click-power');
            expect(state).toEqual(gameState);
        });

        it('should not mutate original state when buying upgrade', () => {
            const originalState = { ...gameState };
            buyUpgrade(gameState, 'click-power');
            expect(gameState).toEqual(originalState);
        });

        it('should not allow buying already purchased upgrade', () => {
            let state = gameState;
            const upgradeCost = UPGRADES['click-power'].cost;
            const clicksNeeded = Math.ceil(upgradeCost / state.clickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            
            state = buyUpgrade(state, 'click-power');
            const firstPurchase = state.biomass;
            
            // Try to buy again
            state = buyUpgrade(state, 'click-power');
            expect(state.biomass).toBe(firstPurchase);
        });
    });

    describe('Integration Tests', () => {
        it('should handle complex game progression', () => {
            let state = gameState;
            
            // Click to get biomass for first generator
            const generatorCost = GENERATORS['basic-generator'].baseCost;
            const generatorClicks = Math.ceil(generatorCost / state.clickPower);
            
            for (let i = 0; i < generatorClicks; i++) {
                state = manualClick(state);
            }
            
            // Buy first generator
            state = buyGenerator(state, 'basic-generator');
            expect(state.growth).toBe(GENERATORS['basic-generator'].growthPerTick);
            
            // Tick to get growth
            state = tick(state);
            expect(state.biomass).toBe(GENERATORS['basic-generator'].growthPerTick);
            
            // Click some more
            state = manualClick(state);
            expect(state.biomass).toBe(GENERATORS['basic-generator'].growthPerTick + state.clickPower);
            
            // Buy click power upgrade
            const upgradeCost = UPGRADES['click-power'].cost;
            const upgradeClicks = Math.ceil(upgradeCost / state.clickPower);
            
            for (let i = 0; i < upgradeClicks; i++) {
                state = manualClick(state);
            }
            state = buyUpgrade(state, 'click-power');
            
            const expectedClickPower = state.clickPower + UPGRADES['click-power'].effect;
            expect(state.clickPower).toBe(expectedClickPower);
            
            // Click with new power
            state = manualClick(state);
            expect(state.biomass).toBe(expectedClickPower);
        });

        it('should maintain state consistency across operations', () => {
            let state = gameState;
            
            // Perform various operations
            state = manualClick(state);
            state = buyGenerator(state, 'basic-generator'); // Should fail, not enough biomass
            state = manualClick(state);
            state = tick(state);
            
            // Verify state is consistent
            const expectedBiomass = GAME_CONFIG.startingBiomass + (state.clickPower * 2);
            expect(state.biomass).toBe(expectedBiomass);
            expect(state.growth).toBe(0);
            expect(state.clickPower).toBe(1); // Should still be 1 since growth is 0
            expect(state.generators['basic-generator'].level).toBe(0);
        });
    });

    describe('Edge Cases', () => {
        it('should handle buying invalid generator gracefully', () => {
            const state = buyGenerator(gameState, 'invalid-generator');
            expect(state).toEqual(gameState);
        });

        it('should handle buying invalid upgrade gracefully', () => {
            const state = buyUpgrade(gameState, 'invalid-upgrade');
            expect(state).toEqual(gameState);
        });

        it('should handle very large numbers correctly', () => {
            let state = gameState;
            
            // Simulate having a lot of biomass
            state.biomass = 1e6;
            state.growth = 1e3;
            
            state = tick(state);
            expect(state.biomass).toBe(1e6 + 1e3);
        });
    });
});