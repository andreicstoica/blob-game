import React from "react";
import type { BlobProps } from "../../game/types";
import Blob from "./Blob";
import { calculateBlobPosition } from "../../game/systems/calculations";

interface BlobContainerProps extends Omit<BlobProps, 'position'> {
  zoomRate?: number;
  currentZoom?: number;
}

export const BlobContainer: React.FC<BlobContainerProps> = ({
  zoomRate = 1,
  currentZoom = 1,
  onAnimationStateChange,
  ...blobProps
}) => {
  const blobPosition = calculateBlobPosition();
  
  return (
    <div
      className="absolute cursor-pointer select-none"
      style={{
        left: `${blobPosition.x}px`,
        top: `${blobPosition.y}px`,
        transform: `translate(-50%, -50%) scale(${zoomRate / currentZoom})`,
        zIndex: 70,
      }}
    >
      <Blob {...blobProps} position={{ x: 0, y: 0 }} onAnimationStateChange={onAnimationStateChange} />
    </div>
  );
};
