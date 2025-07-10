import type { GameState, GeneratorEmoji } from '../types';
import { GENERATORS } from '../content/generators';
import { GAME_CONFIG } from '../content/config';
import { getTotalGrowth } from './calculations';

export interface ScreenLayout {
  centerX: number;
  centerY: number;
  playableWidth: number;
}

export interface FloatingNumberData {
  x: number;
  y: number;
  value: number;
  color: string;
}

/**
 * Calculate screen layout dimensions
 */
export function calculateScreenLayout(): ScreenLayout {
  const { hudWidth, rightHudWidth } = GAME_CONFIG.generatorVisualization;
  const playableWidth = window.innerWidth - hudWidth - rightHudWidth;
  const centerX = hudWidth + playableWidth / 2;
  const centerY = window.innerHeight / 2;
  
  return { centerX, centerY, playableWidth };
}

/**
 * Calculate generator emoji positions and data
 */
export function calculateGeneratorEmojis(gameState: GameState): GeneratorEmoji[] {
  const emojis: GeneratorEmoji[] = [];

  // Get all generators with count > 0
  Object.values(gameState.generators).forEach((generator) => {
    if (generator.level > 0) {
      const generatorData = GENERATORS[generator.id];
      if (generatorData) {
        // Extract emoji from generator name
        const emoji = generatorData.name.split(" ")[0] || "⚪";

        // Create one emoji for each generator purchased
        for (let i = 0; i < generator.level; i++) {
          emojis.push({
            generatorId: generator.id,
            emoji,
            angle: 0, // Will be calculated below
            count: generator.level,
            name: generatorData.name,
          });
        }
      }
    }
  });

  // Calculate angles for positioning
  emojis.forEach((emoji, index) => {
    emoji.angle = (index / emojis.length) * 2 * Math.PI;
  });

  return emojis;
}

/**
 * Calculate floating number data for a generator emoji
 */
export function calculateFloatingNumberData(
  emoji: GeneratorEmoji,
  gameState: GameState,
  screenLayout: ScreenLayout
): FloatingNumberData | null {
  const generator = gameState.generators[emoji.generatorId];
  if (!generator || generator.baseEffect <= 0) {
    return null;
  }

  const { ringRadius, contributionThresholds, colors } = GAME_CONFIG.generatorVisualization;
  
  // Calculate position for floating numbers
  const x = screenLayout.centerX + Math.cos(emoji.angle) * ringRadius;
  const y = screenLayout.centerY + Math.sin(emoji.angle) * ringRadius;

  const individualGrowth = generator.baseEffect;

  // Determine color based on contribution
  const totalGrowth = getTotalGrowth(gameState);
  const contributionRatio = individualGrowth / totalGrowth;
  
  let color = colors.highContribution; // Default green

  if (contributionRatio < contributionThresholds.low) {
    color = colors.lowContribution; // Red for low contribution
  } else if (contributionRatio < contributionThresholds.medium) {
    color = colors.mediumContribution; // Yellow for medium contribution
  }

  return { x, y, value: individualGrowth, color };
}

/**
 * Calculate all floating number data for current generators
 */
export function calculateAllFloatingNumberData(
  generatorEmojis: GeneratorEmoji[],
  gameState: GameState
): FloatingNumberData[] {
  const screenLayout = calculateScreenLayout();
  const floatingNumbers: FloatingNumberData[] = [];

  generatorEmojis.forEach((emoji) => {
    const data = calculateFloatingNumberData(emoji, gameState, screenLayout);
    if (data) {
      floatingNumbers.push(data);
    }
  });

  return floatingNumbers;
} 