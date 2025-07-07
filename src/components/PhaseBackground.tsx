import { useEffect } from "react";
import { useMapSelector } from "../engine/mapState";
import { PHASE_BG_GRADIENT } from "../styles/constants";

export default function PhaseBackground({ mode }: { mode: "light" | "dark" }) {
  const phase = useMapSelector((s) => s.phase); // 'primordial' | 'colonial' | 'cosmic'

  useEffect(() => {
    const gradient = PHASE_BG_GRADIENT[phase][mode];
    document.documentElement.style.setProperty("--_bg-gradient", gradient);
  }, [phase, mode]);

  return null;
}
