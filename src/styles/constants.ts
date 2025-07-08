export const PHASE_BG_GRADIENT = {
    intro: {
        dark: 'linear-gradient(160deg,#e0c3fc,#8ec5fc)',
        light: 'linear-gradient(160deg,#f0e9e1,#b3c6e0)'
    },
    microscope: {
        dark: 'linear-gradient(160deg,#5fa8d3,#b2e0f7)',
        light: 'linear-gradient(160deg,#e6f7ff,#b2e0f7)'
    },
    petri: {
        dark: 'linear-gradient(160deg,#b3c6e0,#7a8fa6)',
        light: 'linear-gradient(160deg,#f0e9e1,#b3c6e0)'
    },
    lab: {
        dark: 'linear-gradient(160deg,#a084ca,#e0c3fc)',
        light: 'linear-gradient(160deg,#f5f5dc,#e0c3fc)'
    },
    city: {
        dark: 'linear-gradient(160deg,#6c7a89,#b0b8c1)',
        light: 'linear-gradient(160deg,#e0e7ef,#b0b8c1)'
    },
    earth: {
        dark: 'linear-gradient(160deg,#2b5876,#4e4376)',
        light: 'linear-gradient(160deg,#c9ffbf,#ffafbd)'
    },
    sunSolarSystem: {
        dark: 'linear-gradient(160deg,#f7971e,#ffd200)',
        light: 'linear-gradient(160deg,#fceabb,#f8b500)'
    }
} as const

export type Phase = keyof typeof PHASE_BG_GRADIENT
