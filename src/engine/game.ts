export interface SlimeState {
    size: number
    type: string
}

export interface UpgradeState {
    id: string
    name: string
    cost: number
    description: string
    effect: number
    type: 'income' | 'split' | 'click' | 'slime'
}

export interface GameState {
    slimes: SlimeState[]
    biomass: number
    income: number
    upgrades: Record<string, UpgradeState>
}

export const initialGameState: GameState = {
    slimes: [],
    biomass: 0,
    income: 0,
    upgrades: {
        'basic-income': {
            id: 'basic-income',
            name: 'Basic Income',
            cost: 10,
            description: 'Increases income by 0.1/s',
            effect: 0.1,
            type: 'income',
        },
    },
}

export function tick(state: GameState): GameState {
    return {
        ...state,
        biomass: state.biomass + state.income,
    }
}

export function manualClick(state: GameState): GameState {
    return {
        ...state,
        biomass: state.biomass + 1,
    }
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
    const upgrade = state.upgrades[upgradeId];
    if (state.biomass >= upgrade.cost) {
        return {
            ...state,
            biomass: state.biomass - upgrade.cost,
            income: state.income + upgrade.effect,
        }
    }
    return state;
}