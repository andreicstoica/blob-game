import { useEffect, useState } from 'react'

export default function usePanZoom(ref: React.RefObject<HTMLCanvasElement>) {
    const [dims, setDims] = useState({ width: 600, height: 600 })
    useEffect(() => {
        function resize() {
            if (!ref.current) return
            const { clientWidth, clientHeight } = ref.current.parentElement!
            setDims({ width: clientWidth, height: clientHeight })
        }
        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [ref])
    /* TODO: add mouse wheel zoom and drag panning later */
    return dims
}
