export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="4tena logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(250, 70%, 55%)" />
          <stop offset="100%" stopColor="hsl(220, 70%, 60%)" />
        </linearGradient>
      </defs>
      {/* Modern abstract shape representing financial/data flow */}
      <path d="M8 6 L24 6 L24 12 L16 12 L16 26 L8 26 Z" fill="url(#logoGradient)" />
      <rect x="18" y="14" width="6" height="12" rx="1" fill="url(#logoGradient)" opacity="0.7" />
    </svg>
  )
}
