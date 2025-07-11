import { useMapSelector } from "../../game/systems/mapState";
import { calculateBlobPosition } from "../../game/systems/calculations";

interface MapProps {
  className?: string;
  zoom?: number;
}

export default function Map({ className, zoom = 1 }: MapProps) {
  const currentLevel = useMapSelector((s) => s.currentLevel);
  const blobPosition = calculateBlobPosition();

  // Calculate the offset needed to keep the blob centered during zoom
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Calculate how much to offset the background to keep blob position stable
  const offsetX = (blobPosition.x - screenWidth / 2) * (1 - zoom);
  const offsetY = (blobPosition.y - screenHeight / 2) * (1 - zoom);

  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundImage: `url(/assets/images/backgrounds/${currentLevel.background}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
        transformOrigin: "center center",
      }}
    />
  );
}
