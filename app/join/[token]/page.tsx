"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GraduationCap, UserPlus, ShieldCheck, Loader2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function JoinPage() {
  const { token } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await fetch(`/api/invites/${token}`);
        if (!res.ok) throw new Error("Invalid join link");
        const data = await res.json();
        setInvite(data);
      } catch (err) {
        showToast("This join link is invalid or has expired", "error");
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, [token, showToast]);

  const handleAccept = async () => {
    if (status === "unauthenticated") {
      router.push(`/login?returnUrl=/join/${token}`);
      return;
    }
    setAccepting(true);
    try {
      const res = await fetch(`/api/invites/${token}/accept`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to join");
      showToast("Access granted. Welcome!", "success");
      router.push("/student/portal");
    } catch (err) {
      showToast("Error joining institution", "error");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return <FullScreenLoader />;

  if (!invite) return <ErrorState />;

  return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center p-6 bg-dot-grid">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0a1a14] border border-cyan-500/15 rounded-3xl p-10 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-amber-500 to-orange-500" />
        
        <div className="h-20 w-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mx-auto mb-8 shadow-inner">
          <GraduationCap size={40} />
        </div>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Student Enrollment</h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Link your credentials to <span className="text-white font-bold">{invite.institutionName}</span>.
        </p>

        <div className="space-y-4">
          <Button 
            onClick={handleAccept}
            disabled={accepting}
            className="w-full bg-gradient-to-r from-cyan-600 to-amber-600 hover:from-cyan-500 hover:to-amber-500 text-white font-bold h-14 rounded-2xl shadow-[0_4px_25px_rgba(34,211,238,0.2)] transition-all flex items-center justify-center gap-2"
          >
            {accepting ? <Loader2 className="animate-spin" size={20} /> : status === "unauthenticated" ? "Sign in to Join" : "Join Institution"}
            {!accepting && <ArrowRight size={18} />}
          </Button>
          
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/50">
             Verified Student Identity Layer
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-[#020d0a] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-cyan-500" size={48} />
      <p className="text-cyan-500/50 font-mono text-sm animate-pulse uppercase tracking-[0.3em]">Resolving Credentials</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-rose-500/5 border border-rose-500/20 rounded-3xl p-10 text-center backdrop-blur-md">
        <XCircle className="text-rose-500 mx-auto mb-6" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">Invalid Link</h2>
        <p className="text-sm text-muted-foreground mb-8">This join link is no longer valid or has expired.</p>
        <Button asChild variant="outline" className="w-full border-rose-500/20 text-rose-400 hover:bg-rose-500/10">
           <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
