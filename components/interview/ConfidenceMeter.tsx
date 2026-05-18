"use client";

interface ConfidenceMeterProps {
  score: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceMeter({
  score,
  label = "Confidence",
  showLabel = true,
  className = "",
}: ConfidenceMeterProps) {
  const pct = Math.min(100, Math.max(0, score));

  // Color gradient: red → amber → green
  const getColor = (v: number) => {
    if (v >= 80) return { bar: "bg-emerald-500", text: "text-emerald-400", glow: "shadow-emerald-500/30" };
    if (v >= 60) return { bar: "bg-amber-500", text: "text-amber-400", glow: "shadow-amber-500/30" };
    return { bar: "bg-red-500", text: "text-red-400", glow: "shadow-red-500/30" };
  };

  const colors = getColor(pct);

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
            {label}
          </span>
          <span className={`text-sm font-heading font-bold ${colors.text}`}>
            {pct}/100
          </span>
        </div>
      )}
      <div className="w-full h-2.5 rounded-full bg-bg-elevated overflow-hidden">
        <div
          className={`h-full rounded-full ${colors.bar} shadow-lg ${colors.glow} transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
