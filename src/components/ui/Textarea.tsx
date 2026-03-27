"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  label,
  error,
  helperText,
  id,
  ...props
}, ref) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-[13px] font-medium text-slate-700">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          "w-full rounded-[10px] border text-[14px] text-slate-800 placeholder:text-slate-400 px-3 py-2.5 resize-y transition-all duration-150 min-h-[80px]",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
          "disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed",
          error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-white hover:border-slate-300",
          className
        )}
        {...props}
      />
      {error && <p className="text-[12px] text-red-500" role="alert">{error}</p>}
      {!error && helperText && <p className="text-[12px] text-slate-500">{helperText}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
