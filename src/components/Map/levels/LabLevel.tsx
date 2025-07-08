export default function LabLevel({
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
      <defs>
        <linearGradient id="labBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a084ca" />
          <stop offset="100%" stopColor="#e0c3fc" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#labBg)" />
      <rect
        x={width / 2 - 40}
        y={height / 2 - 60}
        width="80"
        height="120"
        rx="20"
        fill="#e0c3fc"
        stroke="#a084ca"
        strokeWidth="6"
      />
      <text x="50%" y="60%" textAnchor="middle" fill="#a084ca" fontSize="2rem">
        Lab
      </text>
    </svg>
  );
}
