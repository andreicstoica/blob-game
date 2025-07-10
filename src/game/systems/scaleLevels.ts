import type { ScaleLevel } from '../types';

export const getScaleLevel = (biomass: number): ScaleLevel => {
  if (biomass < 30) {
    return {
      name: "Atomic",
      description: "Individual atoms and molecules",
      unit: "1-10 nm",
      color: "#10b981",
      icon: "⚛️",
    };
  } else if (biomass < 300) {
    return {
      name: "Molecular",
      description: "Complex molecules and compounds",
      unit: "10-100 nm",
      color: "#3b82f6",
      icon: "🧬",
    };
  } else if (biomass < 3000) {
    return {
      name: "Cellular",
      description: "Individual cells and organelles",
      unit: "0.1-1 μm",
      color: "#8b5cf6",
      icon: "🔬",
    };
  } else if (biomass < 30000) {
    return {
      name: "Tissue",
      description: "Cell clusters and tissues",
      unit: "1-10 μm",
      color: "#f59e0b",
      icon: "🦠",
    };
  } else if (biomass < 300000) {
    return {
      name: "Organ",
      description: "Organs and small organisms",
      unit: "1-10 mm",
      color: "#ef4444",
      icon: "🐛",
    };
  } else if (biomass < 3000000) {
    return {
      name: "Organism",
      description: "Complete living beings",
      unit: "10 cm - 1 m",
      color: "#84cc16",
      icon: "🐕",
    };
  } else if (biomass < 30000000) {
    return {
      name: "Building",
      description: "Structures and buildings",
      unit: "1-100 m",
      color: "#06b6d4",
      icon: "🏢",
    };
  } else if (biomass < 300000000) {
    return {
      name: "City",
      description: "Urban areas and districts",
      unit: "100 m - 10 km",
      color: "#f97316",
      icon: "🏙️",
    };
  } else if (biomass < 3000000000) {
    return {
      name: "Regional",
      description: "States and provinces",
      unit: "10-1000 km",
      color: "#a855f7",
      icon: "🗺️",
    };
  } else if (biomass < 30000000000) {
    return {
      name: "Continental",
      description: "Continents and large landmasses",
      unit: "1000-10000 km",
      color: "#ec4899",
      icon: "🌎",
    };
  } else if (biomass < 300000000000) {
    return {
      name: "Planetary",
      description: "Planets and moons",
      unit: "10000-100000 km",
      color: "#14b8a6",
      icon: "🌍",
    };
  } else if (biomass < 3000000000000) {
    return {
      name: "Stellar",
      description: "Stars and solar systems",
      unit: "100000-1000000 km",
      color: "#fbbf24",
      icon: "⭐",
    };
  } else if (biomass < 30000000000000) {
    return {
      name: "Galactic",
      description: "Galaxies and star clusters",
      unit: "1-100 light years",
      color: "#8b5cf6",
      icon: "🌌",
    };
  } else {
    return {
      name: "Cosmic",
      description: "Intergalactic structures",
      unit: "100+ light years",
      color: "#6366f1",
      icon: "🌌",
    };
  }
}; 