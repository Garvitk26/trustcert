"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, LogOut, User, LayoutGrid, UserCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import WalletButton from "@/components/shared/WalletButton";
import WalletStatusBar from "@/src/components/shared/WalletStatusBar";
import Level1StatusBadge from "@/src/components/shared/Level1StatusBadge";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { Networks } from "@stellar/stellar-sdk";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session && session.user.role !== "student") {
      router.push("/institution/dashboard");
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

  if (status === "loading") return <DashboardSkeleton />;
  if (!session || session.user.role !== "student") return null;

  const navItems = [
    { label: "Portal", href: "/student/portal", icon: LayoutGrid },
    { label: "Profile", href: "/student/profile", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-[#020d0a] flex flex-col selection:bg-cyan-500/30 relative">
      {/* Top Navbar */}
      <nav className="h-20 bg-[#0a1a14] border-b border-white/5 sticky top-0 z-50 flex items-center justify-between px-8 md:px-12 backdrop-blur-xl bg-opacity-80">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
               <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="text-xl font-black gradient-text-2">TrustCert</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  pathname === item.href 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <WalletButton />
          
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          
          <div className="flex items-center gap-3">
             <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-white leading-tight">{session.user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-tight">Student</p>
             </div>
             <button 
              onClick={() => signOut()}
              className="p-2 rounded-full bg-white/5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
             >
                <LogOut size={16} />
             </button>
          </div>
        </div>
      </nav>

      {wrongNetwork && (
        <div className="w-full bg-rose-600 text-white py-2 px-4 flex items-center justify-center gap-2 z-[100] animate-in slide-in-from-top duration-300">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider text-center">
            Wrong Network: Switch Freighter to Stellar Testnet to use TrustCert
          </span>
        </div>
      )}
      <WalletStatusBar />

      <main className="flex-1 relative">
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 p-8 md:p-12">
          {children}
        </div>
      </main>

      <Level1StatusBadge />

       {/* Ambient Blobs */}
       <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
      </div>
    </div>
  );
}
