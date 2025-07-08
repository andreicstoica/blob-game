export default function EarthLevel({
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
      <image
        href="/assets/earth/landscape.png"
        x="0"
        y="0"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid slice"
      />
      <image
        href="/assets/earth/city.png"
        x={width * 0.15}
        y={height * 0.25}
        width={width * 0.7}
        height={height * 0.6}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
