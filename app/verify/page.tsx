"use client";

import React, { useState } from "react";
import { Search, ShieldCheck, ArrowRight, CornerDownLeft, Loader2, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";

export default function VerifySearchPage() {
  const router = useRouter();
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!certId.trim()) return;
    setLoading(true);
    router.push(`/verify/${certId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-amber-500/5 to-transparent -z-10" />
      <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] -z-10" />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 lg:py-40">
        
        <div className="w-full max-w-2xl space-y-12">
           
           {/* Section Header */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center space-y-6"
           >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">De-centralized Registry Hub</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Global Verification</h1>
              <p className="text-sm text-muted-foreground/80 leading-relaxed italic max-w-lg mx-auto uppercase italic tracking-widest leading-relaxed">
                Query established blockchain settlements. Authenticate academic digital identities settled on the Stellar ledger.
              </p>
           </motion.div>

           {/* Large Search Hub */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.1 }}
             className="relative group box-glow rounded-[2.5rem]"
           >
              <form onSubmit={handleSearch} className="card-surface border-amber-500/20 p-4 md:p-6 rounded-[2.5rem] bg-bg-surface/80 backdrop-blur-3xl shadow-2xl relative z-10 flex flex-col md:flex-row gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500/40" size={24} />
                    <Input 
                      value={certId}
                      onChange={e => setCertId(e.target.value)}
                      placeholder="Paste Certificate ID or Transaction Hash..." 
                      className="h-16 md:h-20 pl-14 pr-8 bg-white/[0.03] border-white/5 rounded-2xl text-lg md:text-xl font-bold text-white placeholder:text-muted-foreground/30 focus:border-amber-500/30 transition-all select-all shadow-none"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-60 transition-opacity hidden md:flex">
                       <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Enter</span>
                       <div className="p-1 px-2 bg-white/5 rounded-lg border border-white/10"><CornerDownLeft size={12} className="text-amber-400" /></div>
                    </div>
                 </div>
                 
                 <Button 
                   type="submit" 
                   disabled={loading || !certId.trim()}
                   className="h-16 md:h-20 px-10 btn-primary rounded-2xl shadow-none border-none text-lg md:text-xl font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                 >
                    {loading ? <Loader2 className="animate-spin" /> : <>Query Ledger <ArrowRight size={24} className="ml-3" /></>}
                 </Button>
              </form>
           </motion.div>

           {/* Quick Context Footer */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="flex flex-col items-center gap-6"
           >
              <div className="h-px w-20 bg-amber-500/10" />
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] italic">Established Network: Status Operational</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Globe size={14} className="text-amber-400" />
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] italic">Settlements Globally Confined</span>
                 </div>
              </div>
           </motion.div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
