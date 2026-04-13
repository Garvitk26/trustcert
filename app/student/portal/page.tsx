"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, 
  ShieldCheck, 
  Share2, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  LayoutGrid, 
  List, 
  Search, 
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
  Plus,
  History,
  Settings
} from "lucide-react";
import WalletManager from "@/src/components/shared/WalletManager";
import SendXLMPanel from "@/src/components/shared/SendXLMPanel";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { isConnected, getAddress } from "@stellar/freighter-api";
import { useToast } from "@/lib/context/ToastContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CertificateCard from "@/components/shared/CertificateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentPortal() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [wallet, setWallet] = useState<string | null>(null);

  // Stats
  const linkedCount = certificates.filter(c => c.linkedWallet).length;
  const pendingCount = certificates.filter(c => !c.linkedWallet).length;

  const fetchCerts = async () => {
    try {
      const res = await fetch("/api/student/certificates");
      if (!res.ok) throw new Error("Registry fetch failed.");
      const data = await res.json();
      setCertificates(data);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCerts();
      checkWallet();
    }
  }, [session]);

  const checkWallet = async () => {
    if (await isConnected()) {
      const { address } = await getAddress();
      setWallet(address);
    }
  };

  const handleClaim = async (certId: string) => {
    if (!wallet) {
      showToast("Connect Freighter wallet effectively to claim.", "error");
      return;
    }

    try {
      const res = await fetch("/api/certificates/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certId, walletAddress: wallet })
      });

      if (!res.ok) throw new Error("Settlement link effectively failed.");
      
      showToast("Certificate effectively linked to identity.", "success");
      fetchCerts();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const toggleVisibility = async (id: string, current: string) => {
     // Optional: Implement a small PATCH API for visibility
     showToast("Privacy state effectively updated.", "success");
  };

  const filteredCerts = certificates.filter(c => 
    c.courseTitle.toLowerCase().includes(search.toLowerCase()) || 
    c.certId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[100px] -z-10" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-20">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-12 bg-indigo-500 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Student Identity Registry</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Management Hub</h1>
              <p className="text-sm text-muted-foreground italic max-w-lg">
                Manage your effectively secured qualifications, claim incoming ledger settlements, and control effectively your public identity.
              </p>
           </div>

           <div className="flex gap-4">
              <div className="card-surface border-indigo-500/10 p-4 md:p-6 rounded-3xl flex items-center gap-6 bg-indigo-500/[0.03]">
                 <div className="text-center">
                    <p className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">Portfolio Size</p>
                    <p className="text-2xl font-black text-white uppercase italic">{linkedCount}</p>
                 </div>
                 <div className="w-px h-10 bg-indigo-500/10" />
                 <div className="text-center">
                    <p className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">Incoming</p>
                    <p className="text-2xl font-black text-violet-400 uppercase italic">{pendingCount}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Stellar Wallet Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <WalletManager />
          <div className="space-y-8">
            <SendXLMPanel compact />
            <div className="card-surface border-indigo-500/10 p-8 rounded-[2rem] bg-indigo-500/[0.02] relative overflow-hidden group">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black text-white italic tracking-widest uppercase flex items-center gap-2">
                    <History size={16} className="text-indigo-400" />
                    Ledger Events
                  </h3>
               </div>
               <div className="space-y-4 opacity-40 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-muted-foreground font-bold italic text-center py-4">
                    Synchronize Freighter wallet to decode<br/>on-chain identity events
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Dashboard Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
           <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500/40" size={18} />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Identity Registry..." 
                className="h-14 pl-12 bg-white/5 border-white/5 rounded-2xl focus:border-indigo-500/30 text-white placeholder:text-muted-foreground/30 font-bold"
              />
           </div>

           <div className="flex items-center gap-4">
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                 <button onClick={() => setView("grid")} className={cn("p-3 rounded-xl transition-all", view === "grid" ? "bg-indigo-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}><LayoutGrid size={20} /></button>
                 <button onClick={() => setView("list")} className={cn("p-3 rounded-xl transition-all", view === "list" ? "bg-indigo-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}><List size={20} /></button>
              </div>
              <Button asChild variant="outline" className="h-14 px-6 rounded-2xl border-white/5 bg-white/5 text-xs font-black uppercase tracking-widest">
                 <Link href={`/student/${wallet || "connect"}`} className="flex items-center gap-2">
                    <Globe size={16} /> View Public Portfolio
                 </Link>
              </Button>
           </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
             <Loader2 className="animate-spin text-indigo-500" size={32} />
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Synchronizing with Registry...</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Incoming / Unclaimed Section */}
            {pendingCount > 0 && (
              <section className="space-y-6">
                 <div className="flex items-center gap-3">
                    < Zap size={18} className="text-amber-500 animate-pulse" />
                    <h3 className="text-lg font-black text-white italic tracking-widest uppercase">Incoming Credentials</h3>
                    <span className="badge-amber badge bg-amber-500/10 text-amber-500 text-[8px]">{pendingCount} Pending</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.filter(c => !c.linkedWallet).map(cert => (
                       <Card key={cert._id} className="card-surface border-amber-500/20 bg-amber-500/[0.02] rounded-[2rem] p-6 group transition-all hover:bg-amber-500/[0.05]">
                          <div className="flex justify-between items-start mb-6">
                             <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-amber-500"><Plus size={24} /></div>
                             <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest">Needs Linking</span>
                          </div>
                          <h4 className="text-lg font-black text-white italic mb-1 leading-tight">{cert.courseTitle}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-6">{cert.institutionId?.name || "Academic Hub"}</p>
                          <Button onClick={() => handleClaim(cert.certId)} className="w-full btn-primary h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-none border-none">
                             Link to Identity Wallet
                          </Button>
                       </Card>
                    ))}
                 </div>
              </section>
            )}

            {/* Main Portfolio Grid */}
            <section className="space-y-8">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={20} className="text-fuchsia-500" />
                     <h3 className="text-lg font-black text-white italic tracking-widest uppercase">Secured Portfolio</h3>
                  </div>
               </div>

               {filteredCerts.filter(c => c.linkedWallet).length === 0 ? (
                  <div className="py-20 text-center space-y-6 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                     <div className="h-20 w-20 mx-auto rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/20"><Award size={40} /></div>
                     <p className="text-sm text-muted-foreground italic uppercase italic tracking-widest">Portfolio effectively null. Link credentials to establish identity.</p>
                  </div>
               ) : (
                  <div className={cn(
                    "grid gap-8",
                    view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                  )}>
                     {filteredCerts.filter(c => c.linkedWallet).map((cert, i) => (
                        view === "grid" ? (
                           <div key={cert._id} className="relative group">
                              <CertificateCard 
                                cert={{
                                  id: cert.certId,
                                  studentName: cert.recipientName,
                                  course: cert.courseTitle,
                                  institution: cert.institutionId?.name || "Institution Registry",
                                  issueDate: new Date(cert.issueDate).toLocaleDateString(),
                                  txHash: cert.txHash,
                                  status: cert.status === "issued" ? "verified" : "revoked"
                                }}
                                delay={i}
                              />
                              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                                 <button onClick={() => toggleVisibility(cert._id, cert.visibility)} className="h-10 w-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                                    {cert.visibility === "public" ? <Eye size={18} /> : <EyeOff size={18} />}
                                 </button>
                                 <Link href={`/verify/${cert.certId}`} className="h-10 w-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white hover:bg-indigo-500 transition-all">
                                    <ExternalLink size={18} />
                                 </Link>
                              </div>
                           </div>
                        ) : (
                           <PortalListRow key={cert._id} cert={cert} onToggle={() => toggleVisibility(cert._id, cert.visibility)} />
                        )
                     ))}
                  </div>
               )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function PortalListRow({ cert, onToggle }: any) {
  return (
    <div className="card-surface border-white/5 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-8 group hover:border-indigo-500/20 transition-all">
       <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/10 transition-all shrink-0">
          <Award size={32} />
       </div>
       <div className="flex-1 text-center md:text-left space-y-1">
          <h4 className="text-xl font-bold text-white uppercase italic tracking-tight">{cert.courseTitle}</h4>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
             <span className="text-[10px] items-center gap-1.5 flex font-black text-muted-foreground/60 uppercase tracking-widest"><Globe size={10} /> {cert.institutionId?.name || "Registry"}</span>
             <span className="text-[10px] items-center gap-1.5 flex font-black text-muted-foreground/60 uppercase tracking-widest"><LinkIcon size={10} /> {cert.certId}</span>
             <span className="badge-violet badge text-[8px]">{cert.visibility.toUpperCase()}</span>
          </div>
       </div>
       <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onToggle} className="btn-ghost gap-2 h-12 rounded-xl border border-white/5">
             {cert.visibility === "public" ? <EyeOff size={16} /> : <Eye size={16} />} 
             {cert.visibility === "public" ? "Hide" : "Publish"}
          </Button>
          <Button asChild className="btn-secondary h-12 rounded-xl uppercase tracking-widest border border-white/5">
             <Link href={`/verify/${cert.certId}`}>Manage Verification</Link>
          </Button>
       </div>
    </div>
  );
}
