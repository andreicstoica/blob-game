export const GAME_CONFIG = {
  startingBiomass: 1,
  startingClickPower: 1,
  tickRate: 100, // milliseconds
  maxBlobSize: 400,
  minBlobSize: 50,
  blobSizeMultiplier: 10,
  // Generator visualization settings
  generatorVisualization: {
    // Legacy settings (for backward compatibility)
    ringRadius: 30, // pixels from blob center
    emojiSize: 16, // font size in pixels
    hudWidth: 350, // left HUD width
    rightHudWidth: 350, // right HUD width (if any)
    floatingNumberInterval: 1000, // milliseconds between floating numbers
    
    // New movement system settings
    movement: {
      speed: 5, // pixels per second
      padding: 10, // pixels from blob edge
    },
    stacking: {
      maxIndividualGenerators: 100,
      maxFloatingNumbersPerSecond: 100,
    },
    display: {
      currentLevelSize: 16, // font size
      stackedLevelSize: 14, // font size
      countOverlaySize: 10, // font size for "x15"
    },
    contributionThresholds: {
      low: 0.01, // red threshold
      medium: 0.05, // yellow threshold
    },
    colors: {
      highContribution: "#4ade80", // green
      mediumContribution: "#f59e0b", // yellow
      lowContribution: "#ef4444", // red
    }
  }
}; 