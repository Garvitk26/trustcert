"use client";

import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { 
  Shield, 
  CheckCircle2, 
  Globe, 
  Lock, 
  ArrowRight, 
  Zap, 
  Database, 
  QrCode, 
  Search,
  Cpu,
  BarChart,
  ChevronRight,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import ParticleNetwork from "@/components/landing/ParticleNetwork";
import TypewriterHeadline from "@/components/landing/TypewriterHeadline";
import LiveVerificationFeed from "@/components/landing/LiveVerificationFeed";
import BlockchainVisual from "@/components/landing/BlockchainVisual";
import CertificateCard from "@/components/shared/CertificateCard";
import { Button } from "@/components/ui/button";
import { useExportCertificate } from "@/hooks/useExportCertificate";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/verify/${searchQuery.trim()}`);
    }
  };

  const mockCert = {
    id: "CERT-7729-TC",
    studentName: "Parth Karan",
    course: "Blockchain Architecture",
    institution: "Stellar Academy",
    issueDate: "2024-05-20",
    txHash: "0x1a2b3c...9f",
    status: "verified" as const
  };

  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [trustRef, trustVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  return (
    <div className="flex flex-col min-h-screen bg-bg-base relative overflow-hidden">
      <Navbar />
      
      {/* Dynamic Background */}
      <ParticleNetwork />
      <div className="ambient-bg opacity-30" />
      <div className="ambient-blob-3 opacity-20" />

      <main className="flex-1 relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[0.7rem] font-bold uppercase tracking-widest backdrop-blur-md">
                <Shield size={14} className="text-orange-400" />
                <span>Next-Gen Academic Infrastructure</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
                <span className="block italic">Decentralized Trust.</span>
                <TypewriterHeadline 
                  phrases={[
                    "Verify Academic Credentials", 
                    "Issue Professional Certs", 
                    "Secure Digital Identity"
                  ]} 
                />
              </h1>

              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                Empowering institutions to issue tamper-proof credentials and students to own their achievements forever. Built on the <span className="text-amber-400 font-bold">Stellar Network</span>.
              </p>

              {/* QR Search Bar */}
              <form onSubmit={handleSearch} className="relative group max-w-lg">
                 <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
                 <div className="relative flex items-center bg-bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="pl-6 text-slate-500">
                       <Search size={20} />
                    </div>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Paste Certificate ID or Transaction Hash..."
                      className="w-full bg-transparent border-none text-white px-4 py-6 focus:ring-0 placeholder:text-slate-600 font-medium"
                    />
                    <button className="h-full px-6 bg-white/5 hover:bg-white/10 text-amber-400 border-l border-white/5 transition-colors flex items-center gap-2">
                       <QrCode size={20} />
                       <span className="text-[10px] uppercase font-black tracking-widest hidden sm:inline">Scan QR</span>
                    </button>
                 </div>
              </form>

              <div className="flex items-center gap-8 pt-4">
                 <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-10 w-10 round-full border-2 border-bg-base bg-amber-500/20 flex items-center justify-center rounded-full">
                         <span className="text-[8px] font-bold text-white">U{i}</span>
                      </div>
                    ))}
                    <div className="h-10 w-10 round-full border-2 border-bg-base bg-bg-surface flex items-center justify-center rounded-full text-amber-400">
                       <Plus size={16} />
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    <span className="text-white">5,000+</span> Institutional Users Worldwide
                 </p>
              </div>
            </motion.div>

            {/* Hero Visual Mock */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block perspective-1000"
            >
               <div className="absolute -inset-10 bg-amber-500/10 blur-[100px] rounded-full" />
               <div className="relative group/float translate-y-[-20px] transition-transform duration-[3s] ease-in-out hover:translate-y-[-40px]">
                 <CertificateCard cert={mockCert} />
               </div>
               
               {/* Floating elements */}
               <div className="absolute -top-10 -right-10 animate-bounce duration-[4s]">
                 <div className="badge-orange badge px-6 py-3 shadow-2xl">Ledger Confirmed</div>
               </div>
               <div className="absolute -bottom-10 -left-10 animate-pulse duration-[5s]">
                 <div className="badge px-6 py-3 border-amber-500/20 bg-black/40 backdrop-blur-xl text-white font-mono text-xs">TX: 0x1a2b...9f</div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* --- TRUSTED BY MARQUEE --- */}
        <section className="py-20 border-y border-white/5 bg-white/[0.02]">
           <div className="max-w-7xl mx-auto px-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center text-slate-500 mb-12">Infrastructure Powering Global Education</p>
              <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                  <LogoPlaceholder text="MIT" />
                  <LogoPlaceholder text="Google Cloud" />
                  <LogoPlaceholder text="Meta" />
                  <LogoPlaceholder text="Stanford" />
                  <LogoPlaceholder text="Coursera" />
              </div>
           </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section 
          ref={featuresRef as any}
          className={cn(
            "py-32 px-4 relative transition-all duration-1000",
            featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          )}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
               <div className="space-y-4">
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Engineered for <span className="text-amber-500">Integrity</span>.</h2>
                 <p className="text-lg text-slate-400 max-w-xl">Every certificate is a secure, verifiable asset on the world's most scalable blockchain network.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FeatureCard 
                    icon={Shield} 
                    title="Immutable Storage" 
                    desc="Certificates are hashed and pinned to the Stellar ledger, making them impossible to alter or forge."
                    accent="border-amber-500/30"
                 />
                 <FeatureCard 
                    icon={Zap} 
                    title="Instant Issuance" 
                    desc="Process batch uploads of 1,000+ certificates in seconds with instant delivery to student wallets."
                    accent="border-orange-500/30"
                 />
                 <FeatureCard 
                    icon={Globe} 
                    title="Global Portability" 
                    desc="Standards-compliant credentials that move with the user across platforms and borders."
                    accent="border-yellow-500/30"
                 />
                 <FeatureCard 
                    icon={Lock} 
                    title="Privacy First" 
                    desc="Selective disclosure allows students to share proof of completion without revealing sensitive data."
                    accent="border-amber-500/30"
                 />
                 <FeatureCard 
                    icon={Cpu} 
                    title="API Integration" 
                    desc="Seamlessly connect your LMS or HR system to our automated issuance and verification engine."
                    accent="border-orange-500/30"
                 />
                 <FeatureCard 
                    icon={BarChart} 
                    title="Live Analytics" 
                    desc="Deep insights into issuance metrics, verification attempts, and geographical reach."
                    accent="border-yellow-500/30"
                 />
               </div>
            </div>

            <div className="lg:col-start-3">
               <LiveVerificationFeed />
            </div>
          </div>
        </section>

        {/* --- VALUE PROPS (TRUST) --- */}
        <section 
          ref={trustRef as any}
          className={cn(
            "py-32 px-4 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent transition-all duration-1000 delay-300",
            trustVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <div className="max-w-7xl mx-auto space-y-24">
            
            {/* The Stellar Advantage */}
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase">The Stellar Advantage</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed uppercase tracking-widest font-mono">Immutable. Instant. <span className="text-amber-400">$0.00001 fees</span>.</p>
              <BlockchainVisual />
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
               <div className="card-surface border-amber-500/10 p-12 rounded-[2rem] space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700" />
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Shield size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">For Institutions</h3>
                    <p className="text-slate-400 leading-relaxed italic text-lg">Bulk issue 1,000+ certs in one click. Custom branding, verification portals, and automated student delivery.</p>
                  </div>
                  <Button className="btn-primary w-full h-14 text-lg">Launch Institution Console</Button>
               </div>

               <div className="card-surface border-orange-500/10 p-12 rounded-[2rem] space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-orange-500/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700" />
                  <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                    <Globe size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">For Students</h3>
                    <p className="text-slate-400 leading-relaxed italic text-lg">One wallet. Every achievement. Forever. Build a verified digital identity and share it instantly with employers.</p>
                  </div>
                  <Button variant="outline" className="w-full h-14 text-lg border-white/5 text-white hover:bg-white/5">Access Student Vault</Button>
               </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section 
          ref={ctaRef as any}
          className={cn(
            "py-40 px-4 relative text-center transition-all duration-1000",
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#f59e0b_0%,_transparent_70%)] opacity-[0.05]" />
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
               <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic">Ready to Build Trust?</h2>
               <p className="text-xl text-slate-400 max-w-2xl mx-auto italic">Join the next generation of academic integrity. Set up your institution in under 5 minutes.</p>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <Link href="/signup">
                  <Button className="btn-primary px-12 py-8 text-xl font-black rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.3)]">Get Started Now</Button>
                 </Link>
                 <Link href="/pricing">
                  <Button variant="ghost" className="px-12 py-8 text-xl font-bold text-slate-400 hover:text-white border border-white/5 rounded-2xl">View Pricing</Button>
                 </Link>
               </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent }: any) {
  return (
    <div className={cn("card-surface card-hover group p-8 space-y-4 relative overflow-hidden bg-black/40", accent)}>
       <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-500">
          <Icon size={24} />
       </div>
       <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors uppercase tracking-widest">{title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed font-serif italic">{desc}</p>
       </div>
    </div>
  );
}

function LogoPlaceholder({ text }: { text: string }) {
  return <span className="text-xl md:text-3xl font-black tracking-tighter text-white/20 hover:text-white/40 transition-colors uppercase italic">{text}</span>;
}
