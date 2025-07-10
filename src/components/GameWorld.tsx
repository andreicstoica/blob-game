import React from "react";

interface GameWorldProps {
  zoom: number;
  children: React.ReactNode;
}

export const GameWorld: React.FC<GameWorldProps> = ({ zoom, children }) => {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};
