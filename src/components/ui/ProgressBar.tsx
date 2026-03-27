import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
  size?: "xs" | "sm" | "md";
  animated?: boolean;
}

export default function ProgressBar({
  value, max = 100, className, color = "#0052FF",
  trackColor = "#F1F5F9", showLabel = false,
  size = "sm", animated = false,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const h = { xs: "h-1", sm: "h-1.5", md: "h-2" }[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("flex-1 rounded-full overflow-hidden", h)}
        style={{ background: trackColor }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${Math.round(pct)}% complete`}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", animated && "relative overflow-hidden")}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold tabular-nums w-8 text-right shrink-0 text-ink-3 font-mono">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
