"use client";

import React, { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  ExternalLink, 
  ArrowRight, 
  Rocket, 
  Globe, 
  Cpu,
  Trophy,
  Share2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Confetti from "@/components/shared/Confetti";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function OnboardingComplete() {
  const searchParams = useSearchParams();
  const txHash = searchParams.get("txHash");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      {showConfetti && <Confetti />}

      {/* Hero Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-amber-500/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] -z-10" />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 lg:py-40 text-center space-y-12">
        
        {/* Animated Trophy Icon */}
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
          className="relative inline-flex mb-8"
        >
           <div className="absolute -inset-6 bg-gradient-to-tr from-amber-500 via-yellow-500 to-orange-500 rounded-full blur-2xl opacity-20 animate-pulse" />
           <div className="h-28 w-28 bg-bg-surface border-2 border-amber-500/20 rounded-[2rem] flex items-center justify-center text-amber-400 shadow-2xl relative z-10 rotate-3 group hover:rotate-0 transition-transform">
              <Trophy size={56} className="text-amber-400 group-hover:scale-110 transition-transform" />
           </div>
           <motion.div 
             animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="absolute -top-4 -right-4 h-10 w-10 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center"
           >
              <Star size={20} fill="currentColor" />
           </motion.div>
        </motion.div>

        <div className="space-y-6 max-w-2xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
           >
              <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
                Trust Established
              </h1>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em] italic leading-relaxed">
                 Institutional Registry Effectively Confined to Global Ledger
              </p>
           </motion.div>
           
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="text-sm text-muted-foreground/80 leading-relaxed italic max-w-lg mx-auto uppercase italic tracking-widest leading-relaxed"
           >
             Your first certificate batch has been successfully settled on the Stellar network. Global consensus effectively reached. 3001v-Enrolled Identity is now immutable.
           </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-10"
        >
           <Button asChild className="h-16 px-10 btn-primary rounded-2xl shadow-[0_15px_40px_rgba(99,102,241,0.3)] text-lg">
              <Link href="/institution/analytics" className="flex items-center gap-3">
                 <Rocket size={20} />
                 Enter Command Center
              </Link>
           </Button>
           
           {txHash && (
             <Button asChild variant="outline" className="h-16 px-10 border-white/10 bg-white/5 rounded-2xl text-slate-300 hover:bg-white/10 italic tracking-widest text-sm font-bold transition-all">
                <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" className="flex items-center gap-3">
                   <Globe size={18} />
                   Audit Settlement
                   <ExternalLink size={14} className="ml-1 opacity-40" />
                </a>
             </Button>
           )}
        </motion.div>

        {/* Quick Stats Grid Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 max-w-4xl"
        >
           <OnboardingStat icon={ShieldCheck} label="Identity Integrity" value="Verified" color="text-amber-400" />
           <OnboardingStat icon={Cpu} label="Stellar Consensus" value="Established" color="text-yellow-400" />
           <OnboardingStat icon={CheckCircle2} label="Network Status" value="Operational" color="text-orange-400" />
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}

function OnboardingStat({ icon: Icon, label, value, color }: any) {
   return (
      <div className="p-6 rounded-[2.5rem] bg-amber-500/[0.02] border border-amber-500/10 flex flex-col items-center gap-3 space-y-1">
         <Icon size={24} className={color} />
         <div className="text-center">
            <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest mb-1">{label}</p>
            <p className={cn("text-xs font-black uppercase tracking-[0.2em] italic", color)}>{value}</p>
         </div>
      </div>
   );
}
