import React from 'react';

interface CurrentLevelProps {
  displayName: string;
  name: string;
  description: string;
}

export const CurrentLevel: React.FC<CurrentLevelProps> = ({ displayName, name, description }) => (
  <div
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
    }}
  >
    <h3
      style={{
        margin: "0 0 10px 0",
        fontSize: "18px",
        color: "white",
      }}
    >
      Current Level: {displayName || name}
    </h3>
    <p
      style={{
        margin: "0",
        fontSize: "14px",
        opacity: 0.8,
      }}
    >
      {description}
    </p>
  </div>
); 