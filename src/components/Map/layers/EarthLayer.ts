import { useEffect } from 'react'
import mapImg from '../../../assets/world-map.jpg'

export default function EarthLayer({ width, height }: { width: number; height: number }) {
    useEffect(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')!
        const img = new Image()
        img.src = mapImg
        img.onload = () => ctx.drawImage(img, 0, 0, width, height)
        // TODO: draw slime overlay using lat/long → x,y
    }, [width, height])

    return null
}
