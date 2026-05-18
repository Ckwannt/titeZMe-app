export function Wordmark({ height = 28 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 120 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <text
        x="0"
        y="22"
        fontFamily="Nunito, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#F5C518"
      >
        tite
      </text>
      <text
        x="52"
        y="22"
        fontFamily="Nunito, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#E8491D"
      >
        Z
      </text>
      <text
        x="65"
        y="22"
        fontFamily="Nunito, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#F5C518"
      >
        Me
      </text>
    </svg>
  );
}
