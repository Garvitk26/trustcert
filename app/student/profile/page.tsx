"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Link as LinkIcon, 
  Unlink, 
  Bell, 
  Eye, 
  ChevronRight,
  Loader2,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/lib/context/ToastContext";
import WalletButton from "@/components/shared/WalletButton";
import { cn } from "@/lib/utils";

export default function StudentProfile() {
  const { showToast } = useToast();
  
  const [isLinking, setIsLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);

  const handleToggleLink = () => {
    if (isLinked) {
      setIsLinked(false);
      setWallet(null);
      showToast("Wallet unlinked successfully.", "success");
    } else {
      setIsLinking(true);
      setTimeout(() => {
        setIsLinking(false);
        setIsLinked(true);
        setWallet("GABCD...XYZ");
        showToast("Stellar wallet linked successfully!", "success");
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      <header>
        <h1 className="text-3xl font-black text-white mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your identity and blockchain connections.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Column: Personal Info */}
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-black/40 border-amber-500/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500/50">Full Name</label>
                  <Input 
                    defaultValue="Parth Karan" 
                    className="bg-black/20 border-amber-500/10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500/50">Email Address</label>
                  <Input 
                    defaultValue="parth@example.com" 
                    disabled 
                    className="bg-black/10 border-amber-500/5 text-muted-foreground" 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-amber-500/10 text-amber-400 hover:bg-amber-500/10">
                Update Profile
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-black/40 border-amber-500/10">
            <CardHeader>
              <CardTitle className="text-white text-lg font-black flex items-center gap-2">
                <Bell className="text-amber-500" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PreferenceItem 
                title="Certificate Issued" 
                desc="Get notified when a new credential is sent to your wallet." 
                defaultChecked 
              />
              <PreferenceItem 
                title="Verification Hit" 
                desc="Get an alert when someone verifies your public credentials." 
              />
              <PreferenceItem 
                title="Security Alerts" 
                desc="Important updates about your account and security." 
                defaultChecked 
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Wallet & Security */}
        <div className="space-y-8">
          <Card className="bg-black/40 border-amber-500/10 overflow-hidden relative group">
            {isLinked && (
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="bg-amber-500/10 text-amber-500 p-1 rounded-md">
                   <LinkIcon size={12} />
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-white text-lg font-black flex items-center gap-2">
                <Shield className="text-amber-500" /> Wallet Connection
              </CardTitle>
              <CardDescription>Link your Stellar wallet to receive credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLinked ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-[10px] uppercase font-bold text-amber-500/50 mb-1">Linked Wallet</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-400 truncate max-w-[150px]">{wallet}</span>
                      <CheckCircle size={14} className="text-amber-500" />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleToggleLink}
                    className="w-full text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-2 h-12"
                  >
                    <Unlink size={16} /> Unlink Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                   <Button 
                    onClick={handleToggleLink}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black flex items-center justify-center gap-2 h-12 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    {isLinking ? <Loader2 className="animate-spin" size={18} /> : <LinkIcon size={18} />}
                    Connect Wallet
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-tighter">Supported: Freighter, Albedo</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-amber-500/10">
            <CardHeader>
              <CardTitle className="text-white text-lg font-black">Quick Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ToolLink icon={Eye} label="Public Profile" href="/student/portal" />
              <ToolLink icon={ExternalLink} label="Stellar Expert" href="https://stellar.expert" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PreferenceItem({ title, desc, defaultChecked }: any) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
      <Checkbox defaultChecked={defaultChecked} className="mt-1 border-amber-500/20 data-[state=checked]:bg-amber-500" />
      <div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function ToolLink({ icon: Icon, label, href }: any) {
  return (
    <a 
      href={href} 
      target={href.startsWith("http") ? "_blank" : "_self"}
      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs text-muted-foreground hover:text-white"
    >
      <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
        <Icon size={14} className="text-amber-500" /> {label}
      </div>
      <ChevronRight size={14} />
    </a>
  );
}
