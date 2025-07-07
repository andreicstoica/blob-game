export default function Nutrient({
  x,
  y,
  size = 16,
}: {
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        background: "#ffd866",
        borderRadius: "50%",
        boxShadow: "0 0 8px #ffd86688",
        pointerEvents: "none",
      }}
    />
  );
}
