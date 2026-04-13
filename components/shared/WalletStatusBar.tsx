'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { isConnected, getAddress } from '@stellar/freighter-api'
import { getAccountBalance } from '@/lib/stellar'
import { RefreshCw, ExternalLink, Copy, Check, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function WalletStatusBar() {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0.00")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchWalletData = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      if (await isConnected()) {
        const res = await getAddress()
        const userAddress = typeof res === 'object' && 'address' in res ? res.address : res as string
        
        if (userAddress) {
          setAddress(userAddress)
          const bal = await getAccountBalance(userAddress)
          setBalance(bal)
        } else {
          setAddress(null)
          setBalance("0.00")
        }
      } else {
        setAddress(null)
        setBalance("0.00")
      }
    } catch (err) {
      console.error("Failed to fetch wallet data", err)
      setError(true)
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }, [])

  useEffect(() => {
    fetchWalletData()
    const interval = setInterval(fetchWalletData, 30000)
    return () => clearInterval(interval)
  }, [fetchWalletData])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="sticky top-0 z-40 w-full h-12 bg-[#0d0d1f]/80 backdrop-blur-md border-b border-primary/20 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        
        {/* Left Side: Connection Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={cn(
            "w-2 h-2 rounded-full",
            address ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "bg-muted-foreground"
          )} />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className={cn(
               "text-[10px] uppercase font-bold tracking-widest",
               address ? "text-white" : "text-muted-foreground"
            )}>
              {address ? "Freighter Connected" : "Wallet Not Connected"}
            </span>
            {address && (
              <span className="font-mono text-[10px] text-primary/80">
                ({address.slice(0, 4)}...{address.slice(-4)})
              </span>
            )}
          </div>
        </div>

        {/* Center: XLM Balance */}
        <div className="flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase text-muted-foreground font-semibold">Balance</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-primary tabular-nums">
                {balance}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">XLM</span>
            </div>
          </div>
          <div className="h-3 w-[1px] bg-white/10" />
          <button 
            onClick={fetchWalletData}
            disabled={loading}
            className={cn(
              "text-muted-foreground hover:text-primary transition-colors",
              loading && "animate-spin text-primary"
            )}
          >
            <RefreshCw size={14} />
          </button>
          <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase tracking-tighter text-amber-500">
            Testnet
          </div>
        </div>

        {/* Right Side: Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {address && (
            <>
              <button 
                onClick={copyAddress}
                className="p-1.5 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2 text-xs"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span className="hidden lg:inline">Copy Address</span>
              </button>
              <a 
                href={`https://stellar.expert/explorer/testnet/account/${address}`}
                target="_blank"
                className="p-1.5 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2 text-xs"
              >
                <ExternalLink size={14} />
                <span className="hidden lg:inline">Explorer</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
