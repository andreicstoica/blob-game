export const GAME_CONFIG = {
  startingBiomass: 1,
  startingClickPower: 1,
  tickRate: 100, // milliseconds
  maxBlobSize: 400,
  minBlobSize: 50,
  blobSizeMultiplier: 10,
  // Generator visualization settings
  generatorVisualization: {
    ringRadius: 30, // pixels from blob center
    emojiSize: 16, // font size in pixels
    hudWidth: 350, // left HUD width
    rightHudWidth: 350, // right HUD width (if any)
    floatingNumberInterval: 1000, // milliseconds between floating numbers
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