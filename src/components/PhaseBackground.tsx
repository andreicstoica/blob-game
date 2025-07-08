import { useEffect } from "react";
import { useMapSelector } from "../engine/mapState";
import { PHASE_BG_GRADIENT } from "../styles/constants";

export default function PhaseBackground({ mode }: { mode: "light" | "dark" }) {
  const phase = useMapSelector((s) => s.phase); // 'intro' | 'microscope' | 'petri' | 'lab' | 'city' | 'earth' | 'sunSolarSystem'

  useEffect(() => {
    const gradient = PHASE_BG_GRADIENT[phase][mode];
    document.documentElement.style.setProperty("--_bg-gradient", gradient);
  }, [phase, mode]);

  return null;
}
