"use client";

import React from "react";
import { useInstitution } from "@/lib/context/InstitutionContext";
import { DashboardSkeleton } from "@/components/shared/Skeleton";
import { 
  Users, 
  FileCheck, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Zap,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function InstitutionDashboard() {
  const { activeInstitution, loading } = useInstitution();

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Command Center</h1>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic leading-none">
             Established for {activeInstitution?.name}
          </p>
        </div>
        <Button asChild className="h-14 px-8 btn-primary rounded-2xl shadow-lg shadow-indigo-500/20 font-black uppercase tracking-widest italic text-xs">
           <Link href="/institution/issue">
              <Plus size={18} className="mr-2" />
              Issue New Ledger
           </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Certificates" 
          value="1,284" 
          icon={FileCheck} 
          trend="+12% Settlement Velocity"
          trendUp={true} 
          color="indigo"
        />
        <StatCard 
          title="Identity Nodes" 
          value="842" 
          icon={Users} 
          trend="+5.2% Consensus"
          trendUp={true} 
          color="violet"
        />
        <StatCard 
          title="Blockchain Auth" 
          value="99.9%" 
          icon={ShieldCheck} 
          trend="Secured on Stellar"
          trendUp={true} 
          color="fuchsia"
        />
        <StatCard 
          title="Registry Uptime" 
          value="100%" 
          icon={Activity} 
          trend="Operational Horizon"
          trendUp={true} 
          color="sky"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Activity */}
        <div className="p-10 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <Zap size={120} className="text-indigo-500" />
          </div>
          
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none flex items-center gap-3">
              <TrendingUp size={24} className="text-indigo-400" />
              Recent Issuances
            </h3>
            <Link href="/institution/certificates">
              <Button variant="ghost" size="sm" className="btn-ghost rounded-xl uppercase font-black text-[10px] tracking-widest italic">Grid View</Button>
            </Link>
          </div>
          
          <div className="space-y-6 relative z-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all cursor-pointer group/item">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover/item:scale-110 transition-transform">
                     <FileCheck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-tight">Post-Graduate Cert #{1024 + i}</p>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Enrolled Consensus Protocol</p>
                  </div>
                </div>
                <ArrowUpRight size={18} className="text-indigo-500 opacity-20 group-hover/item:opacity-100 group-hover/item:translate-x-1 group-hover/item:-translate-y-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Global Reach */}
        <div className="p-10 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <Globe size={120} className="text-fuchsia-500" />
          </div>
          
          <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-10 flex items-center gap-3 relative z-10">
            <Activity size={24} className="text-fuchsia-400" />
            Vitals Analytics
          </h3>
          
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-[2rem] gap-4 relative z-10 group-hover:border-fuchsia-500/20 transition-colors bg-white/[0.01]">
             <div className="h-12 w-12 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center text-fuchsia-500 animate-pulse">
                <TrendingUp size={24} />
             </div>
             <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] italic">Real-time Coordination Confined</p>
          </div>

          <div className="mt-8 flex justify-between">
             <div className="space-y-1">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Protocol Check</p>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 bg-fuchsia-500 rounded-full animate-ping" />
                   <span className="text-[10px] font-black italic uppercase tracking-widest text-fuchsia-400">Node Synchronized</span>
                </div>
             </div>
             <Button variant="ghost" className="h-10 px-6 btn-ghost rounded-xl uppercase font-black text-[10px] tracking-widest italic">
                Export Audit
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, color }: any) {
  const colorMap: any = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/10 hover:border-indigo-500/30",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/10 hover:border-violet-500/30",
    fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/10 hover:border-fuchsia-500/30",
    sky: "text-sky-400 bg-sky-500/10 border-sky-500/10 hover:border-sky-500/30",
  };

  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] border bg-white/[0.02] backdrop-blur-sm transition-all duration-500 group relative overflow-hidden",
      colorMap[color]
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
         <Icon size={64} />
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-3 rounded-2xl transition-all duration-500", colorMap[color].split(' ')[1])}>
          <Icon size={24} className="group-hover:scale-110 transition-transform" />
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] italic mb-2 leading-none">{title}</p>
        <h4 className="text-4xl font-black text-white leading-none tracking-tight mb-3 italic">{value}</h4>
        <div className="flex items-center gap-2">
           <div className={cn("h-1 w-1 rounded-full", trendUp ? colorMap[color].split(' ')[0] : "bg-rose-500")} />
           <p className={cn("text-[8px] font-black uppercase tracking-widest italic", trendUp ? colorMap[color].split(' ')[0] : "text-rose-500")}>
             {trend}
           </p>
        </div>
      </div>
    </div>
  );
}
