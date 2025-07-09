export default function MicroscopeLevel({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full"
    >
      <rect width="100%" height="100%" fill="#e6f7ff" />
      <ellipse
        cx={width / 2}
        cy={height / 2}
        rx={width / 6}
        ry={height / 10}
        fill="#b2e0f7"
        stroke="#5fa8d3"
        strokeWidth="6"
      />
      <text x="50%" y="60%" textAnchor="middle" fill="#5fa8d3" fontSize="2rem">
        Microscope
      </text>
    </svg>
  );
}
