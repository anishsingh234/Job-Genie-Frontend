interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
  width?: string;
  height?: string;
}

export function Skeleton({
  className = "",
  variant = "rect",
  width,
  height,
}: SkeletonProps) {
  const variants = {
    rect: "rounded-xl",
    circle: "rounded-full",
    text: "rounded-md h-4",
  };

  return (
    <div
      className={`bg-bg-elevated animate-shimmer ${variants[variant]} ${className}`}
      style={{
        width,
        height,
        backgroundImage:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

// ── Pre-built skeleton patterns ──────────────────────────────────────

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width="40px" height="40px" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-1/3 h-4" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
      <Skeleton variant="rect" className="w-full h-20" />
      <div className="flex gap-2">
        <Skeleton variant="rect" className="w-16 h-6" />
        <Skeleton variant="rect" className="w-20 h-6" />
        <Skeleton variant="rect" className="w-14 h-6" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
