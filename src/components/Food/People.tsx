export default function People({
  x,
  y,
  size = 8,
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
        background: "#ff6b6b",
        borderRadius: "50%",
        boxShadow: "0 0 4px #ff6b6b88",
        pointerEvents: "none",
      }}
    />
  );
}
