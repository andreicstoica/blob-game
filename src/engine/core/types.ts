export interface BlobState {
    size: number
}

export interface NutrientState {
    id: string
    x: number
    y: number
    consumed: boolean
}

export interface GeneratorState {
    id: string
    name: string
    baseCost: number
    description: string
    baseEffect: number
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

export interface GameState {
    blobs: BlobState[]
    biomass: number
    growth: number
    clickPower: number
    generators: Record<string, GeneratorState>
    upgrades: Record<string, UpgradeState>
    nutrients: NutrientState[]
    currentLevelId: number
    highestLevelReached: number
} 