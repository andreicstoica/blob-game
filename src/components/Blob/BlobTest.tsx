import React from 'react';
import Blob from './Blob';

export const BlobTest: React.FC = () => {
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
      <Blob 
        id="large-blob"
        size={200}
        position={{ x: 600, y: 300 }}
      />
    </div>
  );
};