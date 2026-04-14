"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { AlertCircle, LogOut, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const INACTIVITY_THRESHOLD = 60 * 60 * 1000; // 60 minutes
const COUNTDOWN_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export default function SessionWatcher() {
  const { data: session, status } = useSession();
  const [isWarning, setIsWarning] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const lastActivityRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (isWarning) {
      setIsWarning(false);
      setCountdown(300);
      if (countdownRef.current) clearInterval(countdownRef.current);
    }
  }, [isWarning]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    const checkInactivity = () => {
      const now = Date.now();
      const diff = now - lastActivityRef.current;

      if (diff >= INACTIVITY_THRESHOLD - COUNTDOWN_THRESHOLD && !isWarning) {
        setIsWarning(true);
      } else if (diff >= INACTIVITY_THRESHOLD) {
        signOut();
      }
    };

    timerRef.current = setInterval(checkInactivity, 10000); // Check every 10s

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [status, resetTimer, isWarning]);

  useEffect(() => {
    if (isWarning) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            signOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isWarning]);

  if (!isWarning) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      />
      
      {/* Modal - min-height wrapper pattern */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative min-h-[320px] w-full max-w-sm bg-[#0d0d1f] border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 animate-pulse">
           <ShieldAlert size={32} />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">Session Expiring</h2>
        <p className="text-sm text-muted-foreground mb-8">
          You've been inactive. You'll be signed out in <span className="text-white font-mono font-bold">{formatTime(countdown)}</span>
        </p>

        <div className="grid grid-cols-1 gap-3 w-full">
           <Button 
            onClick={resetTimer}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all active:scale-95"
           >
             Stay Signed In
           </Button>
           <Button 
            variant="ghost" 
            onClick={() => signOut()}
            className="w-full text-muted-foreground hover:text-white hover:bg-white/5 border border-white/5 h-12 rounded-xl transition-all"
           >
             Sign Out Now
           </Button>
        </div>
      </motion.div>
    </div>
  );
}
