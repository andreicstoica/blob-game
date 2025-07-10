import type { ScaleLevel } from '../types';

export const getScaleLevel = (biomass: number): ScaleLevel => {
  if (biomass < 1) {
    return {
      name: "Primordial",
      description: "The very beginning of existence",
      unit: "Pre-cellular",
      color: "#10b981",
      icon: "⚪",
    };
  } else if (biomass < 2500) {
    return {
      name: "Microscopic",
      description: "Single cells and microorganisms",
      unit: "1-10 μm",
      color: "#3b82f6",
      icon: "🦠",
    };
  } else if (biomass < 2250000) {
    return {
      name: "Petri Scale",
      description: "Visible colonies and cultures",
      unit: "10-100 μm",
      color: "#8b5cf6",
      icon: "🔍",
    };
  } else if (biomass < 50000000) {
    return {
      name: "Laboratory",
      description: "Experimental scale organisms",
      unit: "0.1-1 mm",
      color: "#f59e0b",
      icon: "🧪",
    };
  } else if (biomass < 800000000) {
    return {
      name: "Neighborhood",
      description: "Community-scale spread",
      unit: "1-100 m",
      color: "#ef4444",
      icon: "🏘️",
    };
  } else if (biomass < 15000000000) {
    return {
      name: "Urban",
      description: "City-wide influence",
      unit: "100 m - 10 km",
      color: "#84cc16",
      icon: "🏙️",
    };
  } else if (biomass < 300000000000) {
    return {
      name: "Continental",
      description: "Continent-spanning presence",
      unit: "10-1000 km",
      color: "#06b6d4",
      icon: "🗺️",
    };
  } else if (biomass < 100000000000000) {
    return {
      name: "Planetary",
      description: "Planet-wide dominance",
      unit: "1000-10000 km",
      color: "#f97316",
      icon: "🌍",
    };
  } else {
    return {
      name: "Cosmic",
      description: "Solar system and beyond",
      unit: "10000+ km",
      color: "#8b5cf6",
      icon: "🚀",
    };
  }
}; 