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
      <image
        href="/assets/earth/flower-plant.png"
        x={width * 0.7}
        y={height * 0.65}
        width={width * 0.25}
        height={height * 0.35}
        preserveAspectRatio="xMidYMid meet"
      />
      <text x="50%" y="60%" textAnchor="middle" fill="#6c7a89" fontSize="2rem">
        City
      </text>
    </svg>
  );
}
