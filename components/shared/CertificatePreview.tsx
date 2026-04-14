"use client";

import React from "react";
import { ShieldCheck, Award, CheckCircle2, Hexagon, Building2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface CertificatePreviewProps {
  recipientName: string;
  courseName: string;
  institutionName: string;
  date: string;
  template: "Academic" | "Corporate" | "Digital";
  color?: string; // Hex color for accents
}

export default function CertificatePreview({ 
  recipientName, 
  courseName, 
  institutionName, 
  date, 
  template,
  color = "#f59e0b"
}: CertificatePreviewProps) {
  
  const templates: Record<string, React.JSX.Element> = {
    Academic: (
      <div className="relative w-full h-full bg-[#0d0d1f] flex flex-col items-center justify-center p-12 text-center border-[8px] border-double border-amber-500/15 m-2 overflow-hidden">
         <div className="absolute top-4 left-4 right-4 bottom-4 border border-amber-500/10 pointer-events-none" />
         <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8">
            <Building2 size={32} />
         </div>
         <h4 className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground/60 mb-6 font-serif">Certificate of Scholarship</h4>
         <p className="text-sm font-serif italic text-muted-foreground">This is to certify that</p>
         <h2 className="text-3xl font-black text-white mt-2 mb-6 font-serif underline decoration-amber-500/40 underline-offset-8">
            {recipientName || "Recipient Name"}
         </h2>
         <p className="text-sm font-serif italic text-muted-foreground">has successfully fulfilled the requirement for</p>
         <h3 className="text-xl font-bold text-amber-400 mt-2 mb-10">{courseName || "Course Name"}</h3>
         <div className="flex justify-between w-full pt-8 border-t border-amber-500/10">
            <div className="text-left">
               <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Institution</p>
               <p className="text-sm font-bold text-white">{institutionName || "TrustCert UI"}</p>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Issue Date</p>
               <p className="text-sm font-bold text-white">{date || "Jan 01, 2025"}</p>
            </div>
         </div>
      </div>
    ),
    Corporate: (
      <div className="relative w-full h-full bg-[#0d0d1f] flex flex-row items-center border border-amber-500/15 rounded-xl overflow-hidden shadow-2xl">
         <div className="w-1.5 h-full bg-amber-500" style={{ backgroundColor: color }} />
         <div className="flex-1 p-10 flex flex-col h-full bg-gradient-to-br from-amber-500/5 to-transparent">
            <div className="flex justify-between items-start mb-10">
               <div className="bg-white/5 p-2 rounded-lg flex items-center gap-2">
                 <ShieldCheck size={20} className="text-amber-400" style={{ color }} />
                 <span className="text-xs font-bold text-white">{institutionName || "TrustCert Corp"}</span>
               </div>
               <div className="badge badge-amber" style={{ backgroundColor: `${color}20`, borderColor: `${color}40`, color }}>Corporate Verified</div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-white leading-tight">{courseName || "Operational Excellence"}</h1>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-black text-sm">
                   {(recipientName || "RN")[0]}
                </div>
                <div>
                   <p className="text-sm font-bold text-white leading-none">{recipientName || "Professional Recipient"}</p>
                   <p className="text-[10px] text-muted-foreground">Certified Professional</p>
                </div>
              </div>
            </div>
            <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-6">
              <div className="space-y-1">
                 <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/40">Credential Issued</p>
                 <p className="text-sm font-bold text-white mb-1">{date || "Jan 01, 2025"}</p>
              </div>
              <Award size={40} className="text-amber-500 opacity-20" style={{ color }} />
            </div>
         </div>
      </div>
    ),
    Digital: (
      <div className="relative w-full h-full bg-[#0d0d1f] flex flex-col items-center justify-center p-12 text-center border border-orange-500/20 rounded-3xl group overflow-hidden">
         {/* Hex Pattern Overlay */}
         <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
         <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-yellow-500/10 pointer-events-none" />
         
         <div className="relative z-10 space-y-6">
            <div className="h-16 w-16 bg-gradient-to-tr from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-[0_0_20px_rgba(99,102,241,0.3)]">
               <Hexagon size={32} />
            </div>
            <div className="space-y-2">
               <h4 className="text-[10px] uppercase font-bold tracking-[0.4em] gradient-text-2">Future Ready Credential</h4>
               <h2 className="text-4xl font-black text-white italic tracking-tight italic">{recipientName || "Identity Matrix"}</h2>
            </div>
            <div className="p-1 px-4 bg-white/5 rounded-full inline-flex items-center gap-2 border border-white/5">
                <Globe size={12} className="text-cyan-400" />
                <span className="text-xs font-bold text-white">{courseName || "Web3 Architecture"}</span>
            </div>
            <div className="pt-6 grid grid-cols-2 gap-8 w-full">
               <div className="text-left space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Institution Hub</p>
                  <p className="text-xs font-bold text-white">{institutionName || "The Network"}</p>
               </div>
               <div className="text-right space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Timestamp</p>
                  <p className="text-xs font-bold text-white">{date || "2025.01.01"}</p>
               </div>
            </div>
         </div>
      </div>
    )
  };

  return (
    <div className="w-full h-full min-h-[360px] relative">
      {templates[template] || templates.Academic}
    </div>
  );
}
