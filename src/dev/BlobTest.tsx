import React from 'react';
import Blob from '../game/blob/Blob';
import { GAME_CONFIG } from '../engine/content/content';

interface BlobTestProps {
  onBlobClick?: () => void;
  biomass: number;
}

export const BlobTest: React.FC<BlobTestProps> = ({ onBlobClick, biomass }) => {
  // Calculate blob size based on biomass using config
  const blobSize = Math.max(
    GAME_CONFIG.minBlobSize, 
    Math.min(GAME_CONFIG.maxBlobSize, biomass * GAME_CONFIG.blobSizeMultiplier)
  );

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Blob 
        id="small-blob"
        size={50}
        position={{ x: 200, y: 200 }}
      />
      <Blob 
        id="medium-blob"
        size={100}
        position={{ x: 400, y: 200 }}
      />
      <div 
        onClick={onBlobClick}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <Blob 
          id="main-blob"
          size={blobSize}
          position={{ x: blobSize/2, y: blobSize/2 }}
        />
      </div>
    </div>
  );
};