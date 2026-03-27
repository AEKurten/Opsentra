"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className, label, error, helperText, icon, id, ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-10 rounded-xl border bg-white text-sm text-slate-800 placeholder:text-slate-400",
            "transition-all duration-150 outline-none",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed",
            icon ? "pl-9 pr-3" : "px-3",
            error ? "border-red-300 bg-red-50/40" : "border-slate-200 hover:border-slate-300",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
