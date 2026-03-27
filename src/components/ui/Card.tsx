import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  padding?: "none" | "xs" | "sm" | "md" | "lg";
  style?: CSSProperties;
}

const pads = {
  none: "",
  xs:   "p-3",
  sm:   "p-4",
  md:   "p-5",
  lg:   "p-6",
};

export default function Card({
  children, className, interactive = false,
  onClick, padding = "md", style,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-sm",
        pads[padding],
        interactive && "cursor-pointer transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200 active:scale-[0.99]",
        className
      )}
      style={style}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive && onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {children}
    </div>
  );
}
