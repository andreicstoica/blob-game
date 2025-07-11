// Standardized Color Palette for Blob Game
// These colors should be used consistently across the application

export const Colors = {
  // Biomass & Growth - Green
  biomass: {
    primary: '#4ade80',    // Main green for biomass/growth
    secondary: '#22c55e',  // Darker green for hover states
    light: '#86efac',      // Light green for subtle elements
    dark: '#16a34a',       // Dark green for emphasis
  },

  // Shop & Tutorial - Blue
  shop: {
    primary: '#3b82f6',    // Main blue for shop elements
    secondary: '#2563eb',  // Darker blue for hover states
    light: '#93c5fd',      // Light blue for subtle elements
    dark: '#1d4ed8',       // Dark blue for emphasis
  },

  // Evolution & Levels - Yellow/Gold
  evolution: {
    primary: '#fbbf24',    // Main gold for evolution/levels
    secondary: '#f59e0b',  // Darker gold for hover states
    light: '#fcd34d',      // Light gold for subtle elements
    dark: '#d97706',       // Dark gold for emphasis
  },

  // Generators - Bright Magenta
  generators: {
    primary: '#e91e63',    // Brighter magenta for generators
    secondary: '#c2185b',  // Darker magenta for hover states
    light: '#f8bbd9',      // Light magenta for subtle elements
    dark: '#ad1457',       // Dark magenta for emphasis
  },

  // Upgrades - Dark Purple/Magenta
  upgrades: {
    primary: '#9333ea',    // Dark purple for upgrades
    secondary: '#7c3aed',  // Darker purple for hover states
    light: '#a855f7',      // Light purple for subtle elements
    dark: '#6b21a8',       // Dark purple for emphasis
  },

  // Tutorial - Purple (special case)
  tutorial: {
    primary: '#9333ea',    // Purple for tutorial items
    secondary: '#7c3aed',  // Darker purple for hover states
    light: '#a855f7',      // Light purple for subtle elements
    dark: '#6b21a8',       // Dark purple for emphasis
  },

  // Headlines - Red (for future feature)
  headlines: {
    primary: '#ef4444',    // Red for headlines
    secondary: '#dc2626',  // Darker red for hover states
    light: '#f87171',      // Light red for subtle elements
    dark: '#b91c1c',       // Dark red for emphasis
    darker: '#991b1b',     // Even darker red for unaffordable items
    medium: '#d32f2f',     // Medium red for unaffordable items (between primary and darker)
  },

  // Neutral colors
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },

  // Background colors
  background: {
    primary: 'rgba(0, 0, 0, 0.5)',
    secondary: 'rgba(255, 255, 255, 0.1)',
    tertiary: 'rgba(255, 255, 255, 0.05)',
  }
} as const;

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}; 