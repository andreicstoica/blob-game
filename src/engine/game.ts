export interface SlimeState {
    size: number;
    type: string;
}

export interface GameState {
    slimes: SlimeState[];
    biomass: number;
    income: number;
}

export const initialGameState: GameState = {
    slimes: [],
    biomass: 0,
    income: 0,
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