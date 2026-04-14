"use client";

import React, { useState } from "react";
import { ShieldCheck, Info, ExternalLink, Globe, Lock, Cpu, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface InstitutionSealProps {
  institutionName: string;
  walletAddress: string;
  verifiedDomain?: string;
  size?: "sm" | "md" | "lg";
}

export default function InstitutionSeal({ 
  institutionName, 
  walletAddress, 
  verifiedDomain,
  size = "md" 
}: InstitutionSealProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizes = {
    sm: "px-2 py-1 text-[8px] gap-1.5",
    md: "px-4 py-2 text-[10px] gap-2.5",
    lg: "px-6 py-3 text-xs gap-3"
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center rounded-xl font-black uppercase tracking-[0.2em] italic transition-all",
          "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 shadow-lg shadow-amber-500/5",
          sizes[size]
        )}
      >
        <ShieldCheck size={size === "sm" ? 12 : 18} className="animate-pulse" />
        Verified by TrustCert
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md card-surface border-amber-500/10 bg-bg-surface p-10 md:p-12 rounded-[3rem] space-y-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
               <div className="flex flex-col items-center text-center space-y-6">
                  <div className="h-20 w-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center shadow-inner shadow-amber-500/10">
                     <ShieldCheck size={44} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{institutionName}</h3>
                     <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.3em] italic">Identity Validated Effectively</p>
                  </div>
               </div>

               <div className="space-y-6 pt-4">
                  <SealField icon={Globe} label="Verified Domain" value={verifiedDomain || "Not Registered"} active={!!verifiedDomain} />
                  <SealField icon={Lock} label="Stellar Public Key" value={walletAddress} secondary="Verified Ledger Hub" />
                  <SealField icon={Cpu} label="Trust Protocol" value="TrustCert v1.0 (Alpha)" secondary="Blockchain Settlement" />
               </div>

               <div className="pt-6 space-y-4">
                  <Button asChild className="w-full h-14 btn-primary rounded-2xl uppercase font-black text-xs tracking-widest italic group">
                     <a href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`} target="_blank">
                        Audit on Stellar <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </a>
                  </Button>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    variant="ghost" 
                    className="w-full h-14 btn-ghost rounded-2xl uppercase font-black text-xs tracking-widest italic"
                  >
                     Close Seal
                  </Button>
               </div>

               <div className="flex items-center justify-center gap-2 pt-4 opacity-30">
                  <CheckCircle2 size={12} className="text-amber-500" />
                  <span className="text-[8px] font-bold text-white uppercase tracking-widest italic">Identity Settlement Consensus Confined</span>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function SealField({ icon: Icon, label, value, secondary, active = true }: any) {
   return (
      <div className="flex items-start gap-4">
         <div className={cn("p-2 rounded-xl shrink-0", active ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-muted-foreground/30")}>
            <Icon size={18} />
         </div>
         <div className="space-y-1 flex-1 overflow-hidden">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
            <p className={cn("text-xs font-bold truncate transition-colors", active ? "text-white" : "text-muted-foreground/20 italic")}>{value}</p>
            {secondary && <p className="text-[8px] font-bold text-amber-400/40 uppercase tracking-tight">{secondary}</p>}
         </div>
      </div>
   );
}
