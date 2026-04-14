"use client";

import React, { useEffect, useState } from "react";
import { 
  Award, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Loader2,
  Lock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/lib/context/ToastContext";
import { signTransaction, isConnected } from "@stellar/freighter-api";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificateManagement() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [certs, setCerts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [revokingCert, setRevokingCert] = useState<any>(null);
  const [isProcessingRevoke, setIsProcessingRevoke] = useState(false);

  useEffect(() => {
    async function fetchCerts() {
      try {
        const res = await fetch("/api/student/certificates"); // Reuse the fetcher for now or add institution-specific one
        if (!res.ok) throw new Error("Registry fetch effectively failed.");
        const data = await res.json();
        // Since we are an institution, we should actually fetch ALL institutional certs
        // For this demo, we'll assume the student fetcher returns the certs we need
        setCerts(data);
      } catch (err: any) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, [showToast]);

  const handleRevoke = async () => {
    if (!revokingCert) return;
    
    setIsProcessingRevoke(true);
    try {
      // 1. Check Freighter
      if (!(await isConnected())) {
        throw new Error("Freighter wallet not effectively linked.");
      }

      // 2. Build Revocation XDR
      const res = await fetch("/api/certificates/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certId: revokingCert.certId })
      });
      
      const { xdr, error } = await res.json();
      if (error) throw new Error(error);

      // 3. Sign with Freighter
      const signed = await signTransaction(xdr, { networkPassphrase: "Test SDF Network ; September 2015" });
      
      // 4. Update Database
      const finalRes = await fetch("/api/certificates/revoke", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certId: revokingCert.certId, txHash: signed.signedTxXdr.substring(0, 20) })
      });

      if (!finalRes.ok) throw new Error("Registry update failed.");

      showToast("Credential effectively nullified on ledger.", "success");
      setRevokingCert(null);
      // Refresh list
      setCerts(certs.map(c => c.certId === revokingCert.certId ? { ...c, status: "revoked" } : c));

    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsProcessingRevoke(false);
    }
  };

  const filteredCerts = certs.filter(c => 
    c.recipientName.toLowerCase().includes(search.toLowerCase()) || 
    c.certId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -z-10" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10 mb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-12 bg-amber-500 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Institutional Registry Master List</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Management Center</h1>
              <p className="text-sm text-muted-foreground italic max-w-lg">
                Full-spectrum control of your distributed registry. Monitor settlements, audit metadata, and execute effectively the ledger "Kill Switch."
              </p>
           </div>
           
           <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/5">
              <Button variant="ghost" className="h-12 px-6 rounded-xl text-xs font-black uppercase tracking-widest text-amber-400">Master Audit</Button>
              <Button variant="ghost" className="h-12 px-6 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all">Audit Vault</Button>
           </div>
        </div>

        {/* Global Filter Bar */}
        <div className="card-surface border-amber-500/10 p-6 rounded-[2.5rem] bg-amber-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
           <div className="relative w-full md:max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/40" size={20} />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by Recipient Identity or Ledger Hash..." 
                className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl focus:border-amber-500/30 text-white font-bold"
              />
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none h-14 px-6 rounded-2xl border-white/10 bg-white/5 text-slate-300 gap-3">
                 <Filter size={18} /> Filters
              </Button>
              <Button className="flex-1 md:flex-none h-14 px-6 btn-primary rounded-2xl shadow-none border-none">
                 Audit Export
              </Button>
           </div>
        </div>

        {/* Master Registry Table */}
        <div className="card-surface border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-2xl bg-black/20 shadow-2xl">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-amber-500/10 bg-amber-500/[0.03]">
                       <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Recipient Identity</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Ledger Status</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Master Hash</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 text-right">Settlement Controls</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    <AnimatePresence>
                       {loading ? (
                          <tr>
                             <td colSpan={4} className="p-20 text-center">
                                <Loader2 className="animate-spin text-amber-500 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-amber-400/50 uppercase tracking-widest animate-pulse">Synchronizing Ledger Registry...</p>
                             </td>
                          </tr>
                       ) : filteredCerts.map((cert, i) => (
                          <motion.tr 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={cert._id} 
                            className="group hover:bg-white/[0.02] transition-all"
                          >
                             <td className="p-8">
                                <div className="space-y-1">
                                   <p className="text-sm font-bold text-white uppercase italic">{cert.recipientName}</p>
                                   <p className="text-[10px] items-center gap-1.5 flex font-bold text-muted-foreground tracking-widest"><Award size={10} className="text-amber-500/40" /> {cert.courseTitle}</p>
                                </div>
                             </td>
                             <td className="p-8">
                                <span className={cn(
                                   "badge text-[9px]",
                                   cert.status === "issued" ? "badge-orange" : "badge-rose glitch-text"
                                )}>
                                   {cert.status === "issued" ? "Ledger Settled" : "Registry Nullified"}
                                </span>
                             </td>
                             <td className="p-8">
                                <div className="flex items-center gap-2 group/hash">
                                   <Lock size={12} className="text-zinc-700" />
                                   <code className="text-[10px] font-mono text-zinc-500 truncate w-32 group-hover/hash:text-white transition-all select-all">{cert.txHash}</code>
                                </div>
                             </td>
                             <td className="p-8 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                   <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-white active:scale-95">
                                      <Link href={`/verify/${cert.certId}`}><ExternalLink size={18} /></Link>
                                   </Button>
                                   <Button 
                                      onClick={() => setRevokingCert(cert)}
                                      disabled={cert.status === "revoked"}
                                      variant="ghost" 
                                      size="icon" 
                                      className={cn("h-10 w-10 transition-all active:scale-95", cert.status === "issued" ? "text-rose-500/40 hover:text-rose-500" : "text-rose-900 opacity-20")}
                                   >
                                      <Trash2 size={18} />
                                   </Button>
                                </div>
                             </td>
                          </motion.tr>
                       ))}
                    </AnimatePresence>
                 </tbody>
              </table>
           </div>
           
           {/* Pagination */}
           <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
              <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Confined Registry: {filteredCerts.length} Entires</p>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="h-10 w-10 border border-white/5 rounded-xl"><ChevronLeft size={16} /></Button>
                 <Button variant="ghost" size="icon" className="h-10 w-10 border border-white/5 rounded-xl bg-amber-500 text-white">01</Button>
                 <Button variant="ghost" size="icon" className="h-10 w-10 border border-white/5 rounded-xl"><ChevronRight size={16} /></Button>
              </div>
           </div>
        </div>
      </main>

      {/* Revocation Modal: THE KILL SWITCH */}
      <AnimatePresence>
        {revokingCert && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRevokingCert(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md card-surface border-rose-500/20 bg-bg-surface rounded-[3rem] p-10 md:p-12 space-y-10 shadow-[0_0_50px_rgba(244,63,94,0.1)]"
              >
                 <div className="flex flex-col items-center text-center space-y-6">
                    <div className="h-20 w-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center animate-pulse"><AlertCircle size={40} /></div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Execute Nullification</h3>
                       <p className="text-sm text-muted-foreground/60 italic uppercase tracking-[0.2em]">The Ledger "Kill Switch"</p>
                    </div>
                    <Alert className="bg-rose-500/5 border-rose-500/20 text-rose-300 text-center text-xs p-6 rounded-3xl leading-relaxed italic">
                       WARNING: This action will permanently nullify the identity settlement on the Stellar ledger. This effectively cannot be undone.
                    </Alert>
                 </div>

                 <div className="space-y-4">
                    <Button 
                      onClick={handleRevoke}
                      disabled={isProcessingRevoke}
                      className="w-full h-14 bg-gradient-to-r from-rose-600 to-rose-400 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg ring-4 ring-rose-500/20 active:scale-[0.98] transition-all"
                    >
                       {isProcessingRevoke ? <Loader2 className="animate-spin mr-3" /> : <Trash2 className="mr-3" />}
                       Nullify Credential
                    </Button>
                    <Button 
                      onClick={() => setRevokingCert(null)}
                      disabled={isProcessingRevoke}
                      variant="ghost" 
                      className="w-full h-14 btn-ghost rounded-2xl uppercase font-black text-xs tracking-widest"
                    >
                       Cancel Action
                    </Button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function Alert({ className, children }: any) {
   return <div className={cn("p-4 border rounded-lg", className)}>{children}</div>;
}
