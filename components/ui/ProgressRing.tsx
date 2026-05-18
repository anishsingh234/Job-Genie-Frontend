"use client";

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "accent" | "warning" | "danger";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = "primary",
  showLabel = true,
  label,
  className = "",
}: ProgressRingProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const colors = {
    primary: "#2D6AE3",
    accent: "#19B3A6",
    warning: "#FFB020",
    danger: "#EF4444",
  };

  const glowColors = {
    primary: "drop-shadow(0 0 6px rgba(45,106,227,0.35))",
    accent: "drop-shadow(0 0 6px rgba(25,179,166,0.35))",
    warning: "drop-shadow(0 0 6px rgba(255,176,32,0.35))",
    danger: "drop-shadow(0 0 6px rgba(239,68,68,0.35))",
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        style={{ filter: glowColors[color] }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F5"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            // @ts-expect-error -- custom CSS property for animation
            "--ring-circumference": circumference,
            transition: "stroke-dashoffset 1.2s ease-out",
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-heading font-bold text-text-primary">
            {Math.round(pct)}
          </span>
          {label && (
            <span className="text-xs text-text-muted mt-0.5">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}
