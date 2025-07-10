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
      speed: 75, // pixels per second
      padding: 25, // pixels from blob edge
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
      low: 0.01, // green threshold
      medium: 0.05, // yellow threshold
      high: 0.15, // orange threshold
      veryHigh: 0.3, // red threshold
    },
    colors: {
      lowContribution: "#16a34a", // darker green (least)
      mediumContribution: "#f59e0b", // yellow
      highContribution: "#f97316", // orange
      veryHighContribution: "#ef4444", // red
      maxContribution: "#a855f7", // purple/magenta (most)
    }
  }
}; 