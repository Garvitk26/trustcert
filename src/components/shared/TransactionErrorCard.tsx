"use client";

import React from "react";
import { ShieldAlert, RefreshCw, XCircle, Info } from "lucide-react";

interface TransactionErrorCardProps {
  message: string;
  onRetry?: () => void;
  onCancel?: () => void;
  title?: string;
  type?: "critical" | "warning";
}

export function TransactionErrorCard({ 
  message, 
  onRetry, 
  onCancel, 
  title = "Transaction Failed",
  type = "critical"
}: TransactionErrorCardProps) {
  return (
    <div className="card-surface p-8 relative overflow-hidden group animate-shake">
      {/* Background Warning Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[80px] -z-10 opacity-20 transition-colors duration-500 ${
        type === "critical" ? "bg-rose-500" : "bg-amber-500"
      }`} />
      
      <div className="flex flex-col items-center text-center space-y-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 ${
          type === "critical" 
            ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]" 
            : "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        }`}>
          {type === "critical" ? <ShieldAlert size={32} /> : <Info size={32} />}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {message || "An unexpected error occurred while processing your request on the Stellar network."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all font-sans"
            >
              <RefreshCw size={16} /> <span>Retry Operation</span>
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-sans"
          >
            <XCircle size={16} /> <span>Dismiss</span>
          </button>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
    </div>
  );
}
