"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Award, 
  Users, 
  Activity, 
  Download, 
  Calendar,
  ChevronRight,
  Loader2,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/lib/context/ToastContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const COLORS = ["#f59e0b", "#f97316", "#eab308", "#06b6d4", "#f59e0b"];

export default function AnalyticsDashboard() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/institution/analytics");
        if (!res.ok) throw new Error("Synchronization failure effectively nullified.");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [showToast]);

  const exportCSV = () => {
    showToast("Generating audit report...", "success");
    // Mock export logic - actually builds the CSV string
    const csvContent = "data:text/csv;charset=utf-8,Date,Hits\n" + 
      data.charts.hitsOverTime.map((d: any) => `${d.date},${d.hits}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TrustCert_Audit_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
        <p className="text-sm font-mono text-amber-500/50 uppercase tracking-[0.2em] animate-pulse">Synchronizing Command Center...</p>
      </div>
    );
  }

  const { stats, charts } = data;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent -z-10" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10 mb-16">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-12 bg-amber-500 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Institutional Intelligence Hub</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground italic max-w-lg">
                Real-time performance metrics and blockchain settlement insights confined to your institutional registry.
              </p>
           </div>

           <Button onClick={exportCSV} className="btn-primary h-14 px-8 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.2)]">
              <Download size={18} className="mr-3" /> Export Audit Report (CSV)
           </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <StatCard icon={Award} label="Total Issued" value={stats.totalIssued} color="amber" />
           <StatCard icon={Activity} label="Verification Hits" value={stats.totalHits} color="orange" />
           <StatCard icon={Users} label="Active Students" value={stats.activeStudents} color="yellow" />
           <StatCard icon={TrendingUp} label="Institutional Trust" value={`${Math.min(100, stats.activeStudents * 10)}%`} color="cyan" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
           {/* Line Chart: Verification Hits */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="lg:col-span-2 card-surface border-amber-500/10 p-8 rounded-[2.5rem] bg-amber-500/[0.02] space-y-8"
           >
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-xl font-black text-white italic tracking-widest uppercase">Verification Trends</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Inquiries settled on established ledger (Last 14 Days)</p>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl"><BarChartIcon size={20} className="text-amber-400" /></div>
              </div>

              <div className="h-[350px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={charts.hitsOverTime}>
                       <defs>
                          <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                       <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: "#0d0d1f", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "12px" }}
                         itemStyle={{ color: "#f1f5f9", fontSize: "12px", fontWeight: "bold" }}
                       />
                       <Area type="monotone" dataKey="hits" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorHits)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </motion.div>

           {/* Pie Chart: Template Distribution */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="card-surface border-amber-500/10 p-8 rounded-[2.5rem] bg-orange-500/[0.02] space-y-8 flex flex-col items-center"
           >
              <div className="w-full flex items-center justify-between">
                 <h3 className="text-xl font-black text-white italic tracking-widest uppercase">Templates</h3>
                 <div className="p-3 bg-white/5 rounded-xl"><PieChartIcon size={20} className="text-orange-400" /></div>
              </div>

              <div className="h-[300px] w-full flex-1">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={charts.templateDistribution}
                          innerRadius={80}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                       >
                          {charts.templateDistribution.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip 
                         contentStyle={{ backgroundColor: "#0d0d1f", border: "1px solid rgba(139,92,246,0.1)", borderRadius: "12px" }}
                       />
                       <Legend align="center" verticalAlign="bottom" height={36}/>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </motion.div>
        </div>

        {/* Top Courses List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <h3 className="text-lg font-black text-white italic tracking-widest uppercase">Top Institutional Courses</h3>
              <div className="space-y-4">
                 {charts.topCourses.map((course: any, i: number) => (
                    <div key={i} className="card-surface border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center text-xs font-black text-amber-400 bg-amber-500/10 rounded-xl">0{i+1}</div>
                          <span className="text-sm font-bold text-white uppercase tracking-tight">{course._id}</span>
                       </div>
                       <span className="badge-amber badge text-[10px]">{course.count} Issued</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="card-surface border-amber-500/5 p-10 rounded-[3rem] bg-amber-500/[0.01] flex flex-col items-center justify-center text-center space-y-6">
              <div className="h-20 w-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500"><TrendingUp size={32} /></div>
              <div className="space-y-2">
                 <h4 className="text-xl font-black text-white italic uppercase italic">Regional Settlement Insights</h4>
                 <p className="text-xs text-muted-foreground italic leading-relaxed uppercase italic">Verification effectively confined to global hubs. Settlements reaching consensus in established identities.</p>
              </div>
              <Button variant="outline" className="btn-secondary rounded-xl uppercase tracking-widest">View Geographic Map (TBA)</Button>
           </div>
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
    yellow: "text-yellow-400 bg-yellow-500/10",
    cyan: "text-cyan-400 bg-cyan-500/10"
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
