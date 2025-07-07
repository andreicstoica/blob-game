import { describe, it, expect, beforeEach } from 'vitest';
import { 
    initialGameState, 
    manualClick, 
    tick, 
    buyGenerator, 
    buyUpgrade,
    getGeneratorCost,
    getTotalGrowth,
    consumeNutrient,
    getNearbyNutrients
} from './game';
import { GENERATORS, UPGRADES, GAME_CONFIG } from './content';

describe('Game Logic', () => {
    let gameState: typeof initialGameState;

    beforeEach(() => {
        gameState = { ...initialGameState };
    });

    describe('Initial State', () => {
        it('should start with configured biomass', () => {
            expect(gameState.biomass).toBe(GAME_CONFIG.startingBiomass);
        });

        it('should start with zero growth', () => {
            expect(gameState.growth).toBe(0);
        });

        it('should start with configured click power', () => {
            expect(gameState.clickPower).toBe(GAME_CONFIG.startingClickPower);
        });

        it('should have all configured generators available', () => {
            Object.keys(GENERATORS).forEach(generatorId => {
                expect(gameState.generators[generatorId]).toBeDefined();
            });
        });

        it('should have all configured upgrades available', () => {
            Object.keys(UPGRADES).forEach(upgradeId => {
                expect(gameState.upgrades[upgradeId]).toBeDefined();
            });
        });

        it('should have all generators at level 0 initially', () => {
            Object.values(gameState.generators).forEach(generator => {
                expect(generator.level).toBe(0);
            });
        });

        it('should have all upgrades unpurchased initially', () => {
            Object.values(gameState.upgrades).forEach(upgrade => {
                expect(upgrade.purchased).toBe(false);
            });
        });

        it('should have nutrients available initially', () => {
            expect(gameState.nutrients.length).toBe(20);
            expect(gameState.nutrients.every(n => !n.consumed)).toBe(true);
        });
    });

    describe('Nutrient System', () => {
        it('should consume nutrients and increase biomass', () => {
            const initialBiomass = gameState.biomass;
            const nutrient = gameState.nutrients[0];
            
            const newState = consumeNutrient(gameState, nutrient.id);
            
            expect(newState.biomass).toBe(initialBiomass + 1);
            expect(newState.nutrients.find(n => n.id === nutrient.id)?.consumed).toBe(true);
        });

        it('should not consume already consumed nutrients', () => {
            const nutrient = gameState.nutrients[0];
            let state = gameState;
            
            // Consume first time
            state = consumeNutrient(state, nutrient.id);
            const biomassAfterFirst = state.biomass;
            
            // Try to consume again
            state = consumeNutrient(state, nutrient.id);
            
            expect(state.biomass).toBe(biomassAfterFirst); // Should not change
        });

        it('should not consume non-existent nutrients', () => {
            const newState = consumeNutrient(gameState, 'non-existent-id');
            expect(newState).toEqual(gameState); // Should remain unchanged
        });

        it('should calculate nearby nutrients correctly', () => {
            const blobPosition = { x: 400, y: 300 };
            const nearbyNutrients = getNearbyNutrients(gameState, blobPosition);
            
            expect(nearbyNutrients.length).toBe(20); // All nutrients should be nearby initially
            expect(nearbyNutrients.every(n => typeof n.distance === 'number')).toBe(true);
            expect(nearbyNutrients.every(n => n.distance >= 0)).toBe(true);
        });

        it('should filter out consumed nutrients from nearby calculation', () => {
            const blobPosition = { x: 400, y: 300 };
            const nutrient = gameState.nutrients[0];
            
            // Consume a nutrient
            let state = consumeNutrient(gameState, nutrient.id);
            
            const nearbyNutrients = getNearbyNutrients(state, blobPosition);
            expect(nearbyNutrients.length).toBe(19); // One less nutrient
            expect(nearbyNutrients.find(n => n.id === nutrient.id)).toBeUndefined();
        });

        it('should calculate correct distances', () => {
            const blobPosition = { x: 0, y: 0 };
            const nutrient = { id: 'test', x: 3, y: 4, consumed: false };
            const testState = { ...gameState, nutrients: [nutrient] };
            
            const nearbyNutrients = getNearbyNutrients(testState, blobPosition);
            expect(nearbyNutrients[0].distance).toBe(5); // 3-4-5 triangle
        });
    });

    describe('Manual Click', () => {
        it('should increase biomass by click power', () => {
            const newState = manualClick(gameState);
            expect(newState.biomass).toBe(GAME_CONFIG.startingBiomass + GAME_CONFIG.startingClickPower);
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
            const clicksNeeded = Math.ceil(clickUpgradeCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            state = buyUpgrade(state, 'click-power');
            
            const newState = manualClick(state);
            const expectedClickPower = GAME_CONFIG.startingClickPower + UPGRADES['click-power'].effect;
            expect(newState.biomass).toBe(expectedClickPower);
        });
    });

    describe('Game Tick', () => {
        it('should add growth to biomass on tick', () => {
            let state = gameState;
            // Get enough biomass to buy a generator
            const generatorCost = GENERATORS['basic-slime'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            const newState = tick(state);
            expect(newState.biomass).toBe(GENERATORS['basic-slime'].baseEffect);
        });

        it('should not mutate original state on tick', () => {
            const originalBiomass = gameState.biomass;
            tick(gameState);
            expect(gameState.biomass).toBe(originalBiomass);
        });
    });

    describe('Generators', () => {
        it('should allow buying basic slime generator', () => {
            let state = gameState;
            const generatorCost = GENERATORS['basic-slime'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            
            const generator = state.generators['basic-slime'];
            expect(getGeneratorCost(generator)).toBe(generatorCost);
            
            state = buyGenerator(state, 'basic-slime');
            
            expect(state.biomass).toBe(0); // Spent all biomass
            expect(state.growth).toBe(GENERATORS['basic-slime'].baseEffect);
            expect(state.generators['basic-slime'].level).toBe(1);
        });

        it('should increase generator cost after purchase', () => {
            let state = gameState;
            const generatorCost = GENERATORS['basic-slime'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            
            const originalCost = getGeneratorCost(state.generators['basic-slime']);
            state = buyGenerator(state, 'basic-slime');
            const newCost = getGeneratorCost(state.generators['basic-slime']);
            
            expect(newCost).toBeGreaterThan(originalCost);
            expect(newCost).toBe(Math.floor(generatorCost * GENERATORS['basic-slime'].costMultiplier));
        });

        it('should not allow buying generator if not enough biomass', () => {
            const state = buyGenerator(gameState, 'basic-slime');
            
            // Should remain unchanged
            expect(state.biomass).toBe(GAME_CONFIG.startingBiomass);
            expect(state.growth).toBe(0);
            expect(state.generators['basic-slime'].level).toBe(0);
        });

        it('should generate passive growth when ticked', () => {
            let state = gameState;
            const generatorCost = GENERATORS['basic-slime'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            state = tick(state);
            expect(state.biomass).toBe(GENERATORS['basic-slime'].baseEffect);
        });

        it('should calculate total growth correctly', () => {
            let state = gameState;
            
            // Buy basic slime generator
            const basicSlimeCost = GENERATORS['basic-slime'].baseCost;
            const basicSlimeClicks = Math.ceil(basicSlimeCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < basicSlimeClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            // Buy slime farm
            const slimeFarmCost = GENERATORS['slime-farm'].baseCost;
            const slimeFarmClicks = Math.ceil(slimeFarmCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < slimeFarmClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'slime-farm');
            
            const expectedGrowth = GENERATORS['basic-slime'].baseEffect + GENERATORS['slime-farm'].baseEffect;
            expect(getTotalGrowth(state)).toBe(expectedGrowth);
        });

        it('should handle multiple generator levels correctly', () => {
            let state = gameState;
            const generatorCost = GENERATORS['basic-slime'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / GAME_CONFIG.startingClickPower);
            
            // Buy first level
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            // Buy second level
            const secondLevelCost = Math.floor(generatorCost * GENERATORS['basic-slime'].costMultiplier);
            const secondLevelClicks = Math.ceil(secondLevelCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < secondLevelClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            const expectedGrowth = GENERATORS['basic-slime'].baseEffect * 2;
            expect(state.growth).toBe(expectedGrowth);
            expect(state.generators['basic-slime'].level).toBe(2);
        });

        it('should have correct generator costs with multiplier', () => {
            const generator = gameState.generators['basic-slime'];
            expect(getGeneratorCost(generator)).toBe(GENERATORS['basic-slime'].baseCost);
            
            // Simulate buying first level
            let state = gameState;
            const generatorCost = GENERATORS['basic-slime'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            const expectedCost = Math.floor(generatorCost * GENERATORS['basic-slime'].costMultiplier);
            const newCost = getGeneratorCost(state.generators['basic-slime']);
            expect(newCost).toBe(expectedCost);
        });
    });

    describe('Upgrades', () => {
        it('should allow buying click power upgrade', () => {
            let state = gameState;
            const upgradeCost = UPGRADES['click-power'].cost;
            const clicksNeeded = Math.ceil(upgradeCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            
            state = buyUpgrade(state, 'click-power');
            
            expect(state.biomass).toBe(0);
            const expectedClickPower = GAME_CONFIG.startingClickPower + UPGRADES['click-power'].effect;
            expect(state.clickPower).toBe(expectedClickPower);
            expect(state.upgrades['click-power'].purchased).toBe(true);
        });

        it('should not allow buying upgrade twice', () => {
            let state = gameState;
            const upgradeCost = UPGRADES['click-power'].cost;
            const clicksNeeded = Math.ceil(upgradeCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < clicksNeeded; i++) {
                state = manualClick(state);
            }
            
            state = buyUpgrade(state, 'click-power');
            const firstPurchase = state.clickPower;
            
            state = buyUpgrade(state, 'click-power');
            expect(state.clickPower).toBe(firstPurchase);
        });

        it('should apply efficient generators upgrade correctly', () => {
            let state = gameState;
            
            // Buy basic slime generator
            const generatorCost = GENERATORS['basic-slime'].baseCost;
            const generatorClicks = Math.ceil(generatorCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < generatorClicks; i++) {
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            // Buy efficient generators upgrade
            const upgradeCost = UPGRADES['efficient-generators'].cost;
            const upgradeClicks = Math.ceil(upgradeCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < upgradeClicks; i++) {
                state = manualClick(state);
            }
            state = buyUpgrade(state, 'efficient-generators');
            
            const expectedGrowth = GENERATORS['basic-slime'].baseEffect + UPGRADES['efficient-generators'].effect;
            expect(state.growth).toBe(expectedGrowth);
        });

        it('should not allow buying upgrade if not enough biomass', () => {
            const state = buyUpgrade(gameState, 'click-power');
            
            // Should remain unchanged
            expect(state.biomass).toBe(GAME_CONFIG.startingBiomass);
            expect(state.clickPower).toBe(GAME_CONFIG.startingClickPower);
            expect(state.upgrades['click-power'].purchased).toBe(false);
        });

        it('should not allow buying already purchased upgrade', () => {
            let state = gameState;
            const upgradeCost = UPGRADES['click-power'].cost;
            const clicksNeeded = Math.ceil(upgradeCost / GAME_CONFIG.startingClickPower);
            
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
            const generatorCost = GENERATORS['basic-slime'].baseCost;
            const generatorClicks = Math.ceil(generatorCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < generatorClicks; i++) {
                state = manualClick(state);
            }
            
            // Buy first generator
            state = buyGenerator(state, 'basic-slime');
            expect(state.growth).toBe(GENERATORS['basic-slime'].baseEffect);
            
            // Tick to get growth
            state = tick(state);
            expect(state.biomass).toBe(GENERATORS['basic-slime'].baseEffect);
            
            // Click some more
            state = manualClick(state);
            expect(state.biomass).toBe(GENERATORS['basic-slime'].baseEffect + GAME_CONFIG.startingClickPower);
            
            // Buy click power upgrade
            const upgradeCost = UPGRADES['click-power'].cost;
            const upgradeClicks = Math.ceil(upgradeCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < upgradeClicks; i++) {
                state = manualClick(state);
            }
            state = buyUpgrade(state, 'click-power');
            
            const expectedClickPower = GAME_CONFIG.startingClickPower + UPGRADES['click-power'].effect;
            expect(state.clickPower).toBe(expectedClickPower);
            
            // Click with new power
            state = manualClick(state);
            expect(state.biomass).toBe(expectedClickPower);
        });

        it('should maintain state consistency across operations', () => {
            let state = gameState;
            
            // Perform various operations
            state = manualClick(state);
            state = buyGenerator(state, 'basic-slime'); // Should fail, not enough biomass
            state = manualClick(state);
            state = tick(state);
            
            // Verify state is consistent
            const expectedBiomass = GAME_CONFIG.startingBiomass + (GAME_CONFIG.startingClickPower * 2);
            expect(state.biomass).toBe(expectedBiomass);
            expect(state.growth).toBe(0);
            expect(state.clickPower).toBe(GAME_CONFIG.startingClickPower);
            expect(state.generators['basic-slime'].level).toBe(0);
        });

        it('should integrate nutrient consumption with game progression', () => {
            let state = gameState;
            const initialBiomass = state.biomass;
            const nutrient = state.nutrients[0];
            
            // Consume a nutrient
            state = consumeNutrient(state, nutrient.id);
            expect(state.biomass).toBe(initialBiomass + 1);
            
            // Click to get more biomass
            state = manualClick(state);
            expect(state.biomass).toBe(initialBiomass + 1 + GAME_CONFIG.startingClickPower);
            
            // Buy a generator with the extra biomass
            const generatorCost = GENERATORS['basic-slime'].baseCost;
            const clicksNeeded = Math.ceil(generatorCost / GAME_CONFIG.startingClickPower);
            
            for (let i = 0; i < clicksNeeded - 1; i++) { // -1 because we already have 1 extra from nutrient
                state = manualClick(state);
            }
            state = buyGenerator(state, 'basic-slime');
            
            expect(state.growth).toBe(GENERATORS['basic-slime'].baseEffect);
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