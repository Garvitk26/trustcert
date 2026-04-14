"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import WalletButton from "@/components/shared/WalletButton";
import { useToast } from "@/lib/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const { showToast } = useToast();

  const [role, setRole] = useState<"institution" | "student">("institution");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTime && lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 60000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        rememberMe,
      });

      if (result?.error) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        
        if (result.error.includes("Account locked")) {
          const match = result.error.match(/in (\d+) minutes/);
          if (match) setLockoutTime(parseInt(match[1]));
        }
        setError(result.error);
      } else {
        showToast("Welcome to TrustCert!", "success");
        // We need to fetch the session to get the role or just use the current state if lucky
        // But for safety, we redirect after session is established
        router.push(role === "institution" ? "/institution/dashboard" : "/student/portal");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020d0a] p-4 relative overflow-hidden">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <motion.div
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#031410]/80 backdrop-blur-xl border border-amber-500/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500">
                TrustCert
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm">Verify credentials on the Stellar blockchain</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-black/40 p-1 rounded-xl mb-8 border border-amber-500/5">
            <button
              onClick={() => setRole("institution")}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300",
                role === "institution" 
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              Institution
            </button>
            <button
              onClick={() => setRole("student")}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300",
                role === "student" 
                  ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              Student
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-amber-500/70">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="bg-black/40 border-amber-500/10 focus:border-amber-500/50"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono uppercase tracking-widest text-amber-500/70">Password</label>
                <Link href="/contact" className="text-xs text-amber-500/50 hover:text-amber-500 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-black/40 border-amber-500/10 focus:border-amber-500/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="border-amber-500/20 data-[state=checked]:bg-amber-500" 
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">Remember for 30 days</label>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || (!!lockoutTime && lockoutTime > 0)}
              className="w-full h-12 font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-none shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs"
                >
                  <AlertCircle size={14} />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-amber-500/10"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#031410] px-4 text-muted-foreground font-bold">Or continue with</span></div>
            </div>

            <div className="flex gap-4">
              <WalletButton />
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-amber-400 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
