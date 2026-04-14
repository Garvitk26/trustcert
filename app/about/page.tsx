"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { 
  ShieldCheck, 
  Globe, 
  Zap, 
  Database, 
  Users, 
  Lock,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base relative overflow-hidden">
      <Navbar />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-amber-500/5 to-transparent -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] -z-10" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-20 lg:py-32">
        
        {/* --- MISSION HERO --- */}
        <section className="text-center space-y-12 mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md"
           >
             <ShieldCheck size={14} />
             <span>The Network of Trust</span>
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.9]"
           >
              Architecting <br /> <span className="text-amber-500">Immutability</span>.
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed italic"
           >
              TrustCert is effectively decentralizing the global identity infrastructure. We empower institutions to issue tamper-proof credentials and students to own their achievements forever on the Stellar ledger.
           </motion.p>
        </section>

        {/* --- CORE ADVANTAGES --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="space-y-10"
           >
              <div className="space-y-4">
                 <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-widest">The Stellar Edge</h2>
                 <p className="text-slate-500 italic max-w-lg leading-relaxed uppercase tracking-widest text-[10px] font-bold">Confined effectively to established ledger consensus.</p>
              </div>

              <div className="space-y-8">
                 <AdvantageItem 
                   icon={Zap} 
                   title="Instant Settlements" 
                   desc="Consensus reached in under 5 seconds. Verification becomes a real-time asset effectively."
                 />
                 <AdvantageItem 
                   icon={Database} 
                   title="Immutable Registry" 
                   desc="Cryptographic SHA-256 digests pinned to the world's most scalable blockchain network."
                 />
                 <AdvantageItem 
                   icon={Lock} 
                   title="Privacy by Design" 
                   desc="Selective disclosure allows identity verification without revealing sensitive metadata."
                 />
              </div>
           </motion.div>

           <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500 to-yellow-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-all duration-1000" />
              <div className="relative p-12 aspect-square card-surface border-amber-500/10 rounded-[3rem] bg-amber-500/[0.02] flex flex-col items-center justify-center text-center space-y-10">
                 <div className="h-32 w-32 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-400 animate-pulse">
                    <Globe size={64} />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Global Identity Layer</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-[0.2em] max-w-xs leading-relaxed italic">TrustCert is building the bridge between institutional data and decentralized identity standards.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* --- CTA --- */}
        <section className="p-12 md:p-24 rounded-[4rem] bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center space-y-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
           <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Ready to join the network?</h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto italic">Start issuing blockchain-verified certificates today with zero infrastructure overhead.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                 <Link href="/signup">
                    <Button className="btn-primary h-16 px-10 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] group">
                       Get Started Now <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </Link>
                 <Link href="/contact">
                    <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 hover:bg-white/5 uppercase tracking-widest text-xs font-black">
                       Contact Expert
                    </Button>
                 </Link>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

function AdvantageItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-6 group">
       <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400 border border-white/5 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
          <Icon size={28} />
       </div>
       <div className="space-y-1">
          <h4 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h4>
          <p className="text-sm text-slate-500 italic leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
