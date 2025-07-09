export interface UpgradeState {
  id: string;
  name: string;
  cost: number;
  description: string;
  effect: number;
  type: 'growth' | 'split' | 'click' | 'blob';
  purchased: boolean;
  unlockedAtLevel: string;
}

export interface UpgradeConfig {
  id: string;
  name: string;
  cost: number;
  description: string;
  effect: number;
  type: 'growth' | 'split' | 'click' | 'blob';
  unlockedAtLevel: string;
} 