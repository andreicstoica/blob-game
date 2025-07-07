import { useEffect } from 'react'
import { useMap, useMapSelector } from '../engine/mapState'

const COLORS = {
    empty: '#1e1e1e',
    nutrient: '#ffd866',
    slime: '#44ff66',
}

export default function PetriLayer({ width, height }: { width: number; height: number }) {
    const size = useMapSelector(s => s.size)
    const cells = useMapSelector(s => s.cells)

    useEffect(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')!
        const cellPx = Math.floor(width / size)

        function draw() {
            // Cheap full-grid redraw (fine for 128²)
            cells.forEach(cell => {
                ctx.fillStyle = COLORS[cell.status]
                ctx.fillRect(cell.x * cellPx, cell.y * cellPx, cellPx, cellPx)
            })
            requestAnimationFrame(draw)
        }
        draw()
    }, [cells, size, width, height])

    /* handle clicks → attempt to feed slime */
    useEffect(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement
        function onClick(e: MouseEvent) {
            const rect = canvas.getBoundingClientRect()
            const x = Math.floor(((e.clientX - rect.left) / width) * size)
            const y = Math.floor(((e.clientY - rect.top) / height) * size)
            const status = useMap.getState().get(x, y)
            if (status === 'nutrient') useMap.getState().set(x, y, 'empty')
        }
        canvas.addEventListener('click', onClick)
        return () => canvas.removeEventListener('click', onClick)
    }, [size, width, height])

    return null // layer draws straight to the canvas
}
