import { useState } from "react";
import PhaseBackground from "./components/PhaseBackground";
import Map from "./components/Map/Map";
import { useMap, useMapSelector } from "./engine/mapState";

function App() {
  const [isDark, setIsDark] = useState(true);
  const phase = useMapSelector((s) => s.phase);
  const setPhase = useMap((s) => s.setPhase);

  const phases: Array<"primordial" | "colonial" | "cosmic"> = [
    "primordial",
    "colonial",
    "cosmic",
  ];
  const phaseNames = {
    primordial: "🧫",
    colonial: "🌍",
    cosmic: "🌌",
  };

  const nextPhase = () => {
    const currentIndex = phases.indexOf(phase);
    const nextIndex = (currentIndex + 1) % phases.length;
    setPhase(phases[nextIndex]);
  };

  return (
    <div className="h-full w-full relative">
      {/* Set background gradient based on game phase and mode */}
      <PhaseBackground mode={isDark ? "dark" : "light"} />

      {/* Your app content here */}
      <Map className="w-full h-screen" />

      {/* Controls in top right */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {/* Phase change button */}
        <button
          onClick={nextPhase}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white border border-white/20 hover:bg-white/20 transition-colors"
        >
          {phaseNames[phase]}
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

export default App;
