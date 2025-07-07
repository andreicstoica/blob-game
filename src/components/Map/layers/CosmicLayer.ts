import { useEffect } from 'react'
import Noise from 'noisejs'

export default function CosmicLayer({ width, height }: { width: number; height: number }) {
    useEffect(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')!
        // quick procedural starfield
        const noise = new Noise(Math.random())
        for (let x = 0; x < width; x++)
            for (let y = 0; y < height; y++) {
                const v = noise.simplex2(x * 0.005, y * 0.005)
                if (v > 0.6) {
                    ctx.fillStyle = `rgba(255,255,255,${v})`
                    ctx.fillRect(x, y, 1, 1)
                }
            }
    }, [width, height])
    return null
}
