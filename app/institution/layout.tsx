"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Building2, 
  LayoutDashboard, 
  FilePlus, 
  Award, 
  BarChart3, 
  Settings, 
  LogOut, 
  Clock,
  User,
  AlertTriangle,
  Menu,
  X
} from "lucide-react";
import { MobilePreviewBanner } from "@/src/components/shared/MobilePreviewBanner";
import Link from "next/link";
import { InstitutionProvider, useInstitution } from "@/lib/context/InstitutionContext";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import InstitutionSwitcher from "@/components/shared/InstitutionSwitcher";
import WalletStatusBar from "@/src/components/shared/WalletStatusBar";
import Level1StatusBadge from "@/src/components/shared/Level1StatusBadge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Networks } from "@stellar/stellar-sdk";

const navItems = [
  { href: "/institution/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "amber" },
  { href: "/institution/issue", label: "Issue Certificate", icon: FilePlus, color: "orange" },
  { href: "/institution/certificates", label: "Manage All", icon: Award, color: "amber" },
  { href: "/institution/analytics", label: "Analytics", icon: BarChart3, color: "cyan" },
  { href: "/institution/settings", label: "Settings", icon: Settings, color: "amber" },
];

const colors: Record<string, string> = {
  amber: "text-amber-400",
  orange: "text-orange-400",
  cyan: "text-cyan-400",
};

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session && session.user.role !== "institution") {
      router.push("/student/portal");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function checkNetwork() {
      if (typeof window === 'undefined') return
      try {
        const { getNetworkDetails } = await import('@stellar/freighter-api')
        const details = await getNetworkDetails()
        if (details.networkPassphrase !== Networks.TESTNET) {
          setWrongNetwork(true)
        } else {
          setWrongNetwork(false)
        }
      } catch {
        // Freighter not installed
      }
    }
    checkNetwork()
    const interval = setInterval(checkNetwork, 10000)
    return () => clearInterval(interval)
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") return <DashboardSkeleton />;
  if (!session || session.user.role !== "institution") return null;

  return (
    <InstitutionProvider>
      <div className="flex min-h-screen bg-[#020d0a] selection:bg-amber-500/30 relative">
        <Sidebar session={session} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-20 left-4 z-[60] bg-amber-600 text-white p-2 rounded-lg lg:hidden shadow-lg border border-amber-400/50"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <main className="flex-1 flex flex-col relative z-10 w-full overflow-x-hidden">
          {wrongNetwork && (
            <div className="w-full bg-rose-600 text-white py-2 px-4 flex items-center justify-center gap-2 z-[100] animate-in slide-in-from-top duration-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-center">
                Wrong Network: Switch Freighter to Stellar Testnet to use TrustCert
              </span>
            </div>
          )}
          <WalletStatusBar />
          <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
          <div className="relative flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto w-full">
             {children}
          </div>
        </main>
        <Level1StatusBadge />
        <MobilePreviewBanner />
      </div>
    </InstitutionProvider>
  );
}

function Sidebar({ session, isOpen, setIsOpen }: { session: any, isOpen: boolean, setIsOpen: (o: boolean) => void }) {
  const pathname = usePathname();
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "w-64 bg-[#0a1a14] border-r border-white/5 flex flex-col h-screen sticky top-0 md:relative md:top-0 z-50 shrink-0 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0 fixed" : "-translate-x-full fixed lg:relative"
      )}>
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-gradient-to-tr from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
             <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="text-xl font-black gradient-text">TrustCert</span>
        </Link>
      </div>

      <div className="px-6 mb-8">
        <InstitutionSwitcher />
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative",
                isActive ? colors[item.color] + " bg-white/5" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} className={cn("transition-colors", isActive ? "text-current" : "text-muted-foreground group-hover:text-white")} />
              {item.label}
              {isActive && (
                <div className={cn("absolute left-0 top-3 bottom-3 w-1 rounded-r-full", "bg-current")} />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner">
             <User size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
            <p className="text-[10px] text-muted-foreground truncate italic">Last login: {formatDistanceToNow(new Date(session.user.lastLogin || Date.now()))} ago</p>
          </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
      </aside>
    </>
  );
}

function ShieldCheck({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
