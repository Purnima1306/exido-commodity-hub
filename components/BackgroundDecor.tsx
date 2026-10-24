export default function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="curveBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#3b82f6" stopOpacity="0.45" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="curveGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e6bc5c" stopOpacity="0" />
            <stop offset="0.5" stopColor="#e6bc5c" stopOpacity="0.35" />
            <stop offset="1" stopColor="#e6bc5c" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="curvePurple" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="0.5" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="curveTeal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#14b8a6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#14b8a6" stopOpacity="0.3" />
            <stop offset="1" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M-120 640 C 180 460, 460 780, 760 600 S 1240 340, 1560 500"
          stroke="url(#curveBlue)"
          strokeWidth="1.4"
        />
        <path
          d="M-120 700 C 200 540, 480 840, 780 660 S 1260 400, 1560 560"
          stroke="url(#curveGold)"
          strokeWidth="1"
        />
        <path
          d="M-120 220 C 220 80, 520 360, 820 200 S 1260 40, 1560 180"
          stroke="url(#curvePurple)"
          strokeWidth="1.2"
        />
        <path
          d="M-120 780 C 260 700, 560 900, 900 780 S 1320 640, 1560 720"
          stroke="url(#curveTeal)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}