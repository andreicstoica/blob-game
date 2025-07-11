import React from "react";
import type { GeneratorVisualization } from "../../game/types/ui";

interface StackedGeneratorElementProps {
  generator: GeneratorVisualization;
  blobSize: number; // Add blobSize prop
}

// This component is no longer needed since we're only showing floating numbers
// Keeping the file for potential future use

// export const StackedGeneratorElement: React.FC<StackedGeneratorElementProps> = ({ generator, blobSize }) => {
//   const { display } = GAME_CONFIG.generatorVisualization;
//   const blobPosition = calculateBlobPosition();
  
//   const x = blobPosition.x + generator.position.x;
//   const y = blobPosition.y + generator.position.y;

//   // Calculate if generator is inside the blob
//   const blobRadius = blobSize * 0.35;
//   const distanceFromCenter = Math.sqrt(
//     generator.position.x * generator.position.x + 
//     generator.position.y * generator.position.y
//   );
//   const isInsideBlob = distanceFromCenter < blobRadius;
  
//   // Calculate opacity based on distance from blob edge
//   let opacity = 1;
//   if (isInsideBlob) {
//     // Inside blob: apply opacity based on depth
//     const depthRatio = distanceFromCenter / blobRadius; // 0 = center, 1 = edge
//     opacity = 0.3 + (depthRatio * 0.4); // 0.3 at center, 0.7 at edge
//   }

//   return (
//     <div
//       className="absolute"
//       style={{
//         left: x,
//         top: y,
//         transform: "translate(-50%, -50%)",
//         fontSize: `${display.stackedLevelSize}px`,
//         lineHeight: 1,
//         pointerEvents: "auto",
//         userSelect: "none",
//         color: "#000",
//         textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
//         zIndex: isInsideBlob ? 70 : 80, // Lower z-index when inside blob
//         cursor: "help",
//         opacity: opacity,
//         transition: "opacity 0.3s ease", // Smooth opacity transitions
//       }}
//       title={`${generator.emoji} (${generator.count} total from previous levels)`}
//     >
//       <div style={{ position: 'relative' }}>
//         {generator.emoji}
//         <div
//           style={{
//             position: 'absolute',
//             top: '-8px',
//             right: '-8px',
//             fontSize: `${display.countOverlaySize}px`,
//             backgroundColor: 'rgba(0, 0, 0, 0.8)',
//             color: 'white',
//             borderRadius: '50%',
//             width: '16px',
//             height: '16px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             lineHeight: 1,
//           }}
//         >
//           {generator.count}
//         </div>
//       </div>
//     </div>
//   );

}; 