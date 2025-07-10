import { useState } from "react";
import { useMapSelector } from "../../game/systems/mapState";
import { LEVELS } from "../../game/content/levels";
import Map from "./Map";

export default function CycleMaps() {
  const [isDark, setIsDark] = useState(true);
  const currentLevel = useMapSelector((s) => s.currentLevel);
  const setLevel = useMapSelector((s) => s.setLevel);

  const nextLevel = () => {
    const currentIndex = LEVELS.findIndex(level => level.name === currentLevel.name);
    const nextIndex = (currentIndex + 1) % LEVELS.length;
    setLevel(LEVELS[nextIndex]);
  };

  return (
    <div className="h-full w-full relative">
      {/* Your app content here */}
      <Map className="w-full h-screen" />

      {/* Controls in top right */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {/* Level change button */}
        <button
          onClick={nextLevel}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white border border-white/20 hover:bg-white/20 transition-colors"
          title={`${currentLevel.displayName} - ${currentLevel.description}`}
        >
          {currentLevel.displayName}
        </button>

        {/* Debugger: Next Level */}
        <button
          onClick={nextLevel}
          className="px-4 py-2 bg-red-500/80 backdrop-blur-sm rounded-lg text-white border border-red-500/40 hover:bg-red-600/80 transition-colors"
          title={`Current: ${currentLevel.name} (ID: ${currentLevel.id})`}
        >
          Next Level
        </button>

        {/* Light/Dark toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white border border-white/20 hover:bg-white/20 transition-colors"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}
