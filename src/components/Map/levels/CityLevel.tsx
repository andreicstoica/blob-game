export default function CityLevel({
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
      <rect width="100%" height="100%" fill="#e0e7ef" />
      <rect
        x={width / 2 - 60}
        y={height / 2}
        width="30"
        height="80"
        fill="#b0b8c1"
        stroke="#6c7a89"
        strokeWidth="4"
      />
      <rect
        x={width / 2 - 20}
        y={height / 2 + 20}
        width="30"
        height="60"
        fill="#b0b8c1"
        stroke="#6c7a89"
        strokeWidth="4"
      />
      <rect
        x={width / 2 + 20}
        y={height / 2 + 10}
        width="30"
        height="70"
        fill="#b0b8c1"
        stroke="#6c7a89"
        strokeWidth="4"
      />
      <text x="50%" y="60%" textAnchor="middle" fill="#6c7a89" fontSize="2rem">
        City
      </text>
    </svg>
  );
}
