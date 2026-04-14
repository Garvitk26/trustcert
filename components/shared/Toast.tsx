"use client";

import React from "react";
import { useToast, Toast } from "@/lib/context/ToastContext";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const icons = {
  success: <CheckCircle2 className="text-amber-500" size={18} />,
  error: <XCircle className="text-rose-500" size={18} />,
  info: <Info className="text-amber-500" size={18} />,
  warning: <AlertTriangle className="text-amber-500" size={18} />,
};

const borders = {
  success: "border-l-4 border-l-amber-500",
  error: "border-l-4 border-l-rose-500",
  info: "border-l-4 border-l-amber-500",
  warning: "border-l-4 border-l-amber-500",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      layout
      className={cn(
        "pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-md p-4 bg-[#0a1a14] border border-white/5 rounded-lg shadow-2xl backdrop-blur-xl",
        borders[toast.type]
      )}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-sm font-medium text-white/90 leading-tight">{toast.message}</p>
      <button 
        onClick={onRemove}
        className="shrink-0 p-1 rounded-md hover:bg-white/5 text-white/40 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
