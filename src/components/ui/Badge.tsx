import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  dot?: boolean;
  dotColor?: string;
  className?: string;
  size?: "xs" | "sm" | "md";
}

export default function Badge({ children, color, bg, dot = false, dotColor, className, size = "sm" }: BadgeProps) {
  const sizes = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2   py-[3px] text-[11px]",
    md: "px-2.5 py-1    text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap",
        sizes[size],
        className
      )}
      style={{ color, backgroundColor: bg }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor ?? color }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
