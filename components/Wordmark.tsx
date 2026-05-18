export function Wordmark({ height = 28 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
      aria-label="titeZMe"
    >
      <text
        y="32"
        fontFamily="Nunito, sans-serif"
        fontWeight="800"
        fontSize="32"
      >
        <tspan fill="#F5C518">tite</tspan>
        <tspan fill="#E8491D">Z</tspan>
        <tspan fill="#F5C518">Me</tspan>
      </text>
    </svg>
  );
}
