"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  error,
  helperText,
  options,
  placeholder,
  id,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-[13px] font-medium text-slate-700">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full h-10 rounded-[10px] border text-[14px] text-slate-800 pr-8 pl-3 appearance-none transition-all duration-150 cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
            "disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed",
            error
              ? "border-red-300 bg-red-50/50"
              : "border-slate-200 bg-white hover:border-slate-300",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      {error && <p className="text-[12px] text-red-500" role="alert">{error}</p>}
      {!error && helperText && <p className="text-[12px] text-slate-500">{helperText}</p>}
    </div>
  );
});

Select.displayName = "Select";
export default Select;
