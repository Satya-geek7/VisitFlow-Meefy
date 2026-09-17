import React, { useEffect } from "react";

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: "success" | "info" | "warning" | "error";
}

interface NotificationToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export function NotificationToast({ toast, onDismiss }: NotificationToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const bgBorder =
    toast.type === "success"
      ? "bg-white border-emerald-300 text-emerald-950"
      : toast.type === "warning"
      ? "bg-white border-amber-300 text-amber-950"
      : toast.type === "error"
      ? "bg-white border-rose-300 text-rose-950"
      : "bg-white border-neutral-300 text-neutral-900";

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md ${bgBorder}`}
      >
        <div className="mt-0.5">
          {toast.type === "success" && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
          {toast.type === "warning" && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          )}
          {(!toast.type || toast.type === "info") && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
          <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
            {toast.description}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
