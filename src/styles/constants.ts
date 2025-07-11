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

export const MILESTONES = [
    {
        id: "ant-size",
        biomassThreshold: 5000,
        message: "You're now the size of an ant! 🐜",
    },
    {
        id: "mouse-size",
        biomassThreshold: 100000,
        message: "You're as big as a mouse! 🐭",
    },
    {
        id: "human-size",
        biomassThreshold: 10000000,
        message: "You're as big as a human! 🧑",
    },
    {
        id: "car-size",
        biomassThreshold: 1200000000,
        message: "You're as large as an American car! 🚗",
    },
    {
        id: "house-size",
        biomassThreshold: 10000000000,
        message: "You're the size of a skyscraper! 🌃",
    },
    {
        id: "whale-size",
        biomassThreshold: 100000000000,
        message: "You're as big as a blue whale! 🐋",
    },
    {
        id: "eiffel-tower-size",
        biomassThreshold: 1000000000000,
        message: "You're as tall as the Eiffel Tower! 🗼",
    },
    {
        id: "nyc-block-size",
        biomassThreshold: 10000000000000,
        message: "You're the size of a NYC block! 🏙️",
    },
    {
        id: "mountain-size",
        biomassThreshold: 100000000000000,
        message: "You're as big as Mount Everest! 🏔️",
    },
    {
        id: "monaco-size",
        biomassThreshold: 10000000000000000,
        message: "You're as big as Monaco! 🌍",
    },
    {
        id: "jupiter-size",
        biomassThreshold: 1000000000000000000,
        message: "You're as big as Jupiter! 🪐",
    },
    {
        id: "solar-system-size",
        biomassThreshold: 1000000000000000000000,
        message: "You're the size of the solar system! 🌌",
    },
] as const;
