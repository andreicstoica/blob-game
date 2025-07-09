export interface Level {
  id: number;
  name: string;
  displayName: string;
  biomassThreshold: number;
  biomassDisplayFormat: 'standard' | 'scientific' | 'decimal' | 'whole';
  background: string;
  foodTypes: string[];
  description: string;
}

export interface ScaleLevel {
  name: string;
  description: string;
  unit: string;
  color: string;
  icon: string;
} 