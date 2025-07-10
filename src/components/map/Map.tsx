import { useMapSelector } from "../../game/systems/mapState";

interface MapProps {
  className?: string;
  zoom?: number;
}

export default function Map({ className }: MapProps) {
  const currentLevel = useMapSelector((s) => s.currentLevel);

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        backgroundImage: `url(/assets/images/backgrounds/${currentLevel.background}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
