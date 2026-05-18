"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "primary" | "accent" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = "primary",
  size = "md",
  animated = true,
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: "bg-primary",
    accent: "bg-accent",
    warning: "bg-accent-warm",
    danger: "bg-danger",
  };

  const glowColors = {
    primary: "shadow-primary/40",
    accent: "shadow-accent/40",
    warning: "shadow-accent-warm/40",
    danger: "shadow-danger/40",
  };

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-text-secondary font-medium">{label}</span>}
          {showValue && (
            <span className="text-sm font-heading font-semibold text-text-primary">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full bg-bg-elevated overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} rounded-full ${colors[color]} shadow-lg ${glowColors[color]} transition-all duration-1000 ease-out
            ${animated ? "animate-progress-fill" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
