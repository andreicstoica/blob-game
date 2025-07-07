export default function Star({
  x,
  y,
  size = 3,
  opacity = 0.8,
}: {
  x: number;
  y: number;
  size?: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        background: `rgba(255, 255, 255, ${opacity})`,
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />
  );
}
