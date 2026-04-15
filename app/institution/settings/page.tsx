"use client";

import React, { useEffect, useState } from "react";
import { 
  Building2, 
  Settings, 
  Users, 
  Key, 
  Save, 
  RefreshCw, 
  Globe, 
  Palette, 
  Hash,
  ShieldCheck,
  UserPlus,
  Trash2,
  Mail,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/context/ToastContext";
import { useInstitution } from "@/lib/context/InstitutionContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export default function InstitutionSettings() {
  const { showToast } = useToast();
  const { refreshInstitutions } = useInstitution();
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [certPrefix, setCertPrefix] = useState("");
  const [accentColor, setAccentColor] = useState("#f59e0b");
  const [walletAddress, setWalletAddress] = useState("");
  const [verifiedDomain, setVerifiedDomain] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/institution/settings");
        if (!res.ok) throw new Error("Registry configuration fetch failed.");
        const data = await res.json();
        setInstitution(data);
        setName(data.name);
        setCertPrefix(data.certPrefix || "");
        setAccentColor(data.accentColor || "#f59e0b");
        setWalletAddress(data.walletAddress || "");
        setVerifiedDomain(data.verifiedDomain || "");
      } catch (err: any) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [showToast]);

  const handleUpdate = async (generateKey = false) => {
    try {
      const res = await fetch("/api/institution/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, certPrefix, accentColor, walletAddress, verifiedDomain, generateKey })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to synchronize organization metadata.");
      }
      const data = await res.json();
      setInstitution(data.institution);
      await refreshInstitutions();
      showToast("Configuration effectively synchronized.", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const copyKey = () => {
    if (!institution?.metadata?.secretKey) return;
    navigator.clipboard.writeText(institution.metadata.secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("API Key copied to clipboard.", "success");
  };

  if (loading) return (
     <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" />
     </div>
  );

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] -z-10" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 lg:py-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10 mb-16">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-12 bg-amber-500 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Institutional Configuration</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Hub Settings</h1>
              <p className="text-sm text-muted-foreground italic max-w-lg">
                Manage your organization effectively, configure the ledger prefix, and generate headless API keys.
              </p>
           </div>
           
           <Button onClick={() => handleUpdate(false)} className="btn-primary h-14 px-8 rounded-2xl shadow-lg">
              <Save size={18} className="mr-3" /> Save Changes
           </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Sidebar Tabs (Desktop) */}
           <div className="space-y-1">
              <SettingsTab icon={Building2} label="Organization" active />
              <Link href="/institution/settings/developers" className="block">
                <SettingsTab icon={Key} label="Developer API" />
              </Link>
              <Link href="/institution/settings/audit" className="block">
                <SettingsTab icon={ShieldCheck} label="Audit Logs" />
              </Link>
           </div>

           {/* Main Settings Form */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* General Section */}
              <section className="card-surface border-white/5 p-8 rounded-[2.5rem] bg-amber-500/[0.01] space-y-8">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <Palette size={18} className="text-amber-500" />
                    <h3 className="text-lg font-black text-white italic tracking-widest uppercase">General Identity</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Organization Name</label>
                       <Input value={name} onChange={e => setName(e.target.value)} className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-amber-500/30" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stellar Wallet (Identity)</label>
                       <Input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="G..." className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-amber-500/30 font-mono" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ledger Prefix</label>
                       <Input value={certPrefix} onChange={e => setCertPrefix(e.target.value)} placeholder="e.g. TC-2026-" className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-amber-500/30 uppercase" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Verified Domain</label>
                       <Input value={verifiedDomain} onChange={e => setVerifiedDomain(e.target.value)} placeholder="e.g. institution.edu" className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-amber-500/30" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Brand Accent</label>
                       <div className="flex items-center gap-4">
                          <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="h-12 w-20 bg-transparent border-none cursor-pointer" />
                          <code className="text-xs text-white bg-white/5 px-4 py-3 rounded-xl border border-white/5">{accentColor}</code>
                       </div>
                    </div>
                 </div>
              </section>

              {/* Developer / API Keys Section */}
              <section className="card-surface border-white/5 p-8 rounded-[2.5rem] bg-yellow-500/[0.01] space-y-8">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                       <Key size={18} className="text-yellow-500" />
                       <h3 className="text-lg font-black text-white italic tracking-widest uppercase">Developer API Keys</h3>
                    </div>
                    <Button onClick={() => handleUpdate(true)} variant="ghost" className="h-10 px-4 text-[10px] items-center gap-2 flex font-black uppercase text-yellow-400 hover:text-yellow-300">
                       <RefreshCw size={12} /> Regenerate Key
                    </Button>
                 </div>

                 <div className="space-y-4">
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                       Use this secret key to issue credentials headlessly via our API. <span className="text-rose-400 font-bold uppercase italic">Never share this publicly.</span>
                    </p>
                    {institution?.metadata?.secretKey ? (
                       <div className="relative group">
                          <div className="bg-black/40 border border-white/5 p-5 pr-14 rounded-2xl font-mono text-sm text-yellow-400/80 truncate">
                             {institution.metadata.secretKey}
                          </div>
                          <Button onClick={copyKey} variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-white">
                             {copied ? <Check size={16} /> : <Copy size={16} />}
                          </Button>
                       </div>
                    ) : (
                       <div className="p-8 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                          <p className="text-xs text-muted-foreground italic uppercase tracking-widest">No API Key effectively generated yet.</p>
                       </div>
                    )}
                 </div>
              </section>

              {/* Team Section */}
              <section className="card-surface border-white/5 p-8 rounded-[2.5rem] bg-amber-500/[0.01] space-y-8">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                       <Users size={18} className="text-amber-500" />
                       <h3 className="text-lg font-black text-white italic tracking-widest uppercase">Team Management</h3>
                    </div>
                    <Button variant="outline" className="h-10 px-4 rounded-xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest">
                       <UserPlus size={14} className="mr-2" /> Invite Member
                    </Button>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group transition-all hover:border-amber-500/20">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-black">PK</div>
                          <div>
                             <p className="text-sm font-bold text-white uppercase italic">Parth Karan</p>
                             <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><Mail size={10} /> parth@trustcert.io</p>
                          </div>
                       </div>
                       <span className="badge-orange badge text-[8px] uppercase tracking-widest">Owner / Administrator</span>
                    </div>
                 </div>
              </section>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SettingsTab({ icon: Icon, label, active }: any) {
   return (
      <button className={cn(
         "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-left group",
         active 
            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg" 
            : "text-muted-foreground hover:text-white hover:bg-white/5"
      )}>
         <Icon size={20} className={active ? "text-amber-400" : "text-muted-foreground group-hover:text-white"} />
         <span className="text-sm font-black uppercase tracking-widest italic">{label}</span>
      </button>
   );
}
