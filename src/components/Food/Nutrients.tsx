import type { NutrientState } from "../../engine/game";

// Import bacteria images
import brownBacteria from "../../assets/bacteria/brown-bacteria.png";
import greenBacteria from "../../assets/bacteria/green-bacteria.png";
import purpleBacteria from "../../assets/bacteria/purple-bacteria.png";

interface NutrientsProps {
  nutrients: NutrientState[];
  phase:
    | "intro"
    | "microscope"
    | "petri"
    | "lab"
    | "city"
    | "earth"
    | "sunSolarSystem";
}

const bacteriaImages = [brownBacteria, greenBacteria, purpleBacteria];

export const Nutrients: React.FC<NutrientsProps> = ({ nutrients, phase }) => {
  const visibleNutrients = nutrients.filter((n) => !n.consumed);

  // Get bacteria image for a specific nutrient (consistent per nutrient)
  const getBacteriaImage = (nutrientId: string) => {
    const hash = nutrientId.split("-")[1]; // Extract number from nutrient-X
    const index = parseInt(hash) % bacteriaImages.length;
    return bacteriaImages[index];
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {visibleNutrients.map((nutrient) => {
        return (
          <div
            key={nutrient.id}
            className="absolute z-20"
            style={{
              // Position relative to screen center - nutrients are stored as offsets from center
              left: "50%",
              top: "50%",
              transform: `translate(${nutrient.x}px, ${nutrient.y}px)`,
            }}
          >
            {phase === "intro" ? (
              <img
                src={getBacteriaImage(nutrient.id)}
                alt="Bacteria"
                className="animate-pulse"
                style={{
                  width: "15px",
                  height: "15px",
                  filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.6))",
                }}
              />
            ) : phase === "microscope" || phase === "petri" ? (
              <div
                className="bg-green-500 rounded-full animate-pulse border border-green-300"
                style={{
                  width: "8px",
                  height: "8px",
                }}
              />
            ) : phase === "lab" ? (
              <span
                style={{
                  fontSize: "14px",
                  filter: "drop-shadow(0 0 2px #fff)",
                }}
                role="img"
                aria-label="flask"
              >
                🧪
              </span>
            ) : phase === "city" ? (
              <span
                style={{
                  fontSize: "14px",
                  filter: "drop-shadow(0 0 2px #fff)",
                }}
                role="img"
                aria-label="flower"
              >
                🌸
              </span>
            ) : phase === "earth" ? (
              <span
                style={{
                  fontSize: "14px",
                  filter: "drop-shadow(0 0 2px #fff)",
                }}
                role="img"
                aria-label="leaf"
              >
                🍃
              </span>
            ) : phase === "sunSolarSystem" ? (
              <span
                style={{
                  fontSize: "14px",
                  filter: "drop-shadow(0 0 2px #fff)",
                }}
                role="img"
                aria-label="star"
              >
                ⭐
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
