"use client";

import React from "react";
import { Loader2, CheckCircle2, AlertCircle, ShieldAlert, Cpu, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export type TxStep = "idle" | "preparing" | "signing" | "broadcasting" | "confirmed" | "failed";

interface TransactionFlowProps {
  step: TxStep;
  title?: string;
  error?: string;
  txHash?: string;
}

export function TransactionFlow({ step, title = "Transaction Protocol", error, txHash }: TransactionFlowProps) {
  const steps = [
    { id: "preparing", label: "Build", icon: Cpu },
    { id: "signing", label: "Sign", icon: ShieldAlert },
    { id: "broadcasting", label: "Broadcast", icon: Globe },
    { id: "confirmed", label: "Confirm", icon: CheckCircle2 },
  ];

  const getStepIndex = (s: TxStep) => {
    if (s === "idle") return -1;
    if (s === "failed") return -1;
    return steps.findIndex(x => x.id === s);
  };

  const currentIndex = getStepIndex(step);

  return (
    <div className="card-surface p-6 space-y-8 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">{title}</h3>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse",
            step === "confirmed" ? "bg-amber-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : 
            step === "failed" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" : 
            "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          )} />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
            {step === "idle" ? "Standby" : step}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === currentIndex;
          const isCompleted = i < currentIndex || step === "confirmed";
          
          return (
            <div key={s.id} className="relative flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500",
                isCompleted ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" :
                isActive ? "bg-sky-500/20 border-sky-400 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)] scale-110" :
                "bg-white/5 border-white/10 text-muted-foreground"
              )}>
                {isActive && step !== "confirmed" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span className={cn(
                "mt-3 text-[10px] font-bold uppercase tracking-widest",
                isCompleted ? "text-amber-500" : isActive ? "text-sky-400" : "text-muted-foreground"
              )}>
                {s.label}
              </span>
              
              {i < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-[1px] -z-10 bg-white/5">
                  <div className={cn(
                    "h-full transition-all duration-1000",
                    isCompleted ? "w-full bg-amber-500/50" : "w-0 bg-sky-400/50"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {step === "failed" && error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 animate-shake">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <p className="text-xs text-rose-200 font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {step === "confirmed" && txHash && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-3 animate-page-enter">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-200 font-bold tracking-tight uppercase">Ledger Settlement Success</p>
          </div>
          <div className="flex items-center justify-between gap-4 p-2 bg-black/20 rounded border border-white/5">
            <code className="text-[10px] font-mono text-muted-foreground truncate">{txHash}</code>
          </div>
        </div>
      )}
    </div>
  );
}
