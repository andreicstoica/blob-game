import { immer } from 'zustand/middleware/immer'
import { create } from 'zustand'

export type CellStatus = 'empty' | 'nutrient' | 'slime'

export interface Cell {
    x: number
    y: number
    status: CellStatus
}

export interface MapState {
    phase: 'primordial' | 'colonial' | 'cosmic'
    size: 128                 // square grid, power of two
    cells: Cell[]             // flat array for speed
    /** helper to read cell idx = y*size + x */
    get: (x: number, y: number) => CellStatus
    set: (x: number, y: number, status: CellStatus) => void
    setPhase: (phase: 'primordial' | 'colonial' | 'cosmic') => void
}

export const useMap = create<MapState>()(
    immer(set => {
        // Flat array initialised to 'empty'
        const size = 128
        const cells: Cell[] = Array.from({ length: size ** 2 }, (_, i) => ({
            x: i % size,
            y: ~~(i / size),
            status: 'empty' as CellStatus,
        }))
        // sprinkle nutrients
        for (let i = 0; i < 300; i++)
            cells[Math.floor(Math.random() * cells.length)].status = 'nutrient'

        return {
            phase: 'primordial',
            size,
            cells,
            get: (x, y) => cells[y * size + x].status,
            set: (x, y, status) =>
                set(s => {
                    s.cells[y * size + x].status = status
                }),
            setPhase: (phase) =>
                set(s => {
                    s.phase = phase
                }),
        }
    })
)

/** Convenience selector */
export const useMapSelector = <T>(sel: (s: MapState) => T) => useMap(sel);