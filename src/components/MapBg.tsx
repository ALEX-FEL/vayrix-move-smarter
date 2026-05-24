export function MapBg({ withCar = false }: { withCar?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dark map base */}
      <div className="absolute inset-0 bg-[#0A0E27]" />
      <div className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(59,107,255,0.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(123,92,255,0.20), transparent 55%)",
        }}
      />
      {/* Grid streets */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 700" preserveAspectRatio="none">
        <defs>
          <linearGradient id="route" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B6BFF" />
            <stop offset="100%" stopColor="#7B5CFF" />
          </linearGradient>
          <pattern id="streets" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 30 H60 M30 0 V60" stroke="#1a2350" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="700" fill="url(#streets)" />
        {/* Big roads */}
        <path d="M-20 500 Q 200 420 420 460" stroke="#1f2a5c" strokeWidth="14" fill="none" />
        <path d="M50 -20 Q 120 300 280 720" stroke="#1f2a5c" strokeWidth="10" fill="none" />
        <path d="M-20 200 Q 220 240 420 180" stroke="#1f2a5c" strokeWidth="8" fill="none" />

        {/* Route */}
        <path
          d="M70 560 Q 180 420 220 320 T 340 140"
          stroke="url(#route)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          className="animate-dash"
        />
        {/* Start pin */}
        <g transform="translate(70,560)">
          <circle r="14" fill="#3B6BFF" opacity="0.25" />
          <circle r="7" fill="#3B6BFF" />
          <circle r="3" fill="white" />
        </g>
        {/* End pin */}
        <g transform="translate(340,140)">
          <circle r="14" fill="#7B5CFF" opacity="0.25" />
          <circle r="7" fill="#7B5CFF" />
          <circle r="3" fill="white" />
        </g>

        {withCar && (
          <g className="animate-car" transform="translate(210,360)">
            <circle r="22" fill="#7B5CFF" opacity="0.2" />
            <rect x="-10" y="-7" width="20" height="14" rx="3" fill="white" />
            <rect x="-7" y="-5" width="14" height="6" rx="1.5" fill="#3B6BFF" />
          </g>
        )}
      </svg>
    </div>
  );
}
