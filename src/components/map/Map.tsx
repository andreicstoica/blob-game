import { useMapSelector } from "../../game/systems/mapState";
import { calculateBlobPosition } from "../../game/systems/calculations";

interface MapProps {
  className?: string;
  zoom?: number;
}

export default function Map({ className, zoom = 1 }: MapProps) {
  const currentLevel = useMapSelector((s) => s.currentLevel);
  const blobPosition = calculateBlobPosition();

  // Calculate the transform origin as a percentage of the screen
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Transform origin should be at the blob position (as percentages)
  const transformOriginX = (blobPosition.x / screenWidth) * 100;
  const transformOriginY = (blobPosition.y / screenHeight) * 100;

  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundImage: `url(/assets/images/backgrounds/${currentLevel.background}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: `scale(${zoom})`,
        transformOrigin: `${transformOriginX}% ${transformOriginY}%`,
      }}
    />
  );
}
