import React from "react";
import Blob from "./Blob";
import type { BlobProps } from "../../game/types";

interface BlobContainerProps extends Omit<BlobProps, "position"> {
  zoomRate?: number;
  currentZoom?: number;
}

export const BlobContainer: React.FC<BlobContainerProps> = ({
  zoomRate = 1,
  currentZoom = 1,
  ...blobProps
}) => {
  return (
    <div
      className="absolute cursor-pointer select-none"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${zoomRate / currentZoom})`,
        zIndex: 70,
      }}
    >
      <Blob {...blobProps} position={{ x: 0, y: 0 }} />
    </div>
  );
};
