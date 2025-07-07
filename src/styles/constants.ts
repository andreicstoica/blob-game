export const PHASE_BG_GRADIENT = {
    primordial: {
        dark: 'linear-gradient(160deg,var(--bg-prim-start),var(--bg-prim-end))',
        light: 'linear-gradient(160deg,var(--bg-prim-light-start),var(--bg-prim-light-end))'
    },
    colonial: {
        dark: 'linear-gradient(160deg,var(--bg-col-start),var(--bg-col-end))',
        light: 'linear-gradient(160deg,var(--bg-col-light-start),var(--bg-col-light-end))'
    },
    cosmic: {
        dark: 'linear-gradient(160deg,var(--bg-cos-start),var(--bg-cos-end))',
        light: 'linear-gradient(160deg,var(--bg-cos-light-start),var(--bg-cos-light-end))'
    }
} as const

export type Phase = keyof typeof PHASE_BG_GRADIENT
