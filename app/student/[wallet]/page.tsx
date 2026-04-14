"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, 
  Share2, 
  Globe, 
  Award, 
  TrendingUp, 
  ExternalLink,
  Loader2,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/context/ToastContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CertificateCard from "@/components/shared/CertificateCard";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentPublicProfile() {
  const { wallet } = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/student/${wallet}/certificates`);
        if (!res.ok) throw new Error("Profile not found.");
        const data = await res.json();
        setProfileData(data);
      } catch (err: any) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [wallet]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
        <p className="text-sm font-mono text-amber-500/50 uppercase tracking-[0.2em] animate-pulse">Fetching Public Identity...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-center space-y-6">
         <AlertCircle size={64} className="text-rose-500" />
         <h1 className="text-2xl font-black text-white italic uppercase italic">Profile Identity Null</h1>
         <p className="text-muted-foreground italic">The effectively specified wallet address effectively failed to resolve on the registry.</p>
         <Button asChild className="btn-secondary rounded-xl uppercase tracking-widest"><Link href="/">Return to Registry</Link></Button>
      </div>
    );
  }

  const { certificates, stats } = profileData;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent -z-10" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-20">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10 mb-20">
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500 to-yellow-500 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-all duration-700" />
                 <div className="relative h-32 w-32 rounded-full border-4 border-white/5 bg-[#0d0d1f] flex items-center justify-center overflow-hidden">
                    <ShieldCheck size={64} className="text-amber-400 group-hover:scale-110 transition-transform duration-500" />
                 </div>
              </div>
              <div className="text-center md:text-left space-y-2">
                 <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="h-2 w-8 bg-amber-500 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Verified On-Chain Resume</span>
                 </div>
                 <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Identity Portfolio</h1>
                 <p className="text-xs font-mono text-muted-foreground/60 break-all select-all flex items-center gap-2">
                   {wallet} <LinkIcon size={12} className="text-amber-500/40" />
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="card-surface border-amber-500/10 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center w-36">
                 <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Trust Score</p>
                 <p className="text-3xl font-black text-amber-400 italic leading-none uppercase">{stats.trustScore}</p>
              </div>
              <Button className="btn-primary h-14 px-8 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.2)]">
                 <Share2 size={18} className="mr-3" /> Share Portfolio
              </Button>
           </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
           <StatCard icon={Award} label="Identity Credentials" value={stats.totalCerts} color="amber" />
           <StatCard icon={Globe} label="Unique Issuers" value={stats.uniqueIssuers} color="orange" />
           <StatCard icon={TrendingUp} label="Institutional Trust" value={`${stats.trustScore}%`} color="yellow" />
        </div>

        {/* Portfolio Grid */}
        <div className="space-y-10">
           <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest leading-none">Public Credentials</h3>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold italic">Confined to established ledger consensus</p>
              </div>
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                 <button onClick={() => setFilter("all")} className={cn("px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all", filter === "all" ? "bg-amber-500 text-white" : "text-muted-foreground")}>All</button>
                 <button onClick={() => setFilter("recent")} className={cn("px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all", filter === "recent" ? "bg-amber-500 text-white" : "text-muted-foreground")}>Recent</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                 {certificates.map((cert: any, i: number) => (
                    <CertificateCard 
                      key={cert._id} 
                      delay={i}
                      cert={{
                        id: cert.certId,
                        studentName: cert.recipientName,
                        course: cert.courseTitle,
                        institution: cert.institutionId?.name || "The Network",
                        issueDate: new Date(cert.issueDate).toLocaleDateString(),
                        txHash: cert.txHash,
                        status: cert.status === "issued" ? "verified" : "revoked"
                      }}
                    />
                 ))}
              </AnimatePresence>
           </div>
           
           {certificates.length === 0 && (
             <div className="p-20 text-center space-y-4 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                <p className="text-muted-foreground italic">No public credentials effectively found in this portfolio.</p>
                <div className="h-1 w-24 bg-amber-500/20 mx-auto rounded-full" />
             </div>
           )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    amber: "text-amber-400 bg-amber-500/10",
    orange: "text-orange-400 bg-orange-500/10",
    yellow: "text-yellow-400 bg-yellow-500/10"
  };

  return (
    <div className="card-surface border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-500">
       <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", colors[color])}>
          <Icon size={32} />
       </div>
       <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 leading-none mb-2">{label}</p>
          <p className="text-3xl font-black text-white italic tracking-tight uppercase leading-none">{value}</p>
       </div>
    </div>
  );
}
