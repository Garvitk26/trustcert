"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Building2, UserPlus, ShieldCheck, Loader2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function InvitePage() {
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
        if (!res.ok) throw new Error("Invalid invite");
        const data = await res.json();
        setInvite(data);
      } catch (err) {
        showToast("This invite link is invalid or has expired", "error");
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, [token, showToast]);

  const handleAccept = async () => {
    if (status === "unauthenticated") {
      router.push(`/login?returnUrl=/invite/${token}`);
      return;
    }
    setAccepting(true);
    try {
      const res = await fetch(`/api/invites/${token}/accept`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to accept");
      showToast("Welcome to the team!", "success");
      router.push("/institution/dashboard");
    } catch (err) {
      showToast("There was an error accepting the invite", "error");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return <FullScreenLoader />;

  if (!invite) return <ErrorState />;

  return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center p-6 bg-dot-grid">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0a1a14] border border-amber-500/15 rounded-3xl p-10 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500" />
        
        <div className="h-20 w-20 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mx-auto mb-8 shadow-inner">
          <Building2 size={40} />
        </div>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Team Invitation</h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          You&apos;ve been invited to join <span className="text-white font-bold">{invite.institutionName}</span> as a <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">{invite.role}</span>.
        </p>

        <div className="space-y-4">
          <Button 
            onClick={handleAccept}
            disabled={accepting}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold h-14 rounded-2xl shadow-[0_4px_25px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {accepting ? <Loader2 className="animate-spin" size={20} /> : status === "unauthenticated" ? "Sign in to Accept" : "Accept Invitation"}
            {!accepting && <ArrowRight size={18} />}
          </Button>
          
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/50">
             Secure Enrollment via Trusted Blockchain
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-[#020d0a] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-amber-500" size={48} />
      <p className="text-amber-500/50 font-mono text-sm animate-pulse uppercase tracking-[0.3em]">Validating Credentials</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-rose-500/5 border border-rose-500/20 rounded-3xl p-10 text-center backdrop-blur-md">
        <XCircle className="text-rose-500 mx-auto mb-6" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">Invitation Expired</h2>
        <p className="text-sm text-muted-foreground mb-8">This invite link is no longer valid or has already been used.</p>
        <Button asChild variant="outline" className="w-full border-rose-500/20 text-rose-400 hover:bg-rose-500/10">
           <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
