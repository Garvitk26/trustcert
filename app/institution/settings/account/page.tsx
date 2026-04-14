"use client";

import React, { useEffect, useState } from "react";
import { 
  Building2, 
  Palette, 
  Type, 
  Globe, 
  Save, 
  Loader2, 
  AlertCircle,
  Link as LinkIcon,
  ShieldCheck,
  Zap,
  Fingerprint
} from "lucide-react";
import { useInstitution } from "@/lib/context/InstitutionContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AccountSettingsPage() {
  const { activeInstitution, setActiveInstitution } = useInstitution();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    accentColor: "#f59e0b",
    certPrefix: "CERT",
    verifiedDomain: ""
  });

  useEffect(() => {
    if (activeInstitution) {
      setFormData({
        name: activeInstitution.name || "",
        accentColor: activeInstitution.accentColor || "#f59e0b",
        certPrefix: (activeInstitution as any).certPrefix || "CERT",
        verifiedDomain: (activeInstitution as any).verifiedDomain || ""
      });
    }
  }, [activeInstitution]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInstitution) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/institutions/${activeInstitution._id}`, {
        method: "PATCH",
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Synchronization failure on the network.");
      const updated = await res.json();
      setActiveInstitution(updated);
      showToast("Identity registry updated effectively.", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      {/* HEADER */}
      <div className="space-y-3">
         <div className="flex items-center gap-2">
            <div className="h-2 w-12 bg-amber-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Institutional Identity</span>
         </div>
         <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Brand Registry</h1>
         <p className="text-xs text-muted-foreground italic uppercase tracking-widest leading-relaxed italic">
            Configure your global manifestation on the Stellar Network Consensus Decentralized Identity layer.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         
         {/* MAIN CONFIGURATION */}
         <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
               <Card className="card-surface border-amber-500/10 rounded-[2.5rem] bg-amber-500/[0.01] overflow-hidden">
                  <CardHeader className="p-10 border-b border-amber-500/5">
                     <CardTitle className="text-xl font-black text-white uppercase italic tracking-widest">Base Identity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 space-y-10">
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] leading-none mb-2 block flex items-center gap-2 italic">
                              <Building2 size={12} /> Institutional Title
                           </label>
                           <Input 
                             value={formData.name}
                             onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                             className="h-14 bg-black/40 border-white/5 rounded-2xl focus:border-amber-500/40 text-lg font-black italic tracking-tight"
                           />
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] leading-none mb-2 block flex items-center gap-2 italic">
                              <Type size={12} /> Certification Prefix
                           </label>
                           <Input 
                             value={formData.certPrefix}
                             onChange={(e) => setFormData(prev => ({ ...prev, certPrefix: e.target.value }))}
                             className="h-14 bg-black/40 border-white/5 rounded-2xl focus:border-amber-500/40 text-lg font-black uppercase tracking-widest"
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] leading-none mb-2 block flex items-center gap-2 italic">
                           <Palette size={12} /> Institutional Accent Color
                        </label>
                        <div className="flex items-center gap-6">
                           <div 
                             className="h-14 w-14 rounded-2xl shadow-2xl border border-white/10 shrink-0" 
                             style={{ backgroundColor: formData.accentColor }} 
                           />
                           <Input 
                             type="color"
                             value={formData.accentColor}
                             onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                             className="h-14 w-full bg-black/40 border-white/5 rounded-2xl p-2 cursor-pointer"
                           />
                        </div>
                     </div>

                  </CardContent>
               </Card>

               <Card className="card-surface border-amber-500/10 rounded-[2.5rem] bg-amber-500/[0.01] overflow-hidden">
                  <CardHeader className="p-10 border-b border-amber-500/5">
                     <CardTitle className="text-xl font-black text-white uppercase italic tracking-widest">Network Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] leading-none mb-2 block flex items-center gap-2 italic">
                           <Globe size={12} /> Verified Network Domain
                        </label>
                        <div className="relative">
                           <Input 
                             value={formData.verifiedDomain}
                             onChange={(e) => setFormData(prev => ({ ...prev, verifiedDomain: e.target.value }))}
                             placeholder="identity.institution.edu"
                             className="h-14 bg-black/40 border-white/5 rounded-2xl focus:border-amber-500/40 pl-12 font-mono text-amber-300"
                           />
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/40">
                              <LinkIcon size={18} />
                           </div>
                        </div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest italic pt-2">Used to prevent phishing attacks effectively globally.</p>
                     </div>
                  </CardContent>
               </Card>

               <div className="flex justify-end gap-6 pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="h-16 px-12 btn-primary rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.2)] text-lg font-black italic tracking-tighter"
                  >
                     {loading ? <Loader2 className="animate-spin mr-3" /> : <Save size={20} className="mr-3" />}
                     Commit to Ledger
                  </Button>
               </div>
            </form>
         </div>

         {/* SIDEBAR: STATUS & STATS */}
         <div className="space-y-8">
            <Card className="card-surface border-amber-500/10 p-8 rounded-[2.5rem] bg-amber-500/[0.02] space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Network Status</span>
                     <span className="badge-orange animate-pulse text-[8px]">ACTIVE</span>
                  </div>
                  <div className="h-1 w-full bg-amber-500/10 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 w-3/4 shadow-[0_0_10px_#f59e0b]" />
                  </div>
               </div>

               <div className="space-y-6">
                  <StatRow icon={Fingerprint} label="Stellar ID" value={activeInstitution?.walletAddress ? `${activeInstitution.walletAddress.substring(0,6)}...${activeInstitution.walletAddress.substring(50)}` : "NOT_LINKED"} />
                  <StatRow icon={Zap} label="Monthly Cycles" value="1,240 / 5,000" />
                  <StatRow icon={ShieldCheck} label="Trust Score" value="A+ Consensus" />
               </div>

               <div className="pt-8 border-t border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic leading-relaxed italic">Institutional Key Consensus</h4>
                  <div className="p-4 bg-black border border-white/5 rounded-xl font-mono text-[9px] text-slate-500 break-all select-all">
                     {activeInstitution?._id}_IDENTITY_ROOT_KEY_ESTABLISHED
                  </div>
               </div>
            </Card>

            <div className="p-8 rounded-[2.5rem] bg-rose-500/[0.03] border border-rose-500/10 space-y-4 group hover:bg-rose-500/5 transition-all">
               <div className="flex items-center gap-3">
                  <AlertCircle size={16} className="text-rose-500 animate-pulse" />
                  <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Danger Protocol</h4>
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed italic uppercase italic">Soft-deleting this registry will effectively nullify all future certificate issuances on the global manifest.</p>
               <Button variant="ghost" className="w-full h-12 text-rose-500 hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest">Nullify Institution</Button>
            </div>
         </div>

      </div>
    </div>
  );
}

function StatRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between group">
       <div className="flex items-center gap-3">
          <Icon size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
       </div>
       <span className="text-xs font-black text-white italic">{value}</span>
    </div>
  );
}
