"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, Cpu, Wallet, Send, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Confetti from "./Confetti";

interface Stage {
  id: number;
  label: string;
  icon: any;
  status: "waiting" | "processing" | "completed" | "error";
  description: string;
}

interface IssuanceProgressProps {
  currentStage: number;
  error?: string | null;
  onClose: () => void;
}

export default function IssuanceProgress({ currentStage, error, onClose }: IssuanceProgressProps) {
  const stages: Stage[] = [
    { 
      id: 1, 
      label: "Metadata Preparation", 
      icon: Cpu, 
      status: error && currentStage === 1 ? "error" : currentStage > 1 ? "completed" : currentStage === 1 ? "processing" : "waiting", 
      description: "Encrypting certificate details and generating identifiers..." 
    },
    { 
      id: 2, 
      label: "Wallet Signature", 
      icon: Wallet, 
      status: error && currentStage === 2 ? "error" : currentStage > 2 ? "completed" : currentStage === 2 ? "processing" : "waiting", 
      description: "Please sign the transaction in your Freighter wallet extension." 
    },
    { 
      id: 3, 
      label: "Ledger Settlement", 
      icon: Send, 
      status: error && currentStage === 3 ? "error" : currentStage > 3 ? "completed" : currentStage === 3 ? "processing" : "waiting", 
      description: "Broadcasting your certificate to the Stellar network..." 
    },
    { 
      id: 4, 
      label: "Verification Lock", 
      icon: ShieldCheck, 
      status: error && currentStage === 4 ? "error" : currentStage > 4 ? "completed" : currentStage === 4 ? "processing" : "waiting", 
      description: "Confining immutable proof to the global certificate registry." 
    },
  ];

  const allCompleted = currentStage > 4 && !error;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      {allCompleted && <Confetti />}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg card-surface border-amber-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 opacity-50" />
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Issuance Pipeline</h2>
            <p className="text-sm text-muted-foreground mt-1 tracking-widest font-mono">3001v-Enrolled Blockchain Transaction</p>
          </div>
          { (error || allCompleted) && (
            <button 
              onClick={onClose}
              className="text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors"
            >
              Close
            </button>
          )}
        </div>

        <div className="space-y-6">
          {stages.map((stage) => (
             <div key={stage.id} className="relative">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "mt-1 p-2 rounded-xl transition-all duration-500",
                    stage.status === "completed" ? "bg-amber-500/10 text-amber-400" :
                    stage.status === "processing" ? "bg-orange-500/10 text-orange-400 animate-pulse border border-orange-500/30" :
                    stage.status === "error" ? "bg-rose-500/10 text-rose-400" :
                    "bg-white/5 text-muted-foreground"
                  )}>
                    <stage.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                       <span className={cn(
                         "text-sm font-bold tracking-widest uppercase",
                         stage.status === "waiting" ? "text-muted-foreground" : "text-white"
                       )}>
                         {stage.label}
                       </span>
                       {stage.status === "completed" && <CheckCircle2 size={16} className="text-amber-400" />}
                       {stage.status === "error" && <AlertCircle size={16} className="text-rose-400" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed mt-1 italic">
                       {stage.status === "error" ? error : stage.description}
                    </p>
                  </div>
                </div>
                {/* Vertical Line Connector */}
                {stage.id < 4 && (
                  <div className={cn(
                    "absolute left-5 top-11 w-0.5 h-6 transition-colors duration-500",
                    stage.status === "completed" ? "bg-amber-500/20" : "bg-white/5"
                  )} />
                )}
             </div>
          ))}
        </div>

        {allCompleted && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center"
          >
             <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em]">Credential Secured Effectively</p>
             <p className="text-[10px] text-amber-300/60 mt-1 uppercase italic">Ledger Confirmation Received</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
