"use client";

import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { 
  Check, 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  ArrowRight,
  TrendingUp,
  Mail,
  Smartphone,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const tiers = [
    {
      name: "Starter",
      tagline: "Ideal for individual projects",
      price: "0",
      accent: "amber",
      features: [
        "5 Certificates per month",
        "Standard Verification Portal",
        "Stellar Ledger Confirmation",
        "Basic Analytics",
        "Public QR verification"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      tagline: "For growing organizations",
      price: isYearly ? "39" : "49",
      accent: "orange",
      features: [
        "Unlimited Certificates",
        "Full Branding Customization",
        "Advanced Verification Analytics",
        "Priority Email Support",
        "Custom Logo on Verifier",
        "API Basic Access (100req/min)"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      tagline: "For global scale institutions",
      price: "Custom",
      accent: "yellow",
      features: [
        "Unlimited Multi-chain Issuance",
        "SLA Guarantee (99.9%)",
        "SSO & Multi-sig Integration",
        "Dedicated Account Manager",
        "Full System White-labeling",
        "On-premise Deployment Option"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-base relative overflow-hidden">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="ambient-bg opacity-20" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 0)', backgroundSize: '60px 60px' }} />

      <main className="flex-1 relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* --- TOP HEADER --- */}
          <section className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                Scalable <span className="text-amber-500">Trust</span>.
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed italic">
                Transparent, low-fee credentialing for organizations of all sizes. Choose the tier that matches your issuance scale.
              </p>
            </motion.div>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center gap-6 pt-6">
               <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", !isYearly ? "text-white" : "text-slate-500")}>Monthly</span>
               <button 
                onClick={() => setIsYearly(!isYearly)}
                className="h-8 w-14 bg-bg-surface border border-white/5 rounded-full relative p-1 transition-colors hover:border-amber-500/50"
               >
                 <motion.div 
                    animate={{ x: isYearly ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="h-full aspect-square bg-amber-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                 />
               </button>
               <div className="flex items-center gap-2">
                 <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", isYearly ? "text-white" : "text-slate-500")}>Yearly</span>
                 <span className="badge-amber badge text-[10px] py-1 px-2">Save 20%</span>
               </div>
            </div>
          </section>

          {/* --- PRICING CARDS --- */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
             {tiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.8 }}
                  className={cn(
                    "relative card-surface p-12 rounded-[2.5rem] border border-white/5 flex flex-col group",
                    tier.popular && "border-amber-500/30 shadow-[0_0_50px_rgba(99,102,241,0.1)]"
                  )}
                >
                   {tier.popular && (
                     <div className="absolute top-0 right-12 -translate-y-1/2">
                       <div className="badge-orange badge px-6 py-2 shadow-2xl font-black italic">Most Popular</div>
                     </div>
                   )}

                   <div className="mb-10 space-y-2">
                      <h3 className="text-2xl font-black text-white uppercase tracking-widest">{tier.name}</h3>
                      <p className="text-sm text-slate-500 italic">{tier.tagline}</p>
                   </div>

                   <div className="mb-10 flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">{tier.price === "Custom" ? "" : "$"}{tier.price}</span>
                      {tier.price !== "Custom" && <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/ month</span>}
                   </div>

                   <div className="flex-1 space-y-6 mb-12 border-t border-white/5 pt-8">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 group-hover:translate-x-1 transition-transform">
                           <div className="mt-1 p-0.5 rounded-full bg-amber-500/10 text-amber-400">
                             <Check size={12} />
                           </div>
                           <p className="text-sm text-slate-400 leading-tight">{feature}</p>
                        </div>
                      ))}
                   </div>

                   <Button className={cn(
                     "w-full h-16 text-lg font-black rounded-2xl transition-all",
                     tier.popular ? "btn-primary shadow-[0_0_30px_rgba(99,102,241,0.3)]" : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                   )}>
                      {tier.cta}
                   </Button>
                </motion.div>
             ))}
          </section>

          {/* --- FINAL CTA FOOTER --- */}
          <section className="relative p-16 md:p-24 rounded-[3rem] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-yellow-600/20 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="absolute inset-0 bg-bg-surface/80 backdrop-blur-2xl" />
              
              <div className="relative z-10 text-center space-y-12">
                 <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">Trust, Redefined.</h2>
                 <p className="text-xl text-slate-400 max-w-2xl mx-auto italic leading-relaxed">Join 500+ institutions already issuing thousands of certificates daily. Safe, instant, global.</p>
                 
                 <div className="flex flex-wrap justify-center gap-6">
                    <Button asChild className="btn-primary h-20 px-16 text-2xl font-black rounded-3xl group shadow-[0_0_50px_rgba(99,102,241,0.3)] hover:scale-105 transition-transform active:scale-95">
                       <Link href="/signup">
                          Ready to Build trust? <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" size={28} />
                       </Link>
                    </Button>
                 </div>
              </div>
          </section>

          {/* FAQ/Questions Section */}
          <section className="pt-20 grid grid-cols-1 md:grid-cols-2 gap-16 px-8">
             <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-amber-500">Security First</h4>
                <h3 className="text-4xl font-bold text-white tracking-tight leading-[1.1]">All data is multi-cloud backed and signed by HSMs.</h3>
                <p className="text-slate-500 leading-relaxed italic text-lg">We ensure your institution's digital reputation is never compromised. Private keys are managed via industry-standard hardware security modules.</p>
             </div>
             <div className="grid grid-cols-2 gap-8">
                <PricingSubFeature icon={Shield} title="SOC 2 Ready" />
                <PricingSubFeature icon={Globe} title="GDPR Compliant" />
                <PricingSubFeature icon={Lock} title="End-to-End SSL" />
                <PricingSubFeature icon={TrendingUp} title="99.9% Uptime" />
             </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PricingSubFeature({ icon: Icon, title }: any) {
  return (
    <div className="flex items-center gap-3">
       <div className="h-10 w-10 rounded-xl bg-bg-surface border border-white/5 flex items-center justify-center text-amber-400">
          <Icon size={20} />
       </div>
       <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{title}</span>
    </div>
  );
}
