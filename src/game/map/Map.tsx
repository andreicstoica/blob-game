import { useMapSelector } from "../../engine/systems/mapState";

interface MapProps {
  className?: string;
}

export default function Map({ className }: MapProps) {
  const currentLevel = useMapSelector((s) => s.currentLevel);

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        backgroundImage: `url(/src/assets/background-images/${currentLevel.background}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
