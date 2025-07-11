import React from "react";
import type { GeneratorVisualization } from "../../game/types/ui";

interface StackedGeneratorElementProps {
  generator: GeneratorVisualization;
}

// This component is no longer needed since we're only showing floating numbers
// Keeping the file for potential future use
export const StackedGeneratorElement: React.FC<StackedGeneratorElementProps> = () => {
  return null;
}; 