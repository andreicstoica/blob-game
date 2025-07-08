export default function IntroLevel({
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
        <linearGradient id="introBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0c3fc" />
          <stop offset="100%" stopColor="#8ec5fc" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#introBg)" />
      <circle
        cx={width / 2}
        cy={height / 2}
        r={Math.min(width, height) / 8}
        fill="#b3c6e0"
        stroke="#7a8fa6"
        strokeWidth="8"
      />
      <text x="50%" y="60%" textAnchor="middle" fill="#7a8fa6" fontSize="2rem">
        Intro
      </text>
    </svg>
  );
}
