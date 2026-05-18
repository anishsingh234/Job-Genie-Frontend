import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

export function Card({
  children,
  className = "",
  hover = false,
  glow = false,
  padding = "md",
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        rounded-2xl border border-border-subtle bg-bg-card
        ${hover ? "transition-all duration-300 hover:bg-bg-card-hover hover:border-border-default hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20" : ""}
        ${glow ? "shadow-lg shadow-primary/5" : ""}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ── Stat Card variant ───────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  color?: "primary" | "accent" | "amber" | "rose";
}

export function StatCard({ label, value, icon, trend, color = "primary" }: StatCardProps) {
  const colors = {
    primary: "text-primary bg-primary/10",
    accent: "text-accent bg-accent/10",
    amber: "text-accent-warm bg-accent-warm/10",
    rose: "text-danger bg-danger/10",
  };

  return (
    <Card hover className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-text-secondary font-medium">{label}</p>
        <p className="text-3xl font-heading font-bold text-text-primary">{value}</p>
        {trend && (
          <p className="text-xs text-accent font-medium">{trend}</p>
        )}
      </div>
      <div className={`rounded-xl p-3 ${colors[color]}`}>
        {icon}
      </div>
    </Card>
  );
}
