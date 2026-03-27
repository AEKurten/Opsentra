"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let toastStore: ToastItem[] = [];

function notify(toasts: ToastItem[]) {
  toastStore = toasts;
  toastListeners.forEach((fn) => fn(toasts));
}

export const toast = {
  success: (message: string) => addToast(message, "success"),
  error: (message: string) => addToast(message, "error"),
  warning: (message: string) => addToast(message, "warning"),
  info: (message: string) => addToast(message, "info"),
};

function addToast(message: string, type: ToastType) {
  const id = Math.random().toString(36).slice(2);
  const newToasts = [...toastStore, { id, message, type }];
  notify(newToasts);
  setTimeout(() => {
    notify(toastStore.filter((t) => t.id !== id));
  }, 4000);
}

const TOAST_CONFIG = {
  success: { icon: CheckCircle, bg: "bg-green-50", border: "border-green-200", text: "text-green-800", icon_color: "text-green-500" },
  error: { icon: XCircle, bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon_color: "text-red-500" },
  warning: { icon: AlertCircle, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", icon_color: "text-amber-500" },
  info: { icon: AlertCircle, bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon_color: "text-blue-500" },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== setToasts);
    };
  }, []);

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const cfg = TOAST_CONFIG[t.type];
        const Icon = cfg.icon;
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-[12px] border shadow-lg pointer-events-auto",
              "animate-fade-in-up min-w-[280px] max-w-[380px]",
              cfg.bg, cfg.border
            )}
          >
            <Icon size={16} className={cn("shrink-0", cfg.icon_color)} aria-hidden="true" />
            <span className={cn("text-[13px] font-medium flex-1", cfg.text)}>{t.message}</span>
            <button
              onClick={() => notify(toastStore.filter((x) => x.id !== t.id))}
              className={cn("p-0.5 rounded transition-colors hover:opacity-70 cursor-pointer", cfg.text)}
              aria-label="Dismiss notification"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
