"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  Calendar, 
  RotateCcw,
  BookOpen,
  User,
  CheckCircle2,
  AlertCircle,
  QrCode
} from "lucide-react";
import QRCodeDisplay from "./QRCodeDisplay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface CertificateData {
  id: string;
  studentName: string;
  course: string;
  institution: string;
  issueDate: string;
  txHash: string;
  status: "verified" | "revoked";
}

interface CertificateCardProps {
  cert: CertificateData;
  delay?: number;
}

export default function CertificateCard({ cert, delay = 0 }: CertificateCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const flip = () => setIsFlipped(!isFlipped);

  return (
    <div 
      className={cn(
        "flip-card w-full h-[360px] cursor-pointer group",
        isFlipped && "flipped"
      )}
      onClick={flip}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay * 0.15, duration: 0.5 }}
        className="flip-card-inner relative w-full h-full"
      >
        {/* Front Face */}
        <div className="flip-card-front absolute inset-0 cert-card-border shadow-2xl">
          <div className="bg-[#0d0d1f] w-full h-full rounded-[13px] p-8 flex flex-col relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 duration-700">
               <ShieldCheck size={280} className="text-white" />
             </div>
             
             {/* Top Banner */}
             <div className="flex justify-between items-start mb-6">
                <div className="badge-amber badge">{cert.institution}</div>
                {cert.status === "verified" ? (
                  <div className="badge-orange badge flex items-center gap-1">
                    <CheckCircle2 size={10} /> Verified
                  </div>
                ) : (
                  <div className="badge-rose badge flex items-center gap-1 glitch-text">
                    <AlertCircle size={10} /> Revoked
                  </div>
                )}
             </div>

             {/* Content */}
             <div className="flex-1 space-y-4">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60">Certificate of Achievement</h4>
                <h2 className="text-3xl font-black text-white leading-tight break-words">{cert.course}</h2>
                <div className="space-y-1">
                   <p className="text-xs text-muted-foreground font-serif italic">This certifies that</p>
                   <p className="text-xl font-bold text-amber-400">{cert.studentName}</p>
                </div>
             </div>

             {/* Bottom Info */}
             <div className="mt-auto flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-[10px] items-center gap-1 flex uppercase font-bold tracking-widest text-muted-foreground/40">
                      <Calendar size={10} /> {cert.issueDate}
                   </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground/40 group-hover:text-amber-400 transition-colors">
                   <QrCode size={18} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Flip to Verify</span>
                </div>
             </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="flip-card-back absolute inset-0 rounded-2xl border border-amber-500/10 bg-[#0d0d1f] shadow-2xl overflow-hidden">
          <div className="h-1 lg:h-2 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500" />
          <div className="p-8 h-full flex flex-col items-center text-center">
             <QRCodeDisplay 
                data={origin ? `${origin}/verify/${cert.id}` : ""} 
                size={140}
                className="mb-6"
                label="Scan to Verify on Blockchain"
             />
             
             <div className="w-full space-y-4">
                <div className="bg-white/5 p-3 rounded-lg flex flex-col items-center gap-1">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest">Blockchain Signature</p>
                   <p className="font-mono-hash text-center text-white/70 break-all select-all hover:text-white transition-colors">{cert.txHash}</p>
                </div>

                <div className="flex flex-col gap-2">
                   <Button asChild size="sm" className="btn-primary w-full h-10">
                      <a href={`https://stellar.expert/explorer/testnet/tx/${cert.txHash}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={14} className="mr-2" /> View on Explorer
                      </a>
                   </Button>
                   <Button variant="ghost" className="btn-ghost w-full flex items-center gap-2 h-10" onClick={(e) => { e.stopPropagation(); flip(); }}>
                      <RotateCcw size={14} /> Back to Front
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
