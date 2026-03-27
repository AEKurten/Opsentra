"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className, variant = "primary", size = "md",
  loading = false, icon, iconPosition = "left",
  children, disabled, ...props
}, ref) => {

  const base = [
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl",
    "transition-all duration-150 select-none cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
    "disabled:opacity-50 disabled:pointer-events-none",
  ].join(" ");

  const variants = {
    primary:   "btn-primary text-white",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.97]",
    ghost:     "text-slate-500 hover:bg-slate-100 hover:text-slate-800 active:scale-[0.97]",
    danger:    "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 active:scale-[0.97]",
    outline:   "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97]",
  };

  const sizes = {
    sm: "h-8  px-3.5 text-[12.5px]",
    md: "h-9  px-4   text-sm",
    lg: "h-11 px-5   text-[14.5px]",
  };

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin-btn w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75"/>
        </svg>
      )}
      {!loading && icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
