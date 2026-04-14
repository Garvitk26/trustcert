"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  Share2, 
  Calendar,
  Building,
  User,
  Hash,
  ArrowLeft,
  Cpu,
  Lock,
  Mail,
  Trash2,
  Settings,
  Activity,
  AlertCircle,
  Loader2,
  Globe,
  Database
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/lib/context/ToastContext";
import QRCodeDisplay from "@/components/shared/QRCodeDisplay";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useExportCertificate } from "@/hooks/useExportCertificate";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyPage() {
  const { certId } = useParams();
  const { showToast } = useToast();
  const { exportCertificate, isExporting } = useExportCertificate();
  const { data: session } = useSession();
  
  const [isScanning, setIsScanning] = useState(true);
  const [certData, setCertData] = useState<any>(null);
  const [stellarProof, setStellarProof] = useState<any>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isPhishing, setIsPhishing] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    if (session && certData) {
      const isOwner = (session.user as any).id === certData.institutionId?.ownerId;
      setIsAdminView(isOwner);
    }
  }, [session, certData]);

  useEffect(() => {
    async function performVerification() {
      try {
        // 1. Fetch from MongoDB
        const res = await fetch(`/api/certificates/verify?certId=${certId}`);
        if (!res.ok) {
          console.warn("Credential not found in registry.");
          return; // Exit early, isScanning will be set to false in finally
        }
        const data = await res.json();
        setCertData(data);

        // 1b. Phishing Protection Check
        if (typeof window !== "undefined" && data.institutionId?.verifiedDomain) {
           const currentHost = window.location.hostname;
           if (currentHost !== data.institutionId.verifiedDomain && currentHost !== "localhost") {
              setIsPhishing(true);
           }
        }

        // 2. Simulate "Scanning" delay for UX
        await new Promise(resolve => setTimeout(resolve, 2500));

        // 3. Live Stellar Fetch
        if (data.txHash) {
          const stellarRes = await fetch(`https://horizon-testnet.stellar.org/transactions/${data.txHash}`);
          if (stellarRes.ok) {
            const txData = await stellarRes.json();
            setStellarProof(txData);
          }
        }
      } catch (err: any) {
        console.error("Verification failed:", err);
        setErrorCount(prev => prev + 1);
      } finally {
        setIsScanning(false);
      }
    }
    performVerification();
  }, [certId]);

  const isRevoked = certData?.status === "revoked";
  const isValid = certData && !isRevoked;

  if (isScanning) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)]" />
        <div className="relative w-full max-w-md card-surface border-amber-500/10 p-12 rounded-[3rem] text-center space-y-8 backdrop-blur-xl shadow-2xl">
           <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-spin-ring" />
              <div className="absolute inset-2 border-2 border-dashed border-orange-500/40 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center text-amber-400">
                 <ShieldCheck size={40} className="animate-pulse" />
              </div>
           </div>
           
           <div className="space-y-3">
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase uppercase animate-pulse">Scanning Registry</h2>
              <p className="text-xs text-muted-foreground/60 tracking-[0.2em] font-mono leading-relaxed uppercase italic">
                 Querying Stellar Ledger for Transaction Hash & Memo Consensus...
              </p>
           </div>

           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
           </div>
        </div>
      </div>
    );
  }

  if (!certData) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col pt-24 pb-12 px-6">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
           <div className="p-6 rounded-full bg-rose-500/10 text-rose-500 animate-bounce">
              <AlertCircle size={64} />
           </div>
           <h1 className="text-3xl font-black text-white italic uppercase italic">Credential Invalid</h1>
           <p className="text-muted-foreground max-w-md italic">The provided Certificate ID was effectively null or effectively modified. Transaction effectively failed to settle on established ledger.</p>
           <Button asChild className="btn-secondary rounded-xl uppercase tracking-widest"><Link href="/">Back to TrustCert</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[100px] -z-10" />

      {/* PHISHING WARNING BANNER */}
      {isPhishing && (
         <div className="bg-rose-600/20 backdrop-blur-md border-y border-rose-500/30 py-4 px-6 relative z-50 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 text-center relative z-10">
               <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-rose-500 animate-pulse" />
                  <span className="text-sm font-black text-rose-500 glitch-text uppercase tracking-widest leading-none">Security Alert: Unrecognized Domain</span>
               </div>
               <p className="text-[10px] text-rose-300/80 font-bold uppercase tracking-widest italic max-w-2xl leading-relaxed italic">
                  This identity settlement is effectively being accessed from an unauthorized coordinate on the network. Established domain is <span className="underline">{certData.institutionId.verifiedDomain}</span>. Execute caution effectively.
               </p>
               <Button variant="outline" className="h-10 px-6 border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] items-center gap-2 flex font-black uppercase tracking-widest italic md:ml-4">
                  Report Incident
               </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/5 to-transparent animate-shimmer pointer-events-none" />
         </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Certificate Visual & Export */}
          <div className="flex-1 space-y-10 order-2 lg:order-1">
             <div className="relative group perspective-1000">
                <AnimatePresence mode="wait">
                  <motion.div 
                    initial={{ opacity: 0, rotateX: 30, scale: 0.9 }}
                    animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                    className="relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-all duration-1000" />
                    
                    <div id="certificate-visual" className="relative h-[380px] md:h-[520px] w-full card-surface border-amber-500/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
                       {/* Identity Reveal Animation Overlay */}
                       <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none transition-opacity duration-1000 opacity-0 group-hover:opacity-10" />
                       
                       {/* SCAN LINE OVER CERTIFACTE */}
                       <div className="scan-line z-30" />

                       {/* Status Indicator (Inside Cert) */}
                       <div className="absolute top-8 right-8 z-40 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                          <div className={cn("h-2 w-2 rounded-full", isValid ? "bg-amber-400 animate-pulse" : "bg-rose-500 animate-pulse")} />
                          <span className={cn("text-[9px] font-black uppercase tracking-widest", isValid ? "text-amber-300" : "text-rose-400")}>
                             {isValid ? "Ledger Verified" : "Settlement Nullified"}
                          </span>
                       </div>

                       {/* Certificate Core Information */}
                       <div className="h-full flex flex-col items-center justify-center p-8 md:p-16 text-center space-y-8 md:space-y-12">
                          <div className="space-y-4">
                             <div className={cn(
                               "h-16 w-16 mx-auto rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-700 group-hover:rotate-[360deg]",
                               isValid ? "bg-gradient-to-tr from-amber-500 to-orange-500" : "bg-gradient-to-tr from-rose-500 to-orange-500"
                             )}>
                                {isValid ? <ShieldCheck size={32} /> : <AlertCircle size={32} />}
                             </div>
                             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 leading-none">Global Academic Credential</h4>
                          </div>

                          <div className="space-y-4 max-w-2xl px-2">
                             <p className="text-xs md:text-sm font-serif italic text-slate-500">This certifies the digital attainment of</p>
                             <h1 className={cn(
                               "text-3xl md:text-6xl font-black italic tracking-tighter leading-tight",
                               isRevoked ? "glitch-text text-rose-500" : "text-white"
                             )}>
                                {certData.recipientName}
                             </h1>
                             <div className="h-1 w-24 bg-amber-500/20 mx-auto rounded-full" />
                             <h2 className="text-lg md:text-2xl font-bold text-amber-400 uppercase tracking-[0.2em]">{certData.courseTitle}</h2>
                          </div>

                          <div className="pt-8 border-t border-white/5 w-full flex items-center justify-between px-4 md:px-12">
                             <div className="text-left">
                                <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Issuer Identity</p>
                                <p className="text-sm font-bold text-white uppercase">{certData.institutionName || "The Network"}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Global Timestamp</p>
                                <p className="text-sm font-bold text-white uppercase">{new Date(certData.issueDate).toLocaleDateString()}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
             </div>

             <div className="flex flex-wrap items-center justify-center gap-4">
                <Button 
                  onClick={() => exportCertificate("certificate-visual", `TC_Audit_${certId}`)}
                  disabled={isExporting}
                  className="btn-primary h-14 px-10 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.2)] text-lg"
                >
                   {isExporting ? <Loader2 className="animate-spin mr-3" /> : <Download size={20} className="mr-3" />}
                   Export Verification Audit
                </Button>
                <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 uppercase tracking-widest text-xs font-bold transition-all active:scale-95">
                   <Share2 size={16} className="mr-3" /> Share Portfolio Entry
                </Button>
             </div>
          </div>

          {/* Verification Sidebar */}
          <div className="w-full lg:w-[420px] space-y-8 order-1 lg:order-2">
             <Card className={cn(
               "card-surface border-amber-500/10 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl shadow-2xl",
               isValid ? "border-amber-500/20" : "border-rose-500/20"
             )}>
                <div className={cn(
                  "h-2 w-full",
                  isValid ? "bg-gradient-to-r from-amber-500 to-yellow-500" : "bg-rose-500"
                )} />
                <CardContent className="p-8 md:p-10 space-y-10">
                   <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-2xl",
                        isValid ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-500"
                      )}>
                         {isValid ? <ShieldCheck size={28} /> : <AlertCircle size={28} />}
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-none">{isValid ? "Verified" : "Nullified"}</h3>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 italic">
                            On-Chain Blockchain Status
                         </p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <AuditField icon={Cpu} label="System Metadata" value={certData.certId} secondary="Immutable ID" />
                      <AuditField icon={Database} label="Registry Hash" value={certData.certHash} secondary="SHA-256 Digest" />
                      <AuditField icon={Globe} label="Stellar Hash" value={certData.txHash} secondary="Ledger Placement" />
                   </div>

                   {/* Live Proof Section */}
                   <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest uppercase">Live Proof</span>
                         {stellarProof ? (
                           <span className="badge-orange animate-pulse text-[8px]">Connected</span>
                         ) : (
                           <span className="badge-amber bg-amber-500/10 text-amber-500 text-[8px]">Fetching...</span>
                         )}
                      </div>
                      <div className="h-40 flex items-center justify-center bg-[#08080f] rounded-2xl border border-white/5 relative group">
                         <QRCodeDisplay data={typeof window !== "undefined" ? window.location.href : ""} size={140} />
                         {!stellarProof && <div className="absolute inset-0 bg-black/60 rounded-2xl backdrop-blur-[2px] flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" /></div>}
                      </div>
                      <p className="text-[9px] text-muted-foreground/60 text-center uppercase tracking-[0.2em] italic">Identity Mirror effectively confined to block {stellarProof?.ledger || "---"}</p>
                   </div>

                   {isValid && (
                     <Button asChild className="w-full h-14 btn-primary rounded-2xl font-black uppercase text-xs tracking-[0.2em]">
                        <a href={`https://stellar.expert/explorer/testnet/tx/${certData.txHash}`} target="_blank">
                          <ExternalLink size={16} className="mr-3" /> Audit on Stellar Expert
                        </a>
                     </Button>
                   )}
                </CardContent>
             </Card>

             {/* Verification Seal */}
             <div className="p-8 rounded-[2rem] bg-amber-500/[0.03] border border-amber-500/10 flex items-center gap-6 group hover:bg-amber-500/5 transition-all">
                <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                   <ShieldCheck size={32} />
                </div>
                <div className="space-y-1">
                   <h6 className="text-xs font-black text-white uppercase italic tracking-widest leading-none">Tamper Proof Secured</h6>
                   <p className="text-[10px] text-muted-foreground leading-relaxed italic uppercase italic">Globally Confined effectively by the Stellar Network Consensus Effectively Secured.</p>
                </div>
             </div>

             {/* ADMIN VIEW OVERLAY */}
             {isAdminView && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-surface border-yellow-500/20 rounded-[2.5rem] p-10 bg-yellow-500/[0.02] border-t-4 border-t-yellow-500 space-y-8 shadow-2xl relative mt-8"
                >
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 bg-yellow-500/10 text-yellow-400 rounded-2xl flex items-center justify-center"><Settings size={28} /></div>
                         <div>
                            <h4 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Command Overlay</h4>
                            <p className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest mt-1">Institutional Oversight View</p>
                         </div>
                      </div>
                      <span className="badge badge-yellow text-[8px] animate-pulse">ADMIN_SESSION</span>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Mail size={12} className="text-yellow-500/40" /> Recipient Private Mail</label>
                         <div className="p-4 bg-black/40 border border-white/5 rounded-2xl font-mono text-sm text-white/90">{certData.recipientEmail}</div>
                      </div>
                   </div>

                   <div className="pt-4 flex gap-4">
                      <Button asChild variant="outline" className="flex-1 h-12 rounded-xl border-white/10 bg-white/5 uppercase text-[10px] items-center gap-2 flex font-black tracking-widest">
                         <Link href="/institution/analytics"><Activity size={14} /> Analytics Hub</Link>
                      </Button>
                      <Button asChild className="flex-1 h-12 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl uppercase text-[10px] items-center gap-2 flex font-black tracking-widest">
                         <Link href="/institution/certificates"><Trash2 size={14} /> Revoke Master</Link>
                      </Button>
                   </div>
                </motion.div>
             )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function AuditField({ icon: Icon, label, value, secondary }: any) {
  return (
    <div className="space-y-2 group/field">
       <div className="flex items-center gap-2">
          <Icon size={12} className="text-amber-500/40" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none uppercase">{label}</span>
       </div>
       <div className="relative">
          <p className="text-[10px] font-mono text-white/70 break-all select-all leading-relaxed hover:text-amber-300 transition-colors cursor-pointer">{value || "PENDING_NULL"}</p>
          <span className="text-[8px] font-bold text-muted-foreground/40 absolute -bottom-4 right-0 uppercase tracking-tighter italic opacity-0 group-hover/field:opacity-100 transition-opacity uppercase">{secondary}</span>
       </div>
    </div>
  );
}
