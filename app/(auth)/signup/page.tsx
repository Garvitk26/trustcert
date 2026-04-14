"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { 
  Building2, 
  GraduationCap, 
  ChevronLeft, 
  Loader2, 
  ShieldCheck,
  Building,
  Mail,
  Lock,
  User,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

type Step = 1 | 2;
type Role = "institution" | "student";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    orgName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ ...formData, role }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      showToast("Account created successfully!", "success");
      
      // Auto sign-in
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: true,
        callbackUrl: role === "institution" ? "/institution/dashboard" : "/student/portal",
      });
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 0)', backgroundSize: '60px 60px' }} />

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-4xl text-center z-10"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tighter">
              Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">TrustCert</span>
            </h1>
            <p className="text-muted-foreground mb-12 text-lg">Decentralized credentialing layer for education.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <RoleCard
                icon={Building2}
                title="Institution"
                description="Issue and manage immutable academic records."
                color="amber"
                onClick={() => { setRole("institution"); setStep(2); }}
              />
              <RoleCard
                icon={GraduationCap}
                title="Student"
                description="Securely access and share your verified credentials."
                color="orange"
                onClick={() => { setRole("student"); setStep(2); }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg z-10"
          >
            <div className="bg-[#031410]/90 backdrop-blur-2xl border border-amber-500/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <button 
                onClick={() => setStep(1)}
                className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-amber-500 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-sm text-muted-foreground">Signing up as a <span className="text-amber-400 capitalize font-bold">{role}</span></p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500/50">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/30" size={18} />
                    <Input 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="pl-10 bg-black/40 border-amber-500/10" 
                      placeholder="John Doe" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500/50">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/30" size={18} />
                    <Input 
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="pl-10 bg-black/40 border-amber-500/10" 
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>
                </div>

                {role === "institution" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500/50">Institution Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/30" size={18} />
                      <Input 
                        value={formData.orgName}
                        onChange={e => setFormData({...formData, orgName: e.target.value})}
                        className="pl-10 bg-black/40 border-amber-500/10" 
                        placeholder="Trust University" 
                        required 
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500/50">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/30" size={18} />
                      <Input 
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="pl-10 bg-black/40 border-amber-500/10" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>
                    {/* Strength Meter */}
                    <div className="flex gap-1 mt-2">
                       {[0, 1, 2, 3].map(i => (
                         <div 
                           key={i} 
                           className={cn(
                             "h-1 flex-1 rounded-full bg-amber-500/10 transition-colors duration-500",
                             formData.password && i < passwordStrength && (
                               passwordStrength === 1 ? "bg-rose-500" :
                               passwordStrength === 2 ? "bg-orange-500" :
                               passwordStrength === 3 ? "bg-yellow-500" : "bg-amber-500"
                             )
                           )} 
                         />
                       ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500/50">Confirm</label>
                    <Input 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className="bg-black/40 border-amber-500/10" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs mt-2">
                    <AlertCircle size={14} />
                    <p>{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 mt-4 font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:scale-[1.02] transition-transform text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleCard({ icon: Icon, title, description, color, onClick }: any) {
  const colors: any = {
    amber: "border-amber-500/20 hover:border-amber-500 shadow-amber-500/5",
    orange: "border-orange-500/20 hover:border-orange-500 shadow-orange-500/5",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group p-10 rounded-3xl border bg-black/40 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl backdrop-blur-md",
        colors[color]
      )}
    >
      <div className={cn(
        "p-4 rounded-2xl w-fit mb-6 transition-all group-hover:scale-110",
        color === "amber" ? "bg-amber-500/10 text-amber-400" : "bg-orange-500/10 text-orange-400"
      )}>
        <Icon size={40} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <div className="mt-8 flex items-center gap-2 font-bold text-sm text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <ShieldCheck size={18} />
        Choose this path
      </div>
    </button>
  );
}
