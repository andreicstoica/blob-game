import { getCurrentLevel } from '../engine/core/game';
import type { GameState } from '../engine/core/game';

export type NumberType = 'biomass' | 'cost' | 'rate' | 'power' | 'threshold' | 'owned';

export interface FormatOptions {
  type: NumberType;
  gameState?: GameState;
  forceFormat?: 'standard' | 'scientific' | 'decimal' | 'whole';
  maxDecimals?: number;
  showPlus?: boolean;
  compact?: boolean;
}

// Centralized number formatting utility for the blob game
// Handles different number types with appropriate formatting based on game context
export function formatNumber(value: number, options: FormatOptions): string {
  const {
    type,
    gameState,
    forceFormat,
    maxDecimals = 3,
    showPlus = false,
    compact = false
  } = options;

  const currentLevel = gameState ? getCurrentLevel(gameState) : null;
  
  // Determine the format to use based on number type
  let format: 'standard' | 'scientific' | 'decimal' | 'whole';
  
  if (forceFormat) {
    format = forceFormat;
  } else if (type === 'owned') {
    // Owned numbers should always be whole numbers
    format = 'whole';
  } else if (type === 'threshold') {
    // Threshold numbers should follow biomass formatting rules (not always whole)
    format = 'standard';
  } else if (type === 'power') {
    // Power numbers should use whole formatting (never decimals)
    format = 'whole';
  } else if (type === 'cost') {
    // Cost numbers should always be whole numbers
    format = 'whole';
  } else {
    // For biomass and rate, use level-appropriate formatting
    format = currentLevel?.biomassDisplayFormat || 'standard';
  }
  
  const adjustedValue = adjustValueForType(value, type, gameState);
  let formatted = formatNumberByType(adjustedValue, format, maxDecimals, compact, type);
  
  if (showPlus && adjustedValue > 0) {
    formatted = `+${formatted}`;
  }
  
  return formatted;
}

// Adjusts value based on number type and game context
function adjustValueForType(value: number, type: NumberType, gameState?: GameState): number {
  switch (type) {
    case 'biomass':
      return value;
    case 'cost':
      return value;
    case 'rate':
      return value;
    case 'power':  // Click power
      return value;
    case 'threshold':  // Level thresholds
      return value;
    case 'owned':  // Generator owned count - always integer
      return value;
    default:
      return value;
  }
}

// Formats a number according to the specified format type and number type
function formatNumberByType(
  value: number, 
  format: 'standard' | 'scientific' | 'decimal' | 'whole',
  maxDecimals: number,
  compact: boolean,
  numberType: NumberType
): string {
  switch (format) {
    case 'scientific':
      return value.toExponential(maxDecimals);
    
    case 'decimal':
      return formatDecimal(value, maxDecimals, numberType);
    
    case 'whole':
      return formatWhole(value, numberType);
    
    case 'standard':
    default:
      return formatStandard(value, numberType);
  }
}

// Format decimal numbers with type-specific rules
function formatDecimal(value: number, maxDecimals: number, numberType: NumberType): string {
  switch (numberType) {
    case 'biomass':
      // 1 decimal place until 1000, then integer until 10B, then large number format
      if (value < 1000) {
        return value.toFixed(1);
      } else if (value < 10_000_000_000) {
        return Math.floor(value).toLocaleString();
      } else {
        return formatLargeNumber(value, 2);
      }
    case 'rate':
    case 'power':
      // 1 decimal place until 100, then integer until 1M, then large number format
      if (value < 100) {
        return value.toFixed(1);
      } else if (value < 1_000_000) {
        return Math.floor(value).toLocaleString();
      } else {
        return formatLargeNumber(value, 2);
      }
    default:
      return value.toFixed(Math.min(maxDecimals, 2));
  }
}

// Format whole numbers with type-specific rules
function formatWhole(value: number, numberType: NumberType): string {
  const intValue = Math.floor(value);
  switch (numberType) {
    case 'cost':
      // Integer until 10B, then large number format with 1 decimal
      if (intValue < 10_000_000_000) {
        return intValue.toLocaleString();
      } else {
        return formatLargeNumber(intValue, 1);
      }
    case 'owned':
      // Always integer, no formatting
      return intValue.toString();
    case 'power':
      // Integer until 1M, then large number format with 2 decimals
      if (intValue < 1_000_000) {
        return intValue.toLocaleString();
      } else {
        return formatLargeNumber(intValue, 2);
      }
    case 'biomass':
      // Integer until 10B, then large number format with 2 decimals
      if (intValue < 10_000_000_000) {
        return intValue.toLocaleString();
      } else {
        return formatLargeNumber(intValue, 2);
      }
    case 'threshold':
      // Integer until 10B, then large number format with 2 decimals
      if (intValue < 10_000_000_000) {
        return intValue.toLocaleString();
      } else {
        return formatLargeNumber(intValue, 2);
      }
    default:
      return intValue.toLocaleString();
  }
}

