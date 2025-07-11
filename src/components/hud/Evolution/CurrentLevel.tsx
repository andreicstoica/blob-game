import React from "react";

interface CurrentLevelProps {
  displayName: string;
  name: string;
  description: string;
}

export const CurrentLevel: React.FC<CurrentLevelProps> = ({
  displayName,
  name,
  description,
}) => {
  // Styles
  const containerStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const titleStyle: React.CSSProperties = {
    margin: "0 0 4px 0",
    fontSize: "14px",
    color: "white",
    fontWeight: "bold"
  };

  const descriptionStyle: React.CSSProperties = {
    margin: "0",
    fontSize: "10px",
    opacity: 0.8,
    lineHeight: "1.3",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        Current: {displayName || name}
      </h3>
      
      <p style={descriptionStyle}>
        {description}
      </p>
    </div>
  );
};
