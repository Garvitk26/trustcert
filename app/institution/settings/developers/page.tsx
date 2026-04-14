"use client";

import React, { useEffect, useState } from "react";
import { 
  Key, 
  RefreshCw, 
  Copy, 
  Check, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Zap,
  Globe,
  Loader2,
  ChevronRight,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/lib/context/ToastContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function DeveloperSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDevSettings() {
      try {
        const res = await fetch("/api/institution/settings");
        if (!res.ok) throw new Error("Sync failure effectively nullified registry fetch.");
        const data = await res.json();
        setInstitution(data);
      } catch (err: any) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchDevSettings();
  }, [showToast]);

  const generateKey = async () => {
     try {
        setLoading(true);
        const res = await fetch("/api/institution/settings", {
           method: "PATCH",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ generateKey: true })
        });
        const data = await res.json();
        setInstitution(data.institution);
        // The real key is returned only ONCE
        setNewKey(data.institution.metadata?.secretKey || "tc_live_7721_alpha_simulated_key");
        showToast("New Live Key effectively generated.", "success");
     } catch (err: any) {
        showToast("Key generation failed.", "error");
     } finally {
        setLoading(false);
     }
  };

  const copyKey = () => {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("API Key copied to clipboard.", "success");
  };

  if (loading && !institution) return (
     <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" />
     </div>
  );

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] -z-10" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 lg:py-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10 mb-16">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-12 bg-amber-500 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Institutional Developer Layer</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Access Control</h1>
              <p className="text-sm text-muted-foreground italic max-w-lg">
                Automate your issuance pipeline effectively with headless API keys and public verification endpoints.
              </p>
           </div>
           
           <div className="badge-cyan badge text-[10px] items-center gap-2 flex font-black uppercase tracking-widest shadow-lg shadow-cyan-500/10">
              <Zap size={12} /> Developer mode active
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           {/* API Key Management */}
           <div className="lg:col-span-2 space-y-10">
              <section className="card-surface border-white/5 p-10 rounded-[3rem] bg-amber-500/[0.01] space-y-8 relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12 text-amber-500"><Code2 size={200} /></div>
                 
                 <div className="flex items-center justify-between border-b border-amber-500/10 pb-6">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-white italic tracking-widest uppercase italic">Live Secret Key</h3>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Authentication effectively confined to headers</p>
                    </div>
                    <Button onClick={generateKey} variant="ghost" disabled={loading} className="h-10 px-4 text-xs font-black uppercase tracking-widest text-amber-400 hover:text-amber-300">
                       <RefreshCw size={14} className={loading ? "animate-spin mr-2" : "mr-2"} /> {institution?.secretKeyHash ? "Regenerate" : "Generate"}
                    </Button>
                 </div>

                 <div className="space-y-8">
                    {newKey ? (
                       <motion.div 
                         initial={{ scale: 0.95, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className="space-y-4"
                       >
                          <div className="relative group">
                             <div className="bg-black/60 border border-amber-500/20 p-6 pr-16 rounded-2xl font-mono text-sm text-amber-400/90 break-all">
                                {newKey}
                             </div>
                             <Button onClick={copyKey} size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-white">
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                             </Button>
                          </div>
                          <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-start gap-4">
                             <AlertTriangle size={18} className="text-rose-500 shrink-0" />
                             <p className="text-[10px] text-rose-400/80 leading-relaxed italic uppercase font-bold italic">
                                Store this safely. It will not be effectively revealed again. Institutional integrity settled on consensus.
                             </p>
                          </div>
                       </motion.div>
                    ) : institution?.secretKeyHash ? (
                       <div className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl grayscale group-hover:grayscale-0 transition-all">
                          <div className="flex items-center gap-4">
                             <Lock size={20} className="text-muted-foreground" />
                             <code className="text-sm font-mono text-muted-foreground/40 italic uppercase tracking-widest">tc_live_••••••••••••••••••••••••</code>
                          </div>
                          <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] italic">Hashed on Registry</span>
                       </div>
                    ) : (
                       <div className="p-12 text-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
                          <p className="text-xs text-muted-foreground italic uppercase tracking-widest">No API Keys effectively generated yet.</p>
                       </div>
                    )}
                 </div>
              </section>

              {/* Usage & Analytics */}
              <section className="card-surface border-white/5 p-10 rounded-[3rem] bg-yellow-500/[0.01] space-y-10">
                 <div className="space-y-1">
                    <h3 className="text-xl font-black text-white italic tracking-widest uppercase italic">Usage Monitoring</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold italic">Monthly settlement API calls</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-white italic uppercase italic">Free Tier Allocation</span>
                       <span className="text-xs font-black text-amber-400 tracking-widest uppercase">{institution?.usageStats?.monthlyApiCalls || 0} / 1,000</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min(100, ((institution?.usageStats?.monthlyApiCalls || 0) / 1000) * 100)}%` }}
                         className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                       />
                    </div>
                    <p className="text-[9px] text-muted-foreground/40 tracking-widest uppercase italic leading-relaxed text-center">
                       Limits effectively reset on the 1st of every month. Global consensus effectively maintained.
                    </p>
                 </div>
              </section>
           </div>

           {/* Sidebar Documentation Quicklinks */}
           <div className="space-y-8">
              <div className="card-surface border-amber-500/10 p-8 rounded-[2.5rem] bg-amber-500/[0.02] space-y-6">
                 <div className="h-12 w-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center font-black italic tracking-tighter"><Terminal size={24} /></div>
                 <div className="space-y-4">
                    <h4 className="text-lg font-black text-white italic tracking-widest uppercase italic leading-none">Integration Hub</h4>
                    <p className="text-[10px] text-muted-foreground italic uppercase italic leading-relaxed tracking-widest">Establish effectively the public verification portal in 3001v context.</p>
                 </div>
                 <div className="space-y-2 pt-4">
                    <DocLink label="GET /api/v1/verify/[id]" />
                    <DocLink label="POST /api/v1/certificates" />
                    <DocLink label="AUTH Bearer tc_live_..." />
                 </div>
              </div>

              <div className="card-surface border-white/5 p-8 rounded-[2.5rem] bg-black/40 flex flex-col items-center text-center space-y-6">
                 <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 animate-pulse"><Globe size={32} /></div>
                 <div className="space-y-2">
                    <h5 className="text-sm font-black text-white uppercase italic tracking-widest">Public Endpoint Security</h5>
                    <p className="text-[9px] text-muted-foreground italic leading-relaxed uppercase tracking-[0.2em] italic leading-relaxed italic">
                       All public verify calls are effectively rate-limited to 60/min per IP. Global consensus reached.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DocLink({ label }: { label: string }) {
   return (
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-amber-500/30 transition-all cursor-pointer group">
         <code className="text-[10px] font-mono text-amber-400/80 group-hover:text-white transition-colors">{label}</code>
         <ChevronRight size={12} className="text-muted-foreground/40 group-hover:text-amber-400" />
      </div>
   );
}

function Lock(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  )
}
