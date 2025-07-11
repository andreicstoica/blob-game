import brownBacteria from "/assets/images/particles/bacteria/brown-bacteria.png";
import greenBacteria from "/assets/images/particles/bacteria/green-bacteria.png";
import purpleBacteria from "/assets/images/particles/bacteria/purple-bacteria.png";
import galaxy1 from "/assets/images/particles/galaxies/galaxy-1.png";
import galaxy2 from "/assets/images/particles/galaxies/galaxy-2.webp";
import mouse1 from "/assets/images/particles/mice/mouse-1.png";
import mouse2 from "/assets/images/particles/mice/mouse-2.png";
import mouse3 from "/assets/images/particles/mice/mouse-3.png";
import spaceship1 from "/assets/images/particles/spaceships/spaceship-1.png";
import spaceship2 from "/assets/images/particles/spaceships/spaceship-2.png";
import spaceship3 from "/assets/images/particles/spaceships/spaceship-3.png";
import tank1 from "/assets/images/particles/tanks/tank-1.png";
import tank2 from "/assets/images/particles/tanks/tank-2.png";
import tank3 from "/assets/images/particles/tanks/tank-3.png";
import person1 from "/assets/images/particles/people/person-1.png";
import person2 from "/assets/images/particles/people/person-2.png";

export const VISUAL_ASSETS = {
    circle: [],
    bacteria: [brownBacteria, greenBacteria, purpleBacteria],
    mice: [mouse1, mouse2, mouse3],
    spaceships: [spaceship1, spaceship2, spaceship3],
    tanks: [tank1, tank2, tank3],
    galaxies: [galaxy1, galaxy2],
    people: [person1, person2],
};

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
