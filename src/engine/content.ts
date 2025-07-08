import type { GeneratorState, UpgradeState } from './game';

export const GENERATORS: Record<string, Omit<GeneratorState, 'level'>> = {
  'basic-generator': {
    id: 'basic-generator',
    name: 'Basic Generator',
    baseCost: 15,
    description: 'Generates 0.1 biomass per second',
    baseEffect: 0.1,
    costMultiplier: 1.15
  },
  'farm': {
    id: 'farm',
    name: 'Farm',
    baseCost: 100,
    description: 'Generates 1 biomass per second',
    baseEffect: 1,
    costMultiplier: 1.15
  },
  'factory': {
    id: 'factory',
    name: 'Factory',
    baseCost: 1100,
    description: 'Generates 8 biomass per second',
    baseEffect: 8,
    costMultiplier: 1.15
  },
  'mine': {
    id: 'mine',
    name: 'Mine',
    baseCost: 12000,
    description: 'Generates 47 biomass per second',
    baseEffect: 47,
    costMultiplier: 1.15
  },
  'shipment': {
    id: 'shipment',
    name: 'Shipment',
    baseCost: 130000,
    description: 'Generates 260 biomass per second',
    baseEffect: 260,
    costMultiplier: 1.15
  }
};

export const UPGRADES: Record<string, Omit<UpgradeState, 'purchased'>> = {
  'click-power': {
    id: 'click-power',
    name: 'Click Power',
    cost: 50,
    description: 'Doubles your click power',
    effect: 1,
    type: 'click'
  },
  'efficient-generators': {
    id: 'efficient-generators',
    name: 'Efficient Generators',
    cost: 500,
    description: 'Each basic generator gives +0.1 biomass/s',
    effect: 0.1,
    type: 'growth'
  }
};

export const GAME_CONFIG = {
  startingBiomass: 1,
  startingClickPower: 1,
  tickRate: 100, // milliseconds
  maxBlobSize: 400,
  minBlobSize: 50,
  blobSizeMultiplier: 10
}; 