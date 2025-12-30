import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = "rectangular",
  width,
  height,
  lines = 1 
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted rounded";
  
  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              i === lines - 1 ? "w-3/4" : "w-full",
              "h-4"
            )}
            style={width && i === 0 ? { width } : undefined}
          />
        ))}
      </div>
    );
  }

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4",
        !width && !height && variant === "rectangular" && "w-full h-full",
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4">
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="rectangular" height={200} />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={80} height={36} />
        <Skeleton variant="rectangular" width={80} height={36} />
      </div>
    </div>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-4 sm:p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="rectangular" width={24} height={24} />
      </div>
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" lines={2} />
      <Skeleton variant="rectangular" width={60} height={20} />
    </div>
  );
}
