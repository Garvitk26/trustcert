"use client";

import React, { useState, useEffect } from "react";
import { Wallet, Loader2, CheckCircle2, AlertCircle, LogOut, Copy, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isConnected, getAddress, requestAccess } from "@stellar/freighter-api";
import { useToast } from "@/lib/context/ToastContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showToast } = useToast();

  const checkConnection = async () => {
    try {
      if (await isConnected()) {
        const res = await getAddress();
        if (res && typeof res === 'object' && 'address' in res) {
          setAddress(res.address);
        } else if (typeof res === 'string') {
          setAddress(res);
        }
      }
    } catch (e) {
      console.error("Wallet check failed", e);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const connected = await isConnected();
      if (connected) {
        const res = await requestAccess();
        if (res && typeof res === 'object' && 'address' in res) {
          setAddress(res.address);
          showToast("Wallet connected successfully", "success");
        } else if (typeof res === 'string') {
          setAddress(res);
          showToast("Wallet connected successfully", "success");
        }
      } else {
        showToast("Freighter wallet not found", "error");
        window.open("https://www.freighter.network/", "_blank");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to connect wallet", "error");
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsDropdownOpen(false);
    showToast("Wallet disconnected", "info");
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      showToast("Address copied!", "success");
    }
  };

  if (address) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold transition-all hover:bg-amber-500/20"
        >
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          {address.slice(0, 4)}...{address.slice(-4)}
          <ChevronDown size={14} className={cn("transition-transform duration-200", isDropdownOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-56 bg-[#0d0d1f] border border-white/5 rounded-xl shadow-2xl p-2 z-[60]"
            >
              <div className="p-3 mb-2 bg-white/5 rounded-lg">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Stellar Address</p>
                <p className="text-[10px] font-mono text-white/80 break-all">{address}</p>
              </div>
              
              <button onClick={copyAddress} className="flex items-center gap-3 w-full p-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all">
                 <Copy size={14} /> Copy Address
              </button>
              <a href={`https://stellar.expert/explorer/testnet/account/${address}`} target="_blank" className="flex items-center gap-3 w-full p-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all">
                 <ExternalLink size={14} /> View on Explorer
              </a>
              <hr className="my-2 border-white/5" />
              <button onClick={disconnectWallet} className="flex items-center gap-3 w-full p-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all">
                 <LogOut size={14} /> Disconnect
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={loading}
      className="btn-secondary flex items-center gap-2 h-10 px-6"
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : <Wallet size={16} />}
      Connect Wallet
    </Button>
  );
}
