import React from "react";
import type { GeneratorVisualization } from "../../game/types/ui";

interface GeneratorElementProps {
  generator: GeneratorVisualization;
}

// This component is no longer needed since we're only showing floating numbers
// Keeping the file for potential future use
export const GeneratorElement: React.FC<GeneratorElementProps> = () => {
  return null;
}; 