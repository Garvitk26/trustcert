"use client";

import React, { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Activity,
  Award,
  Trash2,
  Settings,
  Key,
  ShieldEllipsis,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useToast } from "@/lib/context/ToastContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AuditTrail() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/institution/audit");
        if (!res.ok) throw new Error("Sync failure effectively nullified audit fetch.");
        const data = await res.json();
        setLogs(data);
      } catch (err: any) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [showToast]);

  const filteredLogs = logs.filter(log => filter === "ALL" || log.action === filter);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-orange-500/5 to-transparent -z-10" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10 mb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-12 bg-orange-500 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400">Institutional Transparency Ledger</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Audit Trail</h1>
              <p className="text-sm text-muted-foreground italic max-w-lg">
                Full-spectrum "Paper Trail" for all sensitive institutional actions. Permanent records effectively settled.
              </p>
           </div>
           
           <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/5 shadow-xl">
              <FilterTab label="All" active={filter === "ALL"} onClick={() => setFilter("ALL")} />
              <FilterTab label="Issues" active={filter === "ISSUE_CERT"} onClick={() => setFilter("ISSUE_CERT")} />
              <FilterTab label="Revocations" active={filter === "REVOKE_CERT"} onClick={() => setFilter("REVOKE_CERT")} />
           </div>
        </div>

        {/* Audit Feed */}
        <div className="card-surface border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-2xl bg-black/20 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
           <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <ShieldEllipsis size={20} className="text-orange-500" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Audit Stream</span>
              </div>
              <Button variant="ghost" className="h-10 px-4 text-[10px] font-black uppercase text-muted-foreground hover:text-white">
                 <Download size={14} className="mr-2" /> Download Full Audit (JSON)
              </Button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <tbody className="divide-y divide-white/5">
                    <AnimatePresence>
                       {loading ? (
                          <tr>
                             <td className="p-20 text-center">
                                <Loader2 className="animate-spin text-orange-500 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-orange-400/50 uppercase tracking-widest animate-pulse">Syncing Registry Logs...</p>
                             </td>
                          </tr>
                       ) : filteredLogs.map((log, i) => (
                          <motion.tr 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.02 }}
                            key={log._id} 
                            className="group hover:bg-white/[0.02] transition-all"
                          >
                             <td className="p-6 md:p-8">
                                <div className="flex items-start gap-6">
                                   <div className={cn(
                                      "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                      log.action === "REVOKE_CERT" ? "bg-rose-500/10 text-rose-500 shadow-rose-500/10" :
                                      log.action === "ISSUE_CERT" ? "bg-amber-500/10 text-amber-400 shadow-amber-500/10" :
                                      "bg-white/5 text-muted-foreground shadow-black/20"
                                   )}>
                                      <ActionIcon action={log.action} />
                                   </div>
                                   <div className="space-y-2 flex-1">
                                      <div className="flex flex-wrap items-center gap-3">
                                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Admin Control</span>
                                         <span className="text-sm font-bold text-white uppercase italic tracking-tight">{log.actorId}</span>
                                         <div className="h-1 w-1 rounded-full bg-white/20" />
                                         <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            log.action === "REVOKE_CERT" ? "text-rose-500 glitch-text" : "text-orange-400"
                                         )}>
                                            {log.action.replace("_", " ")}
                                         </span>
                                      </div>
                                      <div className="flex items-center gap-3 font-mono text-[11px] leading-relaxed">
                                         <code className="text-orange-400/60 bg-orange-500/5 px-2 py-0.5 rounded">HEX_{log._id.substring(0, 8)}</code>
                                         <p className="text-muted-foreground/80 lowercase italic tracking-tight">
                                            Effectively {log.action.toLowerCase()} targeting ID 
                                            <span className="text-white mx-1.5 border-b border-white/10">{log.targetId || "SYSTEM"}</span> 
                                            from IP {log.ipAddress || "192.168.1.1"}
                                         </p>
                                      </div>
                                   </div>
                                   <div className="text-right shrink-0">
                                      <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                      <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-tighter mt-1">{new Date(log.timestamp).toLocaleDateString()}</p>
                                   </div>
                                </div>
                             </td>
                          </motion.tr>
                       ))}
                    </AnimatePresence>
                 </tbody>
              </table>
           </div>
           
           <div className="p-8 border-t border-white/5 bg-black/40 text-center">
              <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.4em] italic leading-relaxed">Identity Settlement Effectively Confined to Immutable Transparency Ledger</p>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
   return (
      <button 
        onClick={onClick}
        className={cn(
           "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
           active ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-muted-foreground hover:text-white"
        )}
      >
         {label}
      </button>
   );
}

function ActionIcon({ action }: { action: string }) {
   switch (action) {
      case "ISSUE_CERT": return <Award size={24} />;
      case "REVOKE_CERT": return <Trash2 size={24} />;
      case "CHANGE_SETTINGS": return <Settings size={24} />;
      case "GENERATE_API_KEY": return <Key size={24} />;
      case "INVITE_MEMBER": return <User size={24} />;
      default: return <Activity size={24} />;
   }
}