// Format standard numbers with type-specific rules
function formatStandard(value: number, numberType: NumberType): string {
  switch (numberType) {
    case 'biomass':
    case 'threshold':
      // 1 decimal place until 1000, then integer until 10B, then large number format
      if (value < 1000) {
        return value.toFixed(1);
      } else if (value < 10_000_000_000) {
        return Math.floor(value).toLocaleString();
      } else {
        return formatLargeNumber(value, 2);
      }
    case 'rate':
    case 'power':
      // 1 decimal place until 100, then integer until 1M, then large number format
      if (value < 100) {
        return value.toFixed(1);
      } else if (value < 1_000_000) {
        return Math.floor(value).toLocaleString();
      } else {
        return formatLargeNumber(value, 2);
      }
    case 'cost':
      // Integer until 10B, then large number format with 1 decimal
      const intValue = Math.floor(value);
      if (intValue < 10_000_000_000) {
        return intValue.toLocaleString();
      } else {
        return formatLargeNumber(intValue, 1);
      }
    case 'owned':
      // Always integer, no formatting
      return Math.floor(value).toString();
    default:
      return value.toLocaleString();
  }
}

// American system large number names (from Britannica)
const LARGE_NUMBER_NAMES = [
  '', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 
  'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion',
  'Decillion', 'Undecillion', 'Duodecillion', 'Tredecillion', 'Quattuordecillion'
];

// Formats large numbers with proper naming (e.g., 1.17 Billion)
function formatLargeNumber(value: number, maxDecimals: number): string {
  if (value < 1000) {
    return value.toFixed(Math.min(maxDecimals, 2));
  }
  
  const exp = Math.floor(Math.log(value) / Math.log(1000));
  const scaled = value / Math.pow(1000, exp);
  const suffix = LARGE_NUMBER_NAMES[exp] || `10^${exp * 3}`;
  
  return scaled.toFixed(Math.min(maxDecimals, 2)) + ' ' + suffix;
}

// Formats large numbers in a compact way (e.g., 1.5K, 2.3M, 1.1B) - for smaller ranges
function formatCompact(value: number, maxDecimals: number): string {
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
  const base = 1000;
  
  if (value < base) {
    return value.toFixed(Math.min(maxDecimals, 2));
  }
  
  const exp = Math.min(Math.floor(Math.log(value) / Math.log(base)), suffixes.length - 1);
  const scaled = value / Math.pow(base, exp);
  const suffix = suffixes[exp];
  
  return scaled.toFixed(Math.min(maxDecimals, 2)) + suffix;
}

// Convenience functions for common formatting needs
export const NumberFormatter = {
  // Format biomass values with level-appropriate formatting
  biomass: (value: number, gameState?: GameState, options?: Partial<FormatOptions>) => 
    formatNumber(value, { type: 'biomass', gameState, ...options }),
  
  // Format cost values (typically whole numbers with commas)
  cost: (value: number, gameState?: GameState, options?: Partial<FormatOptions>) => 
    formatNumber(value, { type: 'cost', gameState, ...options }),
  
  // Format rate values (per-second, growth, etc.)
  rate: (value: number, gameState?: GameState, options?: Partial<FormatOptions>) => 
    formatNumber(value, { type: 'rate', gameState, showPlus: true, ...options }),
  
   // Format power values (click power, etc.)
  power: (value: number, gameState?: GameState, options?: Partial<FormatOptions>) => 
    formatNumber(value, { type: 'power', gameState, showPlus: true, ...options }),
  
   // Format threshold values (level requirements)
  threshold: (value: number, gameState?: GameState, options?: Partial<FormatOptions>) => 
    formatNumber(value, { type: 'threshold', gameState, ...options }),
  
  // Format owned counts (always integer, no formatting)
  owned: (value: number, gameState?: GameState, options?: Partial<FormatOptions>) => 
    formatNumber(value, { type: 'owned', gameState, ...options }),
  
  // Format any number with custom options
  custom: (value: number, options: FormatOptions) => formatNumber(value, options)
};

 